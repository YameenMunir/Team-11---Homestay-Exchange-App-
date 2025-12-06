import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContextNew';
import { DOCUMENT_TYPE_LABELS, MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from '../../lib/constants';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';

export default function FileUpload({ documentType, onUploadComplete }) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleFileUpload = async (e) => {
    try {
      setUploading(true);
      setError(null);
      setSuccess(false);

      if (!e.target.files || e.target.files.length === 0) {
        throw new Error('You must select a file to upload.');
      }

      const file = e.target.files[0];

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        throw new Error('File size must be less than 5MB');
      }

      // Validate file type
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        throw new Error('Only JPEG, PNG, and PDF files are allowed');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${documentType}_${Date.now()}.${fileExt}`;

      // 1. Upload to Storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from('user-documents')
        .upload(fileName, file);

      if (storageError) throw storageError;

      // 2. Insert record in user_documents (or update if exists)
      // Store the storage path (fileName) instead of public URL for security
      // Signed URLs will be generated when documents are accessed
      const { error: dbError } = await supabase.from('user_documents').upsert(
        [
          {
            user_id: user.id,
            document_type: documentType,
            file_url: fileName, // Store storage path instead of public URL
            file_name: file.name,
            file_size: file.size,
            verification_status: 'pending',
          },
        ],
        {
          onConflict: 'user_id,document_type',
        }
      );

      if (dbError) throw dbError;

      setSuccess(true);

      if (onUploadComplete) {
        onUploadComplete();
      }

      // Reset file input
      e.target.value = '';
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {DOCUMENT_TYPE_LABELS[documentType] || documentType}
      </label>

      <div className="relative">
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={handleFileUpload}
          disabled={uploading}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
            disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {uploading && (
        <div className="flex items-center text-sm text-blue-600">
          <Upload className="w-4 h-4 mr-2 animate-bounce" />
          <span>Uploading...</span>
        </div>
      )}

      {success && (
        <div className="flex items-center text-sm text-green-600">
          <CheckCircle className="w-4 h-4 mr-2" />
          <span>Document uploaded successfully! Awaiting admin verification.</span>
        </div>
      )}

      {error && (
        <div className="flex items-center text-sm text-red-600">
          <AlertCircle className="w-4 h-4 mr-2" />
          <span>{error}</span>
        </div>
      )}

      <p className="text-xs text-gray-500">
        Accepted formats: JPEG, PNG, PDF (Max 5MB)
      </p>
    </div>
  );
}
