import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContextNew';

export default function SignupForm() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [role, setRole] = useState('guest');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone_number: '',
    // Guest specific
    date_of_birth: '',
    university: '',
    course: '',
    year_of_study: '',
    // Host specific
    address: '',
    postcode: '',
    city: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (formData.email !== formData.confirmEmail) {
      setError('Email addresses do not match');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const userData = {
      role,
      full_name: formData.full_name,
      phone_number: formData.phone_number,
      ...(role === 'guest' && {
        date_of_birth: formData.date_of_birth,
        university: formData.university,
        course: formData.course,
        year_of_study: parseInt(formData.year_of_study),
      }),
      ...(role === 'host' && {
        address: formData.address,
        postcode: formData.postcode,
        city: formData.city,
        date_of_birth: formData.date_of_birth,
      }),
    };

    const { data, error: signUpError, needsEmailConfirmation } = await signUp(
      formData.email,
      formData.password,
      userData
    );

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
    } else {
      setSuccess(true);

      if (needsEmailConfirmation) {
        // Email confirmation required
        setNeedsConfirmation(true);
      } else {
        // Auto-signed in, navigate to dashboard
        setTimeout(() => {
          navigate(role === 'guest' ? '/guest' : '/host');
        }, 1500);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        <div>
          <h2 className="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join Homestay Exchange
          </p>
        </div>

        {/* Role Selection */}
        <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            type="button"
            onClick={() => setRole('guest')}
            className={`px-6 py-3 rounded-md font-medium transition-colors text-base sm:text-sm ${
              role === 'guest'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            I'm a Student
          </button>
          <button
            type="button"
            onClick={() => setRole('host')}
            className={`px-6 py-3 rounded-md font-medium transition-colors text-base sm:text-sm ${
              role === 'host'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            I'm a Host
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {success && needsConfirmation && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Account created successfully!
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>
                      Please check your email inbox at <strong>{formData.email}</strong> and click the confirmation link to activate your account.
                    </p>
                    <p className="mt-2">
                      If you don't see the email, check your spam folder.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {success && !needsConfirmation && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Account created successfully!
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>Redirecting to your dashboard...</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Common Fields */}
          <div className="space-y-4">
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <input
                name="full_name"
                id="full_name"
                type="text"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="John Doe"
                value={formData.full_name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email *
              </label>
              <input
                name="email"
                id="email"
                type="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="confirmEmail" className="block text-sm font-medium text-gray-700">
                Confirm Email *
              </label>
              <input
                name="confirmEmail"
                id="confirmEmail"
                type="email"
                required
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  formData.confirmEmail && formData.email !== formData.confirmEmail
                    ? 'border-red-500'
                    : formData.confirmEmail && formData.email === formData.confirmEmail
                    ? 'border-green-500'
                    : 'border-gray-300'
                }`}
                placeholder="Re-enter your email"
                value={formData.confirmEmail}
                onChange={handleChange}
              />
              {formData.confirmEmail && formData.email !== formData.confirmEmail && (
                <p className="mt-1 text-sm text-red-600">Email addresses do not match</p>
              )}
              {formData.confirmEmail && formData.email === formData.confirmEmail && (
                <p className="mt-1 text-sm text-green-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Emails match
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password *
              </label>
              <input
                name="password"
                id="password"
                type="password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Min. 6 characters"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password *
              </label>
              <input
                name="confirmPassword"
                id="confirmPassword"
                type="password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                name="phone_number"
                id="phone_number"
                type="tel"
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="+44 1234 567890"
                value={formData.phone_number}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700">
                Date of Birth *
              </label>
              <input
                name="date_of_birth"
                id="date_of_birth"
                type="date"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.date_of_birth}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Guest Specific Fields */}
          {role === 'guest' && (
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Student Information</h3>

              <div>
                <label htmlFor="university" className="block text-sm font-medium text-gray-700">
                  University *
                </label>
                <input
                  name="university"
                  id="university"
                  type="text"
                  required
                  placeholder="e.g., Trinity College Dublin"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.university}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="course" className="block text-sm font-medium text-gray-700">
                  Course *
                </label>
                <input
                  name="course"
                  id="course"
                  type="text"
                  required
                  placeholder="e.g., Computer Science"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.course}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="year_of_study" className="block text-sm font-medium text-gray-700">
                  Year of Study *
                </label>
                <input
                  name="year_of_study"
                  id="year_of_study"
                  type="number"
                  required
                  min="1"
                  max="7"
                  placeholder="e.g., 1"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.year_of_study}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          {/* Host Specific Fields */}
          {role === 'host' && (
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Property Information</h3>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address *
                </label>
                <input
                  name="address"
                  id="address"
                  type="text"
                  required
                  placeholder="123 Main Street"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City *
                </label>
                <input
                  name="city"
                  id="city"
                  type="text"
                  required
                  placeholder="Dublin"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="postcode" className="block text-sm font-medium text-gray-700">
                  Postcode *
                </label>
                <input
                  name="postcode"
                  id="postcode"
                  type="text"
                  required
                  placeholder="D02 XY12"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.postcode}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 sm:py-2 px-4 border border-transparent text-base sm:text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </button>

          <div className="text-center">
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
