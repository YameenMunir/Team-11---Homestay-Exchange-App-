import { Lock, Eye, Shield, AlertCircle } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-purple-800 text-white py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <Lock className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-purple-100">
              Last updated: January 2025
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="card p-8 md:p-12 space-y-8">
              {/* Introduction */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  1. Introduction
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  At Host Family Stay, we are committed to protecting your privacy and personal
                  data. This Privacy Policy explains how we collect, use, store, and protect your
                  information in accordance with UK GDPR and Data Protection Act 2018.
                </p>
              </div>

              {/* Information We Collect */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  2. Information We Collect
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Personal Information:
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                      <li>Full name, date of birth, and contact details</li>
                      <li>Government-issued identification documents</li>
                      <li>University enrollment documents (for students)</li>
                      <li>Address and proof of residence (for hosts)</li>
                      <li>DBS check results (for hosts)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Platform Usage Data:
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                      <li>Profile information and preferences</li>
                      <li>Communication with our support team</li>
                      <li>Ratings and reviews</li>
                      <li>Service hours logged</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* How We Use Your Information */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  3. How We Use Your Information
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We use your personal information for the following purposes:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>To facilitate matches between students and hosts</li>
                  <li>To conduct verification and background checks</li>
                  <li>To ensure the safety and security of all users</li>
                  <li>To provide customer support and resolve disputes</li>
                  <li>To improve our services and user experience</li>
                  <li>To comply with legal obligations</li>
                </ul>
              </div>

              {/* Data Sharing */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  4. Data Sharing and Disclosure
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We do not sell your personal data. We may share your information with:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Matched users (hosts or students) as part of the facilitation process</li>
                  <li>Third-party verification services (e.g., DBS check providers)</li>
                  <li>Law enforcement or regulatory bodies when legally required</li>
                  <li>Service providers who help us operate our platform (under strict confidentiality agreements)</li>
                </ul>
              </div>

              {/* Data Security */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  5. Data Security
                </h2>
                <div className="bg-gray-50 rounded-xl p-6 mb-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-700 leading-relaxed">
                        We implement industry-standard security measures to protect your data,
                        including encryption, secure servers, and regular security audits. However,
                        no method of transmission over the internet is 100% secure.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Your Rights */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  6. Your Rights
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Under UK GDPR, you have the right to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Access your personal data</li>
                  <li>Rectify inaccurate data</li>
                  <li>Request erasure of your data (subject to legal obligations)</li>
                  <li>Restrict or object to data processing</li>
                  <li>Data portability</li>
                  <li>Withdraw consent at any time</li>
                </ul>
              </div>

              {/* Data Retention */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  7. Data Retention
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We retain your personal data for as long as necessary to provide our services and
                  comply with legal obligations. Verification documents are stored securely for the
                  duration of your account plus 7 years as required by UK law.
                </p>
              </div>

              {/* Cookies */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  8. Cookies and Tracking
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We use cookies and similar technologies to improve your experience on our
                  platform. You can control cookie preferences through your browser settings.
                </p>
              </div>

              {/* Contact */}
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <AlertCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-purple-900 mb-2">
                      Questions about your privacy?
                    </h3>
                    <p className="text-purple-800 mb-3">
                      If you have any questions about this Privacy Policy or wish to exercise your
                      data rights, please contact our Data Protection Officer.
                    </p>
                    <a href="/contact" className="btn-primary inline-block">
                      Contact Us
                    </a>
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
