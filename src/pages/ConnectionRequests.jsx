import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link2, Clock, CheckCircle, Eye, Mail, Phone, MapPin, AlertCircle, Loader2, XCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { facilitationService } from '../services/facilitationService';
import toast from 'react-hot-toast';

const ConnectionRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

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
      setError(null);
      const data = await facilitationService.getUserRequests();
      setRequests(data);
      if (isRefresh) {
        toast.success('Requests refreshed successfully');
      }
    } catch (err) {
      console.error('[ConnectionRequests] Error fetching requests:', err);
      setError('Failed to load requests. Please try again later.');
      if (isRefresh) {
        toast.error('Failed to refresh requests');
      }
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

  const getStatusBadge = (status) => {
    const badges = {
      pending: {
        icon: Clock,
        text: 'Pending Review',
        class: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      },
      in_review: {
        icon: Eye,
        text: 'Under Review',
        class: 'bg-purple-100 text-purple-800 border-purple-200',
      },
      matched: {
        icon: CheckCircle,
        text: 'Approved',
        class: 'bg-green-100 text-green-800 border-green-200',
      },
      cancelled: {
        icon: XCircle,
        text: 'Not Approved',
        class: 'bg-red-100 text-red-800 border-red-200',
      },
    };

    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;

    return (
      <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border text-sm font-medium ${badge.class}`}>
        <Icon className="w-4 h-4" />
        <span>{badge.text}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <button
            onClick={() => navigate('/student/dashboard')}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-purple-800 text-white py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <Link2 className="w-16 h-16 mx-auto mb-4" />
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                Connection Requests
              </h1>
              <p className="text-xl text-purple-100 mb-6">
                Track your requests to connect with hosts
              </p>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="btn-secondary bg-white text-purple-700 hover:bg-purple-50 border-white flex items-center space-x-2 mx-auto"
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                <span>{refreshing ? 'Refreshing...' : 'Refresh Requests'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-8 bg-purple-50 border-b border-purple-100">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    How Connection Requests Work
                  </h3>
                  <ol className="space-y-2 text-gray-700">
                    <li className="flex items-start space-x-2">
                      <span className="font-bold text-purple-600 flex-shrink-0">1.</span>
                      <span>
                        <strong>You submit a request</strong> to connect with a host, introducing yourself and explaining why you'd be a good match.
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="font-bold text-purple-600 flex-shrink-0">2.</span>
                      <span>
                        <strong>Our admin team reviews</strong> your request and the host's requirements to ensure compatibility and safety.
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="font-bold text-purple-600 flex-shrink-0">3.</span>
                      <span>
                        <strong>Once approved</strong>, we share the admin contact details so they can facilitate your introduction to the host.
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="font-bold text-purple-600 flex-shrink-0">4.</span>
                      <span>
                        <strong>The admin arranges</strong> a meeting or call between you and the host to discuss the arrangement.
                      </span>
                    </li>
                  </ol>
                  <p className="text-sm text-purple-800 mt-4 bg-purple-50 p-3 rounded-lg">
                    <strong>Note:</strong> We do not provide direct messaging between students and hosts. All connections are facilitated by our admin team to ensure safety and proper verification.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Connection Requests List */}
      <section className="py-12">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            {requests.length === 0 ? (
              <div className="card p-12 text-center">
                <Link2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Connection Requests Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Browse hosts and submit connection requests to get started.
                </p>
                <a href="/student/browse" className="btn-primary inline-block">
                  Browse Hosts
                </a>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Your Connection Requests ({requests.length})
                  </h2>
                </div>

                {requests.map((request) => (
                  <div key={request.id} className="card p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                      <div className="flex-1 mb-4 md:mb-0">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {request.hostName}
                        </h3>
                        <p className="text-gray-600 flex items-center space-x-2 mb-2">
                          <MapPin className="w-4 h-4" />
                          <span>{request.hostLocation}</span>
                        </p>
                        <p className="text-sm text-gray-500">
                          Requested on: {new Date(request.requestDate).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <div>
                        {getStatusBadge(request.status)}
                      </div>
                    </div>

                    {/* Your Message */}
                    {request.message && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">
                          Your Message:
                        </h4>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {request.message}
                        </p>
                      </div>
                    )}

                    {/* Admin Notes */}
                    {request.adminNotes && (
                      <div className="bg-blue-50 rounded-lg p-4 mb-4">
                        <h4 className="text-sm font-semibold text-blue-900 mb-2">
                          Admin Notes:
                        </h4>
                        <p className="text-blue-800 text-sm leading-relaxed">
                          {request.adminNotes}
                        </p>
                      </div>
                    )}

                    {/* Status Information */}
                    {request.status === 'pending' && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-semibold text-yellow-900 mb-1">
                              Awaiting Admin Review
                            </h4>
                            <p className="text-sm text-yellow-800">
                              Our admin team will review your request within 24-48 hours. You'll be notified by email once there's an update.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {request.status === 'in_review' && (
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <Eye className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-semibold text-purple-900 mb-1">
                              Under Review
                            </h4>
                            <p className="text-sm text-purple-800">
                              Our admin team is currently reviewing your request and coordinating with the host. We'll update you soon!
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {request.status === 'matched' && request.adminContact && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-green-900 mb-3">
                              Request Approved! Contact Your Admin Facilitator
                            </h4>
                            <div className="bg-white rounded-lg p-4 space-y-3">
                              <div>
                                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                                  Admin Facilitator
                                </p>
                                <p className="text-gray-900 font-semibold">
                                  {request.adminContact.name}
                                </p>
                              </div>
                              {request.adminContact.email && (
                                <div className="flex items-center space-x-2 text-sm text-gray-700">
                                  <Mail className="w-4 h-4 text-purple-600" />
                                  <a
                                    href={`mailto:${request.adminContact.email}`}
                                    className="text-purple-600 hover:text-purple-700 font-medium"
                                  >
                                    {request.adminContact.email}
                                  </a>
                                </div>
                              )}
                              {request.adminContact.phone && (
                                <div className="flex items-center space-x-2 text-sm text-gray-700">
                                  <Phone className="w-4 h-4 text-purple-600" />
                                  <a
                                    href={`tel:${request.adminContact.phone}`}
                                    className="text-purple-600 hover:text-purple-700 font-medium"
                                  >
                                    {request.adminContact.phone}
                                  </a>
                                </div>
                              )}
                            </div>
                            <p className="text-xs text-green-800 mt-3">
                              Contact your admin facilitator to arrange a meeting with the host. They will guide you through the next steps.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {request.status === 'cancelled' && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-semibold text-red-900 mb-1">
                              Request Not Approved
                            </h4>
                            <p className="text-sm text-red-800">
                              Unfortunately, this request was not approved. Please check the admin notes above for more information. You can browse other hosts and submit new requests.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-12 bg-white border-t">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Need Help?
            </h2>
            <p className="text-gray-600 mb-6">
              If you have questions about your connection requests or the facilitation process, we're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/help" className="btn-primary">
                Visit Help Center
              </a>
              <a href="/contact" className="btn-outline">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ConnectionRequests;
