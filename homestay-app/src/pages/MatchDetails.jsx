import { useState } from 'react';
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
  Shield,
} from 'lucide-react';

const MatchDetails = () => {
  const { id } = useParams();
  const [showFacilitateModal, setShowFacilitateModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [connectionMessage, setConnectionMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Mock data - replace with actual API call
  const host = {
    id: 1,
    name: 'Margaret Thompson',
    age: 68,
    location: 'Kensington, London',
    postcode: 'SW7 3AX',
    distance: '2.3 miles from your university',
    rating: 4.8,
    reviewCount: 12,
    servicesNeeded: ['Companionship', 'Grocery Shopping', 'Technology Help'],
    accommodation: 'Private room with ensuite',
    about:
      "Hello! I'm Margaret, a retired teacher who loves reading, gardening, and cooking. I live in a lovely Victorian house in Kensington with a small garden. I'm looking for a friendly, responsible student to help me with weekly shopping trips and occasional technology questions. In return, you'll have a comfortable private room with your own bathroom. I enjoy having company for dinner and sharing stories, but I also respect privacy and quiet study time. Non-smoker preferred, and I have no pets.",
    verified: true,
    imageUrl: 'https://randomuser.me/api/portraits/women/67.jpg',
    amenities: [
      'Private bedroom',
      'Ensuite bathroom',
      'WiFi included',
      'Shared kitchen',
      'Laundry facilities',
      'Garden access',
      'Near public transport',
    ],
    houseRules: [
      'No smoking',
      'No pets',
      'Quiet hours 10pm - 7am',
      'Guests with advance notice',
    ],
    availableFrom: 'September 2025',
    hoursRequired: '10-15 hours per week',
    memberSince: 'January 2024',
    responseRate: '95%',
    reviews: [
      {
        id: 1,
        studentName: 'Sarah K.',
        rating: 5,
        date: 'March 2025',
        comment:
          'Margaret is wonderful! Very kind and understanding. The room is spacious and comfortable. I help with grocery shopping and teaching her to use her tablet, which she really appreciates.',
        verified: true,
      },
      {
        id: 2,
        studentName: 'Ahmed M.',
        rating: 4.5,
        date: 'January 2025',
        comment:
          'Great experience living with Margaret. The location is excellent for UCL students. She cooks amazing meals and loves to share stories about her teaching career.',
        verified: true,
      },
    ],
  };

  const handleFacilitate = () => {
    setShowFacilitateModal(true);
  };

  const handleSubmitRequest = () => {
    if (!connectionMessage.trim()) {
      alert('Please write a message introducing yourself.');
      return;
    }

    // TODO: Implement API call to notify admin
    console.log('Connection request sent for host:', id, 'Message:', connectionMessage);
    setShowFacilitateModal(false);
    setShowSuccessModal(true);
    setConnectionMessage('');
  };

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
                  <div className="w-32 h-32 rounded-xl overflow-hidden bg-gray-200">
                    <img
                      src={host.imageUrl}
                      alt={host.name}
                      className="w-full h-full object-cover"
                    />
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
                          <CheckCircle className="w-6 h-6 text-purple-600" />
                        )}
                      </div>
                      <p className="text-gray-600 mb-2">
                        {host.age} years old • Member since {host.memberSince}
                      </p>
                      <div className="flex items-center space-x-1 text-gray-600 mb-1">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{host.location}</span>
                      </div>
                      <p className="text-xs text-gray-500">{host.distance}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsSaved(!isSaved)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Save host"
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
                    <div className="flex items-center space-x-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-gray-900">
                        {host.rating}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {host.reviewCount} reviews
                    </span>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {host.responseRate} response rate
                      </span>
                    </div>
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
                          className="badge bg-purple-100 text-purple-800"
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
                {host.about}
              </p>
            </div>

            {/* Accommodation Details */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Accommodation Details
              </h2>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-gray-700">
                  <Home className="w-5 h-5 text-purple-600" />
                  <span>{host.accommodation}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <span>Available from {host.availableFrom}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <span>{host.hoursRequired} of help required</span>
                </div>
              </div>

              {/* Amenities */}
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">What's included:</h3>
                <div className="grid grid-cols-2 gap-3">
                  {host.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* House Rules */}
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">House Rules:</h3>
                <ul className="space-y-2">
                  {host.houseRules.map((rule) => (
                    <li key={rule} className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Reviews */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Reviews from Students
              </h2>

              <div className="space-y-6">
                {host.reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold text-gray-900">
                            {review.studentName}
                          </span>
                          {review.verified && (
                            <CheckCircle className="w-4 h-4 text-purple-600" />
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-semibold text-gray-900">
                              {review.rating}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">• {review.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Facilitate Card */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
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
                Request Connection
              </button>

              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <h4 className="font-semibold text-purple-900 text-sm mb-2">
                  What happens next?
                </h4>
                <ol className="text-xs text-purple-800 space-y-2 list-decimal list-inside">
                  <li>You submit a facilitation request</li>
                  <li>Our team reviews your profile match</li>
                  <li>Both parties are contacted within 24-48 hours</li>
                  <li>We arrange a safe first meeting</li>
                  <li>If both agree, the arrangement begins!</li>
                </ol>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 text-sm mb-3">Need help?</h4>
                <div className="space-y-2 text-sm">
                  <a
                    href="#"
                    className="flex items-center space-x-2 text-purple-600 hover:text-purple-700"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Contact support</span>
                  </a>
                  <Link
                    to="/help"
                    className="flex items-center space-x-2 text-purple-600 hover:text-purple-700"
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
              Request Connection with {host.name}
            </h3>

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-purple-900 font-medium mb-1">
                    Admin-Facilitated Connection
                  </p>
                  <p className="text-xs text-purple-800 leading-relaxed">
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

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6 text-left">
              <p className="text-sm text-purple-900 font-medium mb-2">
                What happens next?
              </p>
              <ol className="text-sm text-purple-800 space-y-1">
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
