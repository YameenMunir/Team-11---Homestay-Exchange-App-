import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserPlus,
  Home,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Upload,
  CheckCircle,
  AlertCircle,
  Save,
  Loader2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { adminService } from '../services/adminService';
import toast from 'react-hot-toast';

const AdminCreateProfile = () => {
  const navigate = useNavigate();
  const { hasPermission, adminUser } = useAdmin();
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdUserEmail, setCreatedUserEmail] = useState('');
  const [passwordSetByAdmin, setPasswordSetByAdmin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const [profileData, setProfileData] = useState({
    // Basic Info
    userType: 'host',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    countryCode: '+44',
    phone: '',
    dateOfBirth: '',

    // Host-specific
    address: '',
    city: '',
    postcode: '',
    propertyType: '',
    bedroomsAvailable: '',
    servicesNeeded: [],

    // Student-specific
    university: '',
    course: '',
    yearOfStudy: '',
    servicesOffered: [],

    // Documents (file uploads would be handled separately)
    documents: {
      idDocument: null,
      addressProof: null,
      dbsCheck: null,
      admissionLetter: null,
    },

    // Notes
    adminNotes: '',
    createdOnBehalf: true,
    needsPasswordReset: true,
  });

  // Debug: Log admin user when it changes
  useEffect(() => {
    console.log('AdminCreateProfile - Admin User State:', adminUser);
    console.log('AdminCreateProfile - Admin User ID:', adminUser?.id);
    console.log('AdminCreateProfile - Is Authenticated:', adminUser?.isAuthenticated);
  }, [adminUser]);

  const servicesOptions = [
    'Companionship',
    'Light Cleaning',
    'Garden Help',
    'Technology Help',
    'Grocery Shopping',
    'Meal Preparation',
    'Pet Care',
    'Home Maintenance',
  ];

  const propertyTypes = [
    'Detached House',
    'Semi-Detached House',
    'Terraced House',
    'Flat/Apartment',
    'Bungalow',
  ];

  const countryCodes = [
    { code: '+44', country: 'GB', flag: '🇬🇧' },
    { code: '+1', country: 'US', flag: '🇺🇸' },
    { code: '+91', country: 'IN', flag: '🇮🇳' },
    { code: '+86', country: 'CN', flag: '🇨🇳' },
    { code: '+81', country: 'JP', flag: '🇯🇵' },
    { code: '+49', country: 'DE', flag: '🇩🇪' },
    { code: '+33', country: 'FR', flag: '🇫🇷' },
    { code: '+39', country: 'IT', flag: '🇮🇹' },
    { code: '+34', country: 'ES', flag: '🇪🇸' },
    { code: '+61', country: 'AU', flag: '🇦🇺' },
    { code: '+7', country: 'RU', flag: '🇷🇺' },
    { code: '+82', country: 'KR', flag: '🇰🇷' },
    { code: '+55', country: 'BR', flag: '🇧🇷' },
    { code: '+27', country: 'ZA', flag: '🇿🇦' },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setProfileData({
      ...profileData,
      [name]: newValue,
    });

    // Check password match in real-time
    if (name === 'password') {
      setPasswordsMatch(profileData.confirmPassword === '' || profileData.confirmPassword === newValue);
    } else if (name === 'confirmPassword') {
      setPasswordsMatch(value === '' || value === profileData.password);
    }
  };

  const handleServiceToggle = (service) => {
    const field = profileData.userType === 'host' ? 'servicesNeeded' : 'servicesOffered';
    const currentServices = profileData[field];

    if (currentServices.includes(service)) {
      setProfileData({
        ...profileData,
        [field]: currentServices.filter((s) => s !== service),
      });
    } else {
      setProfileData({
        ...profileData,
        [field]: [...currentServices, service],
      });
    }
  };

  const handleFileUpload = (documentType, file) => {
    setProfileData({
      ...profileData,
      documents: {
        ...profileData.documents,
        [documentType]: file,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!profileData.fullName || !profileData.email || !profileData.password || !profileData.confirmPassword || !profileData.phone || !profileData.dateOfBirth) {
      toast.error('Please fill in all required fields (including password and date of birth)');
      return;
    }

    // Validate password
    if (profileData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    // Validate password match
    if (profileData.password !== profileData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    // Validate age 18+
    if (profileData.dateOfBirth) {
      const birthDate = new Date(profileData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const finalAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ? age - 1
        : age;

      if (finalAge < 18) {
        toast.error('User must be at least 18 years old');
        return;
      }
    }

    // Role-specific validation
    if (profileData.userType === 'host') {
      if (!profileData.address || !profileData.city || !profileData.postcode) {
        toast.error('Please fill in all required host fields (address, city, postcode)');
        return;
      }
      if (!profileData.servicesNeeded || profileData.servicesNeeded.length === 0) {
        toast.error('Please select at least one service needed');
        return;
      }
    }

    if (profileData.userType === 'student') {
      if (!profileData.university || !profileData.course) {
        toast.error('Please fill in all required student fields (university, course)');
        return;
      }
      if (!profileData.servicesOffered || profileData.servicesOffered.length === 0) {
        toast.error('Please select at least one service offered');
        return;
      }
    }

    // Document validation - ID Document is required for all users
    if (!profileData.documents.idDocument) {
      toast.error('Please upload an ID Document (Passport or Driving License)');
      return;
    }

    // Host-specific document validation
    if (profileData.userType === 'host') {
      if (!profileData.documents.addressProof) {
        toast.error('Please upload Proof of Address for host profile');
        return;
      }
    }

    // Student-specific document validation
    if (profileData.userType === 'student') {
      if (!profileData.documents.admissionLetter) {
        toast.error('Please upload Admission Letter for student profile');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Get the admin user ID
      console.log('Admin User from context:', adminUser);
      const adminUserId = adminUser?.id || null;

      if (!adminUserId) {
        console.error('Admin user ID not found. Current admin user:', adminUser);
        toast.error('Admin user not found. Please log in again.');
        setIsSubmitting(false);
        return;
      }

      console.log('Using admin user ID:', adminUserId);

      // Call the backend service
      console.log('Submitting profile data:', profileData);
      const result = await adminService.createUserProfileOnBehalf(profileData, adminUserId);

      console.log('Backend result:', result);

      if (result.status === 'error') {
        // Display validation or creation errors
        const errorMessage = result.errors && result.errors.length > 0
          ? result.errors.join(', ')
          : result.message;
        toast.error(errorMessage);
        setIsSubmitting(false);
        return;
      }

      // Success!
      console.log('✅ User profile created successfully:', result);
      setCreatedUserEmail(profileData.email);
      setPasswordSetByAdmin(result.user?.password_set_by_admin || false);
      setShowSuccess(true);
      toast.success('User profile created successfully!');

    } catch (error) {
      console.error('❌ Error creating profile:', error);
      toast.error(`Failed to create profile: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (!hasPermission('create_profiles')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="card max-w-md w-full text-center p-8">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to create user profiles.</p>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="card max-w-md w-full text-center p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Profile Created Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            The {profileData.userType === 'student' ? 'student' : profileData.userType} profile for <strong>{profileData.fullName}</strong> has been created.
            {passwordSetByAdmin ? (
              <>
                {' '}The user can now log in with the password you set at <strong>{createdUserEmail || profileData.email}</strong>.
              </>
            ) : (
              <>
                {' '}A welcome email with password reset instructions has been sent to <strong>{createdUserEmail || profileData.email}</strong>.
              </>
            )}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/admin/users')}
              className="btn-primary w-full"
            >
              Go to User Management
            </button>
            <button
              onClick={() => {
                setShowSuccess(false);
                setCurrentStep(1);
                setPasswordSetByAdmin(false);
                setShowPassword(false);
                setShowConfirmPassword(false);
                setPasswordsMatch(true);
                setProfileData({
                  userType: 'host',
                  fullName: '',
                  email: '',
                  password: '',
                  confirmPassword: '',
                  countryCode: '+44',
                  phone: '',
                  dateOfBirth: '',
                  address: '',
                  city: '',
                  postcode: '',
                  propertyType: '',
                  bedroomsAvailable: '',
                  servicesNeeded: [],
                  university: '',
                  course: '',
                  yearOfStudy: '',
                  servicesOffered: [],
                  documents: {
                    idDocument: null,
                    addressProof: null,
                    dbsCheck: null,
                    admissionLetter: null,
                  },
                  adminNotes: '',
                  createdOnBehalf: true,
                  needsPasswordReset: true,
                });
              }}
              className="btn-outline w-full"
            >
              Create Another Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-3">
            Create User Profile
          </h1>
          <p className="text-lg text-gray-600">
            Create a profile on behalf of a less tech-savvy user
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-medium mb-1">Creating profiles on behalf of users</p>
            <p>
              Use this tool to help elderly or less tech-savvy users get started. They will receive
              an email with instructions to set their password and complete their profile.
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${currentStep >= 1 ? 'text-purple-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                currentStep >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <span className="ml-2 font-medium hidden sm:inline">User Type & Basic Info</span>
            </div>
            <div className="flex-1 h-1 mx-4 bg-gray-200">
              <div className={`h-full ${currentStep >= 2 ? 'bg-purple-600' : 'bg-gray-200'}`} style={{ width: currentStep >= 2 ? '100%' : '0%' }}></div>
            </div>
            <div className={`flex items-center ${currentStep >= 2 ? 'text-purple-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                currentStep >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
              <span className="ml-2 font-medium hidden sm:inline">Details & Services</span>
            </div>
            <div className="flex-1 h-1 mx-4 bg-gray-200">
              <div className={`h-full ${currentStep >= 3 ? 'bg-purple-600' : 'bg-gray-200'}`} style={{ width: currentStep >= 3 ? '100%' : '0%' }}></div>
            </div>
            <div className={`flex items-center ${currentStep >= 3 ? 'text-purple-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                currentStep >= 3 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                3
              </div>
              <span className="ml-2 font-medium hidden sm:inline">Documents & Review</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card p-8">
          {/* Step 1: User Type & Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Step 1: User Type & Basic Information
              </h2>

              {/* User Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  User Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setProfileData({ ...profileData, userType: 'host' })}
                    className={`p-6 rounded-lg border-2 transition-all ${
                      profileData.userType === 'host'
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <Home className={`w-8 h-8 mx-auto mb-2 ${
                      profileData.userType === 'host' ? 'text-purple-600' : 'text-gray-400'
                    }`} />
                    <span className={`font-medium ${
                      profileData.userType === 'host' ? 'text-purple-600' : 'text-gray-700'
                    }`}>
                      Host
                    </span>
                    <p className="text-xs text-gray-600 mt-1">Needs help with tasks</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProfileData({ ...profileData, userType: 'student' })}
                    className={`p-6 rounded-lg border-2 transition-all ${
                      profileData.userType === 'student'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <GraduationCap className={`w-8 h-8 mx-auto mb-2 ${
                      profileData.userType === 'student' ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <span className={`font-medium ${
                      profileData.userType === 'student' ? 'text-blue-600' : 'text-gray-700'
                    }`}>
                      Student
                    </span>
                    <p className="text-xs text-gray-600 mt-1">Offers help with tasks</p>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-gray-900 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={profileData.fullName}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., Margaret Thompson"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="email@example.com"
                    required
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  User will receive login instructions at this email
                </p>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={profileData.password}
                    onChange={handleChange}
                    className="input-field pr-10"
                    placeholder="Set a secure password"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Minimum 8 characters. User will use this to log in.
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-900 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={profileData.confirmPassword}
                    onChange={handleChange}
                    className={`input-field pr-10 ${
                      profileData.confirmPassword && !passwordsMatch
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : profileData.confirmPassword && passwordsMatch
                        ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                        : ''
                    }`}
                    placeholder="Re-enter the password"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {profileData.confirmPassword && !passwordsMatch && (
                  <p className="text-xs text-red-600 mt-1 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Passwords do not match
                  </p>
                )}
                {profileData.confirmPassword && passwordsMatch && (
                  <p className="text-xs text-green-600 mt-1 flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Passwords match
                  </p>
                )}
                {!profileData.confirmPassword && (
                  <p className="text-xs text-gray-600 mt-1">
                    Must match the password above
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  {/* Country Code Selector */}
                  <select
                    name="countryCode"
                    value={profileData.countryCode}
                    onChange={handleChange}
                    className="input-field w-28 text-sm"
                  >
                    {countryCodes.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.flag} {item.code}
                      </option>
                    ))}
                  </select>

                  {/* Phone Number Input */}
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleChange}
                      className="input-field pl-10 w-full"
                      placeholder="e.g., 7700900123"
                      required
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Enter phone number without country code
                </p>
              </div>

              {/* Date of Birth */}
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-semibold text-gray-900 mb-2">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={profileData.dateOfBirth}
                  onChange={handleChange}
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                  className="input-field"
                  required
                />
                <p className="text-xs text-gray-600 mt-1">
                  User must be 18 years or older
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Details & Services */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Step 2: {profileData.userType === 'host' ? 'Property' : 'Education'} Details & Services
              </h2>

              {/* Host-specific fields */}
              {profileData.userType === 'host' && (
                <>
                  <div>
                    <label htmlFor="address" className="block text-sm font-semibold text-gray-900 mb-2">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={profileData.address}
                        onChange={handleChange}
                        className="input-field pl-10"
                        placeholder="123 Main Street"
                        required={profileData.userType === 'host'}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-semibold text-gray-900 mb-2">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={profileData.city}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="London"
                        required={profileData.userType === 'host'}
                      />
                    </div>

                    <div>
                      <label htmlFor="postcode" className="block text-sm font-semibold text-gray-900 mb-2">
                        Postcode <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="postcode"
                        name="postcode"
                        value={profileData.postcode}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="SW1A 1AA"
                        required={profileData.userType === 'host'}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="propertyType" className="block text-sm font-semibold text-gray-900 mb-2">
                      Property Type
                    </label>
                    <select
                      id="propertyType"
                      name="propertyType"
                      value={profileData.propertyType}
                      onChange={handleChange}
                      className="input-field"
                    >
                      <option value="">Select property type</option>
                      {propertyTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="bedroomsAvailable" className="block text-sm font-semibold text-gray-900 mb-2">
                      Bedrooms Available
                    </label>
                    <input
                      type="number"
                      id="bedroomsAvailable"
                      name="bedroomsAvailable"
                      value={profileData.bedroomsAvailable}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="1"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Services Needed <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {servicesOptions.map((service) => (
                        <label
                          key={service}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={profileData.servicesNeeded.includes(service)}
                            onChange={() => handleServiceToggle(service)}
                            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                          />
                          <span className="text-sm text-gray-700">{service}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Student-specific fields */}
              {profileData.userType === 'student' && (
                <>
                  <div>
                    <label htmlFor="university" className="block text-sm font-semibold text-gray-900 mb-2">
                      University <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="university"
                      name="university"
                      value={profileData.university}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="e.g., University College London"
                      required={profileData.userType === 'student'}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="course" className="block text-sm font-semibold text-gray-900 mb-2">
                        Course <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="course"
                        name="course"
                        value={profileData.course}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="e.g., Computer Science"
                        required={profileData.userType === 'student'}
                      />
                    </div>

                    <div>
                      <label htmlFor="yearOfStudy" className="block text-sm font-semibold text-gray-900 mb-2">
                        Year of Study <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="yearOfStudy"
                        name="yearOfStudy"
                        value={profileData.yearOfStudy}
                        onChange={handleChange}
                        className="input-field"
                        required={profileData.userType === 'student'}
                      >
                        <option value="">Select year</option>
                        <option value="1">Year 1</option>
                        <option value="2">Year 2</option>
                        <option value="3">Year 3</option>
                        <option value="4">Year 4+</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Services Offered <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {servicesOptions.map((service) => (
                        <label
                          key={service}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={profileData.servicesOffered.includes(service)}
                            onChange={() => handleServiceToggle(service)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{service}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 3: Documents & Review */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Step 3: Documents & Notes
              </h2>

              {/* Document Uploads */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  Upload Verification Documents
                </h3>
                <div className="space-y-4">
                  {/* ID Document */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-purple-400 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          ID Document <span className="text-red-500">*</span>
                        </p>
                        <p className="text-sm text-gray-600">Passport or Driving License</p>
                      </div>
                      <label className="btn-outline cursor-pointer">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload('idDocument', e.target.files[0])}
                        />
                      </label>
                    </div>
                    {profileData.documents.idDocument && (
                      <p className="text-sm text-green-600 mt-2 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        {profileData.documents.idDocument.name}
                      </p>
                    )}
                  </div>

                  {/* Host-specific documents */}
                  {profileData.userType === 'host' && (
                    <>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-purple-400 transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">
                              Proof of Address <span className="text-red-500">*</span>
                            </p>
                            <p className="text-sm text-gray-600">Utility bill or council tax statement</p>
                          </div>
                          <label className="btn-outline cursor-pointer">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload
                            <input
                              type="file"
                              className="hidden"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => handleFileUpload('addressProof', e.target.files[0])}
                            />
                          </label>
                        </div>
                        {profileData.documents.addressProof && (
                          <p className="text-sm text-green-600 mt-2 flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            {profileData.documents.addressProof.name}
                          </p>
                        )}
                      </div>

                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-purple-400 transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">DBS Check</p>
                            <p className="text-sm text-gray-600">Background check certificate</p>
                          </div>
                          <label className="btn-outline cursor-pointer">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload
                            <input
                              type="file"
                              className="hidden"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => handleFileUpload('dbsCheck', e.target.files[0])}
                            />
                          </label>
                        </div>
                        {profileData.documents.dbsCheck && (
                          <p className="text-sm text-green-600 mt-2 flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            {profileData.documents.dbsCheck.name}
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  {/* Student-specific documents */}
                  {profileData.userType === 'student' && (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-purple-400 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            Admission Letter <span className="text-red-500">*</span>
                          </p>
                          <p className="text-sm text-gray-600">University admission or enrollment letter</p>
                        </div>
                        <label className="btn-outline cursor-pointer">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload('admissionLetter', e.target.files[0])}
                          />
                        </label>
                      </div>
                      {profileData.documents.admissionLetter && (
                        <p className="text-sm text-green-600 mt-2 flex items-center">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          {profileData.documents.admissionLetter.name}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <label htmlFor="adminNotes" className="block text-sm font-semibold text-gray-900 mb-2">
                  Admin Notes (Internal Only)
                </label>
                <textarea
                  id="adminNotes"
                  name="adminNotes"
                  value={profileData.adminNotes}
                  onChange={handleChange}
                  rows="4"
                  className="input-field resize-none"
                  placeholder="Add any internal notes about this profile creation (e.g., 'Created by phone request', 'User has limited internet access')"
                />
              </div>

              {/* Review Summary */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Profile Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">User Type:</span>
                    <span className="font-medium capitalize">{profileData.userType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{profileData.fullName || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{profileData.email || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{profileData.phone || 'Not set'}</span>
                  </div>
                  {profileData.userType === 'host' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Address:</span>
                        <span className="font-medium">{profileData.address || 'Not set'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Services Needed:</span>
                        <span className="font-medium">{profileData.servicesNeeded.length} selected</span>
                      </div>
                    </>
                  )}
                  {profileData.userType === 'student' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">University:</span>
                        <span className="font-medium">{profileData.university || 'Not set'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Services Offered:</span>
                        <span className="font-medium">{profileData.servicesOffered.length} selected</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-6 border-t mt-8">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="btn-secondary flex-1"
              >
                Previous
              </button>
            )}
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn-primary flex-1"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex-1 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creating Profile...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Create Profile</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateProfile;
