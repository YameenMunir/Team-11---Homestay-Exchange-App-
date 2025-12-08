import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { AlertCircle, Clock, CheckCircle, FileText, XCircle } from 'lucide-react';

/**
 * Component that requires user to be verified before accessing feature
 * Shows appropriate message and actions based on verification status
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to show if verified
 * @param {string} props.feature - Name of the feature being protected (e.g., "Browse Hosts")
 */
const RequiresVerification = ({ children, feature = "this feature" }) => {
  const { user, loading } = useUser();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // User not logged in (shouldn't happen with ProtectedRoute, but just in case)
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="card max-w-md w-full text-center p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please log in to access {feature}.
          </p>
          <Link to={user?.userType === 'host' ? '/host/login' : '/student/login'} className="btn-primary">
            Log In
          </Link>
        </div>
      </div>
    );
  }

  // User is verified - show the protected content
  if (user.verificationStatus === 'verified') {
    return children;
  }

  const dashboardPath = user.userType === 'host' ? '/host/dashboard' : '/student/dashboard';
  const settingsPath = user.userType === 'host' ? '/host/settings' : '/student/settings';

  // User is REJECTED - show rejection message
  if (user.verificationStatus === 'rejected') {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="container-custom max-w-3xl">
          <div className="card p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Verification Not Approved
              </h1>
              <p className="text-lg text-gray-600">
                Your account verification was not approved
              </p>
            </div>

            {/* Status Info */}
            <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-8">
              <div className="flex items-start">
                <AlertCircle className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-2">
                    Why can't I access {feature}?
                  </h3>
                  <p className="text-red-800 text-sm mb-4">
                    Your verification request was reviewed but not approved at this time.
                    This means you cannot access restricted platform features.
                  </p>
                  <p className="text-red-800 text-sm">
                    If you believe this is an error or would like to appeal this decision,
                    please contact our support team for assistance.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/help"
                className="btn-primary flex-1 text-center"
              >
                Contact Support
              </Link>
              <Link
                to={dashboardPath}
                className="btn-outline flex-1 text-center"
              >
                Back to Dashboard
              </Link>
            </div>

            {/* Contact Info */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                Need more information?{' '}
                <Link to={settingsPath} className="text-teal-600 hover:text-teal-700 font-medium">
                  View Your Account Details
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User is PENDING - show verification pending message
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container-custom max-w-3xl">
        <div className="card p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-yellow-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Account Verification Pending
            </h1>
            <p className="text-lg text-gray-600">
              Your account is currently under review by our admin team
            </p>
          </div>

          {/* Status Info */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-2">
                  Why can't I access {feature}?
                </h3>
                <p className="text-yellow-800 text-sm mb-4">
                  For the safety of our community, all accounts must be verified by an administrator
                  before gaining access to core platform features. This process typically takes 24-48 hours.
                </p>
                <p className="text-yellow-800 text-sm">
                  You'll receive an email notification once your account has been verified.
                </p>
              </div>
            </div>
          </div>

          {/* What You Can Do */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              What You Can Do While Waiting
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <FileText className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Check Your Documents</p>
                  <p className="text-sm text-gray-600">
                    Ensure all required documents have been uploaded correctly
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Complete Your Profile</p>
                  <p className="text-sm text-gray-600">
                    Add additional information to help us verify your account faster
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to={settingsPath}
              className="btn-primary flex-1 text-center"
            >
              View Verification Status
            </Link>
            <Link
              to={dashboardPath}
              className="btn-outline flex-1 text-center"
            >
              Back to Dashboard
            </Link>
          </div>

          {/* Contact Info */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Having issues with verification?{' '}
              <Link to="/help" className="text-teal-600 hover:text-teal-700 font-medium">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequiresVerification;
