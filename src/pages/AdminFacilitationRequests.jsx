import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Link2,
  Home,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Calendar,
  FileText,
  Loader2,
} from 'lucide-react';
import { facilitationService } from '../services/facilitationService';
import toast from 'react-hot-toast';

const AdminFacilitationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('reviewing'); // all, pending, reviewing, approved, rejected
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await facilitationService.getAdminRequests();
      setRequests(data);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load facilitation requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      await facilitationService.approveRequest(requestId, adminNotes);
      toast.success('Facilitation request approved!');
      setShowModal(false);
      setAdminNotes('');
      await fetchRequests();
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error('Failed to approve request');
    }
  };

  const handleReject = (request) => {
    setSelectedRequest(request);
    setShowRejectModal(true);
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    try {
      await facilitationService.rejectRequest(selectedRequest.id, rejectReason);
      toast.success('Facilitation request rejected');
      setShowRejectModal(false);
      setShowModal(false);
      setRejectReason('');
      await fetchRequests();
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Failed to reject request');
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewing: 'bg-purple-100 text-purple-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    const icons = {
      pending: <Clock className="w-3 h-3" />,
      reviewing: <Eye className="w-3 h-3" />,
      approved: <CheckCircle className="w-3 h-3" />,
      rejected: <XCircle className="w-3 h-3" />,
    };
    const labels = {
      pending: 'Pending',
      reviewing: 'Under Review',
      approved: 'Approved',
      rejected: 'Rejected',
    };
    return (
      <span className={`badge ${styles[status]} flex items-center space-x-1`}>
        {icons[status]}
        <span>{labels[status]}</span>
      </span>
    );
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading facilitation requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-3">
            Facilitation Requests
          </h1>
          <p className="text-lg text-gray-600">
            Review and approve host-student matching requests
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-6">
            <p className="text-sm text-gray-600 mb-1">Total Requests</p>
            <span className="text-3xl font-bold text-gray-900">
              {requests.length}
            </span>
          </div>
          <div className="card p-6">
            <p className="text-sm text-gray-600 mb-1">Under Review</p>
            <span className="text-3xl font-bold text-purple-600">
              {requests.filter(r => r.status === 'reviewing').length}
            </span>
          </div>
          <div className="card p-6">
            <p className="text-sm text-gray-600 mb-1">Approved</p>
            <span className="text-3xl font-bold text-green-600">
              {requests.filter(r => r.status === 'approved').length}
            </span>
          </div>
          <div className="card p-6">
            <p className="text-sm text-gray-600 mb-1">Rejected</p>
            <span className="text-3xl font-bold text-red-600">
              {requests.filter(r => r.status === 'rejected').length}
            </span>
          </div>
        </div>

        {/* Filter */}
        <div className="card p-6 mb-6">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Filter by status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending (Host Review)</option>
              <option value="reviewing">Under Review (Admin)</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Requests List */}
        {(filterStatus === 'all' ? requests : requests.filter(r => r.status === filterStatus)).length === 0 ? (
          <div className="card p-12 text-center">
            <Link2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No facilitation requests found
            </h3>
            <p className="text-gray-600">
              {filterStatus === 'all'
                ? 'There are no facilitation requests at this time.'
                : `There are no ${filterStatus === 'reviewing' ? 'under review' : filterStatus} requests.`}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {(filterStatus === 'all' ? requests : requests.filter(r => r.status === filterStatus)).map((request) => (
              <div key={request.id} className="card p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Link2 className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {request.studentName} → {request.hostName}
                        </h3>
                        {getStatusBadge(request.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Requested on {new Date(request.requestDate).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Student Info */}
                  <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-4 rounded-r-lg">
                    <div className="flex items-center space-x-2 mb-3">
                      <GraduationCap className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-gray-900">Student (Guest)</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="font-medium text-gray-900">{request.studentName}</p>
                      {request.studentEmail && (
                        <div className="flex items-center space-x-2 text-gray-700">
                          <Mail className="w-4 h-4 text-blue-600" />
                          <a href={`mailto:${request.studentEmail}`} className="hover:text-blue-600">
                            {request.studentEmail}
                          </a>
                        </div>
                      )}
                      {request.studentPhone && (
                        <div className="flex items-center space-x-2 text-gray-700">
                          <Phone className="w-4 h-4 text-blue-600" />
                          <a href={`tel:${request.studentPhone}`} className="hover:text-blue-600">
                            {request.studentPhone}
                          </a>
                        </div>
                      )}
                      {request.studentUniversity && (
                        <div className="flex items-center space-x-2 text-gray-600">
                          <GraduationCap className="w-4 h-4" />
                          <span>{request.studentUniversity}</span>
                        </div>
                      )}
                      {request.studentFieldOfStudy && (
                        <p className="text-xs text-gray-600">Field: {request.studentFieldOfStudy}</p>
                      )}
                    </div>
                  </div>

                  {/* Host Info */}
                  <div className="border-l-4 border-purple-500 pl-4 bg-purple-50 p-4 rounded-r-lg">
                    <div className="flex items-center space-x-2 mb-3">
                      <Home className="w-5 h-5 text-purple-600" />
                      <h4 className="font-semibold text-gray-900">Host</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="font-medium text-gray-900">{request.hostName}</p>
                      {request.hostEmail && (
                        <div className="flex items-center space-x-2 text-gray-700">
                          <Mail className="w-4 h-4 text-purple-600" />
                          <a href={`mailto:${request.hostEmail}`} className="hover:text-purple-600">
                            {request.hostEmail}
                          </a>
                        </div>
                      )}
                      {request.hostPhone && (
                        <div className="flex items-center space-x-2 text-gray-700">
                          <Phone className="w-4 h-4 text-purple-600" />
                          <a href={`tel:${request.hostPhone}`} className="hover:text-purple-600">
                            {request.hostPhone}
                          </a>
                        </div>
                      )}
                      {request.hostLocation && (
                        <div className="flex items-center space-x-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{request.hostLocation}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Services Offered */}
                {request.servicesOffered && request.servicesOffered.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Services Offered:</h4>
                    <div className="flex flex-wrap gap-2">
                      {request.servicesOffered.map((service, index) => (
                        <span key={index} className="badge bg-purple-100 text-purple-800">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Duration */}
                {request.duration && (
                  <div className="mb-6">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Duration: {request.duration} months</span>
                    </div>
                  </div>
                )}

                {/* Admin Notes (if approved/rejected) */}
                {request.adminNotes && (
                  <div className={`p-4 rounded-lg mb-6 ${
                    request.status === 'approved'
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    <p className="text-sm font-semibold text-gray-900 mb-1">Admin Notes:</p>
                    <p className="text-sm text-gray-700">{request.adminNotes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => handleViewDetails(request)}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Full Details</span>
                  </button>

                  {request.status === 'reviewing' && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowModal(true);
                        }}
                        className="btn-primary flex items-center space-x-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Approve Request</span>
                      </button>
                      <button
                        onClick={() => handleReject(request)}
                        className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors font-medium flex items-center space-x-2"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Approve Modal */}
        {showModal && selectedRequest && selectedRequest.status === 'reviewing' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Approve Facilitation Request
                </h3>
                <p className="text-sm text-gray-600">
                  Approving match between {selectedRequest.studentName} and {selectedRequest.hostName}
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Notes (Optional)
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add any notes about this approval..."
                  className="input-field min-h-[100px]"
                  rows={4}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setAdminNotes('');
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleApprove(selectedRequest.id)}
                  className="btn-primary flex-1"
                >
                  Approve & Notify Parties
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Reject Facilitation Request
                </h3>
                <p className="text-sm text-gray-600">
                  Rejecting match between {selectedRequest.studentName} and {selectedRequest.hostName}
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Rejection *
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Provide a clear reason for rejection..."
                  className="input-field min-h-[120px]"
                  rows={5}
                />
                <p className="text-xs text-gray-500 mt-2">
                  This reason will be shared with both parties
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectSubmit}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Reject Request
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFacilitationRequests;
