import React from 'react';
import { Link } from 'react-router-dom';
import { Home as HomeIcon, Users, Shield, Heart, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            Host Family Stay
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connecting students with welcoming hosts for affordable accommodation and
            meaningful intergenerational relationships
          </p>

          <div className="flex justify-center space-x-4">
            <Link
              to="/signup"
              className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <HomeIcon className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Affordable Housing
            </h3>
            <p className="text-gray-600">
              Students get free or low-cost accommodation in exchange for helping with
              everyday tasks
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Community Support
            </h3>
            <p className="text-gray-600">
              Reduce loneliness for older adults while building meaningful
              intergenerational connections
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Safe & Verified
            </h3>
            <p className="text-gray-600">
              All users undergo thorough verification with ID checks and document
              validation
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>

          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Sign Up</h3>
                <p className="text-gray-600">
                  Create your account as either a student or host. Upload required
                  documents for verification.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Get Verified
                </h3>
                <p className="text-gray-600">
                  Our admin team reviews your documents to ensure safety and
                  authenticity for all users.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Find Matches
                </h3>
                <p className="text-gray-600">
                  Browse profiles and send facilitation requests. Our team helps
                  coordinate the perfect match.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                4
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Start Your Stay
                </h3>
                <p className="text-gray-600">
                  Begin your mutually beneficial arrangement with clear expectations and
                  ongoing support.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 bg-white rounded-2xl shadow-lg p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
              <div className="text-gray-600">Verified Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">Safe</div>
              <div className="text-gray-600">Secure Platform</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
              <div className="text-gray-600">Support Available</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 bg-blue-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join our community and make a difference today
          </p>
          <Link
            to="/signup"
            className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Sign Up Now
          </Link>
        </div>
      </div>
    </div>
  );
}
