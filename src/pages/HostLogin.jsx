import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Mail, Lock, Eye, EyeOff, ArrowLeft, AlertCircle } from 'lucide-react';
import { authService } from '../services/authService';
import supabase from '../utils/supabase';
import toast from 'react-hot-toast';

const HostLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { user } = await authService.signIn(formData.email, formData.password);

      // Check user's role from database
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        // Continue with login even if profile fetch fails
        toast.success('Successfully logged in!');
        navigate('/host/dashboard');
        return;
      }

      // Check if user is actually a student trying to log in as host
      if (userProfile.role === 'guest') {
        await authService.signOut();
        setError('This account is registered as a student. Redirecting to student login...');
        toast.error('This account is registered as a student. Please use the student login page.');
        setTimeout(() => {
          navigate('/student/login');
        }, 2000);
        return;
      }

      // Check if user is an admin
      if (userProfile.role === 'admin') {
        await authService.signOut();
        setError('This is an admin account. Redirecting to admin login...');
        toast.error('Please use the admin login page.');
        setTimeout(() => {
          navigate('/admin/login');
        }, 2000);
        return;
      }

      // User is a host, proceed normally
      toast.success('Successfully logged in!');
      navigate('/host/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid email or password. Please try again.');
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      toast.error('Please enter your email address first.');
      return;
    }

    try {
      await authService.resetPassword(formData.email);
      toast.success('Password reset instructions have been sent to your email.');
    } catch (err) {
      console.error('Password reset error:', err);
      toast.error('Failed to send password reset email. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-50 py-12 px-4">
      <div className="container-custom">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8 text-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>

        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="w-20 h-20 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Home className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-3">
              Host Login
            </h1>
            <p className="text-xl text-gray-600">
              Welcome back! Sign in to your account
            </p>
          </div>

          {/* Login Form */}
          <div className="card p-8 md:p-10 animate-slide-up">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
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

              {/* Password Field */}
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
                    placeholder="Enter your password"
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

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  />
                  <span className="text-base text-gray-700">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-base text-teal-600 hover:text-teal-700 font-medium"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn-accessible w-full bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white focus:ring-teal-300"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-base">
                <span className="px-4 bg-white text-gray-500">Don't have an account?</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <Link
              to="/host/signup"
              className="block w-full btn-accessible bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-900 text-center"
            >
              Create Host Account
            </Link>
          </div>

          {/* Help Text */}
          <div className="mt-8 text-center">
            <p className="text-lg text-gray-600">
              Need help?{' '}
              <Link to="/help" className="text-teal-600 hover:text-teal-700 font-medium">
                Visit our Help Center
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostLogin;
