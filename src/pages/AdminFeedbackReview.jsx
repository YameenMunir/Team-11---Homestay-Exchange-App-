import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Star,
  Search,
  Filter,
  Calendar,
  TrendingUp,
  AlertCircle,
  Eye,
  Flag,
  Award,
  Home,
  GraduationCap,
  Heart,
  ArrowLeft,
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { getAllFeedbackForAdmin } from '../services/feedbackService';
import { getRecognitionDetails } from '../services/recognitionService';

const AdminFeedbackReview = () => {
  const { hasPermission } = useAdmin();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ratings'); // ratings, monthly-reports
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all'); // all, 5, 4, 3, 2, 1
  const [filterType, setFilterType] = useState('all'); // all, host, student

  // State for real data
  const [allFeedback, setAllFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tierCache, setTierCache] = useState({});

  // Fetch all feedback data on mount
  useEffect(() => {
    fetchFeedbackData();
  }, []);

  const fetchFeedbackData = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getAllFeedbackForAdmin();

      if (result.success) {
        setAllFeedback(result.data || []);
      } else {
        setError(result.error || 'Failed to fetch feedback data');
      }
    } catch (err) {
      console.error('Error fetching feedback:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Fetch tier information for a student
  const fetchStudentTier = async (studentId) => {
    if (tierCache[studentId]) {
      return tierCache[studentId];
    }

    try {
      const result = await getRecognitionDetails(studentId);
      if (result.success) {
        setTierCache(prev => ({
          ...prev,
          [studentId]: result.data.current_tier || 'none'
        }));
        return result.data.current_tier || 'none';
      }
    } catch (err) {
      console.error('Error fetching tier:', err);
    }
    return 'none';
  };

  // Pre-fetch tiers for all students when reports are loaded
  useEffect(() => {
    const studentIds = monthlyReports
      .filter(report => report.userType === 'student' && report.studentId)
      .map(report => report.studentId);

    const uniqueStudentIds = [...new Set(studentIds)];

    uniqueStudentIds.forEach(studentId => {
      if (!tierCache[studentId]) {
        fetchStudentTier(studentId);
      }
    });
  }, [allFeedback]);

  // Transform feedback data for ratings view (experience ratings)
  const transformToRatings = (feedbackData) => {
    return feedbackData.map(feedback => ({
      id: feedback.id,
      raterName: feedback.submitter?.full_name || 'Unknown',
      raterType: feedback.submitter_role === 'guest' ? 'student' : feedback.submitter_role,
      raterEmail: feedback.submitter?.email || '',
      ratedName: feedback.recipient?.full_name || 'Unknown',
      ratedType: feedback.recipient?.role === 'guest' ? 'student' : feedback.recipient?.role,
      ratedEmail: feedback.recipient?.email || '',
      overallRating: feedback.rating,
      communication: feedback.rating, // Using overall rating as proxy
      reliability: feedback.rating,
      respect: feedback.rating,
      specificRating: feedback.rating,
      wouldRecommend: feedback.rating >= 4,
      positiveAspects: feedback.highlights || '',
      areasForImprovement: feedback.challenges || '',
      additionalComments: feedback.feedback_text || '',
      submittedDate: feedback.created_at,
      flagged: feedback.rating <= 2 || feedback.support_needed,
      flagReason: feedback.rating <= 2 ? 'Low rating (2 or below)' : feedback.support_needed ? 'Support requested' : '',
    }));
  };

  // Transform feedback data for monthly reports view
  const transformToReports = (feedbackData) => {
    return feedbackData.map(feedback => ({
      id: feedback.id,
      submittedBy: feedback.submitter?.full_name || 'Unknown',
      userType: feedback.submitter_role === 'guest' ? 'student' : feedback.submitter_role,
      email: feedback.submitter?.email || '',
      partner: feedback.recipient?.full_name || 'Unknown',
      reportingPeriod: feedback.feedback_month,
      hoursCompleted: feedback.hours_contributed || 0,
      tasksCompleted: feedback.tasks_completed ? feedback.tasks_completed.split(',').length : 0,
      relationshipQuality: feedback.rating,
      wellbeingScore: feedback.rating,
      highlights: feedback.highlights || '',
      challenges: feedback.challenges || '',
      goalsForNextMonth: feedback.goals_next_month || '',
      needSupport: feedback.support_needed,
      supportDetails: feedback.support_details || '',
      submittedDate: feedback.created_at,
      flagged: feedback.rating <= 2 || feedback.support_needed,
      flagReason: feedback.rating <= 2 && feedback.support_needed
        ? 'Low rating + support requested'
        : feedback.rating <= 2
          ? 'Low rating'
          : feedback.support_needed
            ? 'Support requested'
            : '',
      studentId: feedback.submitter_role === 'guest' ? feedback.submitter_id : null,
    }));
  };

  const ratings = transformToRatings(allFeedback);
  const monthlyReports = transformToReports(allFeedback);

  // Filter ratings
  const filteredRatings = ratings.filter((rating) => {
    const matchesSearch =
      rating.raterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rating.ratedName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = filterRating === 'all' || rating.overallRating === parseInt(filterRating);
    const matchesType = filterType === 'all' || rating.raterType === filterType;
    return matchesSearch && matchesRating && matchesType;
  });

  // Filter monthly reports
  const filteredReports = monthlyReports.filter((report) => {
    const matchesSearch =
      report.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.partner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || report.userType === filterType;
    return matchesSearch && matchesType;
  });

  const handleFlagRating = (ratingId) => {
    const reason = prompt('Enter reason for flagging this rating:');
    if (reason) {
      // TODO: Implement API call
      alert(`Rating ${ratingId} has been flagged for review. Reason: ${reason}`);
    }
  };

  const handleContactUser = (email, name) => {
    // TODO: Implement email template or messaging system
    window.location.href = `mailto:${email}?subject=Regarding Your Homestay Exchange Feedback`;
  };

  const getTierBadge = (tier) => {
    if (tier === 'gold') {
      return <span className="badge bg-yellow-400 text-yellow-900 flex items-center space-x-1">
        <Award className="w-3 h-3" />
        <span>Gold Tier</span>
      </span>;
    } else if (tier === 'silver') {
      return <span className="badge bg-gray-300 text-gray-800 flex items-center space-x-1">
        <Award className="w-3 h-3" />
        <span>Silver Tier</span>
      </span>;
    } else if (tier === 'bronze') {
      return <span className="badge bg-orange-300 text-orange-900 flex items-center space-x-1">
        <Award className="w-3 h-3" />
        <span>Bronze Tier</span>
      </span>;
    }
    return null;
  };

  if (!hasPermission('view_reports')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="card max-w-md w-full text-center p-8">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to view feedback and reports.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Header with Back Button */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </button>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-3">
            Feedback & Ratings Review
          </h1>
          <p className="text-lg text-gray-600">
            Monitor user feedback, ratings, and monthly check-in reports
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="card p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading feedback data...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="card p-12 text-center border-red-300 bg-red-50">
            <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Feedback</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button onClick={fetchFeedbackData} className="btn-primary">
              Try Again
            </button>
          </div>
        )}

        {/* Stats */}
        {!loading && !error && (
        <>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-6">
            <p className="text-sm text-gray-600 mb-1">Total Ratings</p>
            <span className="text-3xl font-bold text-gray-900">{ratings.length}</span>
          </div>
          <div className="card p-6">
            <p className="text-sm text-gray-600 mb-1">Average Rating</p>
            <span className="text-3xl font-bold text-yellow-600 flex items-center">
              {(ratings.reduce((sum, r) => sum + r.overallRating, 0) / ratings.length).toFixed(1)}
              <Star className="w-6 h-6 ml-1 fill-yellow-400 text-yellow-400" />
            </span>
          </div>
          <div className="card p-6 border-l-4 border-red-500">
            <p className="text-sm text-gray-600 mb-1">Flagged Items</p>
            <span className="text-3xl font-bold text-red-600">
              {ratings.filter((r) => r.flagged).length + monthlyReports.filter((r) => r.flagged).length}
            </span>
          </div>
          <div className="card p-6">
            <p className="text-sm text-gray-600 mb-1">Monthly Reports</p>
            <span className="text-3xl font-bold text-gray-900">{monthlyReports.length}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('ratings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'ratings'
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Experience Ratings ({ratings.length})
              </button>
              <button
                onClick={() => setActiveTab('monthly-reports')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'monthly-reports'
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Monthly Check-Ins ({monthlyReports.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name..."
                  className="input-field pl-10"
                  aria-label="Search feedback"
                />
              </div>
            </div>

            {/* User Type Filter */}
            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="input-field"
                aria-label="Filter by user type"
              >
                <option value="all">All User Types</option>
                <option value="host">Hosts Only</option>
                <option value="student">Students Only</option>
              </select>
            </div>

            {/* Rating Filter (only for ratings tab) */}
            {activeTab === 'ratings' && (
              <div>
                <select
                  value={filterRating}
                  onChange={(e) => setFilterRating(e.target.value)}
                  className="input-field"
                  aria-label="Filter by rating"
                >
                  <option value="all">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Ratings Tab */}
        {activeTab === 'ratings' && (
          <div className="space-y-4">
            {filteredRatings.map((rating) => (
              <div
                key={rating.id}
                className={`card p-6 ${rating.flagged ? 'border-l-4 border-red-500' : ''}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < rating.overallRating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-bold text-gray-900">{rating.overallRating}/5</span>
                      {rating.wouldRecommend && (
                        <span className="badge bg-green-100 text-green-800 flex items-center space-x-1">
                          <TrendingUp className="w-3 h-3" />
                          <span>Would Recommend</span>
                        </span>
                      )}
                      {rating.flagged && (
                        <span className="badge bg-red-100 text-red-800 flex items-center space-x-1">
                          <Flag className="w-3 h-3" />
                          <span>Flagged</span>
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-600">Rated by:</p>
                        <div className="flex items-center space-x-2">
                          {rating.raterType === 'host' ? (
                            <Home className="w-4 h-4 text-teal-600" />
                          ) : (
                            <GraduationCap className="w-4 h-4 text-blue-600" />
                          )}
                          <span className="font-medium text-gray-900">{rating.raterName}</span>
                          <span className="badge badge-sm capitalize">{rating.raterType}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Rated:</p>
                        <div className="flex items-center space-x-2">
                          {rating.ratedType === 'host' ? (
                            <Home className="w-4 h-4 text-teal-600" />
                          ) : (
                            <GraduationCap className="w-4 h-4 text-blue-600" />
                          )}
                          <span className="font-medium text-gray-900">{rating.ratedName}</span>
                          <span className="badge badge-sm capitalize">{rating.ratedType}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Submitted: {new Date(rating.submittedDate).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                </div>

                {/* Detailed Ratings */}
                <div className="grid grid-cols-4 gap-4 mb-4 text-sm">
                  <div className="text-center">
                    <p className="text-gray-600 mb-1">Communication</p>
                    <div className="flex items-center justify-center space-x-1">
                      <span className="font-semibold text-gray-900">{rating.communication}</span>
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600 mb-1">Reliability</p>
                    <div className="flex items-center justify-center space-x-1">
                      <span className="font-semibold text-gray-900">{rating.reliability}</span>
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600 mb-1">Respect</p>
                    <div className="flex items-center justify-center space-x-1">
                      <span className="font-semibold text-gray-900">{rating.respect}</span>
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600 mb-1">
                      {rating.raterType === 'student' ? 'Living Conditions' : 'Task Quality'}
                    </p>
                    <div className="flex items-center justify-center space-x-1">
                      <span className="font-semibold text-gray-900">{rating.specificRating}</span>
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    </div>
                  </div>
                </div>

                {/* Feedback Text */}
                {rating.positiveAspects && (
                  <div className="bg-green-50 rounded-lg p-4 mb-3">
                    <p className="text-sm font-semibold text-green-900 mb-1">What went well:</p>
                    <p className="text-sm text-green-800">{rating.positiveAspects}</p>
                  </div>
                )}
                {rating.areasForImprovement && (
                  <div className="bg-yellow-50 rounded-lg p-4 mb-3">
                    <p className="text-sm font-semibold text-yellow-900 mb-1">Areas for improvement:</p>
                    <p className="text-sm text-yellow-800">{rating.areasForImprovement}</p>
                  </div>
                )}
                {rating.additionalComments && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-3">
                    <p className="text-sm font-semibold text-gray-900 mb-1">Additional comments:</p>
                    <p className="text-sm text-gray-700">{rating.additionalComments}</p>
                  </div>
                )}

                {/* Flag Reason */}
                {rating.flagged && rating.flagReason && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-3">
                    <p className="text-sm font-semibold text-red-900 mb-1">Flag Reason:</p>
                    <p className="text-sm text-red-800">{rating.flagReason}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  {!rating.flagged && hasPermission('moderate_content') && (
                    <button
                      onClick={() => handleFlagRating(rating.id)}
                      className="btn-outline text-sm flex items-center space-x-1"
                    >
                      <Flag className="w-4 h-4" />
                      <span>Flag for Review</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleContactUser(rating.raterEmail, rating.raterName)}
                    className="btn-outline text-sm flex items-center space-x-1"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>Contact {rating.raterName}</span>
                  </button>
                  <button
                    onClick={() => handleContactUser(rating.ratedEmail, rating.ratedName)}
                    className="btn-outline text-sm flex items-center space-x-1"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>Contact {rating.ratedName}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Monthly Reports Tab */}
        {activeTab === 'monthly-reports' && (
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className={`card p-6 ${report.flagged ? 'border-l-4 border-red-500' : ''}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{report.submittedBy}</h3>
                      <span className={`badge ${report.userType === 'host' ? 'badge-purple' : 'badge-blue'} capitalize`}>
                        {report.userType}
                      </span>
                      {report.userType === 'student' && getTierBadge(tierCache[report.studentId] || 'none')}
                      {report.needSupport && (
                        <span className="badge bg-orange-100 text-orange-800 flex items-center space-x-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>Needs Support</span>
                        </span>
                      )}
                      {report.flagged && (
                        <span className="badge bg-red-100 text-red-800 flex items-center space-x-1">
                          <Flag className="w-3 h-3" />
                          <span>Flagged</span>
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Reporting Period: {new Date(report.reportingPeriod + '-01').toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })} |
                      Partner: {report.partner}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-600 mb-1">Hours Completed</p>
                    <p className="text-xl font-bold text-gray-900">{report.hoursCompleted}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-600 mb-1">Tasks Completed</p>
                    <p className="text-xl font-bold text-gray-900">{report.tasksCompleted}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-600 mb-1">Relationship</p>
                    <div className="flex items-center justify-center space-x-1">
                      <p className="text-xl font-bold text-gray-900">{report.relationshipQuality}</p>
                      <Heart className={`w-5 h-5 ${report.relationshipQuality >= 4 ? 'fill-red-400 text-red-400' : 'text-gray-400'}`} />
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-600 mb-1">Wellbeing</p>
                    <div className="flex items-center justify-center space-x-1">
                      <p className="text-xl font-bold text-gray-900">{report.wellbeingScore}</p>
                      <Heart className={`w-5 h-5 ${report.wellbeingScore >= 4 ? 'fill-red-400 text-red-400' : 'text-gray-400'}`} />
                    </div>
                  </div>
                </div>

                {/* Report Content */}
                {report.highlights && (
                  <div className="bg-green-50 rounded-lg p-4 mb-3">
                    <p className="text-sm font-semibold text-green-900 mb-1">Highlights:</p>
                    <p className="text-sm text-green-800">{report.highlights}</p>
                  </div>
                )}
                {report.challenges && (
                  <div className="bg-yellow-50 rounded-lg p-4 mb-3">
                    <p className="text-sm font-semibold text-yellow-900 mb-1">Challenges:</p>
                    <p className="text-sm text-yellow-800">{report.challenges}</p>
                  </div>
                )}
                {report.goalsForNextMonth && (
                  <div className="bg-teal-50 rounded-lg p-4 mb-3">
                    <p className="text-sm font-semibold text-teal-900 mb-1">Goals for Next Month:</p>
                    <p className="text-sm text-teal-800">{report.goalsForNextMonth}</p>
                  </div>
                )}
                {report.needSupport && report.supportDetails && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-3">
                    <p className="text-sm font-semibold text-orange-900 mb-1">Support Requested:</p>
                    <p className="text-sm text-orange-800">{report.supportDetails}</p>
                  </div>
                )}

                {/* Flag Reason */}
                {report.flagged && report.flagReason && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-3">
                    <p className="text-sm font-semibold text-red-900 mb-1">Automatic Flag Reason:</p>
                    <p className="text-sm text-red-800">{report.flagReason}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <button
                    onClick={() => handleContactUser(report.email, report.submittedBy)}
                    className="btn-primary text-sm flex items-center space-x-1"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>Contact {report.submittedBy}</span>
                  </button>
                  {report.needSupport && (
                    <span className="text-sm text-orange-600 font-medium flex items-center">
                      ⚠️ Action Required: Support requested
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && !error && ((activeTab === 'ratings' && filteredRatings.length === 0) ||
          (activeTab === 'monthly-reports' && filteredReports.length === 0)) && (
          <div className="card p-12 text-center">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No feedback found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
        </>
        )}
      </div>
    </div>
  );
};

export default AdminFeedbackReview;
