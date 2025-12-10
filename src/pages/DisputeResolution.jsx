import {
  MessageCircle,
  Scale,
  AlertCircle,
  CheckCircle2,
  Users,
  FileText,
  Clock,
  Shield,
  AlertTriangle
} from 'lucide-react';

const DisputeResolution = () => {
  const disputeTypes = [
    'Disagreements about service expectations',
    'Accommodation standards concerns',
    'Breach of agreed arrangements',
    'Communication difficulties',
    'Safety or wellbeing concerns',
    'Financial disagreements',
    'Behavioral issues',
    'Other conflicts between users',
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
              <MessageCircle className="w-12 h-12" />
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-4 tracking-tight">
              Dispute Resolution
            </h1>
            <div className="flex items-center justify-center space-x-2 text-lg text-teal-100">
              <Scale className="w-5 h-5" />
              <p>Fair and transparent conflict resolution process</p>
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
                    <Scale className="w-6 h-6 text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Our Commitment to Fair Resolution
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      At Homestay Exchange, we understand that conflicts can arise even in the best
                      relationships. Our dispute resolution process is designed to address issues
                      fairly, transparently, and efficiently, protecting the rights and wellbeing of
                      all parties involved.
                    </p>
                  </div>
                </div>
              </div>

              {/* When to Use */}
              <div className="card p-8 md:p-10 hover:shadow-xl transition-shadow border-l-4 border-blue-600">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 rounded-lg p-3 flex-shrink-0">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      When to Use Dispute Resolution
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-lg mb-4">
                      Our dispute resolution process can help with:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {disputeTypes.map((issue) => (
                        <div
                          key={issue}
                          className="flex items-start space-x-3 bg-blue-50 rounded-lg p-4"
                        >
                          <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{issue}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Resolution Process */}
              <div className="card p-8 md:p-10 hover:shadow-xl transition-shadow border-l-4 border-green-600">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 rounded-lg p-3 flex-shrink-0">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Our Resolution Process
                    </h2>

                    {/* Try Direct Communication First */}
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start space-x-3">
                        <MessageCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-semibold text-blue-900 mb-1">Before Formal Reporting:</h4>
                          <p className="text-blue-800 text-sm">
                            If you're comfortable doing so, try addressing the issue directly with the other party first.
                            Many conflicts can be resolved through friendly, open communication. If this doesn't work
                            or you don't feel comfortable, please proceed with the formal process below.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Step 1 */}
                      <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 border border-green-100">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-lg">
                            1
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              Report the Issue
                            </h3>
                            <p className="text-gray-700 mb-3">
                              Submit a detailed report through our Report a Problem feature or contact
                              our support team directly. Include:
                            </p>
                            <div className="grid gap-2">
                              <div className="flex items-start space-x-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-600 text-sm">Description of the issue and when it occurred</span>
                              </div>
                              <div className="flex items-start space-x-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-600 text-sm">Any relevant evidence (messages, photos, documents)</span>
                              </div>
                              <div className="flex items-start space-x-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-600 text-sm">What outcome you're hoping for</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Step 2 */}
                      <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 border border-green-100">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-lg">
                            2
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              Initial Assessment
                            </h3>
                            <p className="text-gray-700 mb-3">
                              Our team will review your report and respond:
                            </p>
                            <div className="grid gap-2 mb-3">
                              <div className="flex items-start space-x-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-600 text-sm">Acknowledge receipt of your report</span>
                              </div>
                              <div className="flex items-start space-x-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-600 text-sm">Assess the severity and urgency of the situation</span>
                              </div>
                              <div className="flex items-start space-x-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-600 text-sm">Gather information from all parties involved</span>
                              </div>
                              <div className="flex items-start space-x-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-600 text-sm">Determine the appropriate resolution pathway</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-sm bg-green-100 rounded-lg p-3">
                              <span className="font-medium text-green-900">Response Time:</span>
                              <div className="text-right">
                                <div className="text-green-900 font-semibold">Urgent: Within 24 hours</div>
                                <div className="text-green-800">Non-urgent: Up to 7 business days</div>
                                <div className="text-green-800 font-medium mt-1">Safety concerns: Immediate (24/7)</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Step 3 */}
                      <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 border border-green-100">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-lg">
                            3
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              Mediation & Platform Actions
                            </h3>
                            <p className="text-gray-700 mb-3">
                              For most disputes, we facilitate impartial mediation between parties:
                            </p>
                            <div className="grid gap-2 mb-3">
                              <div className="flex items-start space-x-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-600 text-sm">A trained mediator will facilitate communication</span>
                              </div>
                              <div className="flex items-start space-x-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-600 text-sm">Each party has an opportunity to share their perspective</span>
                              </div>
                              <div className="flex items-start space-x-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-600 text-sm">We work towards a mutually acceptable solution</span>
                              </div>
                              <div className="flex items-start space-x-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-600 text-sm">All conversations remain confidential</span>
                              </div>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg border border-green-200">
                              <p className="text-green-900 text-sm">
                                <strong>Platform Authority:</strong> We act impartially to mediate between all parties and reserve
                                the right to relocate students if necessary to ensure safety and resolve conflicts.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Step 4 */}
                      <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 border border-green-100">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-lg">
                            4
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              Resolution & Follow-up
                            </h3>
                            <p className="text-gray-700 mb-3">
                              Once a resolution is reached:
                            </p>
                            <div className="grid gap-2 mb-3">
                              <div className="flex items-start space-x-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-600 text-sm">We document the agreed solution</span>
                              </div>
                              <div className="flex items-start space-x-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-600 text-sm">Provide support to implement the resolution</span>
                              </div>
                              <div className="flex items-start space-x-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-600 text-sm">Follow up to ensure the issue is resolved</span>
                              </div>
                              <div className="flex items-start space-x-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-600 text-sm">Take appropriate action if agreements aren't honored</span>
                              </div>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                              <h4 className="font-semibold text-blue-900 mb-2">Relocation Option:</h4>
                              <p className="text-blue-800 text-sm mb-2">
                                If the conflict cannot be resolved and parties cannot continue living together, we will:
                              </p>
                              <div className="space-y-1 text-sm text-blue-800">
                                <div className="flex items-start space-x-2">
                                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                  <span>Relocate the student to similar standard accommodation</span>
                                </div>
                                <div className="flex items-start space-x-2">
                                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                  <span>Provide one-week notice (except in emergency situations)</span>
                                </div>
                                <div className="flex items-start space-x-2">
                                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                  <span>If alternative accommodation is declined, standard cancellation policy applies</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Serious Violations */}
              <div className="card p-8 md:p-10 hover:shadow-xl transition-shadow border-l-4 border-red-600">
                <div className="flex items-start space-x-4">
                  <div className="bg-red-100 rounded-lg p-3 flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Serious Violations
                    </h2>
                    <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                      <p className="text-red-900 font-semibold text-lg mb-3">
                        For safety concerns, harassment, or serious policy violations:
                      </p>
                      <div className="grid gap-3">
                        <div className="flex items-start space-x-3">
                          <CheckCircle2 className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <span className="text-red-800">We may take immediate action including account suspension</span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle2 className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <span className="text-red-800">Law enforcement will be contacted if necessary</span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle2 className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <span className="text-red-800">Emergency support services will be provided</span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle2 className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <span className="text-red-800">Alternative arrangements will be facilitated urgently</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Escalation */}
              <div className="card p-8 md:p-10 hover:shadow-xl transition-shadow border-l-4 border-orange-600">
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-100 rounded-lg p-3 flex-shrink-0">
                    <Shield className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Escalation Process
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-lg mb-4">
                      If you're not satisfied with the resolution:
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3 bg-orange-50 rounded-lg p-4">
                        <FileText className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">
                            Request a Review
                          </h4>
                          <p className="text-gray-700">
                            You can request a review by a senior team member within 14 days of the
                            initial decision.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 bg-orange-50 rounded-lg p-4">
                        <Users className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">
                            Independent Mediation
                          </h4>
                          <p className="text-gray-700">
                            We can arrange independent third-party mediation for complex disputes.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timelines */}
              <div className="card p-8 md:p-10 hover:shadow-xl transition-shadow border-l-4 border-purple-600">
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 rounded-lg p-3 flex-shrink-0">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Expected Timelines
                    </h2>
                    <div className="bg-purple-50 rounded-xl p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-900 font-medium text-lg">Initial Response</span>
                          <span className="badge bg-purple-100 text-purple-800 text-sm px-4 py-2">24-48 hours</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-900 font-medium text-lg">Investigation Complete</span>
                          <span className="badge bg-purple-100 text-purple-800 text-sm px-4 py-2">5-7 business days</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-900 font-medium text-lg">Resolution Implemented</span>
                          <span className="badge bg-purple-100 text-purple-800 text-sm px-4 py-2">7-14 business days</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-purple-200">
                        <p className="text-sm text-purple-800 flex items-start space-x-2">
                          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <span>Urgent safety concerns are handled immediately regardless of typical timelines</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prevention */}
              <div className="card p-8 md:p-10 hover:shadow-xl transition-shadow border-l-4 border-indigo-600">
                <div className="flex items-start space-x-4">
                  <div className="bg-indigo-100 rounded-lg p-3 flex-shrink-0">
                    <Shield className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Prevention is Better Than Resolution
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-lg mb-4">
                      To minimize conflicts:
                    </p>
                    <div className="grid gap-3">
                      <div className="flex items-start space-x-3 bg-indigo-50 rounded-lg p-4">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Communicate clearly about expectations from the start</span>
                      </div>
                      <div className="flex items-start space-x-3 bg-indigo-50 rounded-lg p-4">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Document agreed arrangements and service commitments</span>
                      </div>
                      <div className="flex items-start space-x-3 bg-indigo-50 rounded-lg p-4">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Address small issues before they become bigger problems</span>
                      </div>
                      <div className="flex items-start space-x-3 bg-indigo-50 rounded-lg p-4">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Maintain respectful and professional communication</span>
                      </div>
                      <div className="flex items-start space-x-3 bg-indigo-50 rounded-lg p-4">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Review and follow our community guidelines</span>
                      </div>
                    </div>
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
                        Need to Report a Dispute?
                      </h3>
                      <p className="text-gray-700 text-lg mb-5 leading-relaxed">
                        Our team is here to help resolve conflicts fairly and efficiently. Report
                        any issues as soon as they arise.
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
                          <MessageCircle className="w-4 h-4" />
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

export default DisputeResolution;
