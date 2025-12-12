import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import { Star, Calendar, Clock, Send, CheckCircle, AlertCircle, Award, ArrowLeft, MessageSquare, User, FileText, Target, HelpCircle, Users } from 'lucide-react';
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

  // Format month for display
  const formatMonth = (monthStr) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(year, parseInt(month) - 1);
    return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  };

  // Get rating label
  const getRatingLabel = (rating) => {
    const labels = {
      1: { text: 'Poor', desc: 'Significant issues need addressing', color: 'text-red-600' },
      2: { text: 'Below Expectations', desc: 'Needs improvement in several areas', color: 'text-orange-600' },
      3: { text: 'Satisfactory', desc: 'Meets basic expectations', color: 'text-yellow-600' },
      4: { text: 'Good', desc: 'Exceeds expectations', color: 'text-teal-600' },
      5: { text: 'Excellent', desc: 'Outstanding performance', color: 'text-green-600' },
    };
    return labels[rating] || null;
  };

  // Determine if user is a student or host
  const isStudent = user?.userType === 'guest';
  const isHost = user?.userType === 'host';

  // If no facilitation ID provided, show selection screen
  if (!facilitationId) {
    return (
      <div className="min-h-screen bg-gray-50 py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-6 font-medium transition-all hover:gap-3 group"
          >
            <ArrowLeft className="w-5 h-5 flex-shrink-0 group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 lg:p-10 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-teal-600" />
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Monthly Feedback
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto">
              To submit monthly feedback, please select an active arrangement from your dashboard or feedback history.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                to={isStudent ? '/guest/dashboard' : '/host/dashboard'}
                className="btn-primary px-6 py-3 font-semibold"
              >
                Go to Dashboard
              </Link>
              <Link
                to="/feedback-history"
                className="btn-secondary px-6 py-3 font-semibold"
              >
                View Feedback History
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-4 sm:mb-6 font-medium transition-all hover:gap-3 group"
        >
          <ArrowLeft className="w-5 h-5 flex-shrink-0 group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </button>

        {/* Header */}
        <div className="mb-5 sm:mb-6 lg:mb-8">
          <div className="flex items-start gap-3 sm:gap-4 mb-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-teal-600 to-blue-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
              <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                Monthly Feedback
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                {isStudent ? 'Rate your experience with your host' : 'Review your student\'s performance'}
              </p>
            </div>
          </div>

          {/* Month & Partner Info */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white rounded-lg border border-gray-200 shadow-sm">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 flex-shrink-0" />
              <span className="text-sm sm:text-base text-gray-700">
                <span className="text-gray-500">Period:</span>{' '}
                <strong className="text-gray-900">{formatMonth(currentMonth)}</strong>
              </span>
            </div>
            {partnerName && (
              <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-teal-50 rounded-lg border border-teal-200 shadow-sm">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 flex-shrink-0" />
                <span className="text-sm sm:text-base text-gray-700">
                  <span className="text-gray-500">{isStudent ? 'Host:' : 'Student:'}</span>{' '}
                  <strong className="text-gray-900">{partnerName}</strong>
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-teal-100 text-teal-700 rounded-full">
                  {partnerRole === 'host' ? 'Host' : 'Student'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 sm:p-5 mb-5 sm:mb-6 shadow-sm">
          <div className="flex gap-3 sm:gap-4">
            <div className="flex-shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-blue-900 text-sm sm:text-base mb-1.5">
                {isStudent ? 'Share Your Experience' : 'Provide Valuable Feedback'}
              </p>
              <p className="text-xs sm:text-sm text-blue-800 leading-relaxed">
                {isStudent
                  ? 'Your feedback helps hosts improve and maintains quality in our community. Be honest and constructive!'
                  : 'Your rating helps students earn recognition badges. Consecutive months of 4-5 stars unlock Bronze, Silver, and Gold status.'}
              </p>
              {isHost && (
                <div className="flex items-center gap-2 mt-3 p-2 sm:p-2.5 bg-white/60 rounded-lg">
                  <Award className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <p className="text-xs text-blue-900">
                    <strong>Recognition:</strong> 2 months → Bronze 🥉 | 4 months → Silver 🥈 | 6 months → Gold 🥇
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-5 sm:mb-6 flex gap-3 shadow-sm animate-shake">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm sm:text-base text-red-900 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        {canSubmit ? (
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Rating Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 lg:p-6">
              <div className="flex items-center gap-2 mb-4 sm:mb-5">
                <Star className="w-5 h-5 text-teal-600 flex-shrink-0" />
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Overall Rating</h2>
                <span className="text-red-500">*</span>
              </div>

              {/* Star Rating */}
              <div className="flex flex-col items-center py-4 sm:py-6">
                <div className="flex items-center gap-1 sm:gap-2 mb-3 sm:mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleStarClick(star)}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="transition-all duration-150 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded-full p-1"
                    >
                      <Star
                        className={`w-10 h-10 sm:w-12 sm:h-12 transition-colors ${
                          star <= (hoveredStar || formData.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 hover:text-gray-400'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {/* Rating Display */}
                <div className="text-center">
                  {formData.rating > 0 ? (
                    <div>
                      <p className={`text-lg sm:text-xl font-bold ${getRatingLabel(formData.rating)?.color}`}>
                        {formData.rating}/5 - {getRatingLabel(formData.rating)?.text}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        {getRatingLabel(formData.rating)?.desc}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm sm:text-base text-gray-500">Click a star to rate</p>
                  )}
                </div>
              </div>
            </div>

            {/* Feedback Text Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 lg:p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-teal-600 flex-shrink-0" />
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Your Feedback</h2>
                <span className="text-red-500">*</span>
              </div>

              <textarea
                id="feedback_text"
                name="feedback_text"
                value={formData.feedback_text}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none text-sm sm:text-base transition-colors"
                placeholder={isStudent
                  ? "Share your experience with your host this month. What went well? Any suggestions for improvement?"
                  : "Share your thoughts about your student's performance this month. What did they do well? Any areas for improvement?"
                }
              />
              <p className="text-xs text-gray-500 mt-2">Minimum 10 characters required</p>
            </div>

            {/* Activity Summary - For Hosts Rating Students */}
            {isHost && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 lg:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-teal-600 flex-shrink-0" />
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">Activity Summary</h2>
                  <span className="text-xs text-gray-500 font-normal">(Optional)</span>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="hours_contributed" className="block text-sm font-medium text-gray-700 mb-2">
                      Hours Contributed
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="hours_contributed"
                        name="hours_contributed"
                        value={formData.hours_contributed}
                        onChange={handleChange}
                        min="0"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm sm:text-base pr-16"
                        placeholder="e.g., 20"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">hours</span>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="tasks_completed" className="block text-sm font-medium text-gray-700 mb-2">
                      Tasks Completed
                    </label>
                    <input
                      type="text"
                      id="tasks_completed"
                      name="tasks_completed"
                      value={formData.tasks_completed}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm sm:text-base"
                      placeholder="e.g., Gardening, shopping, companionship"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Monthly Reflection */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 lg:p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-teal-600 flex-shrink-0" />
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Monthly Reflection</h2>
                <span className="text-xs text-gray-500 font-normal">(Optional)</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="highlights" className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <span className="text-lg">✨</span>
                      Highlights & Positive Moments
                    </span>
                  </label>
                  <textarea
                    id="highlights"
                    name="highlights"
                    value={formData.highlights}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none text-sm sm:text-base"
                    placeholder="What went particularly well this month?"
                  />
                </div>

                <div>
                  <label htmlFor="challenges" className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <span className="text-lg">⚠️</span>
                      Challenges or Concerns
                    </span>
                  </label>
                  <textarea
                    id="challenges"
                    name="challenges"
                    value={formData.challenges}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none text-sm sm:text-base"
                    placeholder="Were there any difficulties or concerns?"
                  />
                </div>

                <div>
                  <label htmlFor="goals_next_month" className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <span className="text-lg">🎯</span>
                      Goals for Next Month
                    </span>
                  </label>
                  <textarea
                    id="goals_next_month"
                    name="goals_next_month"
                    value={formData.goals_next_month}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none text-sm sm:text-base"
                    placeholder="What would you like to focus on next month?"
                  />
                </div>
              </div>
            </div>

            {/* Support Request */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 sm:p-5 lg:p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <h2 className="text-lg font-bold text-gray-900">Need Support?</h2>
              </div>

              <label className="flex items-start gap-3 cursor-pointer p-3 bg-white/60 rounded-lg hover:bg-white/80 transition-colors">
                <input
                  type="checkbox"
                  name="support_needed"
                  checked={formData.support_needed}
                  onChange={handleChange}
                  className="mt-0.5 w-4 h-4 sm:w-5 sm:h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                />
                <span className="text-sm sm:text-base text-gray-700">
                  I would like the Homestay Exchange team to contact me about a concern
                </span>
              </label>

              {formData.support_needed && (
                <div className="mt-4">
                  <label htmlFor="support_details" className="block text-sm font-medium text-gray-700 mb-2">
                    Please describe your concern
                  </label>
                  <textarea
                    id="support_details"
                    name="support_details"
                    value={formData.support_details}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none text-sm sm:text-base bg-white"
                    placeholder="Tell us how we can help..."
                  />
                </div>
              )}
            </div>

            {/* Privacy Notice */}
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 text-xs sm:text-sm text-gray-600 border border-gray-200">
              <p>
                <strong>Privacy:</strong> Your feedback is confidential and used to maintain quality standards.
                {isHost && ' Ratings contribute to your student\'s recognition tier progress.'}
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pt-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full sm:w-auto sm:flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto sm:flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
          /* Already Submitted State */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 lg:p-10 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
              Feedback Already Submitted
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto">
              You have already submitted feedback for <strong>{formatMonth(currentMonth)}</strong>.
              Please check back next month to submit your next review.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                to="/feedback-history"
                className="btn-primary px-6 py-3 font-semibold"
              >
                View Feedback History
              </Link>
              <button
                onClick={() => navigate(-1)}
                className="btn-secondary px-6 py-3 font-semibold"
              >
                Go Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
