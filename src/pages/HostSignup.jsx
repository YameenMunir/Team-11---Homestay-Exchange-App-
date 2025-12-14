import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Home,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Upload,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle,
  FileText,
  AlertCircle,
  XCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import supabase from '../utils/supabase';
import PhoneInput from '../components/PhoneInput';
import { validateEmail } from '../utils/validation';

const HostSignup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
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
    password: '',
    confirmPassword: '',
    address: '',
    postcode: '',
    servicesNeeded: [],
    aboutYou: '',
    idDocument: null,
    utilityBill: null,
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
            role: 'host',
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

      if (formData.utilityBill) {
        const billFileName = `${userId}/utility-bill-${Date.now()}.pdf`;
        const { error: billError } = await supabase.storage
          .from('user-documents')
          .upload(billFileName, formData.utilityBill);

        if (billError) {
          console.error('Utility bill upload error:', billError);
        } else {
          // Insert record into user_documents table
          const { error: billDocError } = await supabase
            .from('user_documents')
            .insert({
              user_id: userId,
              document_type: 'proof_of_address',
              file_url: billFileName,
              file_name: formData.utilityBill.name,
              file_size: formData.utilityBill.size,
              verification_status: 'pending',
            });

          if (billDocError) console.error('Utility bill document record error:', billDocError);
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

      // 4. Create host_profiles entry using RPC function (bypasses RLS)
      const { error: profileError } = await supabase.rpc('create_host_profile', {
        p_user_id: userId,
        p_address: formData.address,
        p_city: formData.city || 'Not specified',
        p_postcode: formData.postcode,
        p_additional_info: formData.aboutYou,
      });

      if (profileError) throw profileError;

      // 5. Show success message
      setSuccess(true);
      setLoading(false);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/host/login');
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
    const services = formData.servicesNeeded.includes(service)
      ? formData.servicesNeeded.filter((s) => s !== service)
      : [...formData.servicesNeeded, service];
    setFormData({ ...formData, servicesNeeded: services });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 py-12 px-4">
      <div className="container-custom">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8 text-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>

        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Home className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-3">
              Become a Host
            </h1>
            <p className="text-xl text-gray-600">
              Join our community and get the support you need
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
                          ? 'bg-orange-600 text-white shadow-lg'
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
                      {step === 1 ? 'Personal' : step === 2 ? 'Services' : 'Documents'}
                    </span>
                  </div>
                  {step < 3 && (
                    <div
                      className={`h-1 flex-1 mx-2 transition-all ${
                        currentStep > step ? 'bg-orange-600' : 'bg-gray-200'
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
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <>
                  <div>
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
                        className="input-accessible pl-14"
                        placeholder="John Smith"
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
                        className={`input-accessible pl-14 ${
                          emailError
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : formData.email && !emailError
                            ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                            : ''
                        }`}
                        placeholder="your.email@example.com"
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
                        className={`input-accessible pl-14 ${
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
                      accessible={true}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="address"
                      className="block text-lg font-semibold text-gray-900 mb-2"
                    >
                      Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <MapPin className="w-6 h-6 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className="input-accessible pl-14"
                        placeholder="123 Main Street, London"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="postcode"
                      className="block text-lg font-semibold text-gray-900 mb-2"
                    >
                      Postcode
                    </label>
                    <input
                      type="text"
                      id="postcode"
                      name="postcode"
                      value={formData.postcode}
                      onChange={handleChange}
                      required
                      className="input-accessible"
                      placeholder="SW1A 1AA"
                    />
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
                        className="input-accessible pl-14 pr-14"
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
                        className={`input-accessible pl-14 ${
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
                </>
              )}

              {/* Step 2: Services Needed */}
              {currentStep === 2 && (
                <>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      What kind of help do you need?
                    </h3>
                    <p className="text-base text-gray-600 mb-6">
                      Select all that apply. Students will see these when browsing.
                    </p>

                    {/* Prohibited Activities Notice - Host Version */}
                    <div className="mb-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-amber-900 text-sm mb-1">Important for Hosts</h4>
                          <p className="text-sm text-amber-800 leading-relaxed">
                            Students can only assist with light, non-hazardous tasks. They cannot do heavy lifting, professional accounting or administrative work, electrical or plumbing tasks, deep cleaning, or anything requiring specialist training or certification.
                          </p>
                          <p className="text-sm text-amber-800 leading-relaxed mt-2">
                            Please ensure future tasks respect these limits.
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
                                  formData.servicesNeeded.includes(service)
                                    ? 'border-orange-600 bg-orange-50 text-orange-900'
                                    : 'border-gray-300 bg-white text-gray-700 hover:border-orange-300'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <span className="leading-tight">{service}</span>
                                  {formData.servicesNeeded.includes(service) && (
                                    <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
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
                        Prohibited Activities (Not Allowed)
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
                      htmlFor="aboutYou"
                      className="block text-lg font-semibold text-gray-900 mb-2"
                    >
                      Tell us about yourself
                    </label>
                    <textarea
                      id="aboutYou"
                      name="aboutYou"
                      value={formData.aboutYou}
                      onChange={handleChange}
                      rows="5"
                      className="input-accessible resize-none"
                      placeholder="Share a bit about yourself, your home, and what you're looking for in a student helper..."
                    ></textarea>
                  </div>
                </>
              )}

              {/* Step 3: Document Upload */}
              {currentStep === 3 && (
                <>
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-6">
                    <div className="flex items-start space-x-3">
                      <FileText className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-orange-900 text-lg mb-2">
                          Required Documents
                        </h4>
                        <p className="text-base text-orange-800 leading-relaxed">
                          For safety and verification, we need the following documents.
                          <strong> Both documents are required</strong> before you can create your account.
                          All information is kept secure and confidential.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-2">
                      ID Document (Passport or Driving License) <span className="text-red-500">*</span>
                    </label>
                    <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                      formData.idDocument
                        ? 'border-green-400 bg-green-50'
                        : 'border-gray-300 hover:border-orange-400'
                    }`}>
                      {formData.idDocument ? (
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                      ) : (
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      )}
                      <label
                        htmlFor="idDocument"
                        className="cursor-pointer text-base text-gray-600"
                      >
                        <span className="text-orange-600 font-semibold hover:text-orange-700">
                          {formData.idDocument ? 'Change file' : 'Click to upload'}
                        </span>{' '}
                        {!formData.idDocument && 'or drag and drop'}
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
                      {!formData.idDocument && (
                        <p className="text-sm text-amber-600 mt-2 font-medium flex items-center justify-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          Required document
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-2">
                      Utility Bill (Proof of Address) <span className="text-red-500">*</span>
                    </label>
                    <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                      formData.utilityBill
                        ? 'border-green-400 bg-green-50'
                        : 'border-gray-300 hover:border-orange-400'
                    }`}>
                      {formData.utilityBill ? (
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                      ) : (
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      )}
                      <label
                        htmlFor="utilityBill"
                        className="cursor-pointer text-base text-gray-600"
                      >
                        <span className="text-orange-600 font-semibold hover:text-orange-700">
                          {formData.utilityBill ? 'Change file' : 'Click to upload'}
                        </span>{' '}
                        {!formData.utilityBill && 'or drag and drop'}
                        <input
                          type="file"
                          id="utilityBill"
                          name="utilityBill"
                          onChange={handleFileChange}
                          className="hidden"
                          accept="image/*,.pdf"
                        />
                      </label>
                      {formData.utilityBill && (
                        <p className="text-sm text-green-600 mt-2 font-medium">
                          ✓ {formData.utilityBill.name}
                        </p>
                      )}
                      {!formData.utilityBill && (
                        <p className="text-sm text-amber-600 mt-2 font-medium flex items-center justify-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          Required document
                        </p>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Recent utility bill, bank statement, or council tax bill showing your address
                    </p>
                  </div>

                  {/* Document Upload Progress */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
                    <h4 className="font-semibold text-gray-900 text-sm mb-3">Upload Progress</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">ID Document</span>
                        {formData.idDocument ? (
                          <span className="text-sm text-green-600 font-medium flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1" /> Uploaded
                          </span>
                        ) : (
                          <span className="text-sm text-amber-600 font-medium flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" /> Required
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Utility Bill</span>
                        {formData.utilityBill ? (
                          <span className="text-sm text-green-600 font-medium flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1" /> Uploaded
                          </span>
                        ) : (
                          <span className="text-sm text-amber-600 font-medium flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" /> Required
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-orange-600 h-full transition-all duration-300"
                        style={{
                          width: `${((formData.idDocument ? 1 : 0) + (formData.utilityBill ? 1 : 0)) * 50}%`
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      {formData.idDocument && formData.utilityBill
                        ? 'All documents uploaded! You can now create your account.'
                        : `${(formData.idDocument ? 1 : 0) + (formData.utilityBill ? 1 : 0)} of 2 documents uploaded`}
                    </p>
                  </div>

                  <div className={`border rounded-xl p-6 ${
                    formData.idDocument && formData.utilityBill
                      ? 'bg-green-50 border-green-200'
                      : 'bg-amber-50 border-amber-200'
                  }`}>
                    <div className="flex items-start space-x-3">
                      {formData.idDocument && formData.utilityBill ? (
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                      )}
                      <div>
                        <h4 className={`font-semibold text-lg mb-2 ${
                          formData.idDocument && formData.utilityBill
                            ? 'text-green-900'
                            : 'text-amber-900'
                        }`}>
                          {formData.idDocument && formData.utilityBill
                            ? 'Ready to Submit!'
                            : 'Documents Required'}
                        </h4>
                        <p className={`text-base ${
                          formData.idDocument && formData.utilityBill
                            ? 'text-green-800'
                            : 'text-amber-800'
                        }`}>
                          {formData.idDocument && formData.utilityBill
                            ? 'Once submitted, our team will review your documents within 24-48 hours. You\'ll receive an email notification when approved.'
                            : 'Please upload both required documents above to enable account creation.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 pt-6">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="btn-accessible flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900"
                    disabled={loading}
                  >
                    Previous
                  </button>
                )}
                <button
                  type="submit"
                  className="btn-accessible flex-1 bg-orange-600 hover:bg-orange-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={loading || success || (currentStep === 3 && (!formData.idDocument || !formData.utilityBill))}
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

              {/* Document requirement message on Step 3 */}
              {currentStep === 3 && (!formData.idDocument || !formData.utilityBill) && (
                <p className="text-center text-amber-600 text-sm mt-3 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Please upload both required documents to create your account
                </p>
              )}
            </form>

            {/* Already have account */}
            <div className="mt-6 text-center">
              <p className="text-base text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/host/login"
                  className="text-orange-600 hover:text-orange-700 font-medium"
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

export default HostSignup;
