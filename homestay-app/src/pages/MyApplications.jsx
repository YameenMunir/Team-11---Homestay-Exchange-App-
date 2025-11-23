import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Clock,
  Calendar,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  MessageSquare,
  Filter
} from 'lucide-react';

export default function MyApplications() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all'); // all, pending, accepted, rejected

  // Mock application data
  const applications = [
    {
      id: 1,
      taskTitle: 'Weekly Grocery Shopping and Light Cleaning',
      hostName: 'Margaret Thompson',
      hostImage: 'https://i.pravatar.cc/150?img=47',
      location: 'Kensington, London',
      appliedDate: '2025-01-15',
      status: 'pending',
      hoursPerWeek: '10-15 hours',
      frequency: 'Weekly',
      message: 'I have experience helping my grandmother with groceries and light housework...'
    },
    {
      id: 2,
      taskTitle: 'Garden Maintenance and Pet Care',
      hostName: 'Robert Chen',
      hostImage: 'https://i.pravatar.cc/150?img=12',
      location: 'Wimbledon, London',
      appliedDate: '2025-01-12',
      status: 'accepted',
      hoursPerWeek: '15-20 hours',
      frequency: 'Bi-weekly',
      message: 'I love working with animals and have experience with garden maintenance...',
      hostResponse: 'Your application looks great! I\'d like to move forward with the facilitation process.'
    },
    {
      id: 3,
      taskTitle: 'Technology Help and Companionship',
      hostName: 'Elizabeth Baker',
      hostImage: 'https://i.pravatar.cc/150?img=45',
      location: 'Richmond, London',
      appliedDate: '2025-01-10',
      status: 'rejected',
      hoursPerWeek: '5-10 hours',
      frequency: 'Weekly',
      message: 'I\'m studying Computer Science and would love to help with technology...',
      hostResponse: 'Thank you for your interest. I\'ve decided to proceed with another candidate whose schedule aligns better with mine.'
    },
    {
      id: 4,
      taskTitle: 'Meal Preparation and Light Cleaning',
      hostName: 'David Wilson',
      hostImage: 'https://i.pravatar.cc/150?img=33',
      location: 'Chelsea, London',
      appliedDate: '2025-01-18',
      status: 'pending',
      hoursPerWeek: '10-15 hours',
      frequency: 'Weekly',
      message: 'I have cooking experience and enjoy preparing healthy meals...'
    }
  ];

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const getStatusBadge = (status) => {
    const configs = {
      pending: {
        icon: AlertCircle,
        color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        label: 'Pending Review'
      },
      accepted: {
        icon: CheckCircle,
        color: 'bg-green-100 text-green-700 border-green-200',
        label: 'Accepted'
      },
      rejected: {
        icon: XCircle,
        color: 'bg-red-100 text-red-700 border-red-200',
        label: 'Not Selected'
      }
    };

    const config = configs[status];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
        <Icon className="w-4 h-4" />
        {config.label}
      </span>
    );
  };

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    rejected: applications.filter(a => a.status === 'rejected').length
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900">
            My Applications
          </h1>
          <p className="mt-2 text-gray-600">
            Track all your task applications in one place
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Accepted</p>
                <p className="text-2xl font-bold text-gray-900">{stats.accepted}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Not Selected</p>
                <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All Applications ({stats.total})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Pending ({stats.pending})
          </button>
          <button
            onClick={() => setFilter('accepted')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'accepted'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Accepted ({stats.accepted})
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'rejected'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Not Selected ({stats.rejected})
          </button>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div className="card text-center py-12">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No applications found
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all'
                ? "You haven't applied to any tasks yet"
                : `You don't have any ${filter} applications`
              }
            </p>
            {filter === 'all' && (
              <button
                onClick={() => navigate('/student/browse-tasks')}
                className="btn-primary"
              >
                Browse Available Tasks
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <div key={application.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Host Info */}
                  <div className="flex items-start gap-4 lg:w-1/3">
                    <img
                      src={application.hostImage}
                      alt={application.hostName}
                      className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {application.taskTitle}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">{application.hostName}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {application.location}
                      </p>
                    </div>
                  </div>

                  {/* Application Details */}
                  <div className="lg:w-2/3">
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      {getStatusBadge(application.status)}
                      <span className="text-sm text-gray-500">
                        Applied {new Date(application.appliedDate).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        {application.hoursPerWeek}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {application.frequency}
                      </div>
                    </div>

                    {/* Your Application Message */}
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <p className="text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        Your Message:
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {application.message}
                      </p>
                    </div>

                    {/* Host Response (if any) */}
                    {application.hostResponse && (
                      <div className={`rounded-lg p-3 mb-3 ${
                        application.status === 'accepted'
                          ? 'bg-green-50 border border-green-200'
                          : 'bg-red-50 border border-red-200'
                      }`}>
                        <p className="text-xs font-medium mb-1 flex items-center gap-1 ${
                          application.status === 'accepted' ? 'text-green-700' : 'text-red-700'
                        }">
                          <MessageSquare className="w-3 h-3" />
                          Host Response:
                        </p>
                        <p className={`text-sm ${
                          application.status === 'accepted' ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {application.hostResponse}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/student/browse-tasks/${application.id}`)}
                        className="btn-outline flex items-center gap-2 text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        View Task
                      </button>
                      {application.status === 'accepted' && (
                        <button
                          onClick={() => navigate('/connection-requests')}
                          className="btn-primary text-sm"
                        >
                          View Next Steps
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
