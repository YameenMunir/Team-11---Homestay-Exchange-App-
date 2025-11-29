import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { MessageSquare, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function ManageRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    try {
      let query = supabase
        .from('facilitation_requests')
        .select(
          `
          *,
          requester:user_profiles!facilitation_requests_requester_id_fkey(full_name, email, role),
          target:user_profiles!facilitation_requests_target_id_fkey(full_name, email, role)
        `
        )
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId, newStatus, notes = '') => {
    try {
      const { error } = await supabase
        .from('facilitation_requests')
        .update({
          status: newStatus,
          admin_notes: notes,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', requestId);

      if (error) throw error;

      alert(`Request ${newStatus}!`);
      fetchRequests();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { color: 'yellow', text: 'Pending', Icon: Clock },
      in_review: { color: 'blue', text: 'In Review', Icon: MessageSquare },
      matched: { color: 'green', text: 'Matched', Icon: CheckCircle },
      completed: { color: 'gray', text: 'Completed', Icon: CheckCircle },
      cancelled: { color: 'red', text: 'Cancelled', Icon: XCircle },
    };

    const badge = badges[status] || badges.pending;
    const Icon = badge.Icon;

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${badge.color}-100 text-${badge.color}-800`}
      >
        <Icon className="w-4 h-4 mr-1" />
        {badge.text}
      </span>
    );
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
          <h2 className="text-2xl font-bold text-gray-900">Facilitation Requests</h2>

          {/* Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending</option>
            <option value="in_review">In Review</option>
            <option value="matched">Matched</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {requests.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No requests found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      {getStatusBadge(request.status)}
                      <span className="text-sm text-gray-500">
                        {new Date(request.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-700">Requester:</span>
                        <span className="text-gray-900">{request.requester.full_name}</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded capitalize">
                          {request.requester.role}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-700">Target:</span>
                        <span className="text-gray-900">{request.target.full_name}</span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded capitalize">
                          {request.target.role}
                        </span>
                      </div>

                      {request.message && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-md">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Message:</span> {request.message}
                          </p>
                        </div>
                      )}

                      {request.admin_notes && (
                        <div className="mt-3 p-3 bg-yellow-50 rounded-md">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Admin Notes:</span> {request.admin_notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {request.status === 'pending' && (
                  <div className="flex space-x-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => updateRequestStatus(request.id, 'in_review')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Start Review
                    </button>
                    <button
                      onClick={() => updateRequestStatus(request.id, 'matched')}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      Mark as Matched
                    </button>
                    <button
                      onClick={() => {
                        const notes = prompt('Cancellation reason:');
                        if (notes) updateRequestStatus(request.id, 'cancelled', notes);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {request.status === 'in_review' && (
                  <div className="flex space-x-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => updateRequestStatus(request.id, 'matched')}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      Mark as Matched
                    </button>
                  </div>
                )}

                {request.status === 'matched' && (
                  <div className="flex space-x-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => updateRequestStatus(request.id, 'completed')}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                    >
                      Mark as Completed
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
