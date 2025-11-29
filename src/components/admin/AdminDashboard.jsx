import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContextNew';
import VerifyDocuments from './VerifyDocuments';
import ManageRequests from './ManageRequests';
import { FileCheck, Users, MessageSquare, BarChart } from 'lucide-react';

export default function AdminDashboard() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('documents');

  const tabs = [
    { id: 'documents', label: 'Verify Documents', icon: FileCheck },
    { id: 'requests', label: 'Facilitation Requests', icon: MessageSquare },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'stats', label: 'Statistics', icon: BarChart },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome, {profile?.full_name}!
              </h1>
              <p className="text-gray-600 mb-2">Administrator Dashboard</p>
              <p className="text-sm text-gray-500">{profile?.email}</p>
            </div>
            <div className="ml-4">
              <div className="flex items-center bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                Admin
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-full p-3">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 rounded-full p-3">
                <FileCheck className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Pending Verifications</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-green-100 rounded-full p-3">
                <MessageSquare className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Active Requests</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 rounded-full p-3">
                <BarChart className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Verified Users</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'documents' && <VerifyDocuments />}
          {activeTab === 'requests' && <ManageRequests />}
          {activeTab === 'users' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-4">User Management</h2>
              <p className="text-gray-600">User management features coming soon...</p>
            </div>
          )}
          {activeTab === 'stats' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-4">Statistics</h2>
              <p className="text-gray-600">Analytics and statistics coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
