import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContextNew';
import { useNotifications } from '../../context/NotificationContext';
import { Bell, LogOut, Home } from 'lucide-react';

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  if (!user || !profile) return null;

  const getDashboardLink = () => {
    if (profile.role === 'admin') return '/admin';
    if (profile.role === 'host') return '/host';
    return '/guest';
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={getDashboardLink()} className="flex items-center space-x-2">
              <Home className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Homestay Exchange</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button className="p-2 text-gray-600 hover:text-gray-900 relative">
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>

            {/* User Info */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{profile.full_name}</p>
                <p className="text-xs text-gray-500 capitalize">{profile.role}</p>
              </div>

              {/* Sign Out */}
              <button
                onClick={handleSignOut}
                className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
