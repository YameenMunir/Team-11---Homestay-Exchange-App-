import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContextNew';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(profile?.role)) {
    // Redirect to appropriate dashboard based on their role
    if (profile.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (profile.role === 'host') {
      return <Navigate to="/host" replace />;
    } else if (profile.role === 'guest') {
      return <Navigate to="/guest" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
};
