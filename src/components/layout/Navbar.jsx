import { Link, useNavigate } from 'react-router-dom';
import { Home, Users, HelpCircle, LogIn, Menu, X, Link2, Settings, User, LogOut, ChevronDown, BookOpen } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import supabase from '../../utils/supabase';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Map userType to route prefix (guest → student, host → host)
  const getRoutePrefix = () => {
    if (!user?.userType) return 'student';
    return user.userType === 'guest' ? 'student' : user.userType;
  };

  const routePrefix = getRoutePrefix();
  const settingsRoute = `/${routePrefix}/settings`;
  const profileRoute = `/${routePrefix}/dashboard`;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Function to get user initials from full name
  const getInitials = (fullName) => {
    if (!fullName) return 'U';
    const names = fullName.trim().split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  // Determine if user is a host for color theming
  const isHost = user?.userType === 'host';
  const avatarGradient = isHost
    ? 'from-orange-600 to-orange-700'
    : 'from-teal-500 to-teal-700';
  const badgeBgColor = isHost ? 'bg-orange-100' : 'bg-teal-100';
  const badgeTextColor = isHost ? 'text-orange-700' : 'text-teal-700';
  const mobileBgColor = isHost ? 'bg-orange-50' : 'bg-teal-50';

  // Handle logout
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
      setIsProfileDropdownOpen(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img
              src="/homestay-logo.jpg"
              alt="Homestay Exchange Logo"
              className="h-12 md:h-16 w-auto object-contain group-hover:scale-105 transition-transform"
            />
            <span className="text-xl md:text-2xl font-display font-bold text-gray-900 hidden sm:inline">
              Homestay Exchange
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-teal-600 font-medium transition-colors flex items-center space-x-2"
              aria-label="Home - Go to homepage"
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>
            {user && (
              <>
                <Link
                  to="/student/browse"
                  className="text-gray-700 hover:text-teal-600 font-medium transition-colors flex items-center space-x-2"
                  aria-label="Browse - Find hosts and accommodation"
                >
                  <Users className="w-5 h-5" />
                  <span>Browse</span>
                </Link>
                <Link
                  to="/connection-requests"
                  className="text-gray-700 hover:text-teal-600 font-medium transition-colors flex items-center space-x-2"
                  aria-label="Requests - View your connection requests"
                >
                  <Link2 className="w-5 h-5" />
                  <span>Requests</span>
                </Link>
              </>
            )}
            <Link
              to="/knowledge-hub"
              className="text-gray-700 hover:text-teal-600 font-medium transition-colors flex items-center space-x-2"
              aria-label="Resources - Access the knowledge hub"
            >
              <BookOpen className="w-5 h-5" />
              <span>Resources</span>
            </Link>
            <Link
              to="/help"
              className="text-gray-700 hover:text-teal-600 font-medium transition-colors flex items-center space-x-2"
              aria-label="Help - Get support and assistance"
            >
              <HelpCircle className="w-5 h-5" />
              <span>Help</span>
            </Link>

            {/* User Profile or Login Buttons */}
            <div className="flex items-center space-x-3 ml-4">
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label="User menu"
                  >
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white font-bold text-sm shadow-md hover:shadow-lg transition-shadow`}>
                      {getInitials(user.fullName)}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-fade-in">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-900">{user.fullName}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${badgeBgColor} ${badgeTextColor} capitalize`}>
                          {user.userType}
                        </span>
                      </div>

                      <Link
                        to={profileRoute}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        aria-label="My Profile - View your dashboard"
                      >
                        <User className="w-4 h-4" />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        to={settingsRoute}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        aria-label="Settings - Manage your account and preferences"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>

                      <div className="border-t border-gray-200 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                          aria-label="Logout - Sign out of your account"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/host/login" className="px-6 py-3 bg-transparent border-2 border-orange-500 text-orange-500 font-medium rounded-lg hover:bg-orange-50 active:bg-orange-100 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-orange-300 text-sm" aria-label="I'm a Host - Login or register as a host">
                    I'm a Host
                  </Link>
                  <Link to="/student/login" className="btn-primary text-sm" aria-label="I'm a Student - Login or register as a student">
                    I'm a Student
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-fade-in">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={toggleMenu}
                aria-label="Home - Go to homepage"
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">Home</span>
              </Link>
              {user && (
                <>
                  <Link
                    to="/student/browse"
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={toggleMenu}
                    aria-label="Browse - Find hosts and accommodation"
                  >
                    <Users className="w-5 h-5" />
                    <span className="font-medium">Browse</span>
                  </Link>
                  <Link
                    to="/connection-requests"
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={toggleMenu}
                    aria-label="Connection Requests - View your connection requests"
                  >
                    <Link2 className="w-5 h-5" />
                    <span className="font-medium">Connection Requests</span>
                  </Link>
                </>
              )}
              <Link
                to="/knowledge-hub"
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={toggleMenu}
                aria-label="Resources - Access the knowledge hub"
              >
                <BookOpen className="w-5 h-5" />
                <span className="font-medium">Resources</span>
              </Link>
              <Link
                to="/help"
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={toggleMenu}
                aria-label="Help - Get support and assistance"
              >
                <HelpCircle className="w-5 h-5" />
                <span className="font-medium">Help</span>
              </Link>

              <div className="pt-3 border-t border-gray-200 space-y-2">
                {user ? (
                  <>
                    {/* User Info Section */}
                    <div className={`px-4 py-3 ${mobileBgColor} rounded-lg`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white font-bold shadow-md`}>
                          {getInitials(user.fullName)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">{user.fullName}</p>
                          <p className="text-xs text-gray-600 truncate">{user.email}</p>
                          <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${badgeBgColor} ${badgeTextColor} capitalize`}>
                            {user.userType}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Link
                      to={profileRoute}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={toggleMenu}
                      aria-label="My Profile - View your dashboard"
                    >
                      <User className="w-5 h-5" />
                      <span className="font-medium">My Profile</span>
                    </Link>

                    <Link
                      to={settingsRoute}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={toggleMenu}
                      aria-label="Settings - Manage your account and preferences"
                    >
                      <Settings className="w-5 h-5" />
                      <span className="font-medium">Settings</span>
                    </Link>

                    <button
                      onClick={() => {
                        handleLogout();
                        toggleMenu();
                      }}
                      className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
                      aria-label="Logout - Sign out of your account"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/host/login"
                      className="block w-full px-6 py-3 bg-transparent border-2 border-orange-500 text-orange-500 font-medium rounded-lg hover:bg-orange-50 active:bg-orange-100 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-orange-300 text-center"
                      onClick={toggleMenu}
                      aria-label="I'm a Host - Login or register as a host"
                    >
                      I'm a Host
                    </Link>
                    <Link
                      to="/student/login"
                      className="block w-full btn-primary text-center"
                      onClick={toggleMenu}
                      aria-label="I'm a Student - Login or register as a student"
                    >
                      I'm a Student
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
