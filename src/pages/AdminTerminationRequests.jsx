import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { terminationService } from '../services/terminationService';
import toast from 'react-hot-toast';
import { AlertTriangle, CheckCircle, XCircle, Clock, Eye, Loader2, User, Home as HomeIcon, ArrowLeft, RefreshCw } from 'lucide-react';

const AdminTerminationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState('pending');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const data = await terminationService.getAdminTerminationRequests();
      setRequests(data);
      if (isRefresh) {
        toast.success('Requests refreshed successfully');
      }
    } catch (error) {
      console.error('Error fetching termination requests:', error);
      toast.error('Failed to load termination requests');
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  const handleRefresh = () => {
    fetchRequests(true);
  };

  const handleApprove = async (requestId) => {
    try {
      setProcessingId(requestId);
      await terminationService.approveTermination(requestId, adminNotes);
      toast.success('Termination request approved. Facilitation has been ended.');
      setShowApproveModal(false);
      setAdminNotes('');
      setSelectedRequest(null);
      await fetchRequests();
    } catch (error) {
      console.error('Error approving termination:', error);
      toast.error('Failed to approve termination request');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId) => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    try {
      setProcessingId(requestId);
      await terminationService.rejectTermination(requestId, rejectReason);
      toast.success('Termination request rejected');
      setShowRejectModal(false);
      setRejectReason('');
      setSelectedRequest(null);
      await fetchRequests();
    } catch (error) {
      console.error('Error rejecting termination:', error);
      toast.error('Failed to reject termination request');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
    };
    const icons = {
      pending: <Clock className="w-3 h-3" />,
      approved: <CheckCircle className="w-3 h-3" />,
      rejected: <XCircle className="w-3 h-3" />,
    };
    const labels = {
      pending: 'Pending Review',
      approved: 'Approved',
      rejected: 'Rejected',
    };
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full border ${styles[status]}`}>
        {icons[status]}
        {labels[status]}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    return role === 'host' ? (
      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
        <HomeIcon className="w-3 h-3" />
        Host
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 border border-purple-200">
        <User className="w-3 h-3" />
        Student
      </span>
    );
  };

  const filteredRequests = requests.filter(req => req.status === filterStatus);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading termination requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-teal-600 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </Link>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900">
                Termination Requests
              </h1>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="btn-primary flex items-center gap-2"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
          <p className="text-lg text-gray-600">
            Review and manage facilitation termination requests from hosts and students
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setFilterStatus('pending')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  filterStatus === 'pending'
                    ? 'border-yellow-600 text-yellow-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pending ({requests.filter(r => r.status === 'pending').length})
              </button>
              <button
                onClick={() => setFilterStatus('approved')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  filterStatus === 'approved'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Approved ({requests.filter(r => r.status === 'approved').length})
              </button>
              <button
                onClick={() => setFilterStatus('rejected')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  filterStatus === 'rejected'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Rejected ({requests.filter(r => r.status === 'rejected').length})
              </button>
            </nav>
          </div>
        </div>

        {/* Requests List */}
        {filteredRequests.length === 0 ? (
          <div className="card p-12 text-center">
            <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No {filterStatus} termination requests
            </h3>
            <p className="text-gray-600">
              {filterStatus === 'pending' && 'Termination requests will appear here when submitted by hosts or students.'}
              {filterStatus === 'approved' && 'Approved termination requests will appear here.'}
              {filterStatus === 'rejected' && 'Rejected termination requests will appear here.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <div key={request.id} className="card p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {request.requesterName}
                      </h3>
                      {getRoleBadge(request.requesterRole)}
                      {getStatusBadge(request.status)}
                    </div>
                    <p className="text-sm text-gray-600">
                      Requested to end facilitation on {new Date(request.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {/* Facilitation Details */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Student</p>
                      <p className="text-sm font-medium text-gray-900">{request.studentName}</p>
                      <p className="text-xs text-gray-600">{request.studentUniversity}</p>
                      <p className="text-xs text-gray-600">{request.studentEmail}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Host</p>
                      <p className="text-sm font-medium text-gray-900">{request.hostName}</p>
                      <p className="text-xs text-gray-600">{request.hostLocation}</p>
                      <p className="text-xs text-gray-600">{request.hostEmail}</p>
                    </div>
                  </div>
                </div>

                {/* Reason */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-700 mb-1">Reason for Termination:</p>
                  <p className="text-sm text-gray-900 bg-white rounded-lg p-3 border border-gray-200">
                    {request.reason}
                  </p>
                </div>

                {/* Admin Notes (if reviewed) */}
                {request.status !== 'pending' && request.adminNotes && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-700 mb-1">Admin Notes:</p>
                    <p className="text-sm text-gray-900 bg-blue-50 rounded-lg p-3 border border-blue-200">
                      {request.adminNotes}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Reviewed by {request.reviewedBy} on {new Date(request.reviewedAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                {request.status === 'pending' && (
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowDetailsModal(true);
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowApproveModal(true);
                      }}
                      disabled={processingId === request.id}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>{processingId === request.id ? 'Processing...' : 'Approve'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowRejectModal(true);
                      }}
                      disabled={processingId === request.id}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>{processingId === request.id ? 'Processing...' : 'Reject'}</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Termination Request Details</h3>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedRequest(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Request Info */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Request Information</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Requester:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedRequest.requesterName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Role:</span>
                    {getRoleBadge(selectedRequest.requesterRole)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    {getStatusBadge(selectedRequest.status)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Submitted:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(selectedRequest.createdAt).toLocaleString('en-GB')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Student & Host Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Student Information</h4>
                  <div className="bg-purple-50 rounded-lg p-4 space-y-1">
                    <p className="text-sm font-medium text-gray-900">{selectedRequest.studentName}</p>
                    <p className="text-xs text-gray-600">{selectedRequest.studentEmail}</p>
                    <p className="text-xs text-gray-600">{selectedRequest.studentUniversity}</p>
                    <p className="text-xs text-gray-600">{selectedRequest.studentCourse}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Host Information</h4>
                  <div className="bg-blue-50 rounded-lg p-4 space-y-1">
                    <p className="text-sm font-medium text-gray-900">{selectedRequest.hostName}</p>
                    <p className="text-xs text-gray-600">{selectedRequest.hostEmail}</p>
                    <p className="text-xs text-gray-600">{selectedRequest.hostLocation}</p>
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Reason for Termination</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-900">{selectedRequest.reason}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setShowApproveModal(true);
                }}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Approve Termination</span>
              </button>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setShowRejectModal(true);
                }}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject Request</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Modal */}
      {showApproveModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              Approve Termination Request?
            </h3>

            <p className="text-sm text-gray-600 mb-6 text-center">
              This will end the facilitation between {selectedRequest.studentName} and {selectedRequest.hostName}.
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Notes (Optional)
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add any notes about this approval..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowApproveModal(false);
                  setAdminNotes('');
                  if (!showDetailsModal) {
                    setSelectedRequest(null);
                  }
                }}
                disabled={processingId === selectedRequest.id}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleApprove(selectedRequest.id)}
                disabled={processingId === selectedRequest.id}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
              >
                {processingId === selectedRequest.id ? 'Approving...' : 'Approve'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              Reject Termination Request?
            </h3>

            <p className="text-sm text-gray-600 mb-6 text-center">
              The facilitation will continue. Please provide a reason for rejection.
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Rejection (Required)
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Explain why this request is being rejected..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                  if (!showDetailsModal) {
                    setSelectedRequest(null);
                  }
                }}
                disabled={processingId === selectedRequest.id}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(selectedRequest.id)}
                disabled={processingId === selectedRequest.id}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
              >
                {processingId === selectedRequest.id ? 'Rejecting...' : 'Reject Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTerminationRequests;
