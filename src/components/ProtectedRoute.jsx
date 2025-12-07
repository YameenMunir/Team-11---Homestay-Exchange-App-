import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Loader2 } from 'lucide-react';

/**
 * Protected route component for role-based access control
 * Ensures hosts can only access host routes and students can only access student routes
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The component to render if authorized
 * @param {string} props.requiredRole - The role required to access this route ('host' or 'guest')
 * @param {string} props.redirectTo - Optional redirect path for unauthorized users
 */
const ProtectedRoute = ({ children, requiredRole, redirectTo = null }) => {
  const { user, loading } = useUser();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, redirect to appropriate login page
  if (!user) {
    const loginPath = requiredRole === 'host' ? '/host/login' : '/student/login';
    return <Navigate to={loginPath} replace />;
  }

  // Check if user's role matches the required role (only if a role is specified)
  if (requiredRole && user.userType !== requiredRole) {
    // Determine appropriate redirect based on user's actual role
    const defaultRedirect = user.userType === 'host'
      ? '/host/dashboard'
      : '/student/dashboard';

    const redirectPath = redirectTo || defaultRedirect;

    // Show access denied message
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="card max-w-md w-full text-center p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. This section is only available for{' '}
            <strong>{requiredRole === 'host' ? 'hosts' : 'students'}</strong>.
          </p>
          <div className="space-y-3">
            <Navigate to={redirectPath} replace />
            <button
              onClick={() => window.location.href = redirectPath}
              className="btn-primary w-full"
            >
              Go to Your Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If all checks pass, render the protected component
  return children;
};

export default ProtectedRoute;
