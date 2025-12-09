import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { dashboardService } from '../services/dashboardService';
import { facilitationService } from '../services/facilitationService';
import { checkMultipleFeedbackEligibility, getCurrentMonth } from '../services/feedbackService';
import VerificationStatusBanner from '../components/VerificationStatusBanner';
import {
  Home,
  Users,
  Star,
  MessageCircle,
  MessageSquare,
  Settings,
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  HelpCircle,
  Briefcase,
  Loader2,
  Mail,
  Phone,
  GraduationCap,
  XCircle,
} from 'lucide-react';

const HostDashboard = () => {
  const { user, getFirstName, loading: userLoading} = useUser();
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [facilitationRequests, setFacilitationRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [matchedStudents, setMatchedStudents] = useState([]);
  const [feedbackEligibility, setFeedbackEligibility] = useState({});

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

  // Fetch facilitation requests
  useEffect(() => {
    const fetchRequests = async () => {
      if (!user) return;

      try {
        setRequestsLoading(true);
        const requests = await facilitationService.getHostRequests();
        setFacilitationRequests(requests);
      } catch (error) {
        console.error('Error fetching facilitation requests:', error);
      } finally {
        setRequestsLoading(false);
      }
    };

    if (!userLoading && user) {
      fetchRequests();
    }
  }, [user, userLoading]);

  // Fetch matched students and check feedback eligibility
  useEffect(() => {
    const fetchMatchedStudents = async () => {
      if (!user) return;

      try {
        const students = await facilitationService.getMatchedStudents();
        setMatchedStudents(students);

        // Check feedback eligibility for all students
        if (students.length > 0) {
          const facilitationIds = students.map(s => s.facilitationId);
          const eligibilityResult = await checkMultipleFeedbackEligibility(facilitationIds);
          if (eligibilityResult.success) {
            setFeedbackEligibility(eligibilityResult.data);
          }
        }
      } catch (error) {
        console.error('Error fetching matched students:', error);
      }
    };

    if (!userLoading && user) {
      fetchMatchedStudents();
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
    pendingRequests: facilitationRequests.filter(r => r.status === 'pending').length,
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

  // Accept facilitation request
  const handleAcceptRequest = async (requestId) => {
    try {
      await facilitationService.acceptRequest(requestId);
      // Refresh requests
      const requests = await facilitationService.getHostRequests();
      setFacilitationRequests(requests);
      alert('Interest confirmed! The request has been forwarded to admin for verification.');
    } catch (error) {
      console.error('Error accepting request:', error);
      alert('Failed to confirm interest. Please try again.');
    }
  };

  // Decline facilitation request
  const handleDeclineRequest = async (requestId) => {
    if (!confirm('Are you sure you want to decline this request? This action cannot be undone.')) {
      return;
    }

    try {
      await facilitationService.declineRequest(requestId);
      // Refresh requests
      const requests = await facilitationService.getHostRequests();
      setFacilitationRequests(requests);
      alert('Request declined.');
    } catch (error) {
      console.error('Error declining request:', error);
      alert('Failed to decline request. Please try again.');
    }
  };

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
        {/* Verification Status Banner */}
        <VerificationStatusBanner />

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900">
                  Welcome back, {getFirstName()}!
                </h1>
                {user.isVerified && (
                  <CheckCircle className="w-8 h-8 text-teal-600" />
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
              onClick={() => setActiveTab('requests')}
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
                <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-7 h-7 text-teal-600" />
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
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors relative ${
                  activeTab === 'requests'
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Requests
                {hostData && hostData.pendingRequests > 0 && (
                  <span className="absolute -top-1 -right-2 w-5 h-5 bg-teal-500 text-white text-xs rounded-full flex items-center justify-center">
                    {hostData.pendingRequests}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'profile'
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Profile
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors relative ${
                  activeTab === 'notifications'
                    ? 'border-teal-600 text-teal-600'
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
              {/* Matched Students */}
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center justify-between">
                  <span>Active Student Arrangements</span>
                  {matchedStudents.length > 0 && (
                    <span className="text-sm font-normal text-gray-600">
                      {matchedStudents.length} student{matchedStudents.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </h2>

                {matchedStudents.length > 0 ? (
                  <div className="space-y-4">
                    {matchedStudents.map((student) => {
                      const canSubmit = feedbackEligibility[student.facilitationId]?.canSubmit;
                      const currentMonth = getCurrentMonth();

                      return (
                        <div
                          key={student.facilitationId}
                          className="border border-gray-200 rounded-xl p-4 hover:border-teal-300 transition-colors"
                        >
                          <div className="flex items-start space-x-4 mb-4">
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                              {student.profilePicture ? (
                                <img
                                  src={student.profilePicture}
                                  alt={student.studentName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-teal-100">
                                  <Users className="w-8 h-8 text-teal-600" />
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-semibold text-gray-900 truncate">
                                  {student.studentName}
                                </h3>
                                {student.rating > 0 && (
                                  <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    <span className="font-semibold text-gray-900 text-sm">
                                      {student.rating.toFixed(1)}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-1">
                                {student.university}
                                {student.course && ` • ${student.course}`}
                              </p>
                              <div className="flex items-center space-x-2 text-xs text-gray-500">
                                <Calendar className="w-3 h-3" />
                                <span>
                                  Matched {student.matchedAt ? new Date(student.matchedAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : 'Recently'}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            {canSubmit ? (
                              <Link
                                to={`/monthly-feedback/${student.facilitationId}`}
                                state={{
                                  partnerName: student.studentName,
                                  partnerId: student.studentId,
                                  partnerRole: 'guest'
                                }}
                                className="btn-primary flex-1 text-center flex items-center justify-center space-x-2"
                              >
                                <MessageSquare className="w-4 h-4" />
                                <span>Submit Feedback ({currentMonth})</span>
                              </Link>
                            ) : (
                              <button
                                disabled
                                className="btn-outline flex-1 text-center opacity-50 cursor-not-allowed flex items-center justify-center space-x-2"
                              >
                                <CheckCircle className="w-4 h-4" />
                                <span>Feedback Submitted ({currentMonth})</span>
                              </button>
                            )}
                            <Link
                              to="/feedback-history"
                              className="btn-outline flex-1 text-center flex items-center justify-center space-x-2"
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span>View History</span>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
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
                        className="border border-gray-200 rounded-xl p-4 hover:border-teal-300 transition-colors"
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
                              : 'bg-teal-100 text-teal-800'
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
                    to="/feedback-history"
                    className="w-full btn-primary flex items-center justify-center space-x-2 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>Submit Monthly Reviews</span>
                  </Link>
                  <Link
                    to="/feedback-history"
                    className="w-full btn-outline flex items-center justify-center space-x-2"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>Feedback History</span>
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
              <div className="card p-6 bg-teal-50 border-teal-200">
                <h3 className="font-semibold text-teal-900 mb-3">
                  Need Assistance?
                </h3>
                <p className="text-sm text-teal-800 mb-4">
                  Our team is here to help with any questions or concerns.
                </p>
                <Link to="/help" className="btn-primary w-full text-center block">
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Facilitation Requests
              </h2>

              {requestsLoading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Loading requests...</p>
                </div>
              ) : facilitationRequests.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    No Requests Yet
                  </h3>
                  <p className="text-gray-600">
                    When students request to connect with you, they'll appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {facilitationRequests.map((request) => (
                    <div key={request.id} className="border border-gray-200 rounded-lg p-6">
                      {/* Student Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {request.studentName}
                          </h3>
                          <div className="space-y-1 text-sm text-gray-600">
                            {request.university && (
                              <div className="flex items-center space-x-2">
                                <GraduationCap className="w-4 h-4" />
                                <span>{request.university}</span>
                              </div>
                            )}
                            {/* Contact details hidden - will be shared by admin after approval */}
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          request.status === 'in_review' ? 'bg-teal-100 text-teal-800' :
                          request.status === 'matched' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {request.status === 'pending' && 'Pending'}
                          {request.status === 'in_review' && 'Under Admin Review'}
                          {request.status === 'matched' && 'matched'}
                          {request.status === 'cancelled' && 'Declined'}
                        </div>
                      </div>

                      {/* Field of Study */}
                      {request.fieldOfStudy && (
                        <div className="mb-3">
                          <span className="text-sm font-medium text-gray-700">Field of Study: </span>
                          <span className="text-sm text-gray-600">{request.fieldOfStudy}</span>
                        </div>
                      )}

                      {/* Hours Available Per Week */}
                      {request.hoursPerWeek && (
                        <div className="mb-3">
                          <span className="text-sm font-medium text-gray-700">Hours Available Per Week: </span>
                          <span className="text-sm text-gray-600">{request.hoursPerWeek} hours</span>
                        </div>
                      )}

                      {/* Student's Message */}
                      {request.message && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">
                            Student's Message:
                          </h4>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {request.message}
                          </p>
                        </div>
                      )}

                      {/* Student Bio */}
                      {request.bio && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">
                            About the Student:
                          </h4>
                          <p className="text-sm text-gray-700">
                            {request.bio}
                          </p>
                        </div>
                      )}

                      {/* Request Date */}
                      <div className="text-xs text-gray-500 mb-4">
                        Requested on {new Date(request.requestDate).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </div>

                      {/* Action Buttons */}
                      {request.status === 'pending' && (
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleAcceptRequest(request.id)}
                            className="flex-1 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium"
                          >
                            <CheckCircle className="w-4 h-4 inline mr-2" />
                            I'm Interested
                          </button>
                          <button
                            onClick={() => handleDeclineRequest(request.id)}
                            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                          >
                            <XCircle className="w-4 h-4 inline mr-2" />
                            Not Interested
                          </button>
                        </div>
                      )}

                      {request.status === 'in_review' && (
                        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                          <p className="text-sm text-teal-900">
                            <strong>Status:</strong> This request has been forwarded to the admin team for verification and final approval.
                          </p>
                        </div>
                      )}

                      {request.status === 'matched' && request.adminContact && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <p className="text-sm text-green-900 mb-2">
                            <strong>Admin Approved!</strong> Admin contact details:
                          </p>
                          <div className="text-sm text-green-800">
                            <p><strong>{request.adminContact.name}</strong></p>
                            {request.adminContact.email && (
                              <p>Email: {request.adminContact.email}</p>
                            )}
                            {request.adminContact.phone && (
                              <p>Phone: {request.adminContact.phone}</p>
                            )}
                          </div>
                        </div>
                      )}

                      {request.status === 'cancelled' && request.adminNotes && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <p className="text-sm text-red-900">
                            <strong>Admin Notes:</strong> {request.adminNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
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
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Settings className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-teal-900 mb-1">
                        Manage Your Profile & Documents
                      </h4>
                      <p className="text-sm text-teal-800 mb-3">
                        Update your personal information, upload verification documents, and manage your account settings.
                      </p>
                      <Link to="/host/settings" className="text-sm text-teal-600 hover:text-teal-700 font-medium">
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
                  className="text-sm text-teal-600 hover:text-teal-700 font-medium"
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
                        ? 'border-teal-600 bg-teal-50'
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
                              className="text-sm text-teal-600 hover:text-teal-700 font-medium whitespace-nowrap"
                              title="Mark as read"
                            >
                              Mark read
                            </button>
                            <span className="w-2 h-2 bg-teal-600 rounded-full"></span>
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
                          className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                        >
                          View Request →
                        </button>
                      </div>
                    )}
                    {notification.type === 'reminder' && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <Link
                          to="/rate-experience"
                          className="text-sm text-teal-600 hover:text-teal-700 font-medium"
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

