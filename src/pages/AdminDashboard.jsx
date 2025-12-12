import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  UserCheck,
  Clock,
  AlertCircle,
  CheckCircle,
  Link2,
  FileText,
  Home,
  GraduationCap,
  ArrowRight,
  TrendingUp,
  Activity,
  Loader2,
  RefreshCw,
  AlertTriangle,
  MessageSquare,
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { useVerificationEvents } from '../context/VerificationEventsContext';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { lastUpdate } = useVerificationEvents();

  // Fetch dashboard data on mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Re-fetch stats when verification changes occur
  useEffect(() => {
    if (lastUpdate) {
      fetchDashboardData();
    }
  }, [lastUpdate]);

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const [statsData, activityData] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getRecentActivity(10),
      ]);
      setStats(statsData);
      setRecentActivity(activityData);
      if (isRefresh) {
        toast.success('Dashboard refreshed successfully');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="btn-primary flex items-center space-x-2"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
          <p className="text-lg text-gray-600">
            Manage verifications, facilitation requests, and platform operations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Verifications</p>
                <span className="text-3xl font-bold text-gray-900">
                  {stats?.pendingVerifications || 0}
                </span>
                <p className="text-xs text-gray-500 mt-2">Users awaiting approval</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Requests</p>
                <span className="text-3xl font-bold text-gray-900">
                  {stats?.pendingFacilitations || 0}
                </span>
                <p className="text-xs text-gray-500 mt-2">Facilitation requests</p>
              </div>
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <Link2 className="w-6 h-6 text-teal-600" />
              </div>
            </div>
          </div>

          <Link
            to="/admin/termination-requests"
            className="card p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Terminations</p>
                <span className="text-3xl font-bold text-gray-900">
                  {stats?.pendingTerminations || 0}
                </span>
                <p className="text-xs text-gray-500 mt-2">Awaiting review</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </Link>

          <div className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Matches</p>
                <span className="text-3xl font-bold text-gray-900">
                  {stats?.activeArrangements || 0}
                </span>
                <p className="text-xs text-gray-500 mt-2">Currently active</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Users</p>
                <span className="text-3xl font-bold text-gray-900">
                  {stats?.totalUsers || 0}
                </span>
                <p className="text-xs text-gray-500 mt-2">
                  {stats?.totalHosts || 0} hosts • {stats?.totalStudents || 0} students
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Reviews</p>
                <span className="text-3xl font-bold text-gray-900">
                  {stats?.totalReviews || 0}
                </span>
                <p className="text-xs text-gray-500 mt-2">Platform reviews</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="/admin/users"
              className="card p-6 hover:shadow-lg transition-all hover:border-teal-200 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    User Management
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Review and verify user accounts
                  </p>
                  {stats?.pendingVerifications > 0 && (
                    <span className="badge bg-yellow-100 text-yellow-800">
                      {stats.pendingVerifications} pending
                    </span>
                  )}
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>

            <Link
              to="/admin/facilitation-requests"
              className="card p-6 hover:shadow-lg transition-all hover:border-teal-200 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Facilitation Requests
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Approve host-student pairings
                  </p>
                  {stats?.pendingFacilitations > 0 && (
                    <span className="badge bg-teal-100 text-teal-800">
                      {stats.pendingFacilitations} pending
                    </span>
                  )}
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>

            <Link
              to="/admin/termination-requests"
              className="card p-6 hover:shadow-lg transition-all hover:border-red-200 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    Termination Requests
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Review facilitation end requests
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>

            <Link
              to="/admin/reports"
              className="card p-6 hover:shadow-lg transition-all hover:border-teal-200 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Monthly Reports
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Review submitted reports
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>

            <Link
              to="/admin/disputes"
              className="card p-6 hover:shadow-lg transition-all hover:border-teal-200 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Dispute Management
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Handle user disputes
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>

            <Link
              to="/admin/feedback"
              className="card p-6 hover:shadow-lg transition-all hover:border-teal-200 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Feedback Review
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    View platform feedback
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>

            <Link
              to="/admin/reviews"
              className="card p-6 hover:shadow-lg transition-all hover:border-amber-200 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Review Management
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Manage platform reviews
                  </p>
                  {stats?.totalReviews > 0 && (
                    <span className="badge bg-amber-100 text-amber-800">
                      {stats.totalReviews} reviews
                    </span>
                  )}
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>

            <Link
              to="/admin/create-profile"
              className="card p-6 hover:shadow-lg transition-all hover:border-teal-200 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Create Host Profile
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Add new host user
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Activity className="w-6 h-6 text-teal-600" />
              <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="text-sm text-teal-600 hover:text-teal-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {recentActivity.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No recent activity</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-shrink-0">
                    {activity.type === 'signup' ? (
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                    ) : activity.type === 'facilitation_request' ? (
                      <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                        <Link2 className="w-5 h-5 text-teal-600" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <FileText className="w-5 h-5 text-gray-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.timestamp).toLocaleString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  {activity.status && (
                    <span
                      className={`badge ${
                        activity.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : activity.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {activity.status}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
