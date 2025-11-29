import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  FileText,
  Award,
  Clock,
  Calendar,
  CheckCircle,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import HelpOverlay from '../components/HelpOverlay';

export default function TaskApplication() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    availability: '',
    relevantExperience: '',
    whyInterested: '',
    additionalInfo: '',
    confirmCommitment: false
  });

  // Mock task data - would normally fetch from API
  useEffect(() => {
    // Simulate API call
    const mockTask = {
      id: taskId,
      title: 'Weekly Grocery Shopping and Light Cleaning',
      hostName: 'Margaret Thompson',
      hostImage: 'https://i.pravatar.cc/150?img=47',
      location: 'Kensington, London',
      hoursPerWeek: '10-15 hours',
      frequency: 'Weekly',
      servicesNeeded: ['Grocery Shopping', 'Light Cleaning'],
      compensation: 'Private room with ensuite bathroom, meals included',
      requirements: 'Must have a valid driver\'s license, non-smoker preferred'
    };
    setTask(mockTask);
  }, [taskId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.confirmCommitment) {
      alert('Please confirm your commitment to this arrangement');
      return;
    }

    console.log('Application submitted:', {
      taskId,
      ...formData
    });

    // TODO: Submit to backend API
    setShowSuccess(true);
  };

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading task details...</p>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full card text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Application Submitted!
          </h2>
          <p className="text-gray-600 mb-6">
            Your application has been sent to {task.hostName}. You'll be notified when the host reviews your application.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/student/browse-tasks')}
              className="btn-primary w-full"
            >
              Browse More Tasks
            </button>
            <button
              onClick={() => navigate('/student/dashboard')}
              className="btn-secondary w-full"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Task
          </button>
          <h1 className="text-3xl font-display font-bold text-gray-900">
            Apply for Task
          </h1>
          <p className="mt-2 text-gray-600">
            Complete this application to express your interest
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Task Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Task Summary</h3>

              {/* Host Info */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                <img
                  src={task.hostImage}
                  alt={task.hostName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-gray-900">{task.hostName}</p>
                  <p className="text-sm text-gray-600">{task.location}</p>
                </div>
              </div>

              {/* Task Title */}
              <h4 className="font-medium text-gray-900 mb-4">{task.title}</h4>

              {/* Key Details */}
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-600">Time Commitment</p>
                    <p className="font-medium text-gray-900">{task.hoursPerWeek}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-600">Frequency</p>
                    <p className="font-medium text-gray-900">{task.frequency}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Award className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-600">Services Needed</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {task.servicesNeeded.map(service => (
                        <span key={service} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Application Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="card space-y-8">
              {/* Info Banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900 mb-1">Application Process</p>
                  <p className="text-blue-700">
                    Your application will be reviewed by the host. If selected, the Homestay Exchange facilitation team will coordinate the next steps.
                  </p>
                </div>
              </div>

              {/* Availability */}
              <div>
                <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Availability
                  <span className="text-red-500">*</span>
                  <HelpOverlay position="right">
                    Specify when you're available to start and your weekly schedule
                  </HelpOverlay>
                </label>
                <textarea
                  id="availability"
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="input-field resize-none"
                  placeholder="e.g., Available to start from March 1st. Free on weekday mornings and Tuesday/Thursday afternoons..."
                />
              </div>

              {/* Relevant Experience */}
              <div>
                <label htmlFor="relevantExperience" className="block text-sm font-medium text-gray-700 mb-2">
                  Relevant Experience
                  <span className="text-red-500">*</span>
                  <HelpOverlay position="right">
                    Describe any experience you have with the services this task requires
                  </HelpOverlay>
                </label>
                <textarea
                  id="relevantExperience"
                  name="relevantExperience"
                  value={formData.relevantExperience}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="input-field resize-none"
                  placeholder="Describe your experience with the required services (e.g., grocery shopping, cleaning, companionship, etc.)..."
                />
              </div>

              {/* Why Interested */}
              <div>
                <label htmlFor="whyInterested" className="block text-sm font-medium text-gray-700 mb-2">
                  Why Are You Interested?
                  <span className="text-red-500">*</span>
                  <HelpOverlay position="right">
                    Explain why you're a good match for this opportunity
                  </HelpOverlay>
                </label>
                <textarea
                  id="whyInterested"
                  name="whyInterested"
                  value={formData.whyInterested}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="input-field resize-none"
                  placeholder="Tell the host why you're interested in this arrangement and what makes you a good fit..."
                />
              </div>

              {/* Additional Information */}
              <div>
                <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Information (Optional)
                  <HelpOverlay position="right">
                    Share anything else that might be relevant to your application
                  </HelpOverlay>
                </label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  rows="3"
                  className="input-field resize-none"
                  placeholder="Any other information you'd like to share..."
                />
              </div>

              {/* Commitment Confirmation */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="confirmCommitment"
                    checked={formData.confirmCommitment}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    required
                  />
                  <span className="text-sm text-gray-700">
                    I confirm that I can commit to the time requirements ({task.hoursPerWeek}, {task.frequency}) and understand that this is a barter arrangement where I provide services in exchange for accommodation.
                  </span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
