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
  AlertCircle,
  XCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { UK_UNIVERSITIES } from '../utils/ukUniversities';
import supabase from '../utils/supabase';
import PhoneInput from '../components/PhoneInput';
import { validateEmail } from '../utils/validation';

const StudentSignup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showOtherUniversity, setShowOtherUniversity] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    confirmEmail: '',
    phone: '',
    countryCode: '+44', // Add country code field
    dateOfBirth: '',
    password: '',
    confirmPassword: '',
    university: '',
    otherUniversity: '',
    courseOfStudy: '',
    yearOfStudy: '',
    servicesOffered: [],
    aboutYou: '',
    hoursPerWeek: '',
    idDocument: null,
    admissionLetter: null,
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation for Step 1
    if (currentStep === 1) {
      // Validate email format using RFC 5322 compliant validation
      const emailValidation = validateEmail(formData.email);
      if (!emailValidation.isValid) {
        toast.error(emailValidation.error, {
          duration: 4000,
          icon: '📧',
        });
        setEmailError(emailValidation.error);
        return;
      }
      setEmailError('');

      // Check if emails match
      if (formData.email !== formData.confirmEmail) {
        toast.error('Email addresses do not match', {
          duration: 4000,
          icon: '📧',
        });
        return;
      }

      // Check if passwords match
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match', {
          duration: 4000,
          icon: '🔒',
        });
        return;
      }

      // Check password length
      if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters', {
          duration: 4000,
          icon: '🔒',
        });
        return;
      }

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
          toast.error('You must be at least 18 years old to register as a student', {
            duration: 4000,
            icon: '🎂',
          });
          return;
        }
      }
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Step 3: Complete signup
      handleSignup();
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    setError('');

    try {
      // 1. Create auth user with Supabase (trigger will auto-create user_profiles)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: 'guest',
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) throw authError;

      const userId = authData.user.id;

      // 2. Upload documents to storage if provided
      if (formData.idDocument) {
        const idFileName = `${userId}/id-document-${Date.now()}.pdf`;
        const { error: idError } = await supabase.storage
          .from('user-documents')
          .upload(idFileName, formData.idDocument);

        if (idError) {
          console.error('ID upload error:', idError);
        } else {
          // Insert record into user_documents table
          const { error: idDocError } = await supabase
            .from('user_documents')
            .insert({
              user_id: userId,
              document_type: 'government_id',
              file_url: idFileName,
              file_name: formData.idDocument.name,
              file_size: formData.idDocument.size,
              verification_status: 'pending',
            });

          if (idDocError) console.error('ID document record error:', idDocError);
        }
      }

      if (formData.admissionLetter) {
        const admissionFileName = `${userId}/admission-letter-${Date.now()}.pdf`;
        const { error: letterError } = await supabase.storage
          .from('user-documents')
          .upload(admissionFileName, formData.admissionLetter);

        if (letterError) {
          console.error('Admission letter upload error:', letterError);
        } else {
          // Insert record into user_documents table
          const { error: admissionDocError } = await supabase
            .from('user_documents')
            .insert({
              user_id: userId,
              document_type: 'admission_proof',
              file_url: admissionFileName,
              file_name: formData.admissionLetter.name,
              file_size: formData.admissionLetter.size,
              verification_status: 'pending',
            });

          if (admissionDocError) console.error('Admission document record error:', admissionDocError);
        }
      }

      // 3. Update user_profiles with phone number and country code
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          phone_number: formData.phone,
          country_code: formData.countryCode,
        })
        .eq('id', userId);

      if (updateError) console.error('Phone update error:', updateError);

      // 4. Create guest_profiles entry using RPC function (bypasses RLS)
      const universityName = formData.university === 'Other'
        ? formData.otherUniversity
        : formData.university;

      const { error: profileError } = await supabase.rpc('create_guest_profile', {
        p_user_id: userId,
        p_university: universityName,
        p_course: formData.courseOfStudy,
        p_year_of_study: parseInt(formData.yearOfStudy),
        p_date_of_birth: formData.dateOfBirth,
        p_skills: formData.servicesOffered,
        p_bio: formData.aboutYou,
        p_hours_per_week: formData.hoursPerWeek ? parseInt(formData.hoursPerWeek) : null,
      });

      if (profileError) throw profileError;

      // 5. Show success message
      setSuccess(true);
      setLoading(false);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/student/login');
      }, 3000);

    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'An error occurred during signup. Please try again.');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, countryCode: eventCountryCode } = e.target;

    // Handle phone input with country code
    if (name === 'phone' && eventCountryCode) {
      setFormData({
        ...formData,
        phone: value,
        countryCode: eventCountryCode,
      });
      return;
    }

    // Real-time email validation
    if (name === 'email' && value) {
      const emailValidation = validateEmail(value);
      if (!emailValidation.isValid) {
        setEmailError(emailValidation.error);
      } else {
        setEmailError('');
      }
    }

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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-50 py-12 px-4">
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
            <div className="w-20 h-20 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-3">
              Join as a Student
            </h1>
            <p className="text-xl text-gray-600">
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
                          ? 'bg-teal-600 text-white shadow-lg'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {currentStep > step ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        step
                      )}
                    </div>
                    <span className="text-sm mt-2 font-medium text-gray-700">
                      {step === 1 ? 'Personal' : step === 2 ? 'Services' : 'Verification'}
                    </span>
                  </div>
                  {step < 3 && (
                    <div
                      className={`h-1 flex-1 mx-2 transition-all ${
                        currentStep > step ? 'bg-teal-600' : 'bg-gray-200'
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="card p-8 md:p-10 animate-slide-up">
            {/* Success Message */}
            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-5">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-900 mb-1">
                      Registration Successful!
                    </h4>
                    <p className="text-sm text-green-800">
                      Please check your email inbox at <strong>{formData.email}</strong> and click
                      the confirmation link to activate your account. Redirecting to login...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-5">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-900 mb-1">Registration Error</h4>
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Personal & Education Information */}
              {currentStep === 1 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <label
                        htmlFor="fullName"
                        className="block text-lg font-semibold text-gray-900 mb-2"
                      >
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User className="w-6 h-6 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                          className="input-field pl-14"
                          placeholder="Jane Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-lg font-semibold text-gray-900 mb-2"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className={`w-6 h-6 ${emailError ? 'text-red-500' : 'text-gray-400'}`} />
                        </div>
                        <input
                          type="text"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className={`input-field pl-14 ${
                            emailError
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                              : formData.email && !emailError
                              ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                              : ''
                          }`}
                          placeholder="jane@university.ac.uk"
                        />
                      </div>
                      {emailError && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          <span>{emailError}</span>
                        </p>
                      )}
                      {formData.email && !emailError && (
                        <p className="mt-1 text-sm text-green-600 flex items-center">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          <span>Valid email format</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="confirmEmail"
                        className="block text-lg font-semibold text-gray-900 mb-2"
                      >
                        Confirm Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="w-6 h-6 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          id="confirmEmail"
                          name="confirmEmail"
                          value={formData.confirmEmail}
                          onChange={handleChange}
                          required
                          className={`input-field pl-14 ${
                            formData.confirmEmail && formData.email !== formData.confirmEmail
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                              : formData.confirmEmail && formData.email === formData.confirmEmail
                              ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                              : ''
                          }`}
                          placeholder="Re-enter your email"
                        />
                      </div>
                      {formData.confirmEmail && formData.email !== formData.confirmEmail && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <span>Email addresses do not match</span>
                        </p>
                      )}
                      {formData.confirmEmail && formData.email === formData.confirmEmail && (
                        <p className="mt-1 text-sm text-green-600 flex items-center">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          <span>Emails match</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-lg font-semibold text-gray-900 mb-2"
                      >
                        Phone Number
                      </label>
                      <PhoneInput
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="e.g., 7700900123"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label
                        htmlFor="dateOfBirth"
                        className="block text-lg font-semibold text-gray-900 mb-2"
                      >
                        Date of Birth (Must be 18+)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Calendar className="w-6 h-6 text-gray-400" />
                        </div>
                        <input
                          type="date"
                          id="dateOfBirth"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          required
                          max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                          className="input-field pl-14"
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        You must be at least 18 years old to register
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <label
                        htmlFor="university"
                        className="block text-lg font-semibold text-gray-900 mb-2"
                      >
                        University
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                          <Building2 className="w-6 h-6 text-gray-400" />
                        </div>
                        <select
                          id="university"
                          name="university"
                          value={formData.university}
                          onChange={handleChange}
                          required
                          className="input-field pl-14 appearance-none"
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
                          className="block text-lg font-semibold text-gray-900 mb-2"
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
                        className="block text-lg font-semibold text-gray-900 mb-2"
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
                        className="block text-lg font-semibold text-gray-900 mb-2"
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
                        className="block text-lg font-semibold text-gray-900 mb-2"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock className="w-6 h-6 text-gray-400" />
                        </div>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          className="input-field pl-14 pr-14"
                          placeholder="Create a secure password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center"
                        >
                          {showPassword ? (
                            <EyeOff className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                          ) : (
                            <Eye className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-lg font-semibold text-gray-900 mb-2"
                      >
                        Confirm Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock className="w-6 h-6 text-gray-400" />
                        </div>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          className={`input-field pl-14 ${
                            formData.confirmPassword && formData.password !== formData.confirmPassword
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                              : formData.confirmPassword && formData.password === formData.confirmPassword
                              ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                              : ''
                          }`}
                          placeholder="Confirm your password"
                        />
                      </div>
                      {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <span>Passwords do not match</span>
                        </p>
                      )}
                      {formData.confirmPassword && formData.password === formData.confirmPassword && (
                        <p className="mt-1 text-sm text-green-600 flex items-center">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          <span>Passwords match</span>
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Step 2: Services & Availability */}
              {currentStep === 2 && (
                <>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      What services can you offer?
                    </h3>
                    <p className="text-base text-gray-600 mb-6">
                      Select all that apply. Hosts will see these when browsing.
                    </p>

                    {/* Prohibited Activities Notice - Student Version */}
                    <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-green-900 text-sm mb-1">Important for Students</h4>
                          <p className="text-sm text-green-800 leading-relaxed">
                            You will only be matched with safe, light, non-hazardous tasks. You will not be expected to do heavy lifting, professional accounting or admin work, electrical or plumbing tasks, deep cleaning, or any work that requires licensing or certification.
                          </p>
                          <p className="text-sm text-green-800 leading-relaxed mt-2">
                            These activities are prohibited for your safety and protection.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Service Categories */}
                    <div className="space-y-5">
                      {Object.entries(serviceCategories).map(([category, services]) => (
                        <div key={category} className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                          <h4 className="font-semibold text-gray-900 mb-3 text-base">{category}</h4>
                          <div className="grid grid-cols-1 gap-2.5">
                            {services.map((service) => (
                              <button
                                key={service}
                                type="button"
                                onClick={() => toggleService(service)}
                                className={`p-3.5 rounded-lg border-2 font-medium text-left transition-all text-sm ${
                                  formData.servicesOffered.includes(service)
                                    ? 'border-teal-600 bg-teal-50 text-teal-900'
                                    : 'border-gray-300 bg-white text-gray-700 hover:border-teal-300'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <span className="leading-tight">{service}</span>
                                  {formData.servicesOffered.includes(service) && (
                                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0" />
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
                      <h4 className="font-semibold text-gray-900 mb-3 text-base flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-600" />
                        Prohibited Activities (Not Required)
                      </h4>
                      <div className="grid grid-cols-1 gap-2.5">
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

                  <div>
                    <label
                      htmlFor="hoursPerWeek"
                      className="block text-lg font-semibold text-gray-900 mb-2"
                    >
                      Hours Available Per Week
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
                      <option value="5">5 hours</option>
                      <option value="10">10 hours</option>
                      <option value="15">15 hours</option>
                      <option value="20">20 hours</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="aboutYou"
                      className="block text-lg font-semibold text-gray-900 mb-2"
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
                  <div className="bg-teal-50 border border-teal-200 rounded-xl p-6 mb-6">
                    <div className="flex items-start space-x-3">
                      <FileText className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-teal-900 text-lg mb-2">
                          Verification Required
                        </h4>
                        <p className="text-base text-teal-800 leading-relaxed">
                          To ensure safety for all users, we need to verify your identity
                          and student status. All documents are kept secure.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-2">
                      ID Document (Passport or Driving License)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-teal-400 transition-colors">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <label
                        htmlFor="idDocument"
                        className="cursor-pointer text-base text-gray-600"
                      >
                        <span className="text-teal-600 font-semibold hover:text-teal-700">
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
                        <p className="text-sm text-green-600 mt-2 font-medium">
                          ✓ {formData.idDocument.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-2">
                      University Admission Letter
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-teal-400 transition-colors">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <label
                        htmlFor="admissionLetter"
                        className="cursor-pointer text-base text-gray-600"
                      >
                        <span className="text-teal-600 font-semibold hover:text-teal-700">
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
                        <p className="text-sm text-green-600 mt-2 font-medium">
                          ✓ {formData.admissionLetter.name}
                        </p>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Your offer letter or student ID card showing current enrollment
                    </p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-green-900 text-lg mb-2">
                          Almost There!
                        </h4>
                        <p className="text-base text-green-800">
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
                    disabled={loading}
                  >
                    Previous
                  </button>
                )}
                <button
                  type="submit"
                  className="btn-primary flex-1"
                  disabled={loading || success}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : currentStep === 3 ? 'Complete Registration' : 'Continue'}
                </button>
              </div>
            </form>

            {/* Already have account */}
            <div className="mt-5 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/student/login"
                  className="text-teal-600 hover:text-teal-700 font-medium"
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
