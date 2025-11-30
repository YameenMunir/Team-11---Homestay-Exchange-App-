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
  if (!user || user.isVerified) {
    return null;
  }

  const settingsPath = user.userType === 'host' ? '/host/settings' : '/student/settings';

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

  if (user.isVerified) {
    return (
      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
        <CheckCircle className="w-4 h-4 mr-1.5" />
        Verified
      </div>
    );
  }

  return (
    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
      <Clock className="w-4 h-4 mr-1.5" />
      Pending Verification
    </div>
  );
};

export default VerificationStatusBanner;
