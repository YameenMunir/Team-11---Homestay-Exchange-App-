import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Star, Calendar, MessageSquare, ArrowLeft, Filter, Users, CheckCircle, Award, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { getFeedbackReceived, getFeedbackSubmitted, getFeedbackStats, getCurrentMonth, checkMultipleFeedbackEligibility, debugFeedbackAccess } from '../services/feedbackService';
import { facilitationService } from '../services/facilitationService';
import { getRecognitionDetails, getTierBadgeInfo, calculateTierProgress } from '../services/recognitionService';
import { useUser } from '../context/UserContext';
import { supabase } from '../lib/supabaseClient';

export default function FeedbackHistory() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(user?.userType === 'host' ? 'students' : 'received'); // 'students', 'received' or 'submitted'
  const [receivedFeedback, setReceivedFeedback] = useState([]);
  const [submittedFeedback, setSubmittedFeedback] = useState([]);
  const [stats, setStats] = useState(null);
  const [filterRating, setFilterRating] = useState('all');
  const [matchedStudents, setMatchedStudents] = useState([]);
  const [feedbackEligibility, setFeedbackEligibility] = useState({});
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [recognitionData, setRecognitionData] = useState(null);
  const successMessage = location.state?.successMessage;
  const submittedRating = location.state?.submittedRating;

  // Show success banner and switch to submitted tab
  useEffect(() => {
    if (successMessage) {
      setShowSuccessBanner(true);
      setActiveTab('submitted'); // Switch to submitted tab to show the new feedback
      // Auto-hide banner after 10 seconds
      const timer = setTimeout(() => setShowSuccessBanner(false), 10000);
      // Clear location state to prevent banner from showing on refresh
      window.history.replaceState({}, document.title);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    const loadFeedback = async () => {
      if (!user) {
        console.log('[FeedbackHistory] No user, skipping load');
        return;
      }

      setLoading(true);

      try {
        // Get the ACTUAL authenticated user ID from Supabase
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser) {
          console.error('[FeedbackHistory] Not authenticated');
          setLoading(false);
          return;
        }

        const actualUserId = authUser.id;
        console.log('[FeedbackHistory] Loading feedback for authenticated user:', actualUserId, 'Type:', user.userType);
        console.log('[FeedbackHistory] Context user ID:', user.id, 'Match:', actualUserId === user.id);

        // Run debug function for students
        if (user.userType === 'guest') {
          console.log('[FeedbackHistory] Running debug for guest user...');
          await debugFeedbackAccess();
        }

        // Load received feedback - USE ACTUAL AUTH USER ID
        console.log('[FeedbackHistory] Loading received feedback...');
        const receivedResult = await getFeedbackReceived(actualUserId);
        console.log('[FeedbackHistory] Received result:', receivedResult);
        if (receivedResult.success) {
          setReceivedFeedback(receivedResult.data || []);
        } else {
          console.error('[FeedbackHistory] Failed to load received feedback:', receivedResult.error);
          setReceivedFeedback([]);
        }

        // Load submitted feedback - USE ACTUAL AUTH USER ID
        console.log('[FeedbackHistory] Loading submitted feedback...');
        const submittedResult = await getFeedbackSubmitted(actualUserId);
        console.log('[FeedbackHistory] Submitted result:', submittedResult);
        if (submittedResult.success) {
          setSubmittedFeedback(submittedResult.data || []);
        } else {
          console.error('[FeedbackHistory] Failed to load submitted feedback:', submittedResult.error);
          setSubmittedFeedback([]);
        }

        // Load stats - USE ACTUAL AUTH USER ID
        console.log('[FeedbackHistory] Loading stats...');
        const statsResult = await getFeedbackStats(actualUserId);
        if (statsResult.success) {
          setStats(statsResult.data);
        }

        // Load matched students for hosts
        if (user.userType === 'host') {
          const students = await facilitationService.getMatchedStudents();
          setMatchedStudents(students);

          // Check feedback eligibility
          if (students.length > 0) {
            const facilitationIds = students.map(s => s.facilitationId);
            const eligibilityResult = await checkMultipleFeedbackEligibility(facilitationIds);
            if (eligibilityResult.success) {
              setFeedbackEligibility(eligibilityResult.data);
            }
          }
        }

        // Load recognition tier data for students - USE ACTUAL AUTH USER ID
        if (user.userType === 'guest') {
          console.log('[FeedbackHistory] Loading recognition data...');
          const recognitionResult = await getRecognitionDetails(actualUserId);
          if (recognitionResult.success) {
            setRecognitionData(recognitionResult.data);
          }
        }

        console.log('[FeedbackHistory] Loading complete');
      } catch (error) {
        console.error('[FeedbackHistory] Error loading feedback:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeedback();
  }, [user?.userType]);

  const filterFeedback = (feedback) => {
    if (filterRating === 'all') return feedback;
    return feedback.filter(f => f.rating === parseInt(filterRating));
  };

  const FeedbackCard = ({ feedback, type }) => {
    const partner = type === 'received' ? feedback.submitter : feedback.recipient;
    const monthDate = new Date(feedback.feedback_month + '-01');

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-all duration-200 hover:border-purple-300">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 sm:gap-4 mb-4 sm:mb-5 pb-4 sm:pb-5 border-b border-gray-100">
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-2.5">
              <h3 className="font-bold text-gray-900 text-lg sm:text-xl break-words">
                {type === 'received' ? 'From' : 'To'}: {partner?.full_name || 'Unknown User'}
              </h3>
              <span className="px-2 sm:px-2.5 py-1 text-xs font-semibold bg-gray-100 text-gray-600 rounded-md flex-shrink-0 whitespace-nowrap">
                {partner?.role === 'host' ? 'Host' : 'Student'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="font-medium break-words">
                {monthDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-start lg:items-end gap-2 sm:gap-2.5 flex-shrink-0">
            <div className="flex items-center gap-0.5 sm:gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${
                    i < feedback.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs sm:text-sm font-bold text-gray-900 bg-gray-100 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md whitespace-nowrap">
              {feedback.rating}/5
            </span>
          </div>
        </div>

        {/* Overall Feedback */}
        {feedback.feedback_text && (
          <div className="mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-100">
            <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Overall Feedback</h4>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed break-words">{feedback.feedback_text}</p>
          </div>
        )}

        {/* Activity Summary - Only show if data exists */}
        {(feedback.hours_contributed !== null || feedback.tasks_completed) && (
          <div className="mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-100">
            <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Activity Summary</h4>
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              {feedback.hours_contributed !== null && (
                <div className="bg-purple-50 rounded-lg p-3 border border-purple-100 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 flex-shrink-0" />
                    <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Hours Contributed</span>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-purple-900 break-words">{feedback.hours_contributed}</p>
                </div>
              )}
              {feedback.tasks_completed && (
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100 min-w-0 overflow-hidden">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
                    <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Tasks Completed</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 mt-2 line-clamp-3 break-words">{feedback.tasks_completed}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Monthly Reflection */}
        {(feedback.highlights || feedback.challenges || feedback.goals_next_month) && (
          <div className="mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-100">
            <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Monthly Reflection</h4>
            <div className="space-y-2 sm:space-y-3">
              {feedback.highlights && (
                <div className="bg-green-50 rounded-lg p-2.5 sm:p-3 border border-green-100 min-w-0 overflow-hidden">
                  <div className="flex items-start gap-2">
                    <span className="text-base sm:text-lg flex-shrink-0">✨</span>
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">Highlights</p>
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed break-words">{feedback.highlights}</p>
                    </div>
                  </div>
                </div>
              )}
              {feedback.challenges && (
                <div className="bg-orange-50 rounded-lg p-2.5 sm:p-3 border border-orange-100 min-w-0 overflow-hidden">
                  <div className="flex items-start gap-2">
                    <span className="text-base sm:text-lg flex-shrink-0">⚠️</span>
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">Challenges</p>
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed break-words">{feedback.challenges}</p>
                    </div>
                  </div>
                </div>
              )}
              {feedback.goals_next_month && (
                <div className="bg-blue-50 rounded-lg p-2.5 sm:p-3 border border-blue-100 min-w-0 overflow-hidden">
                  <div className="flex items-start gap-2">
                    <span className="text-base sm:text-lg flex-shrink-0">🎯</span>
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">Goals for Next Month</p>
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed break-words">{feedback.goals_next_month}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Support Request */}
        {feedback.support_needed && (
          <div className="mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-100">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 min-w-0 overflow-hidden">
              <div className="flex items-start gap-2 sm:gap-3">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0 overflow-hidden">
                  <h4 className="text-xs sm:text-sm font-semibold text-red-900 mb-1">Support Requested</h4>
                  {feedback.support_details && (
                    <p className="text-xs sm:text-sm text-red-800 leading-relaxed break-words">{feedback.support_details}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-xs text-gray-500 flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <Calendar className="w-3 h-3 flex-shrink-0" />
          <span className="break-words">Submitted on {new Date(feedback.created_at).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}</span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 sm:py-12 px-4">
        <div className="text-center max-w-md">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3 sm:mb-4" />
          <p className="text-base sm:text-lg text-gray-900 font-semibold mb-1 break-words">Loading feedback history...</p>
          <p className="text-xs sm:text-sm text-gray-600 break-words">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  const activeFeedback = activeTab === 'received' ? receivedFeedback : submittedFeedback;
  const filteredFeedback = filterFeedback(activeFeedback);

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4 sm:mb-6 font-medium transition-all hover:gap-3 group"
          >
            <ArrowLeft className="w-5 h-5 flex-shrink-0 group-hover:transform group-hover:-translate-x-1 transition-transform" />
            <span className="whitespace-nowrap">Back</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
              <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0 overflow-hidden">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-1 break-words">
                Feedback History
              </h1>
              <p className="text-sm sm:text-base text-gray-600 break-words">
                View and manage your monthly feedback
              </p>
            </div>
          </div>
        </div>

        {/* Success Banner */}
        {showSuccessBanner && successMessage && (
          <div className="mb-4 sm:mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4 sm:p-6 shadow-sm animate-fade-in">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0 overflow-hidden">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2 break-words">
                  Feedback Submitted Successfully!
                </h3>
                <p className="text-sm sm:text-base text-gray-700 mb-2 sm:mb-3 break-words">{successMessage}</p>
                {submittedRating >= 4 && (
                  <div className="flex items-start gap-2 sm:gap-2.5 p-3 sm:p-3.5 bg-purple-50 border border-purple-200 rounded-lg">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-purple-900 break-words">
                      <strong className="font-semibold">Great rating!</strong> Your student is building towards their recognition badge.
                      Consecutive months of 4-5 star ratings earn Bronze, Silver, and Gold status!
                    </p>
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowSuccessBanner(false)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1"
                aria-label="Close"
              >
                <span className="text-xl sm:text-2xl leading-none">&times;</span>
              </button>
            </div>
          </div>
        )}

        {/* Recognition Tier for Students */}
        {user?.userType === 'guest' && recognitionData && activeTab === 'received' && (
          <div className="mb-4 sm:mb-6">
            <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 rounded-lg border-2 border-purple-200 shadow-sm p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 sm:gap-4 mb-4 sm:mb-5">
                <div className="flex items-start gap-3 sm:gap-4 min-w-0 overflow-hidden">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                    <span className="text-2xl sm:text-3xl">{getTierBadgeInfo(recognitionData.current_tier).icon}</span>
                  </div>
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-1.5 break-words">
                      {getTierBadgeInfo(recognitionData.current_tier).name} Status
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-700 break-words">
                      {getTierBadgeInfo(recognitionData.current_tier).description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress to Next Tier */}
              {recognitionData.current_tier !== 'gold' && (
                <div className="bg-white/60 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">
                      Progress to {getTierBadgeInfo(calculateTierProgress(recognitionData.consecutive_high_ratings, recognitionData.current_tier).nextTier).name}
                    </span>
                    <span className="text-sm font-bold text-purple-700">
                      {recognitionData.consecutive_high_ratings} / {
                        recognitionData.current_tier === 'none' ? 2 :
                        recognitionData.current_tier === 'bronze' ? 4 : 6
                      } months
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${calculateTierProgress(recognitionData.consecutive_high_ratings, recognitionData.current_tier).progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    {calculateTierProgress(recognitionData.consecutive_high_ratings, recognitionData.current_tier).message}
                  </p>
                </div>
              )}

              {/* Achievement Dates */}
              <div className="grid grid-cols-3 gap-3">
                <div className={`text-center p-3 rounded-lg ${recognitionData.bronze_achieved_at ? 'bg-orange-100 border border-orange-200' : 'bg-gray-100 border border-gray-200'}`}>
                  <div className="text-2xl mb-1">🥉</div>
                  <div className="text-xs font-semibold text-gray-700">Bronze</div>
                  {recognitionData.bronze_achieved_at && (
                    <div className="text-xs text-gray-600 mt-1">
                      {new Date(recognitionData.bronze_achieved_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                    </div>
                  )}
                </div>
                <div className={`text-center p-3 rounded-lg ${recognitionData.silver_achieved_at ? 'bg-gray-200 border border-gray-300' : 'bg-gray-100 border border-gray-200'}`}>
                  <div className="text-2xl mb-1">🥈</div>
                  <div className="text-xs font-semibold text-gray-700">Silver</div>
                  {recognitionData.silver_achieved_at && (
                    <div className="text-xs text-gray-600 mt-1">
                      {new Date(recognitionData.silver_achieved_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                    </div>
                  )}
                </div>
                <div className={`text-center p-3 rounded-lg ${recognitionData.gold_achieved_at ? 'bg-yellow-100 border border-yellow-300' : 'bg-gray-100 border border-gray-200'}`}>
                  <div className="text-2xl mb-1">🥇</div>
                  <div className="text-xs font-semibold text-gray-700">Gold</div>
                  {recognitionData.gold_achieved_at && (
                    <div className="text-xs text-gray-600 mt-1">
                      {new Date(recognitionData.gold_achieved_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Summary */}
        {stats && activeTab === 'received' && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-5 min-w-0">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 sm:mb-2 truncate">Total Feedback</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">{stats.totalFeedback}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-5 min-w-0">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 sm:mb-2 truncate">Average Rating</p>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.averageRating}</p>
                <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-yellow-400 text-yellow-400 flex-shrink-0" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-5 min-w-0">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 sm:mb-2 truncate">5-Star Ratings</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">{stats.ratingCounts[5]}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-5 min-w-0">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 sm:mb-2 truncate">4-Star Ratings</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">{stats.ratingCounts[4]}</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-4 sm:mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 overflow-x-auto">
            <nav className="flex gap-1 min-w-max sm:min-w-0" aria-label="Tabs">
              {user?.userType === 'host' && (
                <button
                  onClick={() => setActiveTab('students')}
                  className={`flex-1 min-w-0 px-3 sm:px-4 py-2 sm:py-3 font-medium text-xs sm:text-sm rounded-md transition-all ${
                    activeTab === 'students'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
                    <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="whitespace-nowrap">Active Students</span>
                    <span className={`px-1.5 sm:px-2 py-0.5 text-xs font-semibold rounded-full flex-shrink-0 ${
                      activeTab === 'students'
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {matchedStudents.length}
                    </span>
                  </div>
                </button>
              )}
              <button
                onClick={() => setActiveTab('received')}
                className={`flex-1 min-w-0 px-3 sm:px-4 py-2 sm:py-3 font-medium text-xs sm:text-sm rounded-md transition-all ${
                  activeTab === 'received'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
                  <span className="whitespace-nowrap">Received</span>
                  <span className={`px-1.5 sm:px-2 py-0.5 text-xs font-semibold rounded-full flex-shrink-0 ${
                    activeTab === 'received'
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {receivedFeedback.length}
                  </span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('submitted')}
                className={`flex-1 min-w-0 px-3 sm:px-4 py-2 sm:py-3 font-medium text-xs sm:text-sm rounded-md transition-all ${
                  activeTab === 'submitted'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
                  <span className="whitespace-nowrap">Submitted</span>
                  <span className={`px-1.5 sm:px-2 py-0.5 text-xs font-semibold rounded-full flex-shrink-0 ${
                    activeTab === 'submitted'
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {submittedFeedback.length}
                  </span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Filter - only show for feedback tabs */}
        {activeTab !== 'students' && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 sm:mb-6 p-3 sm:p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
              <label className="text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">Filter by rating:</label>
            </div>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="flex-1 sm:flex-none sm:w-64 input-field py-2 sm:py-2.5 px-3 sm:px-4 text-sm font-medium border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-lg min-w-0"
            >
              <option value="all">All Ratings</option>
              <option value="5">⭐ 5 Stars - Excellent</option>
              <option value="4">⭐ 4 Stars - Good</option>
              <option value="3">⭐ 3 Stars - Satisfactory</option>
              <option value="2">⭐ 2 Stars - Below Expectations</option>
              <option value="1">⭐ 1 Star - Poor</option>
            </select>
          </div>
        )}

        {/* Active Students Tab - For Hosts */}
        {activeTab === 'students' && (
          <div className="space-y-4 sm:space-y-5">
            {matchedStudents.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 text-center py-12 sm:py-16 px-4 sm:px-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 break-words">
                  No Active Students
                </h3>
                <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto break-words">
                  You don't have any matched students at the moment. Check your pending requests or browse for new connections.
                </p>
              </div>
            ) : (
              matchedStudents.map((student) => {
                const canSubmit = feedbackEligibility[student.facilitationId]?.canSubmit;
                const currentMonth = getCurrentMonth();

                return (
                  <div
                    key={student.facilitationId}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-all duration-200 hover:border-purple-300"
                  >
                    {/* Student Header */}
                    <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-5">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm">
                        {student.profilePicture ? (
                          <img
                            src={student.profilePicture}
                            alt={student.studentName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100">
                            <Users className="w-7 h-7 sm:w-8 sm:h-8 text-purple-600" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 overflow-hidden">
                        <h3 className="font-bold text-gray-900 text-lg sm:text-xl mb-1 sm:mb-1.5 break-words">
                          {student.studentName}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-2.5 line-clamp-2 break-words">
                          {student.university}
                          {student.course && ` • ${student.course}`}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <div className="flex items-center gap-1.5 text-gray-500 px-2 sm:px-2.5 py-1 bg-gray-50 rounded-md flex-shrink-0">
                            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="whitespace-nowrap">Matched {student.matchedAt ? new Date(student.matchedAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : 'Recently'}</span>
                          </div>
                          {student.rating > 0 && (
                            <div className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 bg-yellow-50 rounded-md border border-yellow-200 flex-shrink-0">
                              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                              <span className="font-semibold text-yellow-700 whitespace-nowrap">{student.rating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Review Status Banner */}
                    {!canSubmit && (
                      <div className="mb-3 sm:mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 sm:gap-2.5">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <p className="text-xs sm:text-sm font-semibold text-green-900 break-words">Review Submitted ({currentMonth})</p>
                          <p className="text-xs text-green-700 mt-0.5 break-words">You've completed this month's feedback</p>
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    {canSubmit && (
                      <Link
                        to={`/monthly-feedback/${student.facilitationId}`}
                        state={{
                          partnerName: student.studentName,
                          partnerId: student.studentId,
                          partnerRole: 'guest'
                        }}
                        className="btn-primary w-full text-center flex items-center justify-center gap-2 py-2.5 sm:py-3 mb-3 sm:mb-4 shadow-sm hover:shadow-md font-semibold text-sm sm:text-base"
                      >
                        <MessageSquare className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">Submit Monthly Review ({currentMonth})</span>
                      </Link>
                    )}

                    {/* Info Box */}
                    <div className="p-3 sm:p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                      <p className="text-xs text-blue-900 leading-relaxed break-words">
                        <strong className="font-semibold">Monthly Review:</strong> Submit one review per student per month. Reviews help students earn recognition badges and track their performance.
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Feedback List - Received and Submitted Tabs */}
        {activeTab !== 'students' && (
          <div className="space-y-4 sm:space-y-5">
            {filteredFeedback.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 text-center py-12 sm:py-16 px-4 sm:px-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 break-words">
                  No feedback {filterRating !== 'all' ? 'with this rating' : 'yet'}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto break-words">
                  {activeTab === 'received'
                    ? "You haven't received any monthly feedback yet. Feedback from your partners will appear here."
                    : "You haven't submitted any monthly feedback yet. Start by reviewing your active arrangements."}
                </p>
              </div>
            ) : (
              filteredFeedback.map((feedback) => (
                <FeedbackCard
                  key={feedback.id}
                  feedback={feedback}
                  type={activeTab}
                />
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}
