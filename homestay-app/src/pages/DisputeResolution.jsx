import { MessageCircle, Users, FileText, CheckCircle, AlertCircle } from 'lucide-react';

const DisputeResolution = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-purple-800 text-white py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <MessageCircle className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Dispute Resolution
            </h1>
            <p className="text-xl text-purple-100">
              Fair and transparent conflict resolution process
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
                  Our Commitment to Fair Resolution
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  At Host Family Stay, we understand that conflicts can arise even in the best
                  relationships. Our dispute resolution process is designed to address issues
                  fairly, transparently, and efficiently, protecting the rights and wellbeing of
                  all parties involved.
                </p>
              </div>

              {/* When to Use */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  When to Use Dispute Resolution
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Our dispute resolution process can help with:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    'Disagreements about service expectations',
                    'Accommodation standards concerns',
                    'Breach of agreed arrangements',
                    'Communication difficulties',
                    'Safety or wellbeing concerns',
                    'Financial disagreements',
                    'Behavioral issues',
                    'Other conflicts between users',
                  ].map((issue) => (
                    <div
                      key={issue}
                      className="flex items-start space-x-2 bg-gray-50 p-3 rounded-lg"
                    >
                      <span className="text-purple-600 text-lg flex-shrink-0">•</span>
                      <span className="text-gray-800">{issue}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resolution Process */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Our Resolution Process
                </h2>
                <div className="space-y-4">
                  {/* Step 1 */}
                  <div className="bg-white border-2 border-purple-200 rounded-xl p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-lg">
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
                        <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 text-sm">
                          <li>Description of the issue and when it occurred</li>
                          <li>Any relevant evidence (messages, photos, documents)</li>
                          <li>What outcome you're hoping for</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="bg-white border-2 border-purple-200 rounded-xl p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-lg">
                        2
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          Initial Assessment
                        </h3>
                        <p className="text-gray-700 mb-3">
                          Our team will review your report within 24-48 hours and:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 text-sm">
                          <li>Acknowledge receipt of your report</li>
                          <li>Assess the severity and urgency of the situation</li>
                          <li>Gather information from all parties involved</li>
                          <li>Determine the appropriate resolution pathway</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="bg-white border-2 border-purple-200 rounded-xl p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-lg">
                        3
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          Mediation
                        </h3>
                        <p className="text-gray-700 mb-3">
                          For most disputes, we facilitate mediation between parties:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 text-sm">
                          <li>A trained mediator will facilitate communication</li>
                          <li>Each party has an opportunity to share their perspective</li>
                          <li>We work towards a mutually acceptable solution</li>
                          <li>All conversations remain confidential</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="bg-white border-2 border-purple-200 rounded-xl p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-lg">
                        4
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          Resolution & Follow-up
                        </h3>
                        <p className="text-gray-700 mb-3">
                          Once a resolution is reached:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 text-sm">
                          <li>We document the agreed solution</li>
                          <li>Provide support to implement the resolution</li>
                          <li>Follow up to ensure the issue is resolved</li>
                          <li>Take appropriate action if agreements aren't honored</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Serious Violations */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Serious Violations
                </h2>
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-red-900 font-semibold mb-2">
                        For safety concerns, harassment, or serious policy violations:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-red-800 ml-4">
                        <li>We may take immediate action including account suspension</li>
                        <li>Law enforcement will be contacted if necessary</li>
                        <li>Emergency support services will be provided</li>
                        <li>Alternative arrangements will be facilitated urgently</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Escalation */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Escalation Process
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  If you're not satisfied with the resolution:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg">
                    <FileText className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Request a Review
                      </h4>
                      <p className="text-gray-700 text-sm">
                        You can request a review by a senior team member within 14 days of the
                        initial decision.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg">
                    <Users className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Independent Mediation
                      </h4>
                      <p className="text-gray-700 text-sm">
                        We can arrange independent third-party mediation for complex disputes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timelines */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Expected Timelines
                </h2>
                <div className="bg-purple-50 rounded-xl p-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900 font-medium">Initial Response</span>
                      <span className="badge bg-purple-100 text-purple-800">24-48 hours</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900 font-medium">Investigation Complete</span>
                      <span className="badge bg-purple-100 text-purple-800">5-7 business days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900 font-medium">Resolution Implemented</span>
                      <span className="badge bg-purple-100 text-purple-800">7-14 business days</span>
                    </div>
                  </div>
                  <p className="text-sm text-purple-800 mt-4">
                    * Urgent safety concerns are handled immediately regardless of typical timelines
                  </p>
                </div>
              </div>

              {/* Prevention */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Prevention is Better Than Resolution
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  To minimize conflicts:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Communicate clearly about expectations from the start</li>
                  <li>Document agreed arrangements and service commitments</li>
                  <li>Address small issues before they become bigger problems</li>
                  <li>Maintain respectful and professional communication</li>
                  <li>Review and follow our community guidelines</li>
                </ul>
              </div>

              {/* Contact */}
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-purple-900 mb-2">
                      Need to Report a Dispute?
                    </h3>
                    <p className="text-purple-800 mb-3">
                      Our team is here to help resolve conflicts fairly and efficiently. Report
                      any issues as soon as they arise.
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

export default DisputeResolution;
