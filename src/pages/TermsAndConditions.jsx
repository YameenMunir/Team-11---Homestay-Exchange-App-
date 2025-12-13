import { useState } from 'react';
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
  Download,
  ExternalLink,
  X,
  Eye,
  Printer
} from 'lucide-react';

const TermsAndConditions = () => {
  const [showHostModal, setShowHostModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);

  // PDF file paths
  const hostTermsPdf = '/documents/HFS Hosting Terms Curr v.10.pdf';
  const studentTermsPdf = '/documents/Host Family Stay Terms and Conditions v.10.2024 (1).pdf';

  // Modal component for viewing PDFs
  const PdfModal = ({ isOpen, onClose, title, pdfUrl }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          {/* Backdrop */}
          <div
            className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="inline-block w-full max-w-6xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-2xl shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-teal-600 to-teal-700">
              <h3 className="text-xl font-bold text-white">{title}</h3>
              <div className="flex items-center space-x-3">
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="text-sm font-medium">Open in New Tab</span>
                </a>
                <a
                  href={pdfUrl}
                  download
                  className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm font-medium">Download</span>
                </a>
                <button
                  onClick={() => window.print()}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span className="text-sm font-medium">Print</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* PDF Viewer */}
            <div className="bg-gray-100">
              <iframe
                src={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                className="w-full h-[75vh]"
                title={title}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

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
                            <span className="text-gray-700">Facilitate only one student (guest) at a time</span>
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

              {/* HFS Hosting - Terms & Conditions for Hosts */}
              <div className="card p-8 md:p-10 hover:shadow-xl transition-shadow border-l-4 border-orange-600">
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-100 rounded-lg p-3 flex-shrink-0">
                    <Home className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      8. HFS Hosting – Terms & Conditions for Hosts
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-lg mb-6">
                      The following terms and conditions apply specifically to hosts providing accommodation
                      through HostFamily Stay. All hosts must read, understand, and agree to these terms
                      before accepting any bookings.
                    </p>

                    {/* Key Points Summary */}
                    <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl p-6 border border-orange-100 mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">This document covers:</h3>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div className="flex items-start space-x-3">
                          <CheckCircle2 className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">Host eligibility and responsibilities</span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle2 className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">Accommodation, safety, and compliance requirements</span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle2 className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">Hosting obligations and conduct</span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle2 className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">Payments, cancellations, and refunds</span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle2 className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">Liability and insurance requirements</span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle2 className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">Dispute resolution procedures</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4">
                      <button
                        onClick={() => setShowHostModal(true)}
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-semibold rounded-xl hover:from-orange-700 hover:to-orange-800 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                      >
                        <Eye className="w-5 h-5" />
                        <span>View Host Terms & Conditions</span>
                      </button>
                      <a
                        href={hostTermsPdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-white border-2 border-orange-600 text-orange-600 font-semibold rounded-xl hover:bg-orange-50 transition-colors"
                      >
                        <ExternalLink className="w-5 h-5" />
                        <span>Open in New Tab</span>
                      </a>
                      <a
                        href={hostTermsPdf}
                        download="HFS_Hosting_Terms_and_Conditions.pdf"
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <Download className="w-5 h-5" />
                        <span>Download PDF</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* HostFamily Stay - Terms & Conditions for Students (Guests) */}
              <div className="card p-8 md:p-10 hover:shadow-xl transition-shadow border-l-4 border-teal-600">
                <div className="flex items-start space-x-4">
                  <div className="bg-teal-100 rounded-lg p-3 flex-shrink-0">
                    <GraduationCap className="w-6 h-6 text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      9. HostFamily Stay – Terms & Conditions for Students (Guests)
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-lg mb-6">
                      The following terms and conditions apply specifically to students and guests
                      booking accommodation through HostFamily Stay. All guests must read, understand,
                      and agree to these terms before confirming any booking.
                    </p>

                    {/* Key Points Summary */}
                    <div className="bg-gradient-to-br from-teal-50 to-white rounded-xl p-6 border border-teal-100 mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">This document covers:</h3>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div className="flex items-start space-x-3">
                          <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">Booking and eligibility requirements</span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">House rules and behaviour expectations</span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">Length of stay, extensions, and cancellations</span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">Payments, refunds, and fees</span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">Safety and liability provisions</span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">Dispute resolution procedures</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4">
                      <button
                        onClick={() => setShowStudentModal(true)}
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold rounded-xl hover:from-teal-700 hover:to-teal-800 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                      >
                        <Eye className="w-5 h-5" />
                        <span>View Student Terms & Conditions</span>
                      </button>
                      <a
                        href={studentTermsPdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-white border-2 border-teal-600 text-teal-600 font-semibold rounded-xl hover:bg-teal-50 transition-colors"
                      >
                        <ExternalLink className="w-5 h-5" />
                        <span>Open in New Tab</span>
                      </a>
                      <a
                        href={studentTermsPdf}
                        download="HostFamily_Stay_Student_Terms_and_Conditions.pdf"
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <Download className="w-5 h-5" />
                        <span>Download PDF</span>
                      </a>
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

      {/* PDF Modals */}
      <PdfModal
        isOpen={showHostModal}
        onClose={() => setShowHostModal(false)}
        title="HFS Hosting – Terms & Conditions for Hosts"
        pdfUrl={hostTermsPdf}
      />
      <PdfModal
        isOpen={showStudentModal}
        onClose={() => setShowStudentModal(false)}
        title="HostFamily Stay – Terms & Conditions for Students"
        pdfUrl={studentTermsPdf}
      />
    </div>
  );
};

export default TermsAndConditions;
