import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Clock,
  Calendar,
  MapPin,
  FileText,
  Home,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import HelpOverlay from '../components/HelpOverlay';

export default function CreateTask() {
  const navigate = useNavigate();
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

  const servicesOptions = [
    'Companionship',
    'Light Cleaning',
    'Grocery Shopping',
    'Meal Preparation',
    'Garden Help',
    'Pet Care',
    'Technology Help'
  ];

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Creating task:', formData);
    // TODO: Submit to backend API
    navigate('/host/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-3xl font-display font-bold text-gray-900">
            Post a New Task
          </h1>
          <p className="mt-2 text-gray-600">
            Create a task to find the perfect student helper
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card space-y-8">
          {/* Task Details Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-purple-600" />
              Task Details
            </h2>

            <div className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Task Title
                  <HelpOverlay position="right">
                    Give your task a clear, descriptive title (e.g., "Weekly Grocery Shopping Help")
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
                    Describe what the task involves and your expectations
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
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-purple-600" />
              Services Needed
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Select all services that apply to this task
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {servicesOptions.map((service) => (
                <button
                  key={service}
                  type="button"
                  onClick={() => toggleService(service)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.servicesNeeded.includes(service)
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{service}</span>
                    {formData.servicesNeeded.includes(service) && (
                      <CheckCircle className="w-4 h-4 text-purple-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Time Commitment */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              Time Commitment
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
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
            <div className="mt-6">
              <label htmlFor="schedule" className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Schedule
                <HelpOverlay position="right">
                  Specify days and times that work best for you
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
            <div className="mt-6">
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
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Home className="w-5 h-5 text-purple-600" />
              Compensation & Requirements
            </h2>

            {/* Compensation */}
            <div className="mb-6">
              <label htmlFor="compensation" className="block text-sm font-medium text-gray-700 mb-2">
                What You're Offering
                <HelpOverlay position="right">
                  Describe the accommodation and any additional benefits
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
                  List any specific skills, qualifications, or characteristics needed
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
          <div>
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
              Post Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
