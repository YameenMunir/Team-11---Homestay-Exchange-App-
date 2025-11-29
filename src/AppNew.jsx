import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContextNew';
import { NotificationProvider } from './context/NotificationContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AuthCallback from './components/auth/AuthCallback';
import GuestDashboardPage from './pages/GuestDashboardPage';
import HostDashboardPage from './pages/HostDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Protected Routes - Guest */}
            <Route
              path="/guest"
              element={
                <ProtectedRoute allowedRoles={['guest']}>
                  <GuestDashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes - Host */}
            <Route
              path="/host"
              element={
                <ProtectedRoute allowedRoles={['host']}>
                  <HostDashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes - Admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
