import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Briefcase,
  Clock,
  Calendar,
  Users,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  User,
  Mail,
  Star,
  Loader2
} from 'lucide-react';
import { hostService } from '../services/hostService';

export default function ManageTasks() {
  const navigate = useNavigate();
  const [selectedTask, setSelectedTask] = useState(null);
  const [showApplicants, setShowApplicants] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch host's tasks from database
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current user
        const { data: { user } } = await hostService.supabase.auth.getUser();

        if (!user) {
          setError('User not authenticated');
          setLoading(false);
          return;
        }

        // Fetch tasks for this host
        const data = await hostService.getTasksByHostId(user.id);
        setTasks(data);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to load tasks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleViewApplicants = (task) => {
    setSelectedTask(task);
    setShowApplicants(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      return;
    }

    try {
      await hostService.deleteTask(taskId);
      // Remove task from local state
      setTasks(tasks.filter(t => t.id !== taskId));
      alert('Task deleted successfully');
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Failed to delete task. Please try again.');
    }
  };

  const handleAcceptApplicant = (taskId, applicantId) => {
    console.log('Accepting applicant:', { taskId, applicantId });
    // TODO: Update backend and navigate to facilitation
    alert('Application accepted! The facilitation team will coordinate next steps.');
  };

  const handleRejectApplicant = (taskId, applicantId) => {
    console.log('Rejecting applicant:', { taskId, applicantId });
    // TODO: Update backend
    alert('Application rejected.');
  };

  const stats = {
    active: tasks.filter(t => t.status === 'active').length,
    filled: tasks.filter(t => t.status === 'filled').length,
    totalApplicants: tasks.reduce((sum, t) => sum + (t.applicant_count || 0), 0)
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="card p-12 text-center">
            <Loader2 className="w-16 h-16 text-purple-600 mx-auto mb-4 animate-spin" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Loading your tasks...
            </h3>
            <p className="text-gray-600">
              Please wait while we fetch your posted tasks.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="card p-12 text-center bg-red-50 border-red-200">
            <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Error Loading Tasks
            </h3>
            <p className="text-red-800 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showApplicants && selectedTask) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => setShowApplicants(false)}
              className="text-purple-600 hover:text-purple-700 mb-4"
            >
              ← Back to My Tasks
            </button>
            <h1 className="text-3xl font-display font-bold text-gray-900">
              Applicants for "{selectedTask.title}"
            </h1>
            <p className="mt-2 text-gray-600">
              {selectedTask.applicants.length} application(s) received
            </p>
          </div>

          {/* Applicants List */}
          {/* Note: Applicant system to be implemented */}
          <div className="card text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Application system coming soon
            </h3>
            <p className="text-gray-600">
              The applicant management feature will be available soon.
            </p>
          </div>
          {false && (
            <div className="space-y-6">
              {selectedTask.applicants.map((applicant) => (
                <div key={applicant.id} className="card">
                  {/* Applicant Header */}
                  <div className="flex items-start gap-4 mb-6 pb-6 border-b">
                    <img
                      src={applicant.image}
                      alt={applicant.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {applicant.name}
                          </h3>
                          <p className="text-sm text-gray-600">{applicant.university}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium text-gray-900">
                              {applicant.rating}
                            </span>
                            <span className="text-sm text-gray-500">rating</span>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          Applied {new Date(applicant.appliedDate).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Application Details */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Availability
                      </h4>
                      <p className="text-gray-600">{applicant.availability}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Relevant Experience
                      </h4>
                      <p className="text-gray-600">{applicant.experience}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Why They're Interested
                      </h4>
                      <p className="text-gray-600">{applicant.whyInterested}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAcceptApplicant(selectedTask.id, applicant.id)}
                      className="btn-primary flex items-center gap-2 flex-1"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Accept & Facilitate
                    </button>
                    <button
                      onClick={() => handleRejectApplicant(selectedTask.id, applicant.id)}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">
              My Posted Tasks
            </h1>
            <p className="mt-2 text-gray-600">
              Manage your task postings and review applications
            </p>
          </div>
          <button
            onClick={() => navigate('/host/create-task')}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Post New Task
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Filled</p>
                <p className="text-2xl font-bold text-gray-900">{stats.filled}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Applicants</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalApplicants}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        {tasks.length === 0 ? (
          <div className="card text-center py-12">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tasks posted yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first task to find student helpers
            </p>
            <button
              onClick={() => navigate('/host/create-task')}
              className="btn-primary"
            >
              Post Your First Task
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Task Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {task.title}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {task.services_needed && task.services_needed.map((service) => (
                            <span
                              key={service}
                              className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        task.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {task.status === 'active' ? 'Active' : 'Filled'}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {task.hours_per_week} hours
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {task.frequency}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {task.applicant_count || 0} applicant{(task.applicant_count || 0) !== 1 ? 's' : ''}
                      </div>
                    </div>

                    <p className="text-sm text-gray-500 mt-2">
                      Posted {new Date(task.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex lg:flex-col gap-2">
                    {task.status === 'active' && (task.applicant_count || 0) > 0 && (
                      <button
                        onClick={() => handleViewApplicants(task)}
                        className="btn-primary flex items-center gap-2 whitespace-nowrap"
                      >
                        <Users className="w-4 h-4" />
                        View Applicants ({task.applicant_count})
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/host/edit-task/${task.id}`)}
                      className="btn-outline flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="btn-secondary flex items-center gap-2 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
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
