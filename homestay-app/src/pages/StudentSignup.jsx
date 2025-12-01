import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  Phone,
  Building2,
  Upload,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle,
  FileText,
  Calendar,
} from 'lucide-react';
import { UK_UNIVERSITIES } from '../data/ukUniversities';

const StudentSignup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showOtherUniversity, setShowOtherUniversity] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    password: '',
    confirmPassword: '',
    university: '',
    otherUniversity: '',
    courseOfStudy: '',
    yearOfStudy: '',
    servicesOffered: [],
    aboutYou: '',
    availableHours: '',
    idDocument: null,
    admissionLetter: null,
  });

  const servicesOptions = [
    'Companionship',
    'Light Cleaning',
    'Grocery Shopping',
    'Meal Preparation',
    'Garden Help',
    'Pet Care',
    'Technology Help',
    'Tutoring',
    'Language Exchange',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation for Step 1
    if (currentStep === 1) {
      // Check if user is at least 18 years old
      if (formData.dateOfBirth) {
        const today = new Date();
        const birthDate = new Date(formData.dateOfBirth);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();

        // Adjust age if birthday hasn't occurred this year
        const actualAge = (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) ? age - 1 : age;

        if (actualAge < 18) {
          alert('You must be at least 18 years old to register as a student');
          return;
        }
      }
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // TODO: Implement signup logic
      console.log('Student signup:', formData);
      navigate('/student/dashboard');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Show/hide the "Other" university input
    if (name === 'university') {
      setShowOtherUniversity(value === 'Other');
      if (value !== 'Other') {
        setFormData({
          ...formData,
          university: value,
          otherUniversity: '',
        });
        return;
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      [e.target.name]: file,
    });
  };

  const toggleService = (service) => {
    const services = formData.servicesOffered.includes(service)
      ? formData.servicesOffered.filter((s) => s !== service)
      : [...formData.servicesOffered, service];
    setFormData({ ...formData, servicesOffered: services });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 py-12 px-4">
      <div className="container-custom">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>

        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-3">
              Join as a Student
            </h1>
            <p className="text-lg text-gray-600">
              Find affordable accommodation and make a difference
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-10">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                        currentStep >= step
                          ? 'bg-purple-600 text-white shadow-lg'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {currentStep > step ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        step
                      )}
                    </div>
                    <span className="text-xs sm:text-sm mt-2 font-medium text-gray-700">
                      {step === 1 ? 'Personal' : step === 2 ? 'Services' : 'Verification'}
                    </span>
                  </div>
                  {step < 3 && (
                    <div
                      className={`h-1 flex-1 mx-2 transition-all ${
                        currentStep > step ? 'bg-purple-600' : 'bg-gray-200'
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="card p-6 md:p-8 animate-slide-up">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Step 1: Personal & Education Information */}
              {currentStep === 1 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <label
                        htmlFor="fullName"
                        className="block text-sm font-semibold text-gray-900 mb-2"
                      >
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                          className="input-field pl-11"
                          placeholder="Jane Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-gray-900 mb-2"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="input-field pl-11"
                          placeholder="jane@university.ac.uk"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-semibold text-gray-900 mb-2"
                      >
                        Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="input-field pl-11"
                          placeholder="07XXX XXXXXX"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label
                        htmlFor="dateOfBirth"
                        className="block text-sm font-semibold text-gray-900 mb-2"
                      >
                        Date of Birth (Must be 18+)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type="date"
                          id="dateOfBirth"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          required
                          max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                          className="input-field pl-11"
                        />
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        You must be at least 18 years old to register
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <label
                        htmlFor="university"
                        className="block text-sm font-semibold text-gray-900 mb-2"
                      >
                        University
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                          <Building2 className="w-5 h-5 text-gray-400" />
                        </div>
                        <select
                          id="university"
                          name="university"
                          value={formData.university}
                          onChange={handleChange}
                          required
                          className="input-field pl-11 appearance-none"
                        >
                          <option value="">Select your university</option>
                          {UK_UNIVERSITIES.map((uni) => (
                            <option key={uni} value={uni}>
                              {uni}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Conditional "Other" University Input */}
                    {showOtherUniversity && (
                      <div className="md:col-span-2">
                        <label
                          htmlFor="otherUniversity"
                          className="block text-sm font-semibold text-gray-900 mb-2"
                        >
                          Please specify your university
                        </label>
                        <input
                          type="text"
                          id="otherUniversity"
                          name="otherUniversity"
                          value={formData.otherUniversity}
                          onChange={handleChange}
                          required={showOtherUniversity}
                          className="input-field"
                          placeholder="Enter your university name"
                        />
                      </div>
                    )}

                    <div>
                      <label
                        htmlFor="courseOfStudy"
                        className="block text-sm font-semibold text-gray-900 mb-2"
                      >
                        Course of Study
                      </label>
                      <input
                        type="text"
                        id="courseOfStudy"
                        name="courseOfStudy"
                        value={formData.courseOfStudy}
                        onChange={handleChange}
                        required
                        className="input-field"
                        placeholder="Computer Science"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="yearOfStudy"
                        className="block text-sm font-semibold text-gray-900 mb-2"
                      >
                        Year of Study
                      </label>
                      <select
                        id="yearOfStudy"
                        name="yearOfStudy"
                        value={formData.yearOfStudy}
                        onChange={handleChange}
                        required
                        className="input-field"
                      >
                        <option value="">Select year</option>
                        <option value="1">Year 1</option>
                        <option value="2">Year 2</option>
                        <option value="3">Year 3</option>
                        <option value="4">Year 4</option>
                        <option value="postgrad">Postgraduate</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-semibold text-gray-900 mb-2"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          className="input-field pl-11 pr-11"
                          placeholder="Create a secure password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                          ) : (
                            <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-semibold text-gray-900 mb-2"
                      >
                        Confirm Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          className="input-field pl-11"
                          placeholder="Confirm your password"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Step 2: Services & Availability */}
              {currentStep === 2 && (
                <>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      What services can you offer?
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Select all that apply. Hosts will see these when browsing.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {servicesOptions.map((service) => (
                        <button
                          key={service}
                          type="button"
                          onClick={() => toggleService(service)}
                          className={`p-3 rounded-lg border-2 font-medium text-sm text-center transition-all ${
                            formData.servicesOffered.includes(service)
                              ? 'border-purple-600 bg-purple-50 text-purple-900'
                              : 'border-gray-300 bg-white text-gray-700 hover:border-purple-300'
                          }`}
                        >
                          <div className="flex flex-col items-center space-y-1">
                            <span>{service}</span>
                            {formData.servicesOffered.includes(service) && (
                              <CheckCircle className="w-4 h-4 text-purple-600" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="availableHours"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Hours Available Per Week
                    </label>
                    <select
                      id="availableHours"
                      name="availableHours"
                      value={formData.availableHours}
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

                  <div>
                    <label
                      htmlFor="aboutYou"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      About You
                    </label>
                    <textarea
                      id="aboutYou"
                      name="aboutYou"
                      value={formData.aboutYou}
                      onChange={handleChange}
                      rows="5"
                      className="input-field resize-none"
                      placeholder="Tell hosts about yourself, your interests, and why you'd be a great match..."
                    ></textarea>
                  </div>
                </>
              )}

              {/* Step 3: Verification Documents */}
              {currentStep === 3 && (
                <>
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 mb-5">
                    <div className="flex items-start space-x-3">
                      <FileText className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-purple-900 mb-1">
                          Verification Required
                        </h4>
                        <p className="text-sm text-purple-800 leading-relaxed">
                          To ensure safety for all users, we need to verify your identity
                          and student status. All documents are kept secure.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      ID Document (Passport or Driving License)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-5 text-center hover:border-purple-400 transition-colors">
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                      <label
                        htmlFor="idDocument"
                        className="cursor-pointer text-sm text-gray-600"
                      >
                        <span className="text-purple-600 font-semibold hover:text-purple-700">
                          Click to upload
                        </span>{' '}
                        or drag and drop
                        <input
                          type="file"
                          id="idDocument"
                          name="idDocument"
                          onChange={handleFileChange}
                          className="hidden"
                          accept="image/*,.pdf"
                        />
                      </label>
                      {formData.idDocument && (
                        <p className="text-xs text-green-600 mt-2 font-medium">
                          ✓ {formData.idDocument.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      University Admission Letter
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-5 text-center hover:border-purple-400 transition-colors">
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                      <label
                        htmlFor="admissionLetter"
                        className="cursor-pointer text-sm text-gray-600"
                      >
                        <span className="text-purple-600 font-semibold hover:text-purple-700">
                          Click to upload
                        </span>{' '}
                        or drag and drop
                        <input
                          type="file"
                          id="admissionLetter"
                          name="admissionLetter"
                          onChange={handleFileChange}
                          className="hidden"
                          accept="image/*,.pdf"
                        />
                      </label>
                      {formData.admissionLetter && (
                        <p className="text-xs text-green-600 mt-2 font-medium">
                          ✓ {formData.admissionLetter.name}
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      Your offer letter or student ID card showing current enrollment
                    </p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-green-900 mb-1">
                          Almost There!
                        </h4>
                        <p className="text-sm text-green-800">
                          Once submitted, our team will review your documents within 24-48
                          hours. You'll receive an email notification when approved.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 pt-4">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="btn-secondary flex-1"
                  >
                    Previous
                  </button>
                )}
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  {currentStep === 3 ? 'Complete Registration' : 'Continue'}
                </button>
              </div>
            </form>

            {/* Already have account */}
            <div className="mt-5 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/student/login"
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSignup;
