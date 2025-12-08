import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Star, ThumbsUp, ThumbsDown, Send, CheckCircle } from 'lucide-react';
import HelpOverlay from '../components/HelpOverlay';

export default function RateExperience() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get user type and partner info from location state (would come from dashboard)
  const { userType = 'student', partnerName = 'Margaret Thompson', partnerId = 1 } = location.state || {};

  const [formData, setFormData] = useState({
    overallRating: 0,
    communication: 0,
    reliability: 0,
    respect: 0,
    livingConditions: 0, // for students rating hosts
    taskQuality: 0, // for hosts rating students
    wouldRecommend: null,
    positiveAspects: '',
    areasForImprovement: '',
    additionalComments: ''
  });

  const [hoveredStar, setHoveredStar] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const handleStarClick = (category, rating) => {
    setFormData({
      ...formData,
      [category]: rating
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required ratings
    if (formData.overallRating === 0) {
      alert('Please provide an overall rating');
      return;
    }

    console.log('Submitting rating:', {
      ...formData,
      partnerId,
      userType
    });

    // TODO: Submit to backend API
    setShowSuccess(true);
  };

  const StarRating = ({ category, label, value, helpText }) => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        <span className="text-red-500">*</span>
        {helpText && (
          <HelpOverlay position="right">{helpText}</HelpOverlay>
        )}
      </label>
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(category, star)}
            onMouseEnter={() => setHoveredStar({ ...hoveredStar, [category]: star })}
            onMouseLeave={() => setHoveredStar({ ...hoveredStar, [category]: 0 })}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`w-8 h-8 ${
                star <= (hoveredStar[category] || value)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {value > 0 ? `${value} / 5` : 'Not rated'}
        </span>
      </div>
    </div>
  );

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full card text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Thank You for Your Feedback!
          </h2>
          <p className="text-gray-600 mb-6">
            Your rating has been submitted and will help improve the Homestay Exchange community.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate(`/${userType}/dashboard`)}
              className="btn-primary w-full"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900">
            Rate Your Experience
          </h1>
          <p className="mt-2 text-gray-600">
            Share your feedback about your arrangement with {partnerName}
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-teal-900">
            <strong>Your feedback matters!</strong> Honest ratings help maintain quality and trust in the Homestay Exchange community. All ratings are confidential and help both parties improve.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-8">
          {/* Overall Rating */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Overall Experience
            </h2>
            <StarRating
              category="overallRating"
              label="Overall Rating"
              value={formData.overallRating}
              helpText="Rate your overall experience from 1 (poor) to 5 (excellent)"
            />
          </div>

          {/* Detailed Ratings */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Detailed Ratings
            </h2>

            <StarRating
              category="communication"
              label="Communication"
              value={formData.communication}
              helpText="How well did you communicate with each other?"
            />

            <StarRating
              category="reliability"
              label="Reliability"
              value={formData.reliability}
              helpText="How reliable was your partner in meeting commitments?"
            />

            <StarRating
              category="respect"
              label="Respect & Consideration"
              value={formData.respect}
              helpText="How respectful and considerate was your partner?"
            />

            {userType === 'student' && (
              <StarRating
                category="livingConditions"
                label="Living Conditions"
                value={formData.livingConditions}
                helpText="How would you rate the accommodation provided?"
              />
            )}

            {userType === 'host' && (
              <StarRating
                category="taskQuality"
                label="Quality of Help Provided"
                value={formData.taskQuality}
                helpText="How would you rate the quality of help you received?"
              />
            )}
          </div>

          {/* Recommendation */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Recommendation
            </h2>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Would you recommend {partnerName} to others?
              <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, wouldRecommend: true })}
                className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                  formData.wouldRecommend === true
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <ThumbsUp className={`w-6 h-6 mx-auto mb-2 ${
                  formData.wouldRecommend === true ? 'text-green-600' : 'text-gray-400'
                }`} />
                <span className={`font-medium ${
                  formData.wouldRecommend === true ? 'text-green-600' : 'text-gray-700'
                }`}>
                  Yes, I would
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, wouldRecommend: false })}
                className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                  formData.wouldRecommend === false
                    ? 'border-red-600 bg-red-50'
                    : 'border-gray-200 hover:border-red-300'
                }`}
              >
                <ThumbsDown className={`w-6 h-6 mx-auto mb-2 ${
                  formData.wouldRecommend === false ? 'text-red-600' : 'text-gray-400'
                }`} />
                <span className={`font-medium ${
                  formData.wouldRecommend === false ? 'text-red-600' : 'text-gray-700'
                }`}>
                  No, I wouldn't
                </span>
              </button>
            </div>
          </div>

          {/* Written Feedback */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Written Feedback
            </h2>

            <div className="mb-6">
              <label htmlFor="positiveAspects" className="block text-sm font-medium text-gray-700 mb-2">
                What went well?
                <HelpOverlay position="right">
                  Share the positive aspects of your experience
                </HelpOverlay>
              </label>
              <textarea
                id="positiveAspects"
                name="positiveAspects"
                value={formData.positiveAspects}
                onChange={handleChange}
                rows="4"
                className="input-field resize-none"
                placeholder="What did you appreciate most about this arrangement?"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="areasForImprovement" className="block text-sm font-medium text-gray-700 mb-2">
                What could be improved?
                <HelpOverlay position="right">
                  Constructive feedback helps everyone improve
                </HelpOverlay>
              </label>
              <textarea
                id="areasForImprovement"
                name="areasForImprovement"
                value={formData.areasForImprovement}
                onChange={handleChange}
                rows="4"
                className="input-field resize-none"
                placeholder="Any suggestions for improvement?"
              />
            </div>

            <div>
              <label htmlFor="additionalComments" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Comments (Optional)
              </label>
              <textarea
                id="additionalComments"
                name="additionalComments"
                value={formData.additionalComments}
                onChange={handleChange}
                rows="3"
                className="input-field resize-none"
                placeholder="Any other feedback you'd like to share?"
              />
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
            <p className="mb-2">
              <strong>Privacy Notice:</strong> Your detailed written feedback will only be shared with the Homestay Exchange team for quality assurance. Only your star ratings and whether you'd recommend will be visible to other users.
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Submit Rating
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
