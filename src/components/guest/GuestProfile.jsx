import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContextNew';
import { useProfile } from '../../hooks/useProfile';
import FileUpload from '../shared/FileUpload';
import { DOCUMENT_TYPES } from '../../lib/constants';
import { Save, Upload } from 'lucide-react';

export default function GuestProfile() {
  const { user, profile } = useAuth();
  const { roleProfile, updateProfile } = useProfile();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [formData, setFormData] = useState({
    bio: '',
    skills: '',
    preferred_location: '',
    preferred_postcode: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
  });

  useEffect(() => {
    if (roleProfile) {
      setFormData({
        bio: roleProfile.bio || '',
        skills: roleProfile.skills?.join(', ') || '',
        preferred_location: roleProfile.preferred_location || '',
        preferred_postcode: roleProfile.preferred_postcode || '',
        emergency_contact_name: roleProfile.emergency_contact_name || '',
        emergency_contact_phone: roleProfile.emergency_contact_phone || '',
      });
    }
    fetchDocuments();
  }, [roleProfile]);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('user_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updates = {
      bio: formData.bio,
      skills: formData.skills.split(',').map((s) => s.trim()).filter((s) => s),
      preferred_location: formData.preferred_location,
      preferred_postcode: formData.preferred_postcode,
      emergency_contact_name: formData.emergency_contact_name,
      emergency_contact_phone: formData.emergency_contact_phone,
    };

    const { error } = await updateProfile(updates);

    if (error) {
      alert('Error updating profile: ' + error.message);
    } else {
      alert('Profile updated successfully!');
      setEditing(false);
    }

    setLoading(false);
  };

  const getDocumentStatus = (docType) => {
    const doc = documents.find((d) => d.document_type === docType);
    if (!doc) return { status: 'missing', color: 'gray', text: 'Not Uploaded' };

    if (doc.verification_status === 'approved')
      return { status: 'approved', color: 'green', text: 'Approved' };
    if (doc.verification_status === 'rejected')
      return { status: 'rejected', color: 'red', text: 'Rejected' };
    return { status: 'pending', color: 'yellow', text: 'Pending Review' };
  };

  if (!roleProfile) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Student Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">University</label>
            <p className="mt-1 text-gray-900">{roleProfile.university}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Course</label>
            <p className="mt-1 text-gray-900">{roleProfile.course}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Year of Study</label>
            <p className="mt-1 text-gray-900">{roleProfile.year_of_study}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-gray-900">{profile.email}</p>
          </div>
        </div>
      </div>

      {/* Editable Profile */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Profile Details</h2>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Edit Profile
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              disabled={!editing}
              rows={4}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Skills (comma separated)
            </label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              disabled={!editing}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
              placeholder="e.g., cooking, gardening, tech support"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Preferred Location
              </label>
              <input
                type="text"
                value={formData.preferred_location}
                onChange={(e) =>
                  setFormData({ ...formData, preferred_location: e.target.value })
                }
                disabled={!editing}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Preferred Postcode
              </label>
              <input
                type="text"
                value={formData.preferred_postcode}
                onChange={(e) =>
                  setFormData({ ...formData, preferred_postcode: e.target.value })
                }
                disabled={!editing}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Emergency Contact Name
              </label>
              <input
                type="text"
                value={formData.emergency_contact_name}
                onChange={(e) =>
                  setFormData({ ...formData, emergency_contact_name: e.target.value })
                }
                disabled={!editing}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Emergency Contact Phone
              </label>
              <input
                type="tel"
                value={formData.emergency_contact_phone}
                onChange={(e) =>
                  setFormData({ ...formData, emergency_contact_phone: e.target.value })
                }
                disabled={!editing}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
              />
            </div>
          </div>

          {editing && (
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Document Uploads */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Required Documents</h2>

        <div className="space-y-6">
          {[DOCUMENT_TYPES.GOVERNMENT_ID, DOCUMENT_TYPES.ADMISSION_PROOF].map((docType) => {
            const status = getDocumentStatus(docType);
            return (
              <div key={docType} className="border-b border-gray-200 pb-6 last:border-0">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-900">
                    {docType === DOCUMENT_TYPES.GOVERNMENT_ID
                      ? 'Government ID'
                      : 'Proof of Admission'}
                  </h3>
                  <span
                    className={`px-3 py-1 text-sm rounded-full bg-${status.color}-100 text-${status.color}-800`}
                  >
                    {status.text}
                  </span>
                </div>
                <FileUpload documentType={docType} onUploadComplete={fetchDocuments} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
