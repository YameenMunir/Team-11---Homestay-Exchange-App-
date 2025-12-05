import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { dashboardService } from '../services/dashboardService';
import { savedHostsService } from '../services/savedHostsService';
import VerificationStatusBanner from '../components/VerificationStatusBanner';
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
  Link2,
  Loader2,
} from 'lucide-react';

const StudentDashboard = () => {
  const { user, getFirstName, loading: userLoading } = useUser();
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedHostsCount, setSavedHostsCount] = useState(0);

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

  // Prepare student data
  const studentData = user && dashboardData ? {
    name: user.fullName,
    university: user.university,
    recognitionLevel: dashboardData.recognitionLevel || 'bronze',
    consecutiveRatings: dashboardData.consecutiveRatings || 0,
    rating: user.rating || 0,
    reviewCount: dashboardData.reviewCount || 0,
    currentHost: dashboardData.currentHost,
    savedHosts: savedHostsCount,
    totalHours: dashboardData.totalHours || 0,
    connectionRequests: dashboardData.connectionRequests || {
      pending: 0,
      approved: 0,
      total: 0,
    },
  } : null;

  const recognitionBadge = {
    bronze: { color: 'orange', label: 'Bronze', description: '2+ consecutive 4-5⭐ ratings' },
    silver: { color: 'gray', label: 'Silver', description: '4+ consecutive 4-5⭐ ratings' },
    gold: { color: 'yellow', label: 'Gold', description: '6+ consecutive 4-5⭐ ratings' },
  };

  const currentBadge = studentData ? recognitionBadge[studentData.recognitionLevel] : recognitionBadge.bronze;

  // Show loading state
  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
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
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Recognition</p>
                  <span className={`badge badge-${studentData.recognitionLevel} text-base px-3 py-1`}>
                    {currentBadge.label}
                  </span>
                  <p className="text-xs text-gray-500 mt-2">
                    {studentData.consecutiveRatings} consecutive high ratings
                  </p>
                </div>
                <Award className={`w-10 h-10 text-${currentBadge.color}-600`} />
              </div>
            </div>

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
                <Clock className="w-10 h-10 text-purple-600" />
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
                  {studentData.connectionRequests.pending > 0 && (
                    <p className="text-xs text-yellow-600 mt-1 font-medium">
                      {studentData.connectionRequests.pending} pending
                    </p>
                  )}
                  {studentData.connectionRequests.approved > 0 && studentData.connectionRequests.pending === 0 && (
                    <p className="text-xs text-green-600 mt-1 font-medium">
                      {studentData.connectionRequests.approved} approved
                    </p>
                  )}
                </div>
                <Link2 className="w-10 h-10 text-purple-600" />
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
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('browse')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'browse'
                    ? 'border-purple-600 text-purple-600'
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
                          <CheckCircle className="w-6 h-6 text-purple-600" />
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
                              className="badge bg-purple-100 text-purple-800"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-purple-900 font-medium">
                            Hours this month
                          </p>
                          <p className="text-2xl font-bold text-purple-900">
                            {studentData.currentHost.hoursThisMonth || 0}
                          </p>
                        </div>
                        <Clock className="w-10 h-10 text-purple-600" />
                      </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                      <Link to="/monthly-report" className="btn-primary flex-1 text-center">
                        Log Hours
                      </Link>
                      <Link to="/rate-experience" className="btn-outline flex-1 text-center">
                        Rate Host
                      </Link>
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
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Recognition Progress
                </h2>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Current: {currentBadge.label}
                    </span>
                    <span className="text-sm text-gray-600">
                      {studentData.consecutiveRatings}/
                      {studentData.recognitionLevel === 'bronze'
                        ? '4'
                        : studentData.recognitionLevel === 'silver'
                        ? '6'
                        : '6+'}{' '}
                      ratings
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`bg-${currentBadge.color}-600 h-3 rounded-full transition-all`}
                      style={{
                        width: `${
                          studentData.recognitionLevel === 'bronze'
                            ? (studentData.consecutiveRatings / 4) * 100
                            : studentData.recognitionLevel === 'silver'
                            ? (studentData.consecutiveRatings / 6) * 100
                            : 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-orange-50 rounded-xl border-2 border-orange-200">
                    <Award className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-orange-900">Bronze</p>
                    <p className="text-xs text-orange-700 mt-1">2 ratings</p>
                  </div>

                  <div className={`text-center p-4 rounded-xl border-2 ${
                    studentData.recognitionLevel === 'silver' || studentData.recognitionLevel === 'gold'
                      ? 'bg-gray-50 border-gray-400'
                      : 'bg-gray-50 border-gray-200'
                  }`}>
                    <Award className={`w-8 h-8 mx-auto mb-2 ${
                      studentData.recognitionLevel === 'silver' || studentData.recognitionLevel === 'gold'
                        ? 'text-gray-600'
                        : 'text-gray-400'
                    }`} />
                    <p className={`text-sm font-semibold ${
                      studentData.recognitionLevel === 'silver' || studentData.recognitionLevel === 'gold'
                        ? 'text-gray-900'
                        : 'text-gray-600'
                    }`}>Silver</p>
                    <p className="text-xs text-gray-600 mt-1">4 ratings</p>
                  </div>

                  <div className={`text-center p-4 rounded-xl border-2 ${
                    studentData.recognitionLevel === 'gold'
                      ? 'bg-yellow-50 border-yellow-400'
                      : 'bg-gray-50 border-gray-200'
                  }`}>
                    <Award className={`w-8 h-8 mx-auto mb-2 ${
                      studentData.recognitionLevel === 'gold'
                        ? 'text-yellow-600'
                        : 'text-gray-400'
                    }`} />
                    <p className={`text-sm font-semibold ${
                      studentData.recognitionLevel === 'gold'
                        ? 'text-yellow-900'
                        : 'text-gray-600'
                    }`}>Gold</p>
                    <p className="text-xs text-gray-600 mt-1">6 ratings</p>
                  </div>
                </div>
              </div>
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
              <div className="card p-6 bg-purple-50 border-purple-200">
                <h3 className="font-semibold text-purple-900 mb-3">💡 Tip</h3>
                <p className="text-sm text-purple-800 mb-4">
                  Maintain consistent 4-5 star ratings to reach Gold status and stand
                  out to hosts!
                </p>
              </div>
            </div>
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
    </div>
  );
};

export default StudentDashboard;
