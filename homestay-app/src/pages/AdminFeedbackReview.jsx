import { useState } from 'react';
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
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

const AdminFeedbackReview = () => {
  const { hasPermission } = useAdmin();
  const [activeTab, setActiveTab] = useState('ratings'); // ratings, monthly-reports
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all'); // all, 5, 4, 3, 2, 1
  const [filterType, setFilterType] = useState('all'); // all, host, student

  // Mock ratings data - Replace with API call
  const ratings = [
    {
      id: 1,
      raterName: 'Sarah K.',
      raterType: 'student',
      raterEmail: 'sarah.k@ucl.ac.uk',
      ratedName: 'Margaret Thompson',
      ratedType: 'host',
      ratedEmail: 'margaret.t@email.com',
      overallRating: 5,
      communication: 5,
      reliability: 5,
      respect: 5,
      specificRating: 5, // livingConditions for student, taskQuality for host
      wouldRecommend: true,
      positiveAspects: 'Margaret is wonderful! She is very kind, understanding, and makes me feel at home. The accommodation is clean and comfortable.',
      areasForImprovement: '',
      additionalComments: 'I am very grateful for this arrangement. Margaret has helped me settle into London.',
      submittedDate: '2025-01-20',
      flagged: false,
    },
    {
      id: 2,
      raterName: 'Margaret Thompson',
      raterType: 'host',
      raterEmail: 'margaret.t@email.com',
      ratedName: 'Sarah K.',
      ratedType: 'student',
      ratedEmail: 'sarah.k@ucl.ac.uk',
      overallRating: 5,
      communication: 5,
      reliability: 5,
      respect: 5,
      specificRating: 5,
      wouldRecommend: true,
      positiveAspects: 'Sarah is polite, respectful, and very helpful. She always asks if I need anything and is great with technology help.',
      areasForImprovement: '',
      additionalComments: 'This arrangement has been a blessing. I highly recommend Sarah.',
      submittedDate: '2025-01-20',
      flagged: false,
    },
    {
      id: 3,
      raterName: 'Emma Wilson',
      raterType: 'student',
      raterEmail: 'emma.w@ucl.ac.uk',
      ratedName: 'Robert Anderson',
      ratedType: 'host',
      ratedEmail: 'robert.a@email.com',
      overallRating: 2,
      communication: 3,
      reliability: 2,
      respect: 2,
      specificRating: 1,
      wouldRecommend: false,
      positiveAspects: 'The location is convenient for my university.',
      areasForImprovement: 'The room has mold and damp issues. I have raised this multiple times but no action has been taken. Communication is poor.',
      additionalComments: 'I would not recommend this arrangement. The living conditions are not acceptable.',
      submittedDate: '2025-01-22',
      flagged: true,
      flagReason: 'Low rating with safety concerns mentioned',
    },
    {
      id: 4,
      raterName: 'John Smith',
      raterType: 'host',
      raterEmail: 'john.s@gmail.com',
      ratedName: 'Ahmed M.',
      ratedType: 'student',
      ratedEmail: 'ahmed.m@imperial.ac.uk',
      overallRating: 3,
      communication: 4,
      reliability: 2,
      respect: 4,
      specificRating: 2,
      wouldRecommend: false,
      positiveAspects: 'Ahmed is polite and respectful when he is available.',
      areasForImprovement: 'Agreed to help with grocery shopping twice a week but often unavailable. Not reliable with commitments.',
      additionalComments: 'The arrangement started well but Ahmed has become less engaged.',
      submittedDate: '2025-01-19',
      flagged: false,
    },
  ];

  // Mock monthly reports data - Replace with API call
  const monthlyReports = [
    {
      id: 1,
      submittedBy: 'Sarah K.',
      userType: 'student',
      email: 'sarah.k@ucl.ac.uk',
      partner: 'Margaret Thompson',
      reportingPeriod: '2025-01',
      hoursCompleted: 40,
      tasksCompleted: 15,
      relationshipQuality: 5,
      wellbeingScore: 5,
      highlights: 'This month has been excellent. I helped Margaret with technology setup for her new tablet, grocery shopping, and companionship. We have developed a lovely friendship.',
      challenges: 'None. Everything is going smoothly.',
      goalsForNextMonth: 'Continue providing the same level of support and help Margaret learn more about using her tablet.',
      needSupport: false,
      supportDetails: '',
      submittedDate: '2025-01-21',
      flagged: false,
    },
    {
      id: 2,
      submittedBy: 'Emma Wilson',
      userType: 'student',
      email: 'emma.w@ucl.ac.uk',
      partner: 'Robert Anderson',
      reportingPeriod: '2025-01',
      hoursCompleted: 20,
      tasksCompleted: 8,
      relationshipQuality: 2,
      wellbeingScore: 2,
      highlights: 'I have been helping with light cleaning as agreed.',
      challenges: 'The room has persistent damp and mold issues which are affecting my health. I have raised this multiple times but no repairs have been made. I feel my concerns are not being taken seriously.',
      goalsForNextMonth: 'Hope to get the mold issue resolved.',
      needSupport: true,
      supportDetails: 'I need help addressing the mold issue in my room. It is affecting my respiratory health and I am worried about long-term exposure.',
      submittedDate: '2025-01-22',
      flagged: true,
      flagReason: 'Low wellbeing score + support requested + health concerns',
    },
    {
      id: 3,
      submittedBy: 'Ahmed M.',
      userType: 'student',
      email: 'ahmed.m@imperial.ac.uk',
      partner: 'John Smith',
      reportingPeriod: '2025-01',
      hoursCompleted: 12,
      tasksCompleted: 4,
      relationshipQuality: 3,
      wellbeingScore: 4,
      highlights: 'Helped with grocery shopping a few times.',
      challenges: 'My university workload has increased significantly this month with exams approaching. I have struggled to balance my commitments.',
      goalsForNextMonth: 'Better time management. Communicate earlier if I cannot make scheduled tasks.',
      needSupport: false,
      supportDetails: '',
      submittedDate: '2025-01-20',
      flagged: false,
    },
  ];

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

  const getTierBadge = (hoursCompleted) => {
    // Bronze: 2+ months, Silver: 4+ months, Gold: 6+ months (simplified for demo)
    // In real implementation, this would be calculated from consecutive positive ratings
    if (hoursCompleted >= 60) {
      return <span className="badge bg-yellow-400 text-yellow-900 flex items-center space-x-1">
        <Award className="w-3 h-3" />
        <span>Gold Tier</span>
      </span>;
    } else if (hoursCompleted >= 40) {
      return <span className="badge bg-gray-300 text-gray-800 flex items-center space-x-1">
        <Award className="w-3 h-3" />
        <span>Silver Tier</span>
      </span>;
    } else if (hoursCompleted >= 20) {
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-3">
            Feedback & Ratings Review
          </h1>
          <p className="text-lg text-gray-600">
            Monitor user feedback, ratings, and monthly check-in reports
          </p>
        </div>

        {/* Stats */}
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
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Experience Ratings ({ratings.length})
              </button>
              <button
                onClick={() => setActiveTab('monthly-reports')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'monthly-reports'
                    ? 'border-purple-600 text-purple-600'
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
                            <Home className="w-4 h-4 text-purple-600" />
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
                            <Home className="w-4 h-4 text-purple-600" />
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
                      {getTierBadge(report.hoursCompleted)}
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
                  <div className="bg-purple-50 rounded-lg p-4 mb-3">
                    <p className="text-sm font-semibold text-purple-900 mb-1">Goals for Next Month:</p>
                    <p className="text-sm text-purple-800">{report.goalsForNextMonth}</p>
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
        {((activeTab === 'ratings' && filteredRatings.length === 0) ||
          (activeTab === 'monthly-reports' && filteredReports.length === 0)) && (
          <div className="card p-12 text-center">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No feedback found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFeedbackReview;
