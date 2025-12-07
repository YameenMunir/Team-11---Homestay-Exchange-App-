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
import SavedHosts from './pages/SavedHosts';
import MatchDetails from './pages/MatchDetails';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminUserManagement from './pages/AdminUserManagement';
import AdminFacilitationRequests from './pages/AdminFacilitationRequests';
import AdminDisputes from './pages/AdminDisputes';
import AdminCreateProfile from './pages/AdminCreateProfile';
import AdminReportsManagement from './pages/AdminReportsManagement';
import AdminFeedbackReview from './pages/AdminFeedbackReview';
import Help from './pages/Help';
import FAQ from './pages/FAQ';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import AntiDiscriminationPolicy from './pages/AntiDiscriminationPolicy';
import DisputeResolution from './pages/DisputeResolution';
import ConnectionRequests from './pages/ConnectionRequests';
import BrowseTasks from './pages/BrowseTasks';
import UserSettings from './pages/UserSettings';
import CreateTask from './pages/CreateTask';
import TaskApplication from './pages/TaskApplication';
import MyApplications from './pages/MyApplications';
import ManageTasks from './pages/ManageTasks';
import RateExperience from './pages/RateExperience';
import MonthlyReport from './pages/MonthlyReport';
import MonthlyFeedbackForm from './pages/MonthlyFeedbackForm';
import FeedbackHistory from './pages/FeedbackHistory';
import RecognitionStatus from './pages/RecognitionStatus';
import KnowledgeHub from './pages/KnowledgeHub';
import LandingPage from './pages/LandingPage';
import ScrollToTop from './components/ScrollToTop';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import ProtectedRoute from './components/ProtectedRoute';
import RequiresVerification from './components/RequiresVerification';
import { UserProvider, useUser } from './context/UserContext';
import { AdminProvider } from './context/AdminContext';
import { VerificationEventsProvider } from './context/VerificationEventsContext';
import AuthProvider from './context/AuthContext';

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
      <ScrollToTop />
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
            <Route
              path="/host/dashboard"
              element={
                <ProtectedRoute requiredRole="host">
                  <HostDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/host/settings"
              element={
                <ProtectedRoute requiredRole="host">
                  <UserSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/host/create-task"
              element={
                <ProtectedRoute requiredRole="host">
                  <RequiresVerification feature="Create Tasks">
                    <CreateTask />
                  </RequiresVerification>
                </ProtectedRoute>
              }
            />
            <Route
              path="/host/manage-tasks"
              element={
                <ProtectedRoute requiredRole="host">
                  <RequiresVerification feature="Manage Tasks">
                    <ManageTasks />
                  </RequiresVerification>
                </ProtectedRoute>
              }
            />
            <Route
              path="/host/edit-task/:taskId"
              element={
                <ProtectedRoute requiredRole="host">
                  <RequiresVerification feature="Edit Tasks">
                    <CreateTask />
                  </RequiresVerification>
                </ProtectedRoute>
              }
            />

            {/* Student Routes */}
            <Route path="/student/login" element={<StudentLogin />} />
            <Route path="/student/signup" element={<StudentSignup />} />
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute requiredRole="guest">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/browse"
              element={
                <ProtectedRoute requiredRole="guest">
                  <RequiresVerification feature="Browse Hosts">
                    <BrowseHosts />
                  </RequiresVerification>
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/saved-hosts"
              element={
                <ProtectedRoute requiredRole="guest">
                  <RequiresVerification feature="Saved Hosts">
                    <SavedHosts />
                  </RequiresVerification>
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/browse-tasks"
              element={
                <ProtectedRoute requiredRole="guest">
                  <RequiresVerification feature="Browse Tasks">
                    <BrowseTasks />
                  </RequiresVerification>
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/match/:id"
              element={
                <ProtectedRoute requiredRole="guest">
                  <RequiresVerification feature="Host Details">
                    <MatchDetails />
                  </RequiresVerification>
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/settings"
              element={
                <ProtectedRoute requiredRole="guest">
                  <UserSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/applications"
              element={
                <ProtectedRoute requiredRole="guest">
                  <MyApplications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/apply/:taskId"
              element={
                <ProtectedRoute requiredRole="guest">
                  <RequiresVerification feature="Task Applications">
                    <TaskApplication />
                  </RequiresVerification>
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedAdminRoute requiredPermission="manage_users">
                  <AdminUserManagement />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/facilitation-requests"
              element={
                <ProtectedAdminRoute requiredPermission="manage_users">
                  <AdminFacilitationRequests />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/create-profile"
              element={
                <ProtectedAdminRoute requiredPermission="create_profiles">
                  <AdminCreateProfile />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedAdminRoute requiredPermission="view_reports">
                  <AdminReportsManagement />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/disputes"
              element={
                <ProtectedAdminRoute requiredPermission="manage_users">
                  <AdminDisputes />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/feedback"
              element={
                <ProtectedAdminRoute requiredPermission="view_reports">
                  <AdminFeedbackReview />
                </ProtectedAdminRoute>
              }
            />

            {/* Help/Support */}
            <Route path="/help" element={<Help />} />
            <Route path="/faq" element={<FAQ />} />

            {/* Connection Requests */}
            <Route path="/connection-requests" element={<ConnectionRequests />} />

            {/* Ratings & Reports */}
            <Route path="/rate-experience" element={<RateExperience />} />
            <Route path="/monthly-report" element={<MonthlyReport />} />
            <Route
              path="/monthly-feedback/:facilitationId"
              element={
                <ProtectedRoute>
                  <MonthlyFeedbackForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/feedback-history"
              element={
                <ProtectedRoute>
                  <FeedbackHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recognition-status"
              element={
                <ProtectedRoute requiredRole="guest">
                  <RecognitionStatus />
                </ProtectedRoute>
              }
            />

            {/* Knowledge Hub & Landing */}
            <Route path="/knowledge-hub" element={<KnowledgeHub />} />
            <Route path="/landing" element={<LandingPage />} />

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
    <AuthProvider>
      <UserProvider>
        <AdminProvider>
          <VerificationEventsProvider>
            <AppContent />
          </VerificationEventsProvider>
        </AdminProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
