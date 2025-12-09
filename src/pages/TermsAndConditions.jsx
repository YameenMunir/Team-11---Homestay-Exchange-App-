import {
  FileText,
  Shield,
  AlertCircle,
  CheckCircle2,
  Users,
  Briefcase,
  GraduationCap,
  Home,
  XCircle,
  Scale,
  Download
} from 'lucide-react';

const TermsAndConditions = () => {
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
              <FileText className="w-12 h-12" />
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-4 tracking-tight">
              Terms and Conditions
            </h1>
            <div className="flex items-center justify-center space-x-2 text-lg text-teal-100">
              <Shield className="w-5 h-5" />
              <p>Last updated: 25th November 2025</p>
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
                      Welcome to HomeStay Exchange Hotel. These Terms & Conditions govern your use of our
                      platform and the services we provide. By accessing or using our platform, you
                      agree to be bound by these terms. Please read them carefully.
                    </p>
                  </div>
                </div>
              </div>

              {/* Eligibility */}
              <div className="card p-8 md:p-10 hover:shadow-xl transition-shadow border-l-4 border-blue-600">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 rounded-lg p-3 flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      2. Eligibility
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-lg mb-4">
                      To use HomeStay Exchange Application, you must:
                    </p>
                    <div className="grid gap-3">
                      <div className="flex items-start space-x-3 bg-blue-50 rounded-lg p-4">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Be at least 18 years of age</span>
                      </div>
                      <div className="flex items-start space-x-3 bg-blue-50 rounded-lg p-4">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Be legally authorized to live and work in the United Kingdom</span>
                      </div>
                      <div className="flex items-start space-x-3 bg-blue-50 rounded-lg p-4">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Provide accurate and complete information during registration</span>
                      </div>
                      <div className="flex items-start space-x-3 bg-blue-50 rounded-lg p-4">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Maintain the confidentiality of your account credentials</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Services */}
              <div className="card p-8 md:p-10 hover:shadow-xl transition-shadow border-l-4 border-green-600">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 rounded-lg p-3 flex-shrink-0">
                    <Briefcase className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      3. Our Services
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-lg mb-4">
                      HomeStay Exchange provides a platform to connect students seeking affordable
                      accommodation with hosts who need support with daily tasks. Our services include:
                    </p>
                    <div className="grid gap-3">
                      <div className="flex items-start space-x-3 bg-green-50 rounded-lg p-4">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Profile creation and matching services</span>
                      </div>
                      <div className="flex items-start space-x-3 bg-green-50 rounded-lg p-4">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Verification and background checks</span>
                      </div>
                      <div className="flex items-start space-x-3 bg-green-50 rounded-lg p-4">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Admin-facilitated connections between students and hosts</span>
                      </div>
                      <div className="flex items-start space-x-3 bg-green-50 rounded-lg p-4">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Ongoing support and dispute resolution</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Responsibilities */}
              <div className="card p-8 md:p-10 hover:shadow-xl transition-shadow border-l-4 border-orange-600">
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-100 rounded-lg p-3 flex-shrink-0">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      4. User Responsibilities
                    </h2>
                    <div className="space-y-6">
                      {/* For Hosts */}
                      <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl p-6 border border-orange-100">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="bg-orange-100 rounded-lg p-2">
                            <Home className="w-5 h-5 text-orange-600" />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900">For Hosts:</h3>
                        </div>
                        <div className="grid gap-3">
                          <div className="flex items-start space-x-3">
                            <CheckCircle2 className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">Provide accurate information about your accommodation</span>
                          </div>
                          <div className="flex items-start space-x-3">
                            <CheckCircle2 className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">Maintain a safe and habitable living environment</span>
                          </div>
                          <div className="flex items-start space-x-3">
                            <CheckCircle2 className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">Complete required background checks and verifications</span>
                          </div>
                          <div className="flex items-start space-x-3">
                            <CheckCircle2 className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">Treat students with respect and dignity</span>
                          </div>
                        </div>
                      </div>

                      {/* For Students */}
                      <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl p-6 border border-orange-100">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="bg-orange-100 rounded-lg p-2">
                            <GraduationCap className="w-5 h-5 text-orange-600" />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900">For Students:</h3>
                        </div>
                        <div className="grid gap-3">
                          <div className="flex items-start space-x-3">
                            <CheckCircle2 className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">Provide accurate information about your needs and capabilities</span>
                          </div>
                          <div className="flex items-start space-x-3">
                            <CheckCircle2 className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">Fulfil agreed-upon service commitments</span>
                          </div>
                          <div className="flex items-start space-x-3">
                            <CheckCircle2 className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">Complete required background checks and verifications</span>
                          </div>
                          <div className="flex items-start space-x-3">
                            <CheckCircle2 className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">Treat hosts with respect and dignity</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Safety and Verification */}
              <div className="card p-8 md:p-10 hover:shadow-xl transition-shadow border-l-4 border-indigo-600">
                <div className="flex items-start space-x-4">
                  <div className="bg-indigo-100 rounded-lg p-3 flex-shrink-0">
                    <Shield className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      5. Safety and Verification
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-lg mb-4">
                      All users must complete our verification process, which includes:
                    </p>
                    <div className="grid gap-3">
                      <div className="flex items-start space-x-3 bg-indigo-50 rounded-lg p-4">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Identify verification through government-issued ID</span>
                      </div>
                      <div className="flex items-start space-x-3 bg-indigo-50 rounded-lg p-4">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">DBS (Disclosure and Barring Service) checks for hosts</span>
                      </div>
                      <div className="flex items-start space-x-3 bg-indigo-50 rounded-lg p-4">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Proof of university enrolment for students</span>
                      </div>
                      <div className="flex items-start space-x-3 bg-indigo-50 rounded-lg p-4">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Address verification for hosts</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Termination */}
              <div className="card p-8 md:p-10 hover:shadow-xl transition-shadow border-l-4 border-red-600">
                <div className="flex items-start space-x-4">
                  <div className="bg-red-100 rounded-lg p-3 flex-shrink-0">
                    <XCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      6. Termination
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      We reserve the right to suspend or terminate your account if you violate these
                      terms or engage in behaviour that is harmful to other users or the platform.
                    </p>
                  </div>
                </div>
              </div>

              {/* Liability */}
              <div className="card p-8 md:p-10 hover:shadow-xl transition-shadow border-l-4 border-yellow-600">
                <div className="flex items-start space-x-4">
                  <div className="bg-yellow-100 rounded-lg p-3 flex-shrink-0">
                    <Scale className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      7. Limitation of Liability
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      HomeStay Exchange Hotel acts as a facilitator and is not party to any agreements between
                      hosts and students. While we conduct verification checks, we cannot guarantee the
                      behaviour of users and are not liable for disputes that arise between parties.
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Terms & Conditions */}
              <div className="card p-8 md:p-10 hover:shadow-xl transition-shadow border-l-4 border-pink-600">
                <div className="flex items-start space-x-4">
                  <div className="bg-pink-100 rounded-lg p-3 flex-shrink-0">
                    <FileText className="w-6 h-6 text-pink-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      8. Additional Terms & Conditions
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-lg mb-4">
                      For further details on terms and conditions, please{' '}
                      <a
                        href="/documents/Terms_and_Conditions_Detailed.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-600 hover:text-pink-700 font-medium transition-colors underline"
                      >
                        click here
                      </a>
                      .
                    </p>
                    <a
                      href="/documents/Terms_and_Conditions_Detailed.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary inline-flex items-center space-x-2 shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <span>Download Full Terms & Conditions</span>
                      <Download className="w-4 h-4" />
                    </a>
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
                        Questions about our Terms?
                      </h3>
                      <p className="text-gray-700 text-lg mb-5 leading-relaxed">
                        If you have any questions about these Terms and Conditions, please contact us.
                        Our team is here to help clarify any concerns you may have.
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

export default TermsAndConditions;
