import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContextNew';
import { DOCUMENT_TYPE_LABELS } from '../../lib/constants';
import { CheckCircle, XCircle, ExternalLink, FileText } from 'lucide-react';

export default function VerifyDocuments() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null);

  useEffect(() => {
    fetchPendingDocuments();
  }, []);

  const fetchPendingDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('user_documents')
        .select(
          `
          *,
          user_profiles(id, full_name, email, role)
        `
        )
        .eq('verification_status', 'pending')
        .order('uploaded_at', { ascending: true });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (documentId, status, reason = null) => {
    try {
      // 1. Update document status
      const { error: updateError } = await supabase
        .from('user_documents')
        .update({
          verification_status: status,
          verified_at: new Date().toISOString(),
          verified_by: user.id,
          rejection_reason: reason,
        })
        .eq('id', documentId);

      if (updateError) throw updateError;

      // 2. Log the action
      const { error: logError } = await supabase
        .from('document_verification_logs')
        .insert([
          {
            document_id: documentId,
            admin_id: user.id,
            action: status,
            notes: reason,
          },
        ]);

      if (logError) throw logError;

      // Refresh list
      fetchPendingDocuments();
      setSelectedDoc(null);
      alert(`Document ${status}!`);
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Pending Document Verification</h2>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {documents.length} pending
          </span>
        </div>

        {documents.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No pending documents to verify.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-bold text-lg text-gray-900">
                        {doc.user_profiles.full_name}
                      </h3>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded capitalize">
                        {doc.user_profiles.role}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-1">{doc.user_profiles.email}</p>

                    <div className="mt-3 space-y-1">
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">Document Type:</span>{' '}
                        <span className="text-gray-900">
                          {DOCUMENT_TYPE_LABELS[doc.document_type] || doc.document_type}
                        </span>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">File:</span>{' '}
                        <span className="text-gray-900">{doc.file_name}</span>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">Size:</span>{' '}
                        <span className="text-gray-900">
                          {(doc.file_size / 1024).toFixed(2)} KB
                        </span>
                      </p>
                      <p className="text-sm text-gray-500">
                        Uploaded: {new Date(doc.uploaded_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Document
                  </a>
                </div>

                <div className="flex space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleVerify(doc.id, 'approved')}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      const reason = prompt(
                        'Please provide a reason for rejection:'
                      );
                      if (reason) handleVerify(doc.id, 'rejected', reason);
                    }}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
