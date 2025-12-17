import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  RefreshCw,
  ArrowLeft,
} from 'lucide-react';
import { facilitationService } from '../services/facilitationService';
import toast from 'react-hot-toast';

const AdminFacilitationRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState('in_review');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [processingId, setProcessingId] = useState(null);

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

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const data = await facilitationService.getAdminRequests();
      setRequests(data);
      toast.success('Facilitation requests refreshed');
    } catch (error) {
      console.error('Error refreshing requests:', error);
      toast.error('Failed to refresh facilitation requests');
    } finally {
      setRefreshing(false);
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
    setShowDetailsModal(true);
  };

  const handleApproveFromDetails = () => {
    setShowDetailsModal(false);
    setShowModal(true);
  };

  const handleRejectFromDetails = () => {
    setShowDetailsModal(false);
    setShowRejectModal(true);
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      in_review: 'bg-teal-100 text-teal-800 border-teal-200',
      matched: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    };
    const icons = {
      pending: <Clock className="w-3 h-3" />,
      in_review: <Eye className="w-3 h-3" />,
      matched: <CheckCircle className="w-3 h-3" />,
      cancelled: <XCircle className="w-3 h-3" />,
    };
    const labels = {
      pending: 'Pending',
      in_review: 'Under Review',
      matched: 'Approved',
      cancelled: 'Rejected',
    };
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full border ${styles[status]}`}>
        {icons[status]}
        {labels[status]}
      </span>
    );
  };

  const filteredRequests = requests.filter(req => req.status === filterStatus);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
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
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-teal-600 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
            <div className="flex items-center gap-3">
              <Link2 className="w-8 h-8 text-teal-600" />
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900">
                Facilitation Requests
              </h1>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
          <p className="text-base sm:text-lg text-gray-600">
            Review and approve host-student matching requests
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setFilterStatus('in_review')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  filterStatus === 'in_review'
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Under Review ({requests.filter(r => r.status === 'in_review').length})
              </button>
              <button
                onClick={() => setFilterStatus('matched')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  filterStatus === 'matched'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Approved ({requests.filter(r => r.status === 'matched').length})
              </button>
              <button
                onClick={() => setFilterStatus('cancelled')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  filterStatus === 'cancelled'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Rejected ({requests.filter(r => r.status === 'cancelled').length})
              </button>
            </nav>
          </div>
        </div>

        {/* Requests List */}
        {filteredRequests.length === 0 ? (
          <div className="card p-12 text-center">
            <Link2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No {filterStatus === 'in_review' ? 'under review' : filterStatus === 'matched' ? 'approved' : 'rejected'} facilitation requests
            </h3>
            <p className="text-gray-600">
              {filterStatus === 'in_review' && 'Facilitation requests needing admin review will appear here.'}
              {filterStatus === 'matched' && 'Approved facilitation requests will appear here.'}
              {filterStatus === 'cancelled' && 'Rejected facilitation requests will appear here.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <div key={request.id} className="card p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Link2 className="w-6 h-6 text-teal-600" />
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
                      {request.studentHoursPerWeek && (
                        <p className="text-xs text-gray-600">Hours/Week: {request.studentHoursPerWeek} hours</p>
                      )}
                    </div>
                  </div>

                  {/* Host Info */}
                  <div className="border-l-4 border-teal-500 pl-4 bg-teal-50 p-4 rounded-r-lg">
                    <div className="flex items-center space-x-2 mb-3">
                      <Home className="w-5 h-5 text-teal-600" />
                      <h4 className="font-semibold text-gray-900">Host</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="font-medium text-gray-900">{request.hostName}</p>
                      {request.hostEmail && (
                        <div className="flex items-center space-x-2 text-gray-700">
                          <Mail className="w-4 h-4 text-teal-600" />
                          <a href={`mailto:${request.hostEmail}`} className="hover:text-teal-600">
                            {request.hostEmail}
                          </a>
                        </div>
                      )}
                      {request.hostPhone && (
                        <div className="flex items-center space-x-2 text-gray-700">
                          <Phone className="w-4 h-4 text-teal-600" />
                          <a href={`tel:${request.hostPhone}`} className="hover:text-teal-600">
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
                        <span key={index} className="badge bg-teal-100 text-teal-800">
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
                    request.status === 'matched'
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

                  {request.status === 'in_review' && (
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

        {/* Details Modal */}
        {showDetailsModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Facilitation Request Details
                  </h3>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-lg font-semibold text-gray-700">
                    {selectedRequest.studentName} → {selectedRequest.hostName}
                  </h4>
                  {getStatusBadge(selectedRequest.status)}
                </div>
                <p className="text-sm text-gray-500">
                  Requested on {new Date(selectedRequest.requestDate).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Student Info */}
                <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-4 rounded-r-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-gray-900">Student (Guest)</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="font-medium text-gray-900">{selectedRequest.studentName}</p>
                    {selectedRequest.studentEmail && (
                      <div className="flex items-center space-x-2 text-gray-700">
                        <Mail className="w-4 h-4 text-blue-600" />
                        <a href={`mailto:${selectedRequest.studentEmail}`} className="hover:text-blue-600">
                          {selectedRequest.studentEmail}
                        </a>
                      </div>
                    )}
                    {selectedRequest.studentPhone && (
                      <div className="flex items-center space-x-2 text-gray-700">
                        <Phone className="w-4 h-4 text-blue-600" />
                        <a href={`tel:${selectedRequest.studentPhone}`} className="hover:text-blue-600">
                          {selectedRequest.studentPhone}
                        </a>
                      </div>
                    )}
                    {selectedRequest.studentUniversity && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <GraduationCap className="w-4 h-4" />
                        <span>{selectedRequest.studentUniversity}</span>
                      </div>
                    )}
                    {selectedRequest.studentFieldOfStudy && (
                      <p className="text-xs text-gray-600">Field: {selectedRequest.studentFieldOfStudy}</p>
                    )}
                    {selectedRequest.studentHoursPerWeek && (
                      <p className="text-xs text-gray-600">Hours/Week: {selectedRequest.studentHoursPerWeek} hours</p>
                    )}
                  </div>
                </div>

                {/* Host Info */}
                <div className="border-l-4 border-teal-500 pl-4 bg-teal-50 p-4 rounded-r-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <Home className="w-5 h-5 text-teal-600" />
                    <h4 className="font-semibold text-gray-900">Host</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="font-medium text-gray-900">{selectedRequest.hostName}</p>
                    {selectedRequest.hostEmail && (
                      <div className="flex items-center space-x-2 text-gray-700">
                        <Mail className="w-4 h-4 text-teal-600" />
                        <a href={`mailto:${selectedRequest.hostEmail}`} className="hover:text-teal-600">
                          {selectedRequest.hostEmail}
                        </a>
                      </div>
                    )}
                    {selectedRequest.hostPhone && (
                      <div className="flex items-center space-x-2 text-gray-700">
                        <Phone className="w-4 h-4 text-teal-600" />
                        <a href={`tel:${selectedRequest.hostPhone}`} className="hover:text-teal-600">
                          {selectedRequest.hostPhone}
                        </a>
                      </div>
                    )}
                    {selectedRequest.hostLocation && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedRequest.hostLocation}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Student's Message */}
              {selectedRequest.message && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Student's Message:
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {selectedRequest.message}
                  </p>
                </div>
              )}

              {/* Services Offered */}
              {selectedRequest.servicesOffered && selectedRequest.servicesOffered.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Services Offered:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedRequest.servicesOffered.map((service, index) => (
                      <span key={index} className="badge bg-teal-100 text-teal-800">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Duration */}
              {selectedRequest.duration && (
                <div className="mb-6">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Duration: {selectedRequest.duration} months</span>
                  </div>
                </div>
              )}

              {/* Admin Notes (if exists) */}
              {selectedRequest.adminNotes && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-sm font-semibold text-gray-900 mb-1">Admin Notes:</p>
                  <p className="text-sm text-gray-700">{selectedRequest.adminNotes}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="btn-secondary flex-1"
                >
                  Close
                </button>
                {selectedRequest.status === 'in_review' && (
                  <>
                    <button
                      onClick={handleApproveFromDetails}
                      className="btn-primary flex-1 flex items-center justify-center space-x-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>Approve Request</span>
                    </button>
                    <button
                      onClick={handleRejectFromDetails}
                      className="flex-1 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors font-medium flex items-center justify-center space-x-2"
                    >
                      <XCircle className="w-5 h-5" />
                      <span>Reject</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Approve Modal */}
        {showModal && selectedRequest && selectedRequest.status === 'in_review' && (
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
                  Admin Notes <span className="text-gray-500 font-normal">(Optional)</span>
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add any notes about this approval (optional)..."
                  className="input-field min-h-[100px]"
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-2">
                  You can approve without adding notes. Notes will be visible to both parties if added.
                </p>
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

