import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { dashboardService } from '../services/dashboardService';
import {
  Home,
  Users,
  Star,
  MessageCircle,
  Settings,
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  HelpCircle,
  Briefcase,
  Loader2,
} from 'lucide-react';

const HostDashboard = () => {
  const { user, getFirstName, loading: userLoading } = useUser();
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await dashboardService.getHostDashboardData(user.id);
        setDashboardData(data);

        // Fetch notifications
        const notifs = await dashboardService.getNotifications(user.id);
        setNotifications(notifs);
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

  // Prepare host data
  const hostData = user ? {
    name: user.fullName,
    verified: user.isVerified,
    memberSince: user.memberSince,
    rating: user.rating || 0,
    reviewCount: dashboardData?.reviewCount || 0,
    currentStudent: dashboardData?.currentStudent,
    pendingRequests: dashboardData?.pendingRequestsCount || 0,
  } : null;

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await dashboardService.markNotificationAsRead(notificationId);
      setNotifications(notifications.map(notif =>
        notif.id === notificationId ? { ...notif, is_read: true } : notif
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!user?.id) return;
    try {
      await dashboardService.markAllNotificationsAsRead(user.id);
      setNotifications(notifications.map(notif => ({ ...notif, is_read: true })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      await dashboardService.deleteNotification(notificationId);
      setNotifications(notifications.filter(notif => notif.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

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
  if (!user) {
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
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900">
                  Welcome back, {getFirstName()}!
                </h1>
                {user.isVerified && (
                  <CheckCircle className="w-8 h-8 text-purple-600" />
                )}
              </div>
              <p className="text-lg text-gray-600">
                Member since {user.memberSince}
              </p>
            </div>

            <Link to="/help" className="btn-secondary hidden md:flex items-center space-x-2">
              <HelpCircle className="w-5 h-5" />
              <span>Help</span>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Your Rating</p>
                  <div className="flex items-center space-x-2">
                    <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                    <span className="text-3xl font-bold text-gray-900">
                      {hostData.rating}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {hostData.reviewCount} reviews
                  </p>
                </div>
                <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Star className="w-7 h-7 text-yellow-600" />
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('overview')}
              className="card p-6 hover:shadow-lg transition-shadow cursor-pointer text-left w-full"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending Requests</p>
                  <span className="text-3xl font-bold text-gray-900">
                    {hostData.pendingRequests}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">Awaiting review</p>
                </div>
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-7 h-7 text-purple-600" />
                </div>
              </div>
            </button>

            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Current Student</p>
                  <span className="text-3xl font-bold text-gray-900">
                    {hostData.currentStudent ? 1 : 0}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">Active arrangement</p>
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                  <Users className="w-7 h-7 text-green-600" />
                </div>
              </div>
            </div>
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
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'profile'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Profile
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors relative ${
                  activeTab === 'notifications'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Notifications
                {notifications.filter((n) => !n.is_read).length > 0 && (
                  <span className="absolute -top-1 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications.filter((n) => !n.is_read).length}
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Current Student */}
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Current Student
                </h2>

                {hostData.currentStudent ? (
                  <>
                    <div className="flex items-start space-x-4 mb-6">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-200">
                        <img
                          src={hostData.currentStudent.imageUrl}
                          alt={hostData.currentStudent.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {hostData.currentStudent.name}
                          </h3>
                          {hostData.currentStudent.rating > 0 && (
                            <div className="flex items-center space-x-1">
                              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold text-gray-900">
                                {hostData.currentStudent.rating.toFixed(1)}
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {hostData.currentStudent.university}
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>Since {hostData.currentStudent.startDate}</span>
                        </div>
                      </div>
                    </div>

                    {hostData.currentStudent.servicesProvided && hostData.currentStudent.servicesProvided.length > 0 && (
                      <div className="bg-gray-50 rounded-xl p-4 mb-4">
                        <p className="text-sm font-semibold text-gray-900 mb-2">
                          Services Provided:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {hostData.currentStudent.servicesProvided.map((service) => (
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

                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-green-900 font-medium">
                            Hours this month
                          </p>
                          <p className="text-2xl font-bold text-green-900">
                            {hostData.currentStudent.hoursThisMonth || 0}
                          </p>
                        </div>
                        <Clock className="w-10 h-10 text-green-600" />
                      </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                      <Link to="/rate-experience" className="btn-primary flex-1 text-center">
                        Rate This Month
                      </Link>
                      <Link to="/monthly-report" className="btn-outline flex-1 text-center">
                        Submit Report
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-4">No active student arrangement</p>
                    <p className="text-sm text-gray-500">
                      Browse facilitation requests to find a student match
                    </p>
                  </div>
                )}
              </div>

              {/* Pending Requests */}
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Pending Facilitation Requests
                </h2>

                {dashboardData?.pendingRequests && dashboardData.pendingRequests.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.pendingRequests.map((request) => (
                      <div
                        key={request.id}
                        className="border border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {request.studentName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {request.university}
                              {request.course && ` • ${request.course}`}
                            </p>
                          </div>
                          <span className={`badge ${
                            request.status === 'under_review'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {request.status === 'under_review' ? 'Under Review' : 'New'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">
                          {request.status === 'under_review'
                            ? "Our team is reviewing this match. We'll contact you within 24-48 hours."
                            : 'New facilitation request received. Our team will review and contact you soon.'}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => alert('Student profile details will be available after admin approval')}
                            className="btn-primary text-sm py-2"
                          >
                            View Profile
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No pending requests at the moment</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    to="/host/create-task"
                    className="w-full btn-primary flex items-center justify-center space-x-2"
                  >
                    <Briefcase className="w-5 h-5" />
                    <span>Post New Task</span>
                  </Link>
                  <Link
                    to="/host/manage-tasks"
                    className="w-full btn-outline flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Manage Tasks</span>
                  </Link>
                  <Link
                    to="/host/settings"
                    className="w-full btn-outline flex items-center justify-center space-x-2"
                  >
                    <Settings className="w-5 h-5" />
                    <span>Settings & Verification</span>
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

              {/* Help & Resources */}
              <div className="card p-6 bg-purple-50 border-purple-200">
                <h3 className="font-semibold text-purple-900 mb-3">
                  Need Assistance?
                </h3>
                <p className="text-sm text-purple-800 mb-4">
                  Our team is here to help with any questions or concerns.
                </p>
                <Link to="/help" className="btn-primary w-full text-center block">
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="card p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
                <Link to="/host/settings" className="btn-primary flex items-center space-x-2">
                  <Edit className="w-5 h-5" />
                  <span>Edit Profile</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <p className="text-gray-900">{user.fullName}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <p className="text-gray-900">{user.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone
                  </label>
                  <p className="text-gray-900">{user.phone}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Member Since
                  </label>
                  <p className="text-gray-900">{user.memberSince}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Verification Status
                  </label>
                  <div className="flex items-center space-x-2">
                    {user.isVerified ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-green-800 font-medium">Verified</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-5 h-5 text-yellow-600" />
                        <span className="text-yellow-800 font-medium">Pending Verification</span>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Overall Rating
                  </label>
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-gray-900 font-medium">{user.rating} ({hostData.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Settings className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-purple-900 mb-1">
                        Manage Your Profile & Documents
                      </h4>
                      <p className="text-sm text-purple-800 mb-3">
                        Update your personal information, upload verification documents, and manage your account settings.
                      </p>
                      <Link to="/host/settings" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                        Go to Settings →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
              {notifications.filter(n => !n.is_read).length > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No notifications
                </h3>
                <p className="text-gray-600">
                  You're all caught up! Check back later for updates.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`border-l-4 rounded-r-lg p-4 transition-all ${
                      !notification.is_read
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium mb-1">
                          {notification.message || notification.content}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {!notification.is_read && (
                          <>
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-sm text-purple-600 hover:text-purple-700 font-medium whitespace-nowrap"
                              title="Mark as read"
                            >
                              Mark read
                            </button>
                            <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                          </>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-sm text-red-600 hover:text-red-700 font-medium"
                          title="Delete notification"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    {/* Action buttons based on notification type */}
                    {notification.type === 'new_request' && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <button
                          onClick={() => setActiveTab('overview')}
                          className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                        >
                          View Request →
                        </button>
                      </div>
                    )}
                    {notification.type === 'reminder' && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <Link
                          to="/rate-experience"
                          className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                        >
                          Rate Now →
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HostDashboard;
