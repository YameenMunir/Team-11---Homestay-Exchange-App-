import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useVoiceGuidance } from '../hooks/useVoiceGuidance';
import { profileService } from '../services/profileService';
import HelpOverlay from '../components/HelpOverlay';
import {
  User,
  Mail,
  Phone,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  Shield,
  FileText,
  Camera,
  Home,
  Loader,
  Save,
  ArrowLeft,
  Eye,
  Volume2,
  HelpCircle as HelpCircleIcon,
  Zap,
  Palette,
  Info,
} from 'lucide-react';

const UserSettings = () => {
  const navigate = useNavigate();
  const { user, updateUser, accessibilitySettings, updateAccessibilitySettings } = useUser();
  const { speak } = useVoiceGuidance();
  const [activeTab, setActiveTab] = useState('profile');
  const [documents, setDocuments] = useState({
    idDocument: {
      file: null,
      status: 'approved',
      uploadedDate: '2025-01-10',
      reviewedDate: '2025-01-12',
    },
    addressProof: {
      file: null,
      status: 'pending',
      uploadedDate: '2025-01-20',
      reviewedDate: null,
    },
    dbsCheck: {
      file: null,
      status: 'not_uploaded',
      uploadedDate: null,
      reviewedDate: null,
    },
    admissionLetter: {
      file: null,
      status: 'approved',
      uploadedDate: '2025-01-10',
      reviewedDate: '2025-01-11',
    },
  });

  const [profile, setProfile] = useState({
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    university: user.university,
    userType: user.userType,
    hoursPerWeek: user.hoursPerWeek || '',
  });

  const [originalProfile, setOriginalProfile] = useState({
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    university: user.university,
    userType: user.userType,
    hoursPerWeek: user.hoursPerWeek || '',
  });

  // Sync profile with user context on mount or user change
  useEffect(() => {
    setProfile({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      university: user.university,
      userType: user.userType,
      hoursPerWeek: user.hoursPerWeek || '',
    });
    setOriginalProfile({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      university: user.university,
      userType: user.userType,
      hoursPerWeek: user.hoursPerWeek || '',
    });
  }, [user]);

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Accessibility settings save state
  const [accessibilitySaving, setAccessibilitySaving] = useState(false);
  const [accessibilitySaveSuccess, setAccessibilitySaveSuccess] = useState(false);
  const [accessibilitySaveError, setAccessibilitySaveError] = useState(null);

  // Handle accessibility settings update with save feedback
  const handleAccessibilityChange = async (updates) => {
    setAccessibilitySaving(true);
    setAccessibilitySaveError(null);
    setAccessibilitySaveSuccess(false);

    try {
      await updateAccessibilitySettings(updates);
      setAccessibilitySaveSuccess(true);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setAccessibilitySaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving accessibility settings:', error);
      setAccessibilitySaveError('Failed to save settings. Please try again.');

      // Clear error message after 5 seconds
      setTimeout(() => {
        setAccessibilitySaveError(null);
      }, 5000);
    } finally {
      setAccessibilitySaving(false);
    }
  };

  const handleFileUpload = (documentType, file) => {
    setDocuments({
      ...documents,
      [documentType]: {
        file: file,
        status: 'pending',
        uploadedDate: new Date().toISOString().split('T')[0],
        reviewedDate: null,
      },
    });
  };

  const hasProfileChanged = () => {
    return (
      profile.fullName !== originalProfile.fullName ||
      profile.email !== originalProfile.email ||
      profile.phone !== originalProfile.phone ||
      profile.hoursPerWeek !== originalProfile.hoursPerWeek
    );
  };

  const handleSaveChanges = async () => {
    if (!hasProfileChanged()) {
      return;
    }

    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      // For guest/student users, update guest_profiles table with hours_per_week
      if (user.userType === 'guest' || user.userType === 'student') {
        // Get current guest profile to preserve all required fields
        const currentGuestProfile = await profileService.getGuestProfile();

        if (currentGuestProfile) {
          // Update with new hours_per_week while preserving other fields
          await profileService.upsertGuestProfile({
            dateOfBirth: currentGuestProfile.date_of_birth,
            university: currentGuestProfile.university,
            course: currentGuestProfile.course,
            yearOfStudy: currentGuestProfile.year_of_study,
            hoursPerWeek: profile.hoursPerWeek,
            // Preserve other optional fields
            studentId: currentGuestProfile.student_id,
            preferredLocation: currentGuestProfile.preferred_location,
            preferredPostcode: currentGuestProfile.preferred_postcode,
            bio: currentGuestProfile.bio,
            skills: currentGuestProfile.skills,
            availabilityStart: currentGuestProfile.availability_start,
            availabilityEnd: currentGuestProfile.availability_end,
            availableHours: currentGuestProfile.available_hours,
            profilePictureUrl: currentGuestProfile.profile_picture_url,
            emergencyContactName: currentGuestProfile.emergency_contact_name,
            emergencyContactPhone: currentGuestProfile.emergency_contact_phone,
          });
        }
      }

      // Update global user context
      updateUser({
        fullName: profile.fullName,
        email: profile.email,
        phone: profile.phone,
        hoursPerWeek: profile.hoursPerWeek,
      });

      // Update originalProfile to match current profile
      setOriginalProfile({ ...profile });
      setSaveSuccess(true);
      speak('Profile changes saved successfully');

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setSaveError('Failed to save changes. Please try again.');
      speak('Error: Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      approved: {
        icon: CheckCircle,
        text: 'Verified',
        class: 'bg-green-100 text-green-800 border-green-200',
      },
      pending: {
        icon: Clock,
        text: 'Pending Review',
        class: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      },
      rejected: {
        icon: AlertCircle,
        text: 'Rejected',
        class: 'bg-red-100 text-red-800 border-red-200',
      },
      not_uploaded: {
        icon: Upload,
        text: 'Not Uploaded',
        class: 'bg-gray-100 text-gray-800 border-gray-200',
      },
    };

    const badge = badges[status];
    const Icon = badge.icon;

    return (
      <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border text-sm font-medium ${badge.class}`}>
        <Icon className="w-4 h-4" />
        <span>{badge.text}</span>
      </div>
    );
  };

  const DocumentUploadCard = ({ title, description, documentType, icon: Icon, required = true }) => {
    const doc = documents[documentType];

    return (
      <div className="card p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {title}
                {required && <span className="text-red-500 ml-1">*</span>}
              </h3>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          </div>
          <div>
            {getStatusBadge(doc.status)}
          </div>
        </div>

        {doc.status === 'approved' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-green-900 font-medium mb-1">
                  Document Verified
                </p>
                <p className="text-xs text-green-800">
                  Uploaded: {new Date(doc.uploadedDate).toLocaleDateString('en-GB')} •
                  Verified: {new Date(doc.reviewedDate).toLocaleDateString('en-GB')}
                </p>
              </div>
            </div>
          </div>
        )}

        {doc.status === 'pending' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-900 font-medium mb-1">
                  Pending Admin Review
                </p>
                <p className="text-xs text-yellow-800">
                  Uploaded: {new Date(doc.uploadedDate).toLocaleDateString('en-GB')} •
                  Typically reviewed within 24-48 hours
                </p>
              </div>
            </div>
          </div>
        )}

        {doc.status === 'rejected' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-900 font-medium mb-1">
                  Document Rejected
                </p>
                <p className="text-xs text-red-800">
                  Please upload a clearer image or correct document type
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Upload Button */}
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-teal-400 transition-colors">
          <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <label htmlFor={documentType} className="cursor-pointer">
            <span className="text-teal-600 font-semibold hover:text-teal-700">
              {doc.status === 'not_uploaded' ? 'Upload Document' : 'Replace Document'}
            </span>
            <p className="text-xs text-gray-600 mt-1">
              PDF, JPG, or PNG • Max 10MB
            </p>
            <input
              type="file"
              id={documentType}
              onChange={(e) => handleFileUpload(documentType, e.target.files[0])}
              className="hidden"
              accept="image/*,.pdf"
            />
          </label>
          {doc.file && (
            <p className="text-xs text-green-600 mt-2 font-medium">
              ✓ {doc.file.name}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Back Button */}
        <button
          onClick={() => {
            speak('Going back');
            navigate(-1);
          }}
          onFocus={() => speak('Back button')}
          className="flex items-center space-x-2 text-gray-600 hover:text-teal-600 transition-colors mb-6 group"
          aria-label="Go back to previous page"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-3">
            Profile & Settings
          </h1>
          <p className="text-lg text-gray-600">
            Manage your profile and verification documents
          </p>
        </div>

        {/* Verification Status Banner */}
        <div className="card p-6 mb-8 bg-gradient-to-r from-teal-50 to-teal-100 border-2 border-teal-200">
          <div className="flex items-start space-x-4">
            <Shield className="w-12 h-12 text-teal-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-teal-900 mb-2">
                Verification Status
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Photo ID</p>
                  {getStatusBadge(documents.idDocument.status)}
                </div>
                {profile.userType === 'host' && (
                  <>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Address Proof</p>
                      {getStatusBadge(documents.addressProof.status)}
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">DBS Check</p>
                      {getStatusBadge(documents.dbsCheck.status)}
                    </div>
                  </>
                )}
                {profile.userType === 'student' && (
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Admission Letter</p>
                    {getStatusBadge(documents.admissionLetter.status)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => {
                  setActiveTab('profile');
                  speak('Profile Information tab');
                }}
                onFocus={() => speak('Profile Information tab')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'profile'
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                aria-label="Profile Information"
              >
                Profile Information
              </button>
              <button
                onClick={() => {
                  setActiveTab('verification');
                  speak('Verification Documents tab');
                }}
                onFocus={() => speak('Verification Documents tab')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'verification'
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                aria-label="Verification Documents"
              >
                Verification Documents
              </button>
              <button
                onClick={() => {
                  setActiveTab('accessibility');
                  speak('Accessibility Settings tab');
                }}
                onFocus={() => speak('Accessibility Settings tab')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'accessibility'
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                aria-label="Accessibility Settings"
              >
                Accessibility Settings
              </button>
            </nav>
          </div>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="card p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Personal Information
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={profile.fullName}
                      onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      className="input-field pl-11"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="input-field pl-11"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="input-field pl-11"
                    />
                  </div>
                </div>

                {/* Hours Per Week - Only show for guest/student users */}
                {(user.userType === 'guest' || user.userType === 'student') && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Hours Available Per Week
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="w-5 h-5 text-gray-400" />
                      </div>
                      <select
                        value={profile.hoursPerWeek}
                        onChange={(e) => setProfile({ ...profile, hoursPerWeek: e.target.value })}
                        className="input-field pl-11"
                      >
                        <option value="">Select hours</option>
                        <option value="5">5 hours</option>
                        <option value="10">10 hours</option>
                        <option value="15">15 hours</option>
                        <option value="20">20 hours</option>
                        <option value="25">25 hours</option>
                        <option value="30">30 hours</option>
                      </select>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      How many hours per week are you available to help your host family?
                    </p>
                  </div>
                )}

                {/* Success Message */}
                {saveSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <p className="text-sm font-medium text-green-900">
                        Changes saved successfully!
                      </p>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {saveError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <p className="text-sm font-medium text-red-900">
                        {saveError}
                      </p>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    speak('Saving profile changes');
                    handleSaveChanges();
                  }}
                  onFocus={() => speak('Save Changes button')}
                  disabled={!hasProfileChanged() || saving}
                  className={`btn-primary flex items-center justify-center space-x-2 ${
                    (!hasProfileChanged() || saving) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  aria-label="Save profile changes"
                >
                  {saving ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Verification Tab */}
        {activeTab === 'verification' && (
          <div className="space-y-6">
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-6 mb-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 text-teal-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-teal-900 mb-2">
                    Why Verification Matters
                  </h3>
                  <p className="text-sm text-teal-800 leading-relaxed">
                    All documents are reviewed by our admin team to ensure safety and trust in our community. Your information is kept secure and confidential. Verification typically takes 24-48 hours.
                  </p>
                </div>
              </div>
            </div>

            <DocumentUploadCard
              title="Photo ID"
              description="Valid passport or UK driving license"
              documentType="idDocument"
              icon={FileText}
              required={true}
            />

            {profile.userType === 'student' && (
              <DocumentUploadCard
                title="University Admission Letter"
                description="Offer letter or current student ID card"
                documentType="admissionLetter"
                icon={FileText}
                required={true}
              />
            )}

            {profile.userType === 'host' && (
              <>
                <DocumentUploadCard
                  title="Proof of Address"
                  description="Recent utility bill or council tax statement (within 3 months)"
                  documentType="addressProof"
                  icon={Home}
                  required={true}
                />

                <DocumentUploadCard
                  title="DBS Check"
                  description="Valid DBS (Disclosure and Barring Service) certificate"
                  documentType="dbsCheck"
                  icon={Shield}
                  required={true}
                />
              </>
            )}
          </div>
        )}

        {/* Accessibility Tab */}
        {activeTab === 'accessibility' && (
          <div className="space-y-6">
            {/* Header Info */}
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <Eye className="w-6 h-6 text-teal-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-teal-900 mb-2">
                    Make the website easier to use
                  </h3>
                  <p className="text-sm text-teal-800 leading-relaxed">
                    Customize your experience with accessibility features designed to make navigation and interaction more comfortable for everyone.
                  </p>
                </div>
              </div>
            </div>

            {/* Save Status Indicator */}
            {accessibilitySaving && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center space-x-3">
                <Loader className="w-5 h-5 text-blue-600 animate-spin" />
                <span className="text-sm text-blue-800 font-medium">Saving settings...</span>
              </div>
            )}

            {accessibilitySaveSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-800 font-medium">Settings saved successfully!</span>
              </div>
            )}

            {accessibilitySaveError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-sm text-red-800 font-medium">{accessibilitySaveError}</span>
              </div>
            )}

            {/* Senior-Friendly Mode */}
            <HelpOverlay helpText="Increases text size, button size, and spacing to make the interface easier to use">
              <div className="card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        Senior-Friendly Mode
                      </h3>
                      <p className="text-sm text-gray-600">
                        Makes everything larger and easier to see and use. Perfect for older adults or anyone who prefers simpler, clearer interfaces.
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-4">
                    <input
                      type="checkbox"
                      checked={accessibilitySettings.seniorMode}
                      onChange={async (e) => {
                        const isEnabled = e.target.checked;
                        await handleAccessibilityChange({ seniorMode: isEnabled });
                        speak(isEnabled ? 'Senior-Friendly Mode enabled. Text and buttons are now larger.' : 'Senior-Friendly Mode disabled.');
                      }}
                      className="sr-only peer"
                      aria-label="Toggle Senior-Friendly Mode"
                      disabled={accessibilitySaving}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                  </label>
                </div>
              </div>
            </HelpOverlay>

            {/* Voice Guidance */}
            <HelpOverlay helpText="Enables text-to-speech for buttons, labels, and important messages">
              <div className="card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Volume2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        Voice Guidance
                      </h3>
                      <p className="text-sm text-gray-600">
                        Hear important information read aloud. The system will speak button labels, help text, and confirmations.
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-4">
                    <input
                      type="checkbox"
                      checked={accessibilitySettings.voiceGuidance}
                      onChange={async (e) => {
                        const isEnabled = e.target.checked;
                        await handleAccessibilityChange({ voiceGuidance: isEnabled });
                        if (isEnabled) {
                          speak('Voice Guidance enabled. Important information will be read aloud.');
                        }
                      }}
                      className="sr-only peer"
                      aria-label="Toggle Voice Guidance"
                      disabled={accessibilitySaving}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                  </label>
                </div>
              </div>
            </HelpOverlay>

            {/* Help Overlay */}
            <HelpOverlay helpText="Shows blue info icons with helpful tooltips throughout the application">
              <div className="card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <HelpCircleIcon className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        Help Overlay
                      </h3>
                      <p className="text-sm text-gray-600">
                        Show helpful hints and explanations on each page. Small info icons will appear next to features to explain what they do.
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-4">
                    <input
                      type="checkbox"
                      checked={accessibilitySettings.helpOverlay}
                      onChange={async (e) => {
                        const isEnabled = e.target.checked;
                        await handleAccessibilityChange({ helpOverlay: isEnabled });
                        speak(isEnabled ? 'Help Overlay enabled. Helpful hints will appear throughout the application.' : 'Help Overlay disabled.');
                      }}
                      className="sr-only peer"
                      aria-label="Toggle Help Overlay"
                      disabled={accessibilitySaving}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                  </label>
                </div>
              </div>
            </HelpOverlay>

            {/* Color Blind Mode */}
            <HelpOverlay helpText="Applies color filters to help users with different types of color blindness">
              <div className="card p-6">
                <div className="flex items-start space-x-3 mb-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Palette className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Color Blind Mode
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Adjust colors to make the interface more accessible for different types of color vision deficiency.
                    </p>
                    <select
                      value={accessibilitySettings.colorBlindMode}
                      onChange={async (e) => {
                        const value = e.target.value;
                        await handleAccessibilityChange({ colorBlindMode: value });
                        const modeNames = {
                          none: 'No color adjustment',
                          protanopia: 'Protanopia mode for red-blind users',
                          deuteranopia: 'Deuteranopia mode for green-blind users',
                          tritanopia: 'Tritanopia mode for blue-blind users'
                        };
                        speak(`Color Blind Mode set to ${modeNames[value]}`);
                      }}
                      className="input-field w-full md:w-auto"
                      aria-label="Select Color Blind Mode"
                      disabled={accessibilitySaving}
                    >
                      <option value="none">No Color Adjustment</option>
                      <option value="protanopia">Protanopia (Red-Blind)</option>
                      <option value="deuteranopia">Deuteranopia (Green-Blind)</option>
                      <option value="tritanopia">Tritanopia (Blue-Blind)</option>
                    </select>
                  </div>
                </div>
              </div>
            </HelpOverlay>

            {/* Need Help Section */}
            <div className="card p-6 bg-blue-50 border-blue-200">
              <div className="flex items-start space-x-3">
                <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Need Help?
                  </h3>
                  <p className="text-sm text-blue-800 leading-relaxed mb-4">
                    If you need assistance with these settings or using the website, please contact our support team. We're here to help make your experience as easy as possible.
                  </p>
                  <a
                    href="/help"
                    className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    <span>Contact Support</span>
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSettings;
