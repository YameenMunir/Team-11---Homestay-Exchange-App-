import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { dashboardService } from '../services/dashboardService';
import { savedHostsService } from '../services/savedHostsService';
import { facilitationService } from '../services/facilitationService';
import { terminationService } from '../services/terminationService';
import { checkMultipleFeedbackEligibility, getCurrentMonth } from '../services/feedbackService';
import { getRecognitionDetails } from '../services/recognitionService';
import { supabase } from '../lib/supabaseClient';
import VerificationStatusBanner from '../components/VerificationStatusBanner';
import MyReviews from '../components/MyReviews';
import toast from 'react-hot-toast';
import {
  Search,
  Home,
  Star,
  Award,
  Clock,
  CheckCircle,
  Calendar,
  Heart,
  Settings,
  HelpCircle,
  Loader2,
  Link2,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  XCircle,
} from 'lucide-react';

const StudentDashboard = () => {
  const { user, getFirstName, loading: userLoading } = useUser();
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedHostsCount, setSavedHostsCount] = useState(0);
  const [connectionRequestCounts, setConnectionRequestCounts] = useState({
    pending: 0,
    approved: 0,
    reviewing: 0,
    rejected: 0,
    total: 0,
  });
  const [matchedHosts, setMatchedHosts] = useState([]);
  const [feedbackEligibility, setFeedbackEligibility] = useState({});
  const [recognitionData, setRecognitionData] = useState(null);
  const [showTerminationModal, setShowTerminationModal] = useState(false);
  const [selectedHostForTermination, setSelectedHostForTermination] = useState(null);
  const [terminationReason, setTerminationReason] = useState('');
  const [terminationRequests, setTerminationRequests] = useState([]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await dashboardService.getStudentDashboardData(user.id);
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!userLoading && user) {
      fetchDashboardData();
    }
  }, [user, userLoading]);

  // Fetch saved hosts count
  useEffect(() => {
    const fetchSavedHostsCount = async () => {
      try {
        const count = await savedHostsService.getSavedHostsCount();
        setSavedHostsCount(count);
      } catch (error) {
        console.error('Error fetching saved hosts count:', error);
      }
    };

    if (!userLoading && user) {
      fetchSavedHostsCount();
    }
  }, [user, userLoading]);

  // Fetch connection request counts
  useEffect(() => {
    const fetchConnectionRequestCounts = async () => {
      try {
        const counts = await facilitationService.getRequestCounts();
        setConnectionRequestCounts(counts);
      } catch (error) {
        console.error('Error fetching connection request counts:', error);
      }
    };

    if (!userLoading && user) {
      fetchConnectionRequestCounts();
    }
  }, [user, userLoading]);

  // Fetch matched hosts and check feedback eligibility
  useEffect(() => {
    const fetchMatchedHosts = async () => {
      if (!user) return;

      try {
        const hosts = await facilitationService.getMatchedHosts();
        setMatchedHosts(hosts);

        // Check feedback eligibility for all hosts
        if (hosts.length > 0) {
          const facilitationIds = hosts.map(h => h.facilitationId);
          const eligibilityResult = await checkMultipleFeedbackEligibility(facilitationIds);
          if (eligibilityResult.success) {
            setFeedbackEligibility(eligibilityResult.data);
          }
        }
      } catch (error) {
        console.error('Error fetching matched hosts:', error);
      }
    };

    if (!userLoading && user) {
      fetchMatchedHosts();
    }
  }, [user, userLoading]);

  // Fetch recognition data using the same service as FeedbackHistory
  useEffect(() => {
    const fetchRecognitionData = async () => {
      if (!user) return;

      try {
        // Get the ACTUAL authenticated user ID from Supabase (matching FeedbackHistory pattern)
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser) {
          console.error('[StudentDashboard] Not authenticated');
          return;
        }

        const actualUserId = authUser.id;
        console.log('[StudentDashboard] Loading recognition data for authenticated user:', actualUserId);

        const recognitionResult = await getRecognitionDetails(actualUserId);
        if (recognitionResult.success) {
          setRecognitionData(recognitionResult.data);
          console.log('[StudentDashboard] Recognition data loaded:', recognitionResult.data);
        } else {
          console.error('[StudentDashboard] Failed to load recognition data:', recognitionResult.error);
        }
      } catch (error) {
        console.error('[StudentDashboard] Error fetching recognition data:', error);
      }
    };

    if (!userLoading && user) {
      fetchRecognitionData();
    }
  }, [user, userLoading]);

  // Fetch termination requests
  useEffect(() => {
    const fetchTerminationRequests = async () => {
      if (!user) return;

      try {
        const requests = await terminationService.getUserTerminationRequests();
        setTerminationRequests(requests);
      } catch (error) {
        console.error('Error fetching termination requests:', error);
      }
    };

    if (!userLoading && user) {
      fetchTerminationRequests();
    }
  }, [user, userLoading]);

  // Termination handlers
  const handleEndFacilitationClick = (host) => {
    setSelectedHostForTermination(host);
    setShowTerminationModal(true);
  };

  const handleSubmitTermination = async () => {
    if (!terminationReason.trim()) {
      toast.error('Please provide a reason for ending the facilitation');
      return;
    }

    try {
      await terminationService.createTerminationRequest(
        selectedHostForTermination.facilitationId,
        'guest',
        terminationReason
      );

      toast.success('Termination request submitted. Admin will review it shortly.');
      setShowTerminationModal(false);
      setTerminationReason('');
      setSelectedHostForTermination(null);

      // Refresh matched hosts and termination requests
      const hosts = await facilitationService.getMatchedHosts();
      setMatchedHosts(hosts);
      const requests = await terminationService.getUserTerminationRequests();
      setTerminationRequests(requests);
    } catch (error) {
      console.error('Error submitting termination request:', error);
      toast.error(error.message || 'Failed to submit termination request');
    }
  };

  // Prepare student data - use recognitionData for recognition fields
  const studentData = user && dashboardData ? {
    name: user.fullName,
    university: user.university,
    recognitionLevel: recognitionData?.current_tier || 'none',
    consecutiveRatings: recognitionData?.consecutive_high_ratings || 0,
    rating: user.rating || 0,
    reviewCount: dashboardData.reviewCount || 0,
    currentHost: dashboardData.currentHost,
    savedHosts: savedHostsCount,
    totalHours: dashboardData.totalHours || 0,
    connectionRequests: connectionRequestCounts,
    recognitionAchievements: {
      bronze_achieved_at: recognitionData?.bronze_achieved_at,
      silver_achieved_at: recognitionData?.silver_achieved_at,
      gold_achieved_at: recognitionData?.gold_achieved_at,
    },
  } : null;

  const recognitionBadge = {
    none: { color: 'gray', label: 'No Badge', icon: '⭐', description: 'Keep providing excellent service to earn your first badge!' },
    bronze: { color: 'orange', label: 'Bronze', icon: '🥉', description: '2+ consecutive 4-5⭐ ratings' },
    silver: { color: 'gray', label: 'Silver', icon: '🥈', description: '4+ consecutive 4-5⭐ ratings' },
    gold: { color: 'yellow', label: 'Gold', icon: '🥇', description: '6+ consecutive 4-5⭐ ratings' },
  };

  const currentBadge = studentData ? (recognitionBadge[studentData.recognitionLevel] || recognitionBadge.none) : recognitionBadge.none;

  // Show loading state
  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show message if no user data
  if (!user || !studentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in to view your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Verification Status Banner */}
        <VerificationStatusBanner />

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">
                Welcome, {getFirstName()}!
              </h1>
              <p className="text-lg text-gray-600">{user.university}</p>
            </div>

            <Link to="/help" className="btn-secondary hidden md:flex items-center space-x-2">
              <HelpCircle className="w-5 h-5" />
              <span>Help</span>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Link to="/feedback-history" className="card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2">Recognition Tier</p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-3xl">{currentBadge.icon}</span>
                    <span className="text-xl font-bold text-gray-900">{currentBadge.label}</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {studentData.consecutiveRatings} / {
                      studentData.recognitionLevel === 'none' ? '2' :
                      studentData.recognitionLevel === 'bronze' ? '4' :
                      studentData.recognitionLevel === 'silver' ? '6' : '6+'
                    } months
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-teal-600 flex-shrink-0" />
              </div>
            </Link>

            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Your Rating</p>
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-2xl font-bold text-gray-900">
                      {studentData.rating}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {studentData.reviewCount} reviews
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Hours</p>
                  <span className="text-2xl font-bold text-gray-900">
                    {studentData.totalHours}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">Community service</p>
                </div>
                <Clock className="w-10 h-10 text-teal-600" />
              </div>
            </div>

            <Link to="/student/saved-hosts" className="card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Saved Hosts</p>
                  <span className="text-2xl font-bold text-gray-900">
                    {studentData.savedHosts}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">For later</p>
                </div>
                <Heart className="w-10 h-10 text-red-500" />
              </div>
            </Link>

            <Link to="/connection-requests" className="card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Requests</p>
                  <span className="text-2xl font-bold text-gray-900">
                    {studentData.connectionRequests.total}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {studentData.connectionRequests.pending > 0 && `${studentData.connectionRequests.pending} pending`}
                    {studentData.connectionRequests.pending === 0 && studentData.connectionRequests.approved > 0 && `${studentData.connectionRequests.approved} approved`}
                    {studentData.connectionRequests.pending === 0 && studentData.connectionRequests.approved === 0 && 'No active requests'}
                  </p>
                </div>
                <Link2 className="w-10 h-10 text-teal-600" />
              </div>
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'overview'
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('facilitation')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'facilitation'
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Facilitation
              </button>
              <button
                onClick={() => setActiveTab('browse')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'browse'
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Browse Hosts
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Current Arrangement */}
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Current Arrangement
                </h2>

                {studentData.currentHost ? (
                  <>
                    <div className="flex items-start space-x-4 mb-6">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-200">
                        <img
                          src={studentData.currentHost.imageUrl}
                          alt={studentData.currentHost.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {studentData.currentHost.name}
                          </h3>
                          <CheckCircle className="w-6 h-6 text-teal-600" />
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {studentData.currentHost.location}
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>Since {studentData.currentHost.since}</span>
                        </div>
                      </div>
                    </div>

                    {studentData.currentHost.servicesProvided && studentData.currentHost.servicesProvided.length > 0 && (
                      <div className="bg-gray-50 rounded-xl p-4 mb-4">
                        <p className="text-sm font-semibold text-gray-900 mb-2">
                          Services You Provide:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {studentData.currentHost.servicesProvided.map((service) => (
                            <span
                              key={service}
                              className="badge bg-teal-100 text-teal-800"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-teal-900 font-medium">
                            Hours this month
                          </p>
                          <p className="text-2xl font-bold text-teal-900">
                            {studentData.currentHost.hoursThisMonth || 0}
                          </p>
                        </div>
                        <Clock className="w-10 h-10 text-teal-600" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 mt-4">
                      <div className="flex gap-3">
                        <Link to="/monthly-report" className="btn-primary flex-1 text-center">
                          Log Hours
                        </Link>
                        <Link to="/rate-experience" className="btn-outline flex-1 text-center">
                          Rate Host
                        </Link>
                      </div>
                      {matchedHosts.length > 0 && matchedHosts[0] && (
                        <div className="flex gap-3">
                          {feedbackEligibility[matchedHosts[0].facilitationId]?.canSubmit ? (
                            <Link
                              to={`/monthly-feedback/${matchedHosts[0].facilitationId}`}
                              state={{
                                partnerName: matchedHosts[0].hostName,
                                partnerId: matchedHosts[0].hostId,
                                partnerRole: 'host'
                              }}
                              className="btn-primary w-full text-center flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700"
                            >
                              <MessageSquare className="w-4 h-4" />
                              <span>Submit Monthly Review ({getCurrentMonth()})</span>
                            </Link>
                          ) : (
                            <button
                              disabled
                              className="btn-outline w-full text-center opacity-50 cursor-not-allowed flex items-center justify-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              <span>Review Submitted ({getCurrentMonth()})</span>
                            </button>
                          )}
                        </div>
                      )}
                      {matchedHosts.length > 0 && matchedHosts[0] ? (
                        <button
                          onClick={() => handleEndFacilitationClick(matchedHosts[0])}
                          className="w-full px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors font-medium flex items-center justify-center space-x-2"
                        >
                          <AlertTriangle className="w-4 h-4" />
                          <span>End Facilitation</span>
                        </button>
                      ) : studentData.currentHost ? (
                        <div className="w-full px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                          <p className="text-sm text-yellow-800">
                            Loading facilitation details... Please refresh if this persists.
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Home className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-4">No active host arrangement</p>
                    <p className="text-sm text-gray-500 mb-4">
                      Browse available hosts to find a match
                    </p>
                    <Link to="/student/browse" className="btn-primary">
                      Browse Hosts
                    </Link>
                  </div>
                )}
              </div>

              {/* Recognition Progress */}
              <div className="card p-6 bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50 border-2 border-teal-200">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <span className="text-3xl">{currentBadge.icon}</span>
                    Recognition Progress
                  </h2>
                </div>

                {/* Current Tier Display */}
                <div className="bg-white/60 rounded-lg p-4 mb-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Current Tier</p>
                      <p className="text-2xl font-bold text-gray-900">{currentBadge.label}</p>
                    </div>
                    <span className="text-5xl">{currentBadge.icon}</span>
                  </div>
                  <p className="text-xs text-gray-600">{currentBadge.description}</p>
                </div>

                {/* Progress to Next Tier */}
                {studentData.recognitionLevel !== 'gold' && (
                  <div className="bg-white/60 rounded-lg p-4 mb-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">
                        Progress to {
                          studentData.recognitionLevel === 'none' ? 'Bronze' :
                          studentData.recognitionLevel === 'bronze' ? 'Silver' : 'Gold'
                        }
                      </span>
                      <span className="text-sm font-bold text-teal-700">
                        {studentData.consecutiveRatings} / {
                          studentData.recognitionLevel === 'none' ? 2 :
                          studentData.recognitionLevel === 'bronze' ? 4 : 6
                        } months
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-teal-600 to-blue-600 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, (studentData.consecutiveRatings / (
                            studentData.recognitionLevel === 'none' ? 2 :
                            studentData.recognitionLevel === 'bronze' ? 4 : 6
                          )) * 100)}%`
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      {Math.max(0, (studentData.recognitionLevel === 'none' ? 2 :
                        studentData.recognitionLevel === 'bronze' ? 4 : 6) - studentData.consecutiveRatings)} more month{Math.max(0, (studentData.recognitionLevel === 'none' ? 2 :
                        studentData.recognitionLevel === 'bronze' ? 4 : 6) - studentData.consecutiveRatings) !== 1 ? 's' : ''} needed
                    </p>
                  </div>
                )}

                {/* Achievement Badges Grid */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className={`text-center p-3 rounded-lg ${studentData?.recognitionAchievements?.bronze_achieved_at ? 'bg-orange-100 border-2 border-orange-300' : 'bg-gray-100 border-2 border-gray-200'}`}>
                    <div className="text-3xl mb-1">🥉</div>
                    <p className="text-xs font-semibold text-gray-700 mb-1">Bronze</p>
                    {studentData?.recognitionAchievements?.bronze_achieved_at ? (
                      <p className="text-xs text-gray-600">
                        {new Date(studentData.recognitionAchievements.bronze_achieved_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500">Not yet</p>
                    )}
                  </div>

                  <div className={`text-center p-3 rounded-lg ${studentData?.recognitionAchievements?.silver_achieved_at ? 'bg-gray-200 border-2 border-gray-400' : 'bg-gray-100 border-2 border-gray-200'}`}>
                    <div className="text-3xl mb-1">🥈</div>
                    <p className="text-xs font-semibold text-gray-700 mb-1">Silver</p>
                    {studentData?.recognitionAchievements?.silver_achieved_at ? (
                      <p className="text-xs text-gray-600">
                        {new Date(studentData.recognitionAchievements.silver_achieved_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500">Not yet</p>
                    )}
                  </div>

                  <div className={`text-center p-3 rounded-lg ${studentData?.recognitionAchievements?.gold_achieved_at ? 'bg-yellow-100 border-2 border-yellow-400' : 'bg-gray-100 border-2 border-gray-200'}`}>
                    <div className="text-3xl mb-1">🥇</div>
                    <p className="text-xs font-semibold text-gray-700 mb-1">Gold</p>
                    {studentData?.recognitionAchievements?.gold_achieved_at ? (
                      <p className="text-xs text-gray-600">
                        {new Date(studentData.recognitionAchievements.gold_achieved_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500">Not yet</p>
                    )}
                  </div>
                </div>

                {/* View Full Status Button */}
                <Link
                  to="/feedback-history"
                  className="w-full btn-primary flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>View Full Recognition Status</span>
                </Link>
              </div>

              {/* My Platform Reviews */}
              <MyReviews />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    to="/student/browse"
                    className="w-full btn-primary flex items-center justify-center space-x-2"
                  >
                    <Search className="w-5 h-5" />
                    <span>Browse Hosts</span>
                  </Link>
                  <Link
                    to="/feedback-history"
                    className="w-full btn-primary flex items-center justify-center space-x-2 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>Feedback & Recognition</span>
                  </Link>
                  <Link
                    to="/student/settings"
                    className="w-full btn-outline flex items-center justify-center space-x-2"
                  >
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                  </Link>
                  <Link
                    to="/help"
                    className="w-full btn-outline flex items-center justify-center space-x-2"
                  >
                    <HelpCircle className="w-5 h-5" />
                    <span>Get Help</span>
                  </Link>
                </div>
              </div>

              {/* Tips */}
              <div className="card p-6 bg-teal-50 border-teal-200">
                <h3 className="font-semibold text-teal-900 mb-3">💡 Tip</h3>
                <p className="text-sm text-teal-800 mb-4">
                  Maintain consistent 4-5 star ratings to reach Gold status and stand
                  out to hosts!
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'facilitation' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Current Facilitation Card */}
            <div className="card p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Home className="w-7 h-7 text-teal-600" />
                Current Facilitation
              </h2>

              {matchedHosts.length > 0 && matchedHosts[0] ? (
                <div>
                  {/* Host Details */}
                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                        {matchedHosts[0].profilePicture ? (
                          <img
                            src={matchedHosts[0].profilePicture}
                            alt={matchedHosts[0].hostName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-teal-100">
                            <Home className="w-10 h-10 text-teal-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {matchedHosts[0].hostName}
                          </h3>
                          <CheckCircle className="w-6 h-6 text-teal-600" />
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {matchedHosts[0].city}{matchedHosts[0].postcode && `, ${matchedHosts[0].postcode}`}
                        </p>
                        {matchedHosts[0].rating > 0 && (
                          <div className="flex items-center gap-1 mt-2">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold text-gray-900 text-sm">
                              {matchedHosts[0].rating.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Matched since {matchedHosts[0].matchedAt ? new Date(matchedHosts[0].matchedAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : 'Recently'}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      {feedbackEligibility[matchedHosts[0].facilitationId]?.canSubmit ? (
                        <Link
                          to={`/monthly-feedback/${matchedHosts[0].facilitationId}`}
                          state={{
                            partnerName: matchedHosts[0].hostName,
                            partnerId: matchedHosts[0].hostId,
                            partnerRole: 'host'
                          }}
                          className="btn-primary flex-1 text-center flex items-center justify-center gap-2"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>Submit Monthly Review ({getCurrentMonth()})</span>
                        </Link>
                      ) : (
                        <button
                          disabled
                          className="btn-outline flex-1 text-center opacity-50 cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Review Submitted ({getCurrentMonth()})</span>
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => handleEndFacilitationClick(matchedHosts[0])}
                      className="w-full px-4 py-3 border-2 border-red-400 text-red-700 rounded-lg hover:bg-red-50 transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                      <AlertTriangle className="w-5 h-5" />
                      <span>Request to End Facilitation</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Active Facilitation
                  </h3>
                  <p className="text-gray-600 mb-6">
                    You don't have an active facilitation arrangement yet.
                  </p>
                  <Link to="/student/browse" className="btn-primary">
                    Browse Available Hosts
                  </Link>
                </div>
              )}
            </div>

            {/* Termination Requests History */}
            {terminationRequests.length > 0 && (
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                  Termination Requests
                </h2>

                <div className="space-y-4">
                  {terminationRequests.map((request) => (
                    <div
                      key={request.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">
                            Request to end facilitation with {request.partnerName}
                          </span>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full border ${
                          request.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                            : request.status === 'approved'
                            ? 'bg-green-100 text-green-800 border-green-200'
                            : 'bg-red-100 text-red-800 border-red-200'
                        }`}>
                          {request.status === 'pending' && <Clock className="w-3 h-3" />}
                          {request.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                          {request.status === 'rejected' && <XCircle className="w-3 h-3" />}
                          {request.status === 'pending' ? 'Pending Review' : request.status === 'approved' ? 'Approved' : 'Rejected'}
                        </span>
                      </div>

                      <div className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Your reason:</span> {request.reason}
                      </div>

                      {request.adminNotes && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                          <p className="text-sm font-medium text-blue-900 mb-1">Admin Response:</p>
                          <p className="text-sm text-blue-800">{request.adminNotes}</p>
                          {request.reviewedAt && (
                            <p className="text-xs text-blue-600 mt-1">
                              Reviewed on {new Date(request.reviewedAt).toLocaleDateString('en-GB')}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="text-xs text-gray-500 mt-3">
                        Submitted on {new Date(request.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'browse' && (
          <div className="card p-8 text-center">
            <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Browse Available Hosts
            </h3>
            <p className="text-gray-600 mb-6">
              Redirecting you to the browse page...
            </p>
            <Link to="/student/browse" className="btn-primary">
              Go to Browse Hosts
            </Link>
          </div>
        )}
      </div>

      {/* Termination Request Modal */}
      {showTerminationModal && selectedHostForTermination && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              End Facilitation with {selectedHostForTermination.hostName}?
            </h3>

            <p className="text-sm text-gray-600 mb-6 text-center">
              Your request will be reviewed by an admin before the facilitation is officially ended.
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Please provide a reason for ending this facilitation:
              </label>
              <textarea
                value={terminationReason}
                onChange={(e) => setTerminationReason(e.target.value)}
                placeholder="Enter your reason here..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowTerminationModal(false);
                  setTerminationReason('');
                  setSelectedHostForTermination(null);
                }}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitTermination}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
