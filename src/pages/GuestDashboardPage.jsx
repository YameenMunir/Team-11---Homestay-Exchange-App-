import React from 'react';
import Navbar from '../components/shared/Navbar';
import GuestDashboard from '../components/guest/GuestDashboard';

export default function GuestDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <GuestDashboard />
    </div>
  );
}
