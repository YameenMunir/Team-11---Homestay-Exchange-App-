import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Briefcase,
  Clock,
  Calendar,
  MapPin,
  FileText,
  Home,
  CheckCircle,
  ArrowLeft,
  Loader2,
  AlertCircle,
  XCircle
} from 'lucide-react';
import HelpOverlay from '../components/HelpOverlay';
import { hostService } from '../services/hostService';

export default function CreateTask() {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const isEditMode = !!taskId;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    servicesNeeded: [],
    hoursPerWeek: '',
    frequency: '',
    schedule: '',
    duration: '',
    compensation: '',
    requirements: '',
    additionalNotes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [error, setError] = useState(null);

  const serviceCategories = {
    'Household & Daily Assistance': [
      'Light cleaning (dusting, wiping surfaces) and tidying',
      'Sweeping or mopping floors',
      'Dishwashing',
      'Organising shelves or cupboards',
      'Sorting recycling / taking out rubbish',
      'Folding laundry (if agreed)',
      'Organising storage, rooms, or study areas',
      'Helping during small home events',
      'Laundry and ironing',
      'Simple home organization',
      'Watering plants / garden maintenance',
      'Grocery shopping help',
      'Helping with minor house tasks (under host\'s supervision)'
    ],
    'Errands & Outside Assistance': [
      'Light gardening (watering, weeding, raking)',
      'Cleaning driveway, garage or backyard',
      'Seasonal decoration assistance (non-hazardous)',
      'Dog walking or pet feeding',
      'Light cleaning after pets (litter, bowls)',
      'Light gardening or balcony care',
      'Accompanying to local shops, post office, or pharmacy',
      'Helping carry shopping bags or packages',
      'Picking up small household items',
      'Helping with outdoor garden tasks (under host\'s supervision)'
    ],
    'Childcare Assistance': [
      'Babysitting while host is at home (without DBS)',
      'Babysitting while host is not at home (DBS mandatory)',
      'Helping children with homework',
      'Playing or supervising kids in shared spaces',
      'Dropping children at or collecting from a school/nursery (DBS mandatory)'
    ],
    'Practical & Technical Help': [
      'Printing or organising documents',
      'Basic tech support (phone, laptop, apps, video calls)',
      'Setting up a computer or workspace',
      'Simple research tasks',
      'Helping with schedules, reminders, or organising files',
      'Setting up mobile phones, apps, or Wi-Fi',
      'Helping with video calls',
      'Troubleshooting simple tech issues',
      'Assisting with online forms, emails, or digital tasks'
    ],
    'Educational & Mentoring Support': [
      'Tutoring in another language',
      'Tutoring in a skill or discipline',
      'Homework support for grandchildren',
      'Guidance with digital learning tools'
    ]
  };

  const prohibitedActivities = [
    'Heavy lifting or hazardous work',
    'Professional childcare / elderly care',
    'Professional cleaning or deep cleaning',
    'Electrical, plumbing, or repair work',
    'Business administration or accounting tasks',
    'Handling money or sensitive documents',
    'Transporting children alone'
  ];

  // Fetch task data when in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchTask = async () => {
        try {
          setIsLoading(true);
          setError(null);

          const task = await hostService.getTaskById(taskId);

          // Populate form with existing task data
          setFormData({
            title: task.title || '',
            description: task.description || '',
            servicesNeeded: task.services_needed || [],
            hoursPerWeek: task.hours_per_week || '',
            frequency: task.frequency || '',
            schedule: task.schedule || '',
            duration: task.duration || '',
            compensation: task.compensation || '',
            requirements: task.requirements || '',
            additionalNotes: task.additional_notes || ''
          });
        } catch (err) {
          console.error('Error fetching task:', err);
          setError('Failed to load task. Please try again.');
        } finally {
          setIsLoading(false);
        }
      };

      fetchTask();
    }
  }, [isEditMode, taskId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const toggleService = (service) => {
    const currentServices = formData.servicesNeeded;
    if (currentServices.includes(service)) {
      setFormData({
        ...formData,
        servicesNeeded: currentServices.filter(s => s !== service)
      });
    } else {
      setFormData({
        ...formData,
        servicesNeeded: [...currentServices, service]
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (formData.servicesNeeded.length === 0) {
      setError('Please select at least one service');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (isEditMode) {
        // Update existing task
        await hostService.updateTask(taskId, {
          title: formData.title,
          description: formData.description,
          services_needed: formData.servicesNeeded,
          hours_per_week: formData.hoursPerWeek,
          frequency: formData.frequency,
          schedule: formData.schedule,
          duration: formData.duration,
          compensation: formData.compensation,
          requirements: formData.requirements,
          additional_notes: formData.additionalNotes,
        });

        // Navigate back to manage tasks on success
        navigate('/host/manage-tasks', {
          state: { message: 'Task updated successfully!' }
        });
      } else {
        // Create new task
        await hostService.createTask(formData);

        // Navigate to manage tasks on success
        navigate('/host/manage-tasks', {
          state: { message: 'Task posted successfully!' }
        });
      }
    } catch (err) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} task:`, err);
      setError(err.message || `Failed to ${isEditMode ? 'update' : 'create'} task. Please try again.`);
      setIsSubmitting(false);
    }
  };

  // Show loading state while fetching task data in edit mode
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="card p-12 text-center">
            <Loader2 className="w-16 h-16 text-teal-600 mx-auto mb-4 animate-spin" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Loading task...
            </h3>
            <p className="text-gray-600">
              Please wait while we fetch the task details.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-3xl font-display font-bold text-gray-900">
            {isEditMode ? 'Edit Task' : 'Post a New Task'}
          </h1>
          <p className="mt-2 text-gray-600">
            {isEditMode
              ? 'Update your task details and requirements'
              : 'Create a task to find the perfect student helper'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 space-y-8">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Task Details Section */}
          <div className="pb-6 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center justify-center w-10 h-10 bg-teal-100 rounded-lg">
                <Briefcase className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Task Details
              </h2>
            </div>

            <div className="space-y-5">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Task Title
                  <HelpOverlay position="right">
                  </HelpOverlay>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="e.g., Weekly Grocery Shopping and Light Cleaning"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                  <HelpOverlay position="right">
                  </HelpOverlay>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="input-field resize-none"
                  placeholder="Provide a detailed description of the task, what you need help with, and any specific requirements..."
                />
              </div>
            </div>
          </div>

          {/* Services Needed */}
          <div className="pb-6 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-teal-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Services Needed
              </h2>
            </div>
            <p className="text-sm text-gray-600 mb-5">
              Select all services that apply to this task
            </p>

            {/* Prohibited Activities Notice */}
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-900 text-sm mb-1">Important: Prohibited Activities</h4>
                  <p className="text-sm text-red-800 leading-relaxed">
                    When creating a task, please remember that students cannot perform heavy lifting, professional accounting or business administration, electrical or plumbing work, deep or hazardous cleaning, or any task that requires professional licensing.
                  </p>
                  <p className="text-sm text-red-800 leading-relaxed mt-2">
                    Please avoid posting tasks that involve these activities.
                  </p>
                </div>
              </div>
            </div>

            {/* Service Categories */}
            <div className="space-y-6">
              {Object.entries(serviceCategories).map(([category, services]) => (
                <div key={category} className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3 text-base">{category}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {services.map((service) => (
                      <button
                        key={service}
                        type="button"
                        onClick={() => toggleService(service)}
                        className={`p-3 rounded-lg border-2 transition-all text-left text-sm ${
                          formData.servicesNeeded.includes(service)
                            ? 'border-teal-600 bg-teal-50 text-teal-700 shadow-sm'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-teal-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-medium leading-tight">{service}</span>
                          {formData.servicesNeeded.includes(service) && (
                            <CheckCircle className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Prohibited Activities List */}
            <div className="mt-6 bg-gray-100 rounded-xl p-5 border border-gray-300">
              <h3 className="font-semibold text-gray-900 mb-3 text-base flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                Prohibited Activities (Not Allowed)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {prohibitedActivities.map((activity) => (
                  <div
                    key={activity}
                    className="p-3 rounded-lg border-2 border-red-200 bg-red-50 text-red-700 opacity-60 cursor-not-allowed text-sm"
                  >
                    <div className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span className="font-medium leading-tight line-through">{activity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Time Commitment */}
          <div className="pb-6 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center justify-center w-10 h-10 bg-teal-100 rounded-lg">
                <Clock className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Time Commitment
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {/* Hours per Week */}
              <div>
                <label htmlFor="hoursPerWeek" className="block text-sm font-medium text-gray-700 mb-2">
                  Hours per Week
                </label>
                <select
                  id="hoursPerWeek"
                  name="hoursPerWeek"
                  value={formData.hoursPerWeek}
                  onChange={handleChange}
                  required
                  className="input-field"
                >
                  <option value="">Select hours</option>
                  <option value="5-10">5-10 hours</option>
                  <option value="10-15">10-15 hours</option>
                  <option value="15-20">15-20 hours</option>
                  <option value="20+">20+ hours</option>
                </select>
              </div>

              {/* Frequency */}
              <div>
                <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-2">
                  Frequency
                </label>
                <select
                  id="frequency"
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  required
                  className="input-field"
                >
                  <option value="">Select frequency</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="as-needed">As Needed</option>
                </select>
              </div>
            </div>

            {/* Schedule */}
            <div className="mt-5">
              <label htmlFor="schedule" className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Schedule
                <HelpOverlay position="right">
                </HelpOverlay>
              </label>
              <input
                type="text"
                id="schedule"
                name="schedule"
                value={formData.schedule}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., Weekday mornings, Tuesday and Thursday afternoons"
              />
            </div>

            {/* Duration */}
            <div className="mt-5">
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                Expected Duration
              </label>
              <select
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="">Select duration</option>
                <option value="1-3-months">1-3 months</option>
                <option value="3-6-months">3-6 months</option>
                <option value="6-12-months">6-12 months</option>
                <option value="12+-months">12+ months</option>
                <option value="ongoing">Ongoing</option>
              </select>
            </div>
          </div>

          {/* Compensation & Requirements */}
          <div className="pb-6 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center justify-center w-10 h-10 bg-teal-100 rounded-lg">
                <Home className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Compensation & Requirements
              </h2>
            </div>

            {/* Compensation */}
            <div className="mb-5">
              <label htmlFor="compensation" className="block text-sm font-medium text-gray-700 mb-2">
                What You're Offering
                <HelpOverlay position="right">
                </HelpOverlay>
              </label>
              <textarea
                id="compensation"
                name="compensation"
                value={formData.compensation}
                onChange={handleChange}
                required
                rows="3"
                className="input-field resize-none"
                placeholder="e.g., Private room with ensuite bathroom, access to kitchen and living areas, WiFi included..."
              />
            </div>

            {/* Requirements */}
            <div>
              <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
                Requirements
                <HelpOverlay position="right">
                </HelpOverlay>
              </label>
              <textarea
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                rows="3"
                className="input-field resize-none"
                placeholder="e.g., Must have a valid driver's license, non-smoker preferred, comfortable with pets..."
              />
            </div>
          </div>

          {/* Additional Notes */}
          <div className="pb-6">
            <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              id="additionalNotes"
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleChange}
              rows="3"
              className="input-field resize-none"
              placeholder="Any other information applicants should know..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary flex-1 py-3"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 py-3 flex items-center justify-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{isEditMode ? 'Updating Task...' : 'Posting Task...'}</span>
                </>
              ) : (
                isEditMode ? 'Update Task' : 'Post Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
