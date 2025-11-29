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
} from 'lucide-react';

const HostSignup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    postcode: '',
    servicesNeeded: [],
    aboutYou: '',
    idDocument: null,
    utilityBill: null,
    dbsCheck: null,
  });

  const servicesOptions = [
    'Companionship',
    'Light Cleaning',
    'Grocery Shopping',
    'Meal Preparation',
    'Garden Help',
    'Pet Care',
    'Technology Help',
    'Other',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // TODO: Implement signup logic
      console.log('Host signup:', formData);
      navigate('/host/dashboard');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 py-12 px-4">
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
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
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
                    <span className="text-sm mt-2 font-medium text-gray-700">
                      {step === 1 ? 'Personal' : step === 2 ? 'Services' : 'Documents'}
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
          <div className="card p-8 md:p-10 animate-slide-up">
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
                        <Mail className="w-6 h-6 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="input-accessible pl-14"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-lg font-semibold text-gray-900 mb-2"
                    >
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone className="w-6 h-6 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="input-accessible pl-14"
                        placeholder="07XXX XXXXXX"
                      />
                    </div>
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
                        className="input-accessible pl-14"
                        placeholder="Confirm your password"
                      />
                    </div>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {servicesOptions.map((service) => (
                        <button
                          key={service}
                          type="button"
                          onClick={() => toggleService(service)}
                          className={`p-4 rounded-xl border-2 font-medium text-left transition-all ${
                            formData.servicesNeeded.includes(service)
                              ? 'border-purple-600 bg-purple-50 text-purple-900'
                              : 'border-gray-300 bg-white text-gray-700 hover:border-purple-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-lg">{service}</span>
                            {formData.servicesNeeded.includes(service) && (
                              <CheckCircle className="w-6 h-6 text-purple-600" />
                            )}
                          </div>
                        </button>
                      ))}
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
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-6">
                    <div className="flex items-start space-x-3">
                      <FileText className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-purple-900 text-lg mb-2">
                          Required Documents
                        </h4>
                        <p className="text-base text-purple-800 leading-relaxed">
                          For safety and verification, we need the following documents.
                          All information is kept secure and confidential.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-2">
                      ID Document (Passport or Driving License)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition-colors">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <label
                        htmlFor="idDocument"
                        className="cursor-pointer text-base text-gray-600"
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
                        <p className="text-sm text-green-600 mt-2 font-medium">
                          ✓ {formData.idDocument.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-2">
                      Utility Bill (Proof of Address)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition-colors">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <label
                        htmlFor="utilityBill"
                        className="cursor-pointer text-base text-gray-600"
                      >
                        <span className="text-purple-600 font-semibold hover:text-purple-700">
                          Click to upload
                        </span>{' '}
                        or drag and drop
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
                    </div>
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-2">
                      DBS Check (Background Check)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition-colors">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <label
                        htmlFor="dbsCheck"
                        className="cursor-pointer text-base text-gray-600"
                      >
                        <span className="text-purple-600 font-semibold hover:text-purple-700">
                          Click to upload
                        </span>{' '}
                        or drag and drop
                        <input
                          type="file"
                          id="dbsCheck"
                          name="dbsCheck"
                          onChange={handleFileChange}
                          className="hidden"
                          accept="image/*,.pdf"
                        />
                      </label>
                      {formData.dbsCheck && (
                        <p className="text-sm text-green-600 mt-2 font-medium">
                          ✓ {formData.dbsCheck.name}
                        </p>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Don't have a DBS check?{' '}
                      <a href="#" className="text-purple-600 hover:text-purple-700 font-medium">
                        Learn how to get one
                      </a>
                    </p>
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
                  >
                    Previous
                  </button>
                )}
                <button
                  type="submit"
                  className="btn-accessible flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {currentStep === 3 ? 'Complete Registration' : 'Continue'}
                </button>
              </div>
            </form>

            {/* Already have account */}
            <div className="mt-6 text-center">
              <p className="text-base text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/host/login"
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

export default HostSignup;
