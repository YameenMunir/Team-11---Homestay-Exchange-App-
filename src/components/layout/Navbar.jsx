import { Link } from 'react-router-dom';
import { Home, Users, HelpCircle, LogIn, Menu, X, Link2, Settings } from 'lucide-react';
import { useState } from 'react';
import { useUser } from '../../context/UserContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();

  // Determine settings route with fallback
  const settingsRoute = user?.userType ? `/${user.userType}/settings` : '/student/settings';

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img
              src="/homestay-logo.jpg"
              alt="Host Family Stay Logo"
              className="h-12 md:h-16 w-auto object-contain group-hover:scale-105 transition-transform"
            />
            <span className="text-xl md:text-2xl font-display font-bold text-gray-900 hidden sm:inline">
              Host Family Stay
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors flex items-center space-x-2"
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>
            <Link
              to="/student/browse"
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors flex items-center space-x-2"
            >
              <Users className="w-5 h-5" />
              <span>Browse</span>
            </Link>
            <Link
              to="/connection-requests"
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors flex items-center space-x-2"
            >
              <Link2 className="w-5 h-5" />
              <span>Requests</span>
            </Link>
            <Link
              to="/help"
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors flex items-center space-x-2"
            >
              <HelpCircle className="w-5 h-5" />
              <span>Help</span>
            </Link>
            <Link
              to={settingsRoute}
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors flex items-center space-x-2"
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </Link>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-3 ml-4">
              <Link to="/host/login" className="btn-outline text-sm">
                I'm a Host
              </Link>
              <Link to="/student/login" className="btn-primary text-sm">
                I'm a Student
              </Link>
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
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">Home</span>
              </Link>
              <Link
                to="/student/browse"
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={toggleMenu}
              >
                <Users className="w-5 h-5" />
                <span className="font-medium">Browse</span>
              </Link>
              <Link
                to="/connection-requests"
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={toggleMenu}
              >
                <Link2 className="w-5 h-5" />
                <span className="font-medium">Connection Requests</span>
              </Link>
              <Link
                to="/help"
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={toggleMenu}
              >
                <HelpCircle className="w-5 h-5" />
                <span className="font-medium">Help</span>
              </Link>
              <Link
                to={settingsRoute}
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={toggleMenu}
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium">Settings</span>
              </Link>

              <div className="pt-3 border-t border-gray-200 space-y-2">
                <Link
                  to="/host/login"
                  className="block w-full btn-outline text-center"
                  onClick={toggleMenu}
                >
                  I'm a Host
                </Link>
                <Link
                  to="/student/login"
                  className="block w-full btn-primary text-center"
                  onClick={toggleMenu}
                >
                  I'm a Student
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
