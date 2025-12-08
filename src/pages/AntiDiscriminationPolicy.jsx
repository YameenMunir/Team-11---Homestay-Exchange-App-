import { Users, Heart, Scale, AlertCircle } from 'lucide-react';

const AntiDiscriminationPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-purple-800 text-white py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <Heart className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Anti-Discrimination Policy
            </h1>
            <p className="text-xl text-purple-100">
              Building an inclusive community for everyone
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="card p-8 md:p-12 space-y-8">
              {/* Our Commitment */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Our Commitment to Equality
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Homestay Exchange is committed to creating an inclusive, welcoming platform where
                  all users are treated with dignity and respect. We have zero tolerance for
                  discrimination of any kind and work actively to ensure equal opportunities for
                  everyone in our community.
                </p>
              </div>

              {/* Protected Characteristics */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Protected Characteristics
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  In accordance with the UK Equality Act 2010, we prohibit discrimination based on:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    'Age',
                    'Disability',
                    'Gender reassignment',
                    'Marriage and civil partnership',
                    'Pregnancy and maternity',
                    'Race',
                    'Religion or belief',
                    'Sex',
                    'Sexual orientation',
                  ].map((characteristic) => (
                    <div
                      key={characteristic}
                      className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg"
                    >
                      <Users className="w-5 h-5 text-purple-600 flex-shrink-0" />
                      <span className="text-gray-800 font-medium">{characteristic}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* What This Means */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  What This Means for Our Community
                </h2>
                <div className="space-y-4">
                  <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded-r-lg">
                    <h3 className="font-semibold text-purple-900 mb-2">For Hosts:</h3>
                    <ul className="list-disc list-inside space-y-1 text-purple-800 ml-4">
                      <li>
                        You cannot refuse students based on protected characteristics
                      </li>
                      <li>All students must be treated equally regardless of background</li>
                      <li>
                        Accommodation standards must be the same for all students
                      </li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded-r-lg">
                    <h3 className="font-semibold text-purple-900 mb-2">For Students:</h3>
                    <ul className="list-disc list-inside space-y-1 text-purple-800 ml-4">
                      <li>You cannot refuse hosts based on protected characteristics</li>
                      <li>All hosts must be treated with equal respect</li>
                      <li>Services provided must not discriminate based on host background</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Reasonable Accommodations */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Reasonable Accommodations
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We are committed to making reasonable accommodations for users with disabilities.
                  This includes:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Accessible platform design with screen reader compatibility</li>
                  <li>Large text options and high contrast modes</li>
                  <li>Alternative formats for documentation when needed</li>
                  <li>Additional support during the matching process</li>
                  <li>Flexible arrangement options to accommodate specific needs</li>
                </ul>
              </div>

              {/* Reporting Discrimination */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Reporting Discrimination
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you experience or witness discrimination on our platform:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg">
                    <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Report Immediately
                      </h4>
                      <p className="text-gray-700 text-sm">
                        Use our Report a Problem feature or contact our support team directly.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg">
                    <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        We Investigate
                      </h4>
                      <p className="text-gray-700 text-sm">
                        Our team will thoroughly investigate all reports of discrimination.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg">
                    <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Action Taken
                      </h4>
                      <p className="text-gray-700 text-sm">
                        Violations result in warnings, account suspension, or permanent ban
                        depending on severity.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Consequences */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Consequences of Discrimination
                </h2>
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <div className="flex items-start space-x-3">
                    <Scale className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-red-900 font-semibold mb-2">
                        Discrimination will result in:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-red-800 ml-4">
                        <li>Immediate investigation of the incident</li>
                        <li>Warning or temporary suspension for first offenses</li>
                        <li>Permanent ban from the platform for serious or repeated violations</li>
                        <li>Reporting to relevant authorities if legally required</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Training and Education */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Training and Education
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We provide resources and guidance to help all users understand their
                  responsibilities and create an inclusive environment. This includes onboarding
                  materials, community guidelines, and access to support when questions arise.
                </p>
              </div>

              {/* Contact */}
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <AlertCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-purple-900 mb-2">
                      Report Discrimination
                    </h3>
                    <p className="text-purple-800 mb-3">
                      If you have experienced or witnessed discrimination, please report it
                      immediately. All reports are taken seriously and handled confidentially.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <a href="/help" className="btn-primary inline-block text-center">
                        Report a Problem
                      </a>
                      <a href="/contact" className="btn-outline inline-block text-center">
                        Contact Support
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

export default AntiDiscriminationPolicy;
