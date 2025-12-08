import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Star, Calendar, Clock, Send, CheckCircle, AlertCircle, Award, ArrowLeft, MessageSquare } from 'lucide-react';
import { submitMonthlyFeedback, canSubmitFeedback, getCurrentMonth } from '../services/feedbackService';
import { useUser } from '../context/UserContext';
import HelpOverlay from '../components/HelpOverlay';

export default function MonthlyFeedbackForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const { facilitationId } = useParams();

  // Get partner info from location state or props
  const { partnerName, partnerId, partnerRole } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [canSubmit, setCanSubmit] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentMonth] = useState(getCurrentMonth());

  const [formData, setFormData] = useState({
    rating: 0,
    feedback_text: '',
    hours_contributed: '',
    tasks_completed: '',
    highlights: '',
    challenges: '',
    goals_next_month: '',
    support_needed: false,
    support_details: '',
  });

  const [hoveredStar, setHoveredStar] = useState(0);

  // Check if user can submit feedback for this month
  useEffect(() => {
    const checkEligibility = async () => {
      if (!facilitationId) return;

      const result = await canSubmitFeedback(facilitationId);
      if (result.success) {
        setCanSubmit(result.canSubmit);
        if (!result.canSubmit) {
          setError(`You have already submitted feedback for ${result.month}. You can only submit one feedback entry per month.`);
        }
      }
    };

    checkEligibility();
  }, [facilitationId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleStarClick = (rating) => {
    setFormData({ ...formData, rating });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.rating === 0) {
      setError('Please provide a rating (1-5 stars)');
      return;
    }

    if (!formData.feedback_text || formData.feedback_text.trim().length < 10) {
      setError('Please provide feedback (at least 10 characters)');
      return;
    }

    setLoading(true);

    try {
      const feedbackData = {
        facilitation_id: facilitationId,
        recipient_id: partnerId,
        rating: formData.rating,
        feedback_text: formData.feedback_text,
        hours_contributed: formData.hours_contributed ? parseInt(formData.hours_contributed) : null,
        tasks_completed: formData.tasks_completed,
        highlights: formData.highlights,
        challenges: formData.challenges,
        goals_next_month: formData.goals_next_month,
        support_needed: formData.support_needed,
        support_details: formData.support_details,
        feedback_month: currentMonth,
      };

      const result = await submitMonthlyFeedback(feedbackData);

      if (result.success) {
        // Redirect to Feedback History after successful submission
        navigate('/feedback-history', {
          state: {
            successMessage: `Monthly feedback for ${partnerName} has been submitted successfully for ${currentMonth}!`,
            submittedRating: formData.rating
          }
        });
      } else {
        setError(result.error || 'Failed to submit feedback. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Error submitting feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  const StarRating = () => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Overall Rating
        <span className="text-red-500">*</span>
        <HelpOverlay position="right">
          Rate your partner's performance this month from 1 (poor) to 5 (excellent).
          Achieving 4-5 stars consistently helps students earn recognition badges!
        </HelpOverlay>
      </label>
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`w-10 h-10 ${
                star <= (hoveredStar || formData.rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
        <span className="ml-3 text-lg font-medium text-gray-700">
          {formData.rating > 0 ? `${formData.rating} / 5` : 'Not rated'}
        </span>
      </div>
      <div className="mt-2 text-sm text-gray-600">
        {formData.rating === 1 && '⭐ Poor - Significant issues'}
        {formData.rating === 2 && '⭐⭐ Below expectations - Needs improvement'}
        {formData.rating === 3 && '⭐⭐⭐ Satisfactory - Meets basic expectations'}
        {formData.rating === 4 && '⭐⭐⭐⭐ Good - Exceeds expectations'}
        {formData.rating === 5 && '⭐⭐⭐⭐⭐ Excellent - Outstanding performance'}
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
            Feedback Submitted Successfully!
          </h2>
          <p className="text-gray-600 mb-4">
            Thank you for submitting your monthly feedback for {currentMonth}.
          </p>

          {user?.userType === 'host' && formData.rating >= 4 && (
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6">
              <Award className="w-6 h-6 text-teal-600 mx-auto mb-2" />
              <p className="text-sm text-teal-900">
                <strong>Great rating!</strong> Your student is building towards their recognition badge.
                Consecutive months of 4-5 star ratings earn Bronze, Silver, and Gold status!
              </p>
            </div>
          )}

          {formData.support_needed && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-900">
                Our support team will contact you within 24 hours regarding your request.
              </p>
            </div>
          )}

          <button
            onClick={() => navigate(`/${user?.userType}/dashboard`)}
            className="btn-primary w-full"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-6 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-3">
            Monthly Feedback Submission
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-5 h-5 text-teal-600" />
              <span className="font-medium">
                Feedback for: <strong className="text-gray-900">{currentMonth}</strong>
              </span>
            </div>
            {partnerName && (
              <div className="flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-lg border border-teal-100">
                <span className="text-sm text-gray-600">Rating:</span>
                <span className="font-semibold text-gray-900">{partnerName}</span>
                <span className="px-2 py-0.5 text-xs font-medium bg-teal-100 text-teal-700 rounded-full">
                  {partnerRole === 'host' ? 'Host' : 'Student'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-xl p-5 mb-6 flex gap-4 shadow-sm">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-teal-600" />
            </div>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-teal-900 mb-2">Monthly Feedback System</p>
            <p className="text-sm text-teal-800 mb-3 leading-relaxed">
              You can submit <strong>one feedback entry per month</strong> for each arrangement.
              Your feedback helps maintain quality and trust in our community.
            </p>
            <div className="flex items-start gap-2 p-3 bg-white/60 rounded-lg">
              <Award className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-teal-900 leading-relaxed">
                <strong>For students:</strong> Earning 4-5 stars for consecutive months unlocks recognition badges:
                Bronze (2 months), Silver (4 months), Gold (6 months)
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 flex gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-900 font-medium">{error}</p>
          </div>
        )}

        {/* Form */}
        {canSubmit ? (
          <form onSubmit={handleSubmit} className="card space-y-6 shadow-sm border border-gray-200">
            {/* Rating Section */}
            <div className="pb-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                <Star className="w-5 h-5 text-teal-600" />
                Performance Rating
              </h2>
              <p className="text-sm text-gray-600 mb-6">Rate your partner's overall performance this month</p>
              <StarRating />
            </div>

            {/* Overall Feedback */}
            <div className="pb-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-teal-600" />
                Overall Feedback
              </h2>
              <p className="text-sm text-gray-600 mb-6">Share your thoughts about this month's arrangement</p>
              <div className="mb-6">
                <label htmlFor="feedback_text" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Feedback
                  <span className="text-red-500">*</span>
                  <HelpOverlay position="right">
                    Provide constructive feedback about this month's arrangement
                  </HelpOverlay>
                </label>
                <textarea
                  id="feedback_text"
                  name="feedback_text"
                  value={formData.feedback_text}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="input-field resize-none"
                  placeholder="Share your thoughts about this month's performance, what went well, and any areas for improvement..."
                />
              </div>
            </div>

            {/* Activity Details (Optional for Hosts) */}
            {user?.userType === 'host' && (
              <div className="pb-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-teal-600" />
                  Student Activity Summary
                </h2>
                <p className="text-sm text-gray-600 mb-6">Optional: Track hours and tasks completed</p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="hours_contributed" className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-teal-600" />
                        Hours Contributed This Month
                      </div>
                    </label>
                    <input
                      type="number"
                      id="hours_contributed"
                      name="hours_contributed"
                      value={formData.hours_contributed}
                      onChange={handleChange}
                      min="0"
                      className="input-field"
                      placeholder="e.g., 40"
                    />
                  </div>

                  <div>
                    <label htmlFor="tasks_completed" className="block text-sm font-medium text-gray-700 mb-2">
                      Tasks Completed Description
                    </label>
                    <input
                      type="text"
                      id="tasks_completed"
                      name="tasks_completed"
                      value={formData.tasks_completed}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="e.g., Gardening, errands, companionship"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Monthly Reflection */}
            <div className="pb-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                Monthly Reflection
              </h2>
              <p className="text-sm text-gray-600 mb-6">Optional: Reflect on highlights, challenges, and goals</p>

              <div className="mb-6">
                <label htmlFor="highlights" className="block text-sm font-medium text-gray-700 mb-2">
                  Highlights & Positive Moments
                </label>
                <textarea
                  id="highlights"
                  name="highlights"
                  value={formData.highlights}
                  onChange={handleChange}
                  rows="3"
                  className="input-field resize-none"
                  placeholder="What went particularly well this month?"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="challenges" className="block text-sm font-medium text-gray-700 mb-2">
                  Challenges or Issues
                </label>
                <textarea
                  id="challenges"
                  name="challenges"
                  value={formData.challenges}
                  onChange={handleChange}
                  rows="3"
                  className="input-field resize-none"
                  placeholder="Were there any challenges or concerns this month?"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="goals_next_month" className="block text-sm font-medium text-gray-700 mb-2">
                  Goals or Expectations for Next Month
                </label>
                <textarea
                  id="goals_next_month"
                  name="goals_next_month"
                  value={formData.goals_next_month}
                  onChange={handleChange}
                  rows="3"
                  className="input-field resize-none"
                  placeholder="What would you like to see next month?"
                />
              </div>
            </div>

            {/* Support Request */}
            <div className="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-teal-600" />
                Need Support?
              </h2>
              <p className="text-sm text-gray-600 mb-4">Request assistance from the Homestay Exchange team</p>

              <label className="flex items-start gap-3 cursor-pointer mb-4">
                <input
                  type="checkbox"
                  name="support_needed"
                  checked={formData.support_needed}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <span className="text-sm text-gray-700">
                  I would like the Homestay Exchange team to contact me
                </span>
              </label>

              {formData.support_needed && (
                <div>
                  <label htmlFor="support_details" className="block text-sm font-medium text-gray-700 mb-2">
                    What do you need help with?
                  </label>
                  <textarea
                    id="support_details"
                    name="support_details"
                    value={formData.support_details}
                    onChange={handleChange}
                    rows="3"
                    className="input-field resize-none"
                    placeholder="Please describe your concern or support request..."
                  />
                </div>
              )}
            </div>

            {/* Privacy Notice */}
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
              <p>
                <strong>Confidential:</strong> Your monthly feedback is used to monitor arrangement quality and calculate recognition tiers. Detailed feedback is kept confidential and reviewed by the Homestay Exchange team.
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-secondary flex-1 py-3 font-semibold"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex-1 flex items-center justify-center gap-2 py-3 font-semibold shadow-md hover:shadow-lg transition-shadow"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Submit Feedback</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="card text-center py-16 shadow-sm border border-gray-200">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Feedback Already Submitted
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You have already submitted feedback for this month. Please check back next month to submit another review!
            </p>
            <button
              onClick={() => navigate(`/${user?.userType}/dashboard`)}
              className="btn-primary px-8 py-3 font-semibold shadow-md hover:shadow-lg transition-shadow"
            >
              Return to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
