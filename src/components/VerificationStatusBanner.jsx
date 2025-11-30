import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useUser } from '../context/UserContext';

/**
 * Banner component that displays user's verification status
 * Shows different messages based on verification state
 */
const VerificationStatusBanner = () => {
  const { user } = useUser();

  // Don't show banner if no user or if user is verified
  if (!user || user.verificationStatus === 'verified') {
    return null;
  }

  const settingsPath = user.userType === 'host' ? '/host/settings' : '/student/settings';
  const helpPath = '/help';

  // Show rejected status
  if (user.verificationStatus === 'rejected') {
    return (
      <div className="mb-6">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg shadow-sm">
          <div className="flex items-start">
            <XCircle className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">
                    Verification Not Approved
                  </h3>
                  <p className="text-sm text-red-800 mb-2">
                    Your account verification was not approved. You cannot access restricted features at this time.
                    Please contact support for more information.
                  </p>
                  <div className="flex items-center space-x-4">
                    <Link
                      to={helpPath}
                      className="text-sm font-medium text-red-900 hover:text-red-800 underline inline-flex items-center"
                    >
                      Contact Support →
                    </Link>
                    <Link
                      to={settingsPath}
                      className="text-sm font-medium text-red-900 hover:text-red-800 underline inline-flex items-center"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show pending status (default)
  return (
    <div className="mb-6">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg shadow-sm">
        <div className="flex items-start">
          <Clock className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-yellow-900 mb-1">
                  Account Verification Pending
                </h3>
                <p className="text-sm text-yellow-800 mb-2">
                  Your account is under review. You'll be notified once verified.
                  Some features are limited until verification is complete.
                </p>
                <Link
                  to={settingsPath}
                  className="text-sm font-medium text-yellow-900 hover:text-yellow-800 underline inline-flex items-center"
                >
                  View Status & Documents →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Compact version for use in sidebars or smaller spaces
 */
export const VerificationStatusBadge = () => {
  const { user } = useUser();

  if (!user) return null;

  // Verified status
  if (user.verificationStatus === 'verified') {
    return (
      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
        <CheckCircle className="w-4 h-4 mr-1.5" />
        Verified
      </div>
    );
  }

  // Rejected status
  if (user.verificationStatus === 'rejected') {
    return (
      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
        <XCircle className="w-4 h-4 mr-1.5" />
        Not Verified
      </div>
    );
  }

  // Pending status (default)
  return (
    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
      <Clock className="w-4 h-4 mr-1.5" />
      Pending Verification
    </div>
  );
};

export default VerificationStatusBanner;
