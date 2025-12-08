import {
  Heart,
  Scale,
  AlertCircle,
  CheckCircle2,
  Users,
  Shield,
  AlertTriangle,
  BookOpen
} from 'lucide-react';

const AntiDiscriminationPolicy = () => {
  const protectedCharacteristics = [
    'Age',
    'Disability',
    'Gender reassignment',
    'Marriage and civil partnership',
    'Pregnancy and maternity',
    'Race',
    'Religion or belief',
    'Sex',
    'Sexual orientation',
  ];

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
              <Heart className="w-12 h-12" />
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-4 tracking-tight">
              Anti-Discrimination Policy
            </h1>
            <div className="flex items-center justify-center space-x-2 text-lg text-teal-100">
              <Shield className="w-5 h-5" />
              <p>Building an inclusive community for everyone</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 -mt-8">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {/* Our Commitment */}
              <div className="card p-8 md:p-10 hover:shadow-xl transition-shadow border-l-4 border-teal-600">
                <div className="flex items-start space-x-4">
                  <div className="bg-teal-100 rounded-lg p-3 flex-shrink-0">
                    <Heart className="w-6 h-6 text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Our Commitment to Equality
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      Homestay Exchange is committed to creating an inclusive, welcoming platform where
                      all users are treated with dignity and respect. We have zero tolerance for
                      discrimination of any kind and work actively to ensure equal opportunities for
                      everyone in our community.
                    </p>
                  </div>
                </div>
              </div>

              {/* Protected Characteristics */}
              <div className="card p-8 md:p-10 hover:shadow-xl transition-shadow border-l-4 border-blue-600">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 rounded-lg p-3 flex-shrink-0">
                    <Scale className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Protected Characteristics
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-lg mb-4">
                      In accordance with the UK Equality Act 2010, we prohibit discrimination based on:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {protectedCharacteristics.map((characteristic) => (
                        <div
                          key={characteristic}
                          className="flex items-start space-x-3 bg-blue-50 rounded-lg p-4"
                        >
                          <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 font-medium">{characteristic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* What This Means */}
              <div className="card p-8 md:p-10 hover:shadow-xl transition-shadow border-l-4 border-green-600">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 rounded-lg p-3 flex-shrink-0">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      What This Means for Our Community
                    </h2>
                    <div className="space-y-6">
                      {/* For Hosts */}
                      <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 border border-green-100">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="bg-green-100 rounded-lg p-2">
                            <Users className="w-5 h-5 text-green-600" />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900">For Hosts:</h3>
                        </div>
                        <div className="grid gap-3">
                          <div className="flex items-start space-x-3">
                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">You cannot refuse students based on protected characteristics</span>
                          </div>
                          <div className="flex items-start space-x-3">
                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">All students must be treated equally regardless of background</span>
                          </div>
                          <div className="flex items-start space-x-3">
                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">Accommodation standards must be the same for all students</span>
                          </div>
                        </div>
                      </div>

                      {/* For Students */}
                      <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 border border-green-100">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="bg-green-100 rounded-lg p-2">
                            <Users className="w-5 h-5 text-green-600" />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900">For Students:</h3>
                        </div>
                        <div className="grid gap-3">
                          <div className="flex items-start space-x-3">
                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">You cannot refuse hosts based on protected characteristics</span>
                          </div>
                          <div className="flex items-start space-x-3">
                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">All hosts must be treated with equal respect</span>
                          </div>
                          <div className="flex items-start space-x-3">
                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">Services provided must not discriminate based on host background</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reasonable Accommodations */}
              <div className="card p-8 md:p-10 hover:shadow-xl transition-shadow border-l-4 border-purple-600">
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 rounded-lg p-3 flex-shrink-0">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Reasonable Accommodations
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-lg mb-4">
                      We are committed to making reasonable accommodations for users with disabilities.
                      This includes:
                    </p>
                    <div className="grid gap-3">
                      <div className="flex items-start space-x-3 bg-purple-50 rounded-lg p-4">
                        <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Accessible platform design with screen reader compatibility</span>
                      </div>
                      <div className="flex items-start space-x-3 bg-purple-50 rounded-lg p-4">
                        <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Large text options and high contrast modes</span>
                      </div>
                      <div className="flex items-start space-x-3 bg-purple-50 rounded-lg p-4">
                        <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Alternative formats for documentation when needed</span>
                      </div>
                      <div className="flex items-start space-x-3 bg-purple-50 rounded-lg p-4">
                        <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Additional support during the matching process</span>
                      </div>
                      <div className="flex items-start space-x-3 bg-purple-50 rounded-lg p-4">
                        <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Flexible arrangement options to accommodate specific needs</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reporting Discrimination */}
              <div className="card p-8 md:p-10 hover:shadow-xl transition-shadow border-l-4 border-orange-600">
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-100 rounded-lg p-3 flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Reporting Discrimination
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-lg mb-4">
                      If you experience or witness discrimination on our platform:
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3 bg-orange-50 rounded-lg p-4">
                        <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                          1
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">
                            Report Immediately
                          </h4>
                          <p className="text-gray-700">
                            Use our Report a Problem feature or contact our support team directly.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 bg-orange-50 rounded-lg p-4">
                        <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                          2
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">
                            We Investigate
                          </h4>
                          <p className="text-gray-700">
                            Our team will thoroughly investigate all reports of discrimination.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 bg-orange-50 rounded-lg p-4">
                        <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                          3
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">
                            Action Taken
                          </h4>
                          <p className="text-gray-700">
                            Violations result in warnings, account suspension, or permanent ban
                            depending on severity.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Consequences */}
              <div className="card p-8 md:p-10 hover:shadow-xl transition-shadow border-l-4 border-red-600">
                <div className="flex items-start space-x-4">
                  <div className="bg-red-100 rounded-lg p-3 flex-shrink-0">
                    <Scale className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Consequences of Discrimination
                    </h2>
                    <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                      <p className="text-red-900 font-semibold text-lg mb-3">
                        Discrimination will result in:
                      </p>
                      <div className="grid gap-3">
                        <div className="flex items-start space-x-3">
                          <CheckCircle2 className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <span className="text-red-800">Immediate investigation of the incident</span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle2 className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <span className="text-red-800">Warning or temporary suspension for first offenses</span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle2 className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <span className="text-red-800">Permanent ban from the platform for serious or repeated violations</span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle2 className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <span className="text-red-800">Reporting to relevant authorities if legally required</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Training and Education */}
              <div className="card p-8 md:p-10 hover:shadow-xl transition-shadow border-l-4 border-indigo-600">
                <div className="flex items-start space-x-4">
                  <div className="bg-indigo-100 rounded-lg p-3 flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Training and Education
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      We provide resources and guidance to help all users understand their
                      responsibilities and create an inclusive environment. This includes onboarding
                      materials, community guidelines, and access to support when questions arise.
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
                        Report Discrimination
                      </h3>
                      <p className="text-gray-700 text-lg mb-5 leading-relaxed">
                        If you have experienced or witnessed discrimination, please report it
                        immediately. All reports are taken seriously and handled confidentially.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <a
                          href="/help"
                          className="btn-primary inline-flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-shadow"
                        >
                          <span>Report a Problem</span>
                          <AlertTriangle className="w-4 h-4" />
                        </a>
                        <a
                          href="/contact"
                          className="btn-outline inline-flex items-center justify-center space-x-2"
                        >
                          <span>Contact Support</span>
                          <AlertCircle className="w-4 h-4" />
                        </a>
                      </div>
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

export default AntiDiscriminationPolicy;
