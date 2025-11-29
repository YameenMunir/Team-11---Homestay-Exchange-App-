import React from 'react';
import Navbar from '../components/shared/Navbar';
import AdminDashboard from '../components/admin/AdminDashboard';

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <AdminDashboard />
    </div>
  );
}
