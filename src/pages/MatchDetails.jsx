import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Star,
  Home,
  CheckCircle,
  Heart,
  Share2,
  AlertCircle,
  Calendar,
  Clock,
  Mail,
  Phone,
  MessageCircle,
  MessageSquare,
  Shield,
  Loader2,
  XCircle,
  Briefcase,
  DollarSign,
  Eye,
} from 'lucide-react';
import { hostService } from '../services/hostService';
import { savedHostsService } from '../services/savedHostsService';
import { facilitationService } from '../services/facilitationService';

const MatchDetails = () => {
  const { id } = useParams();
  const [host, setHost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFacilitateModal, setShowFacilitateModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [connectionMessage, setConnectionMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [existingRequest, setExistingRequest] = useState(null);

  // Fetch host data and check saved status
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching host details for ID:', id);

        // Fetch host data, saved status, and existing request in parallel
        const [hostData, savedStatus, requestData] = await Promise.all([
          hostService.getHostById(id),
          savedHostsService.isHostSaved(id),
          facilitationService.checkExistingRequest(id)
        ]);

        setHost(hostData);
        setIsSaved(savedStatus);
        setExistingRequest(requestData);
      } catch (err) {
        console.error('Error fetching host:', err);
        setError(err.message || 'Failed to load host details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleFacilitate = () => {
    setShowFacilitateModal(true);
  };

  const handleToggleSave = async () => {
    try {
      const newSavedStatus = await savedHostsService.toggleSavedHost(id);
      setIsSaved(newSavedStatus);
    } catch (err) {
      console.error('Error toggling saved status:', err);
      alert('Failed to update favorites. Please try again.');
    }
  };

  const handleSubmitRequest = async () => {
    if (!connectionMessage.trim()) {
      alert('Please write a message introducing yourself.');
      return;
    }

    try {
      const newRequest = await facilitationService.createRequest(id, connectionMessage);
      console.log('Facilitation request sent for host:', id);
      setShowFacilitateModal(false);
      setShowSuccessModal(true);
      setConnectionMessage('');
      // Update existing request to prevent duplicate submissions
      setExistingRequest({
        id: newRequest.id,
        status: newRequest.status,
        created_at: newRequest.created_at
      });
    } catch (err) {
      console.error('Error creating facilitation request:', err);
      alert('Failed to submit request. Please try again.');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container-custom">
          <div className="card p-12 text-center">
            <Loader2 className="w-16 h-16 text-teal-600 mx-auto mb-4 animate-spin" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Loading host details...
            </h3>
            <p className="text-gray-600">
              Please wait while we fetch the host information.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container-custom">
          <Link
            to="/student/browse"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Browse</span>
          </Link>
          <div className="card p-12 text-center bg-red-50 border-red-200">
            <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Unable to Load Host
            </h3>
            <p className="text-red-800 mb-6">{error}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                Try Again
              </button>
              <Link to="/student/browse" className="btn-secondary">
                Back to Browse
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No host data
  if (!host) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container-custom">
          <div className="card p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Host Not Found
            </h3>
            <p className="text-gray-600 mb-6">
              This host may not exist or may have removed their listing.
            </p>
            <Link to="/student/browse" className="btn-primary">
              Back to Browse Hosts
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Back Button */}
        <Link
          to="/student/browse"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Browse</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Host Header Card */}
            <div className="card p-6">
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Host Image */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-xl overflow-hidden bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center">
                    {host.imageUrl || host.profilePictureUrl ? (
                      <img
                        src={host.imageUrl || host.profilePictureUrl}
                        alt={host.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Home className="w-16 h-16 text-teal-400" />
                    )}
                  </div>
                </div>

                {/* Host Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                          {host.name}
                        </h1>
                        {host.verified && (
                          <CheckCircle className="w-6 h-6 text-teal-600" />
                        )}
                      </div>
                      <p className="text-gray-600 mb-2">
                        Member since {host.memberSince}
                      </p>
                      <div className="flex items-center space-x-1 text-gray-600 mb-1">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{host.location}</span>
                      </div>
                      {host.numberOfRooms && (
                        <p className="text-xs text-gray-500">
                          {host.numberOfRooms} {host.numberOfRooms === 1 ? 'room' : 'rooms'} available
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={handleToggleSave}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label={isSaved ? 'Unsave host' : 'Save host'}
                        title={isSaved ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Heart
                          className={`w-6 h-6 ${
                            isSaved
                              ? 'fill-red-500 text-red-500'
                              : 'text-gray-400'
                          }`}
                        />
                      </button>
                      <button
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Share"
                      >
                        <Share2 className="w-6 h-6 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-4 mb-4">
                    {host.rating > 0 ? (
                      <>
                        <div className="flex items-center space-x-1">
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold text-gray-900">
                            {host.rating.toFixed(1)}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">
                          {host.reviewCount} {host.reviewCount === 1 ? 'review' : 'reviews'}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm text-gray-500 italic">New host - No reviews yet</span>
                    )}
                  </div>

                  {/* Services Needed */}
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-2">
                      Services Needed:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {host.servicesNeeded.map((service) => (
                        <span
                          key={service}
                          className="badge bg-teal-100 text-teal-800"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About {host.name}</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {host.about || host.propertyDescription || 'No description provided.'}
              </p>
              {host.additionalInfo && (
                <div className="mt-4 p-4 bg-teal-50 border border-teal-200 rounded-lg">
                  <p className="text-sm text-teal-900">{host.additionalInfo}</p>
                </div>
              )}
            </div>

            {/* Available Opportunities */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Available Opportunities ({host.tasks?.length || 0})
              </h2>

              <div className="space-y-4">
                {host.tasks && host.tasks.length > 0 ? (
                  host.tasks.map((task) => (
                    <div key={task.id} className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">{task.title}</h3>

                      <p className="text-gray-700 mb-4">{task.description}</p>

                      {/* Task Details Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-teal-600" />
                          <div>
                            <p className="text-xs text-gray-500">Hours/Week</p>
                            <p className="text-sm font-medium text-gray-900">{task.hoursPerWeek}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-teal-600" />
                          <div>
                            <p className="text-xs text-gray-500">Frequency</p>
                            <p className="text-sm font-medium text-gray-900">{task.frequency}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-teal-600" />
                          <div>
                            <p className="text-xs text-gray-500">Duration</p>
                            <p className="text-sm font-medium text-gray-900">{task.duration}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-teal-600" />
                          <div>
                            <p className="text-xs text-gray-500">Schedule</p>
                            <p className="text-sm font-medium text-gray-900">{task.schedule || 'Flexible'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Services for this task */}
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-gray-700 mb-2">Services Needed:</p>
                        <div className="flex flex-wrap gap-2">
                          {task.servicesNeeded.map((service, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-700"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Compensation */}
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                        <div className="flex items-start gap-2">
                          <DollarSign className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-green-900 mb-1">Compensation:</p>
                            <p className="text-sm text-green-800">{task.compensation}</p>
                          </div>
                        </div>
                      </div>

                      {/* Requirements */}
                      {task.requirements && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-semibold text-blue-900 mb-1">Requirements:</p>
                              <p className="text-sm text-blue-800">{task.requirements}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Additional Notes */}
                      {task.additionalNotes && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">Additional Notes:</p>
                          <p className="text-sm text-gray-700">{task.additionalNotes}</p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No tasks available at the moment.</p>
                )}
              </div>
            </div>

            {/* Amenities */}
            {host.amenities && host.amenities.length > 0 && (
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities Included</h2>
                <div className="grid grid-cols-2 gap-3">
                  {host.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Host Preferences */}
            {(host.preferredGender || host.preferredAgeRange) && (
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Host Preferences</h2>
                <div className="space-y-3">
                  {host.preferredGender && (
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="w-5 h-5 text-teal-600" />
                      <div>
                        <p className="text-xs text-gray-500">Preferred Gender</p>
                        <p className="text-sm font-medium text-gray-900">{host.preferredGender}</p>
                      </div>
                    </div>
                  )}
                  {host.preferredAgeRange && (
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="w-5 h-5 text-teal-600" />
                      <div>
                        <p className="text-xs text-gray-500">Preferred Age Range</p>
                        <p className="text-sm font-medium text-gray-900">{host.preferredAgeRange}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Facilitate Card */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              {existingRequest ? (
                /* Existing Request - Show Status */
                <div>
                  <div className={`rounded-xl p-4 mb-4 ${
                    existingRequest.status === 'pending' ? 'bg-yellow-50 border border-yellow-200' :
                    existingRequest.status === 'reviewing' ? 'bg-teal-50 border border-teal-200' :
                    existingRequest.status === 'approved' || existingRequest.status === 'matched' ? 'bg-green-50 border border-green-200' :
                    'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-start space-x-3">
                      {existingRequest.status === 'pending' && <Clock className="w-6 h-6 text-yellow-600 flex-shrink-0" />}
                      {existingRequest.status === 'reviewing' && <Eye className="w-6 h-6 text-teal-600 flex-shrink-0" />}
                      {(existingRequest.status === 'approved' || existingRequest.status === 'matched') && <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />}
                      {existingRequest.status === 'rejected' && <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />}
                      <div>
                        <h4 className={`font-semibold mb-1 ${
                          existingRequest.status === 'pending' ? 'text-yellow-900' :
                          existingRequest.status === 'reviewing' ? 'text-teal-900' :
                          existingRequest.status === 'approved' || existingRequest.status === 'matched' ? 'text-green-900' :
                          'text-red-900'
                        }`}>
                          {existingRequest.status === 'pending' && 'Request Pending'}
                          {existingRequest.status === 'reviewing' && 'Under Review'}
                          {(existingRequest.status === 'approved' || existingRequest.status === 'matched') && 'Request Approved!'}
                          {existingRequest.status === 'rejected' && 'Request Not Approved'}
                        </h4>
                        <p className={`text-sm ${
                          existingRequest.status === 'pending' ? 'text-yellow-800' :
                          existingRequest.status === 'reviewing' ? 'text-teal-800' :
                          existingRequest.status === 'approved' || existingRequest.status === 'matched' ? 'text-green-800' :
                          'text-red-800'
                        }`}>
                          {existingRequest.status === 'pending' && 'Your facilitation request is awaiting admin review.'}
                          {existingRequest.status === 'reviewing' && 'Our admin team is currently reviewing your request.'}
                          {(existingRequest.status === 'approved' || existingRequest.status === 'matched') && 'Your request has been approved! Check your Connection Requests page for admin contact details.'}
                          {existingRequest.status === 'rejected' && 'Unfortunately, this request was not approved. You may browse other hosts.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/connection-requests"
                    className="btn-primary w-full mb-4 text-center block"
                  >
                    View Request Status
                  </Link>

                  {/* Show feedback button for matched arrangements */}
                  {(existingRequest.status === 'matched' || existingRequest.status === 'approved') && (
                    <Link
                      to={`/monthly-feedback/${existingRequest.id}`}
                      state={{
                        partnerName: host.name,
                        partnerId: host.id,
                        partnerRole: 'host'
                      }}
                      className="btn-outline w-full mb-4 text-center flex items-center justify-center space-x-2"
                    >
                      <MessageSquare className="w-5 h-5" />
                      <span>Submit Monthly Feedback</span>
                    </Link>
                  )}

                  <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                    <p className="text-xs text-teal-800">
                      <strong>Note:</strong> You can only send one facilitation request per host.
                      Check your Connection Requests page to track the status of this request.
                    </p>
                  </div>
                </div>
              ) : (
                /* No Existing Request - Show Request Button */
                <div>
                  <div className="mb-6">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                      <div className="flex items-start space-x-3">
                        <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-green-900 text-sm mb-1">
                            Verified Host
                          </h4>
                          <p className="text-xs text-green-800">
                            ID, address, and DBS check verified
                          </p>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Interested in this host?
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Our team will facilitate the arrangement and coordinate with both
                      parties to set up a meeting.
                    </p>
                  </div>

                  <button
                    onClick={handleFacilitate}
                    className="btn-primary w-full mb-4 text-lg py-4"
                  >
                    Request Facilitation
                  </button>

                  <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                    <h4 className="font-semibold text-teal-900 text-sm mb-2">
                      What happens next?
                    </h4>
                    <ol className="text-xs text-teal-800 space-y-2 list-decimal list-inside">
                      <li>You submit a facilitation request</li>
                      <li>Our team reviews your profile match</li>
                      <li>Both parties are contacted within 24-48 hours</li>
                      <li>We arrange a safe first meeting</li>
                      <li>If both agree, the arrangement begins!</li>
                    </ol>
                  </div>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 text-sm mb-3">Need help?</h4>
                <div className="space-y-2 text-sm">
                  <a
                    href="#"
                    className="flex items-center space-x-2 text-teal-600 hover:text-teal-700"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Contact support</span>
                  </a>
                  <Link
                    to="/help"
                    className="flex items-center space-x-2 text-teal-600 hover:text-teal-700"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>Visit Help Center</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Connection Request Modal */}
      {showFacilitateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 animate-fade-in max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Request Facilitation with {host.name}
            </h3>

            <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-6">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-teal-900 font-medium mb-1">
                    Admin-Facilitated Connection
                  </p>
                  <p className="text-xs text-teal-800 leading-relaxed">
                    Our admin team will review your request and coordinate with both you and {host.name} to arrange a safe first meeting. We do not provide direct messaging for safety and privacy reasons.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="connectionMessage" className="block text-sm font-semibold text-gray-900 mb-2">
                Introduce Yourself and Explain Why You'd Like to Connect *
              </label>
              <textarea
                id="connectionMessage"
                value={connectionMessage}
                onChange={(e) => setConnectionMessage(e.target.value)}
                rows="6"
                className="input-field resize-none w-full"
                placeholder="Example: Hello! I'm a Computer Science student at UCL. I noticed you need help with technology and grocery shopping, which are services I can provide. I'm reliable, friendly, and would love to help while having affordable accommodation close to campus..."
                required
              ></textarea>
              <p className="text-xs text-gray-600 mt-2">
                This message will be shared with the admin team and the host.
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-900 font-medium mb-1">
                    Before Submitting
                  </p>
                  <ul className="text-xs text-yellow-800 space-y-1">
                    <li>• Ensure your profile is complete</li>
                    <li>• Verify your documents are uploaded</li>
                    <li>• Be genuine and respectful in your message</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowFacilitateModal(false);
                  setConnectionMessage('');
                }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRequest}
                className="btn-primary flex-1"
                disabled={!connectionMessage.trim()}
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 animate-fade-in text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Request Sent Successfully!
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Your connection request has been sent to our admin team. They will review your request and contact both you and <span className="font-semibold">{host.name}</span> within 24-48 hours to arrange a meeting.
            </p>

            <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-6 text-left">
              <p className="text-sm text-teal-900 font-medium mb-2">
                What happens next?
              </p>
              <ol className="text-sm text-teal-800 space-y-1">
                <li>1. Admin reviews your request</li>
                <li>2. You'll receive an email update</li>
                <li>3. Check your Connection Requests page for status</li>
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="btn-secondary flex-1"
              >
                Close
              </button>
              <Link
                to="/connection-requests"
                className="btn-primary flex-1 text-center"
              >
                View My Requests
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchDetails;
