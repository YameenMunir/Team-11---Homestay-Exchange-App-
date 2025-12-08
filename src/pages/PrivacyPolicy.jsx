import {
  Lock,
  Shield,
  AlertCircle,
  CheckCircle2,
  Database,
  Eye,
  FileText,
  Users,
  Clock
} from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)'
        }}></div>
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Lock className="w-12 h-12" />
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-4 tracking-tight">
              Privacy Policy
            </h1>
            <div className="flex items-center justify-center space-x-2 text-lg text-teal-100">
              <Shield className="w-5 h-5" />
              <p>Last updated: January 2025</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 -mt-8">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {/* Introduction */}
              <div className="card p-8 md:p-10 hover:shadow-xl transition-shadow border-l-4 border-teal-600">
                <div className="flex items-start space-x-4">
                  <div className="bg-teal-100 rounded-lg p-3 flex-shrink-0">
                    <FileText className="w-6 h-6 text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      1. Introduction
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      At Homestay Exchange, we are committed to protecting your privacy and personal
                      data. This Privacy Policy explains how we collect, use, store, and protect your
                      information in accordance with UK GDPR and Data Protection Act 2018.
                    </p>
                  </div>
                </div>
              </div>

              {/* Information We Collect */}
              <div className="card p-8 md:p-10 hover:shadow-xl transition-shadow border-l-4 border-blue-600">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 rounded-lg p-3 flex-shrink-0">
                    <Database className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      2. Information We Collect
                    </h2>
                    <div className="space-y-6">
                      {/* Personal Information */}
                      <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 border border-blue-100">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="bg-blue-100 rounded-lg p-2">
                            <Users className="w-5 h-5 text-blue-600" />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900">Personal Information:</h3>
                        </div>
                        <div className="grid gap-3">
                          <div className="flex items-start space-x-3">
                            <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">Full name, date of birth, and contact details</span>
                          </div>
                          <div className="flex items-start space-x-3">
                            <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">Government-issued identification documents</span>
                          </div>
                          <div className="flex items-start space-x-3">
                            <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">University enrollment documents (for students)</span>
                          </div>
                          <div className="flex items-start space-x-3">
                            <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">Address and proof of residence (for hosts)</span>
                          </div>
                          <div className="flex items-start space-x-3">
                            <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">DBS check results (for hosts)</span>
                          </div>
                        </div>
                      </div>

                      {/* Platform Usage Data */}
                      <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 border border-blue-100">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="bg-blue-100 rounded-lg p-2">
                            <Eye className="w-5 h-5 text-blue-600" />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900">Platform Usage Data:</h3>
                        </div>
                        <div className="grid gap-3">
                          <div className="flex items-start space-x-3">
                            <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">Profile information and preferences</span>
                          </div>
                          <div className="flex items-start space-x-3">
                            <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">Communication with our support team</span>
                          </div>
                          <div className="flex items-start space-x-3">
                            <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">Ratings and reviews</span>
                          </div>
                          <div className="flex items-start space-x-3">
                            <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">Service hours logged</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* How We Use Your Information */}
              <div className="card p-8 md:p-10 hover:shadow-xl transition-shadow border-l-4 border-green-600">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 rounded-lg p-3 flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      3. How We Use Your Information
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-lg mb-4">
                      We use your personal information for the following purposes:
                    </p>
                    <div className="grid gap-3">
                      <div className="flex items-start space-x-3 bg-green-50 rounded-lg p-4">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">To facilitate matches between students and hosts</span>
                      </div>
                      <div className="flex items-start space-x-3 bg-green-50 rounded-lg p-4">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">To conduct verification and background checks</span>
                      </div>
                      <div className="flex items-start space-x-3 bg-green-50 rounded-lg p-4">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">To ensure the safety and security of all users</span>
                      </div>
                      <div className="flex items-start space-x-3 bg-green-50 rounded-lg p-4">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">To provide customer support and resolve disputes</span>
                      </div>
                      <div className="flex items-start space-x-3 bg-green-50 rounded-lg p-4">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">To improve our services and user experience</span>
                      </div>
                      <div className="flex items-start space-x-3 bg-green-50 rounded-lg p-4">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">To comply with legal obligations</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Sharing */}
              <div className="card p-8 md:p-10 hover:shadow-xl transition-shadow border-l-4 border-orange-600">
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-100 rounded-lg p-3 flex-shrink-0">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      4. Data Sharing and Disclosure
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-lg mb-4">
                      We do not sell your personal data. We may share your information with:
                    </p>
                    <div className="grid gap-3">
                      <div className="flex items-start space-x-3 bg-orange-50 rounded-lg p-4">
                        <CheckCircle2 className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Matched users (hosts or students) as part of the facilitation process</span>
                      </div>
                      <div className="flex items-start space-x-3 bg-orange-50 rounded-lg p-4">
                        <CheckCircle2 className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Third-party verification services (e.g., DBS check providers)</span>
                      </div>
                      <div className="flex items-start space-x-3 bg-orange-50 rounded-lg p-4">
                        <CheckCircle2 className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Law enforcement or regulatory bodies when legally required</span>
                      </div>
                      <div className="flex items-start space-x-3 bg-orange-50 rounded-lg p-4">
                        <CheckCircle2 className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Service providers who help us operate our platform (under strict confidentiality agreements)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Security */}
              <div className="card p-8 md:p-10 hover:shadow-xl transition-shadow border-l-4 border-indigo-600">
                <div className="flex items-start space-x-4">
                  <div className="bg-indigo-100 rounded-lg p-3 flex-shrink-0">
                    <Shield className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      5. Data Security
                    </h2>
                    <div className="bg-indigo-50 rounded-xl p-6">
                      <p className="text-gray-700 leading-relaxed text-lg">
                        We implement industry-standard security measures to protect your data,
                        including encryption, secure servers, and regular security audits. However,
                        no method of transmission over the internet is 100% secure.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Your Rights */}
              <div className="card p-8 md:p-10 hover:shadow-xl transition-shadow border-l-4 border-purple-600">
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 rounded-lg p-3 flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      6. Your Rights
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-lg mb-4">
                      Under UK GDPR, you have the right to:
                    </p>
                    <div className="grid gap-3">
                      <div className="flex items-start space-x-3 bg-purple-50 rounded-lg p-4">
                        <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Access your personal data</span>
                      </div>
                      <div className="flex items-start space-x-3 bg-purple-50 rounded-lg p-4">
                        <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Rectify inaccurate data</span>
                      </div>
                      <div className="flex items-start space-x-3 bg-purple-50 rounded-lg p-4">
                        <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Request erasure of your data (subject to legal obligations)</span>
                      </div>
                      <div className="flex items-start space-x-3 bg-purple-50 rounded-lg p-4">
                        <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Restrict or object to data processing</span>
                      </div>
                      <div className="flex items-start space-x-3 bg-purple-50 rounded-lg p-4">
                        <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Data portability</span>
                      </div>
                      <div className="flex items-start space-x-3 bg-purple-50 rounded-lg p-4">
                        <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Withdraw consent at any time</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Retention */}
              <div className="card p-8 md:p-10 hover:shadow-xl transition-shadow border-l-4 border-yellow-600">
                <div className="flex items-start space-x-4">
                  <div className="bg-yellow-100 rounded-lg p-3 flex-shrink-0">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      7. Data Retention
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      We retain your personal data for as long as necessary to provide our services and
                      comply with legal obligations. Verification documents are stored securely for the
                      duration of your account plus 7 years as required by UK law.
                    </p>
                  </div>
                </div>
              </div>

              {/* Cookies */}
              <div className="card p-8 md:p-10 hover:shadow-xl transition-shadow border-l-4 border-pink-600">
                <div className="flex items-start space-x-4">
                  <div className="bg-pink-100 rounded-lg p-3 flex-shrink-0">
                    <Eye className="w-6 h-6 text-pink-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      8. Cookies and Tracking
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      We use cookies and similar technologies to improve your experience on our
                      platform. You can control cookie preferences through your browser settings.
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-600 to-teal-800 opacity-5 rounded-2xl"></div>
                <div className="card p-8 md:p-10 border-2 border-teal-200 hover:border-teal-300 transition-all hover:shadow-xl relative">
                  <div className="flex items-start space-x-4">
                    <div className="bg-teal-100 rounded-xl p-4 flex-shrink-0">
                      <AlertCircle className="w-8 h-8 text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-teal-900 mb-3">
                        Questions about your privacy?
                      </h3>
                      <p className="text-gray-700 text-lg mb-5 leading-relaxed">
                        If you have any questions about this Privacy Policy or wish to exercise your
                        data rights, please contact our Data Protection Officer.
                      </p>
                      <a
                        href="/contact"
                        className="btn-primary inline-flex items-center space-x-2 shadow-lg hover:shadow-xl transition-shadow"
                      >
                        <span>Contact Us</span>
                        <AlertCircle className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
