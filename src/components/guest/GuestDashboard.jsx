import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContextNew';
import { useProfile } from '../../hooks/useProfile';
import BrowseHosts from './BrowseHosts';
import GuestProfile from './GuestProfile';
import { User, Search, FileText, AlertCircle } from 'lucide-react';

export default function GuestDashboard() {
  const { profile } = useAuth();
  const { roleProfile } = useProfile();
  const [activeTab, setActiveTab] = useState('browse');

  const tabs = [
    { id: 'browse', label: 'Browse Hosts', icon: Search },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'documents', label: 'Documents', icon: FileText },
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
              <p className="text-gray-600 mb-3">Student Dashboard</p>

              {/* Student Info */}
              {roleProfile && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="flex items-center text-sm">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">University</p>
                      <p className="font-medium text-gray-900">{roleProfile.university}</p>
                    </div>
                  </div>

                  <div className="flex items-center text-sm">
                    <div className="bg-green-100 rounded-full p-2 mr-3">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Course</p>
                      <p className="font-medium text-gray-900">{roleProfile.course}</p>
                    </div>
                  </div>

                  <div className="flex items-center text-sm">
                    <div className="bg-purple-100 rounded-full p-2 mr-3">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Year of Study</p>
                      <p className="font-medium text-gray-900">Year {roleProfile.year_of_study}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="ml-4">
              {profile?.is_verified ? (
                <div className="flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified
                </div>
              ) : (
                <div className="flex items-center bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Pending
                </div>
              )}
            </div>
          </div>

          {!profile?.is_verified && (
            <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Your account is pending verification. Please upload required documents to
                    get verified and start browsing hosts.
                  </p>
                </div>
              </div>
            </div>
          )}
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
          {activeTab === 'browse' && <BrowseHosts />}
          {activeTab === 'profile' && <GuestProfile />}
          {activeTab === 'documents' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-4">Document Verification</h2>
              <p className="text-gray-600">
                Upload your required documents for verification.
              </p>
              {/* Document upload components will go here */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
