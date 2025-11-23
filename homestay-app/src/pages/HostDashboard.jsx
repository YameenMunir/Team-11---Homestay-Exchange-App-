import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
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
} from 'lucide-react';

const HostDashboard = () => {
  const { user, getFirstName } = useUser();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data
  const hostData = {
    name: user.fullName,
    verified: user.isVerified,
    memberSince: user.memberSince,
    rating: user.rating,
    reviewCount: 12,
    currentStudent: {
      name: 'Sarah K.',
      university: 'University College London',
      startDate: 'September 2024',
      servicesProvided: ['Grocery Shopping', 'Technology Help', 'Companionship'],
      hoursThisMonth: 14,
      rating: 5,
      imageUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    pendingRequests: 2,
    notifications: [
      {
        id: 1,
        type: 'new_request',
        message: 'New facilitation request from Ahmed M.',
        time: '2 hours ago',
        unread: true,
      },
      {
        id: 2,
        type: 'reminder',
        message: 'Time to rate your current student for this month',
        time: '1 day ago',
        unread: true,
      },
    ],
  };

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

            <div className="card p-6">
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
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Current Student</p>
                  <span className="text-3xl font-bold text-gray-900">1</span>
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
                {hostData.notifications.filter((n) => n.unread).length > 0 && (
                  <span className="absolute -top-1 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {hostData.notifications.filter((n) => n.unread).length}
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
                      <div className="flex items-center space-x-1">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-gray-900">
                          {hostData.currentStudent.rating}
                        </span>
                      </div>
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

                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-900 font-medium">
                        Hours this month
                      </p>
                      <p className="text-2xl font-bold text-green-900">
                        {hostData.currentStudent.hoursThisMonth}
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
              </div>

              {/* Pending Requests */}
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Pending Facilitation Requests
                </h2>

                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">Ahmed M.</h3>
                        <p className="text-sm text-gray-600">
                          King's College London • Year 2
                        </p>
                      </div>
                      <span className="badge bg-yellow-100 text-yellow-800">
                        Under Review
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">
                      Our team is reviewing this match. We'll contact you within
                      24-48 hours.
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

                  <div className="border border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">Lisa W.</h3>
                        <p className="text-sm text-gray-600">
                          Imperial College • Postgraduate
                        </p>
                      </div>
                      <span className="badge bg-purple-100 text-purple-800">New</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">
                      New facilitation request received. Our team will review and
                      contact you soon.
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
                    to="/host/settings"
                    className="w-full btn-outline flex items-center justify-center space-x-2"
                  >
                    <Edit className="w-5 h-5" />
                    <span>Edit Profile</span>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Notifications</h2>
            <div className="space-y-4">
              {hostData.notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`border-l-4 rounded-r-lg p-4 ${
                    notification.unread
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium mb-1">
                        {notification.message}
                      </p>
                      <p className="text-sm text-gray-500">{notification.time}</p>
                    </div>
                    {notification.unread && (
                      <span className="ml-4 w-2 h-2 bg-purple-600 rounded-full"></span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HostDashboard;
