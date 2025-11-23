import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Heart,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  Send,
  CheckCircle
} from 'lucide-react';
import HelpOverlay from '../components/HelpOverlay';

export default function MonthlyReport() {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  const currentMonth = new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  const [formData, setFormData] = useState({
    hoursCompleted: '',
    tasksCompleted: '',
    relationshipQuality: 0,
    wellbeingScore: 0,
    highlights: '',
    challenges: '',
    goalsForNextMonth: '',
    needSupport: false,
    supportDetails: ''
  });

  const [hoveredStar, setHoveredStar] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleStarClick = (category, rating) => {
    setFormData({
      ...formData,
      [category]: rating
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.hoursCompleted || !formData.tasksCompleted) {
      alert('Please provide hours and tasks completed');
      return;
    }

    console.log('Submitting monthly report:', formData);
    // TODO: Submit to backend API
    setShowSuccess(true);
  };

  const StarRating = ({ category, label, value, helpText, icon: Icon }) => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-purple-600" />}
        {label}
        <span className="text-red-500">*</span>
        {helpText && (
          <HelpOverlay position="right">{helpText}</HelpOverlay>
        )}
      </label>
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(category, star)}
            onMouseEnter={() => setHoveredStar({ ...hoveredStar, [category]: star })}
            onMouseLeave={() => setHoveredStar({ ...hoveredStar, [category]: 0 })}
            className="transition-transform hover:scale-110"
          >
            <Heart
              className={`w-8 h-8 ${
                star <= (hoveredStar[category] || value)
                  ? 'fill-red-400 text-red-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {value > 0 ? `${value} / 5` : 'Not rated'}
        </span>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        {value === 1 && '😟 Needs attention'}
        {value === 2 && '😐 Below expectations'}
        {value === 3 && '🙂 Satisfactory'}
        {value === 4 && '😊 Good'}
        {value === 5 && '😄 Excellent'}
      </div>
    </div>
  );

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full card text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Report Submitted Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for completing your monthly check-in. Your report helps us ensure the quality of all arrangements.
          </p>
          {formData.needSupport && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-purple-900">
                A member of our support team will contact you within 24 hours to discuss your concerns.
              </p>
            </div>
          )}
          <button
            onClick={() => navigate('/student/dashboard')}
            className="btn-primary w-full"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900">
            Monthly Check-In Report
          </h1>
          <p className="mt-2 text-gray-600 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Reporting period: {currentMonth}
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-medium mb-1">Why monthly reports?</p>
            <p>
              Regular check-ins help us ensure both students and hosts are happy with their arrangements. This also helps us identify and resolve any issues early.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-8">
          {/* Activity Summary */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Activity Summary
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="hoursCompleted" className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-600" />
                    Hours Completed This Month
                    <span className="text-red-500">*</span>
                  </div>
                </label>
                <input
                  type="number"
                  id="hoursCompleted"
                  name="hoursCompleted"
                  value={formData.hoursCompleted}
                  onChange={handleChange}
                  required
                  min="0"
                  className="input-field"
                  placeholder="e.g., 40"
                />
              </div>

              <div>
                <label htmlFor="tasksCompleted" className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Tasks/Services Completed
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="tasksCompleted"
                  name="tasksCompleted"
                  value={formData.tasksCompleted}
                  onChange={handleChange}
                  required
                  min="0"
                  className="input-field"
                  placeholder="e.g., 15"
                />
              </div>
            </div>
          </div>

          {/* Relationship & Well-being */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Relationship & Well-being
            </h2>

            <StarRating
              category="relationshipQuality"
              label="Relationship with Host/Student"
              value={formData.relationshipQuality}
              helpText="How would you rate your relationship this month?"
              icon={Heart}
            />

            <StarRating
              category="wellbeingScore"
              label="Your Overall Well-being"
              value={formData.wellbeingScore}
              helpText="How are you feeling about the arrangement?"
              icon={TrendingUp}
            />
          </div>

          {/* Qualitative Feedback */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Monthly Reflection
            </h2>

            <div className="mb-6">
              <label htmlFor="highlights" className="block text-sm font-medium text-gray-700 mb-2">
                Highlights & Positive Moments
                <HelpOverlay position="right">
                  Share what went well this month
                </HelpOverlay>
              </label>
              <textarea
                id="highlights"
                name="highlights"
                value={formData.highlights}
                onChange={handleChange}
                rows="4"
                className="input-field resize-none"
                placeholder="What were the best moments or achievements this month?"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="challenges" className="block text-sm font-medium text-gray-700 mb-2">
                Challenges Faced
                <HelpOverlay position="right">
                  Share any difficulties or concerns
                </HelpOverlay>
              </label>
              <textarea
                id="challenges"
                name="challenges"
                value={formData.challenges}
                onChange={handleChange}
                rows="4"
                className="input-field resize-none"
                placeholder="Were there any challenges or issues this month?"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="goalsForNextMonth" className="block text-sm font-medium text-gray-700 mb-2">
                Goals for Next Month
              </label>
              <textarea
                id="goalsForNextMonth"
                name="goalsForNextMonth"
                value={formData.goalsForNextMonth}
                onChange={handleChange}
                rows="3"
                className="input-field resize-none"
                placeholder="What would you like to achieve or improve next month?"
              />
            </div>
          </div>

          {/* Support Request */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Need Support?
            </h2>

            <label className="flex items-start gap-3 cursor-pointer mb-4">
              <input
                type="checkbox"
                name="needSupport"
                checked={formData.needSupport}
                onChange={handleChange}
                className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">
                I would like someone from the Homestay Exchange team to contact me
              </span>
            </label>

            {formData.needSupport && (
              <div>
                <label htmlFor="supportDetails" className="block text-sm font-medium text-gray-700 mb-2">
                  Please briefly describe what you need help with
                </label>
                <textarea
                  id="supportDetails"
                  name="supportDetails"
                  value={formData.supportDetails}
                  onChange={handleChange}
                  rows="3"
                  className="input-field resize-none"
                  placeholder="Let us know how we can support you..."
                />
              </div>
            )}
          </div>

          {/* Privacy Notice */}
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
            <p>
              <strong>Confidential:</strong> Your monthly reports are reviewed by the Homestay Exchange team to monitor arrangement quality. Individual responses are kept confidential and are used to improve our services.
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary flex-1"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
