import { FileText, Shield, AlertCircle } from 'lucide-react';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-purple-800 text-white py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <FileText className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Terms and Conditions
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
                  Welcome to Host Family Stay. These Terms and Conditions govern your use of our
                  platform and the services we provide. By accessing or using our platform, you
                  agree to be bound by these terms. Please read them carefully.
                </p>
              </div>

              {/* Eligibility */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  2. Eligibility
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  To use Host Family Stay, you must:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Be at least 18 years of age</li>
                  <li>Be legally authorized to live and work in the United Kingdom</li>
                  <li>Provide accurate and complete information during registration</li>
                  <li>Maintain the confidentiality of your account credentials</li>
                </ul>
              </div>

              {/* Services */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  3. Our Services
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Host Family Stay provides a platform to connect students seeking affordable
                  accommodation with hosts who need support with daily tasks. Our services include:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Profile creation and matching services</li>
                  <li>Verification and background checks</li>
                  <li>Admin-facilitated connections between students and hosts</li>
                  <li>Ongoing support and dispute resolution</li>
                </ul>
              </div>

              {/* User Responsibilities */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  4. User Responsibilities
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">For Hosts:</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                      <li>Provide accurate information about your accommodation</li>
                      <li>Maintain a safe and habitable living environment</li>
                      <li>Complete required background checks and verifications</li>
                      <li>Treat students with respect and dignity</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">For Students:</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                      <li>Provide accurate information about your needs and capabilities</li>
                      <li>Fulfill agreed-upon service commitments</li>
                      <li>Complete required background checks and verifications</li>
                      <li>Treat hosts with respect and dignity</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Safety and Verification */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  5. Safety and Verification
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  All users must complete our verification process, which includes:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Identity verification through government-issued ID</li>
                  <li>DBS (Disclosure and Barring Service) checks for hosts</li>
                  <li>Proof of university enrollment for students</li>
                  <li>Address verification for hosts</li>
                </ul>
              </div>

              {/* Termination */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  6. Termination
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to suspend or terminate your account if you violate these
                  terms or engage in behavior that is harmful to other users or the platform.
                </p>
              </div>

              {/* Liability */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  7. Limitation of Liability
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Host Family Stay acts as a facilitator and is not party to any agreements between
                  hosts and students. While we conduct verification checks, we cannot guarantee the
                  behavior of users and are not liable for disputes that arise between parties.
                </p>
              </div>

              {/* Contact */}
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <AlertCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-purple-900 mb-2">
                      Questions about our Terms?
                    </h3>
                    <p className="text-purple-800 mb-3">
                      If you have any questions about these Terms and Conditions, please contact us.
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

export default TermsAndConditions;
