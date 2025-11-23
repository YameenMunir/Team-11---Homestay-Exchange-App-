import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import HostLogin from './pages/HostLogin';
import HostSignup from './pages/HostSignup';
import StudentLogin from './pages/StudentLogin';
import StudentSignup from './pages/StudentSignup';
import HostDashboard from './pages/HostDashboard';
import StudentDashboard from './pages/StudentDashboard';
import BrowseHosts from './pages/BrowseHosts';
import MatchDetails from './pages/MatchDetails';
import AdminDashboard from './pages/AdminDashboard';
import Help from './pages/Help';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import AntiDiscriminationPolicy from './pages/AntiDiscriminationPolicy';
import DisputeResolution from './pages/DisputeResolution';
import ConnectionRequests from './pages/ConnectionRequests';
import BrowseTasks from './pages/BrowseTasks';
import UserSettings from './pages/UserSettings';
import { UserProvider, useUser } from './context/UserContext';

function AppContent() {
  const { accessibilitySettings } = useUser();

  // Apply accessibility settings to the document
  useEffect(() => {
    const root = document.documentElement;

    // Apply senior mode
    if (accessibilitySettings.seniorMode) {
      root.classList.add('senior-mode');
    } else {
      root.classList.remove('senior-mode');
    }

    // Apply color blind mode filters
    const colorBlindFilters = {
      none: '',
      protanopia: 'url(#protanopia-filter)',
      deuteranopia: 'url(#deuteranopia-filter)',
      tritanopia: 'url(#tritanopia-filter)',
    };

    if (accessibilitySettings.colorBlindMode !== 'none') {
      root.style.filter = colorBlindFilters[accessibilitySettings.colorBlindMode];
    } else {
      root.style.filter = '';
    }
  }, [accessibilitySettings.seniorMode, accessibilitySettings.colorBlindMode]);

  return (
    <Router>
      {/* SVG Filters for Color Blind Modes */}
      <svg style={{ display: 'none' }}>
        <defs>
          {/* Protanopia (Red-Blind) Filter */}
          <filter id="protanopia-filter">
            <feColorMatrix type="matrix" values="
              0.567, 0.433, 0, 0, 0
              0.558, 0.442, 0, 0, 0
              0, 0.242, 0.758, 0, 0
              0, 0, 0, 1, 0" />
          </filter>

          {/* Deuteranopia (Green-Blind) Filter */}
          <filter id="deuteranopia-filter">
            <feColorMatrix type="matrix" values="
              0.625, 0.375, 0, 0, 0
              0.7, 0.3, 0, 0, 0
              0, 0.3, 0.7, 0, 0
              0, 0, 0, 1, 0" />
          </filter>

          {/* Tritanopia (Blue-Blind) Filter */}
          <filter id="tritanopia-filter">
            <feColorMatrix type="matrix" values="
              0.95, 0.05, 0, 0, 0
              0, 0.433, 0.567, 0, 0
              0, 0.475, 0.525, 0, 0
              0, 0, 0, 1, 0" />
          </filter>
        </defs>
      </svg>

      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />

            {/* Host Routes */}
            <Route path="/host/login" element={<HostLogin />} />
            <Route path="/host/signup" element={<HostSignup />} />
            <Route path="/host/dashboard" element={<HostDashboard />} />
            <Route path="/host/settings" element={<UserSettings />} />

            {/* Student Routes */}
            <Route path="/student/login" element={<StudentLogin />} />
            <Route path="/student/signup" element={<StudentSignup />} />
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/browse" element={<BrowseHosts />} />
            <Route path="/student/browse-tasks" element={<BrowseTasks />} />
            <Route path="/student/match/:id" element={<MatchDetails />} />
            <Route path="/student/settings" element={<UserSettings />} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            {/* Help/Support */}
            <Route path="/help" element={<Help />} />

            {/* Connection Requests */}
            <Route path="/connection-requests" element={<ConnectionRequests />} />

            {/* Information Pages */}
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/anti-discrimination" element={<AntiDiscriminationPolicy />} />
            <Route path="/dispute-resolution" element={<DisputeResolution />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;
