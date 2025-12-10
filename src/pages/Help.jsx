import { useState } from 'react';
import {
  HelpCircle,
  Search,
  MessageCircle,
  AlertCircle,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
  Shield,
  Users,
  FileText,
  Home,
  Send,
} from 'lucide-react';

const Help = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportForm, setReportForm] = useState({
    category: '',
    subject: '',
    description: '',
    priority: 'normal',
  });

  const faqs = [
    {
      category: 'Getting Started',
      icon: <Users className="w-5 h-5" />,
      questions: [
        {
          id: 1,
          question: 'How do I sign up as a host?',
          answer:
            'Click on "I\'m a Host" in the navigation menu and follow the registration process. You\'ll need to provide your details, select services you need help with, and upload verification documents including ID, proof of address, and a DBS check.',
        },
        {
          id: 2,
          question: 'How do I sign up as a student?',
          answer:
            'Click on "I\'m a Student" in the navigation menu. You\'ll need to provide your personal details, university information, upload your ID and admission letter, and describe the services you can offer.',
        },
        {
          id: 3,
          question: 'What documents do I need to verify my account?',
          answer:
            'Hosts need: Valid ID (passport or driving license), utility bill for proof of address, and a DBS background check. Students need: Valid ID and a university admission letter or student ID showing current enrollment.',
        },
      ],
    },
    {
      category: 'Matching & Facilitation',
      icon: <Home className="w-5 h-5" />,
      questions: [
        {
          id: 4,
          question: 'How does the matching process work?',
          answer:
            'Students can browse available hosts based on location, services needed, and preferences. When you find a suitable match, click the "Request Facilitation" button. Our team will then contact both parties to arrange a safe meeting.',
        },
        {
          id: 5,
          question: 'Can I message hosts/students directly?',
          answer:
            'No, for safety and security reasons, the platform does not allow direct messaging. All communication is facilitated through our admin team to ensure safety and proper vetting.',
        },
        {
          id: 6,
          question: 'How long does the facilitation process take?',
          answer:
            'Our team typically responds within 24-48 hours of receiving a facilitation request. We review the match, contact both parties, and help arrange an initial meeting.',
        },
      ],
    },
    {
      category: 'Safety & Verification',
      icon: <Shield className="w-5 h-5" />,
      questions: [
        {
          id: 7,
          question: 'How do you ensure safety?',
          answer:
            'We verify all users through ID checks, address verification for hosts, DBS background checks for hosts, and university verification for students. All arrangements are facilitated by our team, and we provide ongoing support.',
        },
        {
          id: 8,
          question: 'What is a DBS check and how do I get one?',
          answer:
            'A DBS (Disclosure and Barring Service) check is a background check that shows if someone has a criminal record. You can apply for one through the official DBS website or through an umbrella organization. We can provide guidance on this process.',
        },
        {
          id: 9,
          question: 'What if I feel unsafe during my stay?',
          answer:
            'Your safety is our top priority. If you feel unsafe at any time, please use the "Report a Problem" feature immediately or contact our support team. We have protocols in place to handle such situations quickly.',
        },
      ],
    },
    {
      category: 'Ratings & Reviews',
      icon: <FileText className="w-5 h-5" />,
      questions: [
        {
          id: 10,
          question: 'How does the rating system work?',
          answer:
            'After a stay arrangement, both hosts and students can rate each other on a 5-star scale and leave reviews. This helps build trust in the community and helps future matches.',
        },
        {
          id: 11,
          question: 'What are Bronze, Silver, and Gold status levels?',
          answer:
            'Students earn recognition based on consistent positive ratings: Bronze after 2 consecutive 4-5 star ratings, Silver after 4 consecutive high ratings, and Gold after 6. This recognizes community service excellence.',
        },
      ],
    },
    {
      category: 'Legal & Policies',
      icon: <AlertCircle className="w-5 h-5" />,
      questions: [
        {
          id: 12,
          question: 'What are the terms and conditions?',
          answer:
            'Our terms and conditions outline the rights and responsibilities of all users. Please review them carefully during registration. They cover data protection, service expectations, and dispute resolution.',
        },
        {
          id: 13,
          question: 'How is my data protected?',
          answer:
            'We comply with UK GDPR regulations. Your personal data is encrypted and stored securely. We only share necessary information with matched parties and our admin team. See our Privacy Policy for full details.',
        },
      ],
    },
  ];

  const reportCategories = [
    'Safety Concern',
    'Inappropriate Behavior',
    'Scam or Fraud',
    'Profile Violation',
    'Technical Issue',
    'Other',
  ];

  const filteredFaqs = searchTerm
    ? faqs
        .map((category) => ({
          ...category,
          questions: category.questions.filter(
            (q) =>
              q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
              q.answer.toLowerCase().includes(searchTerm.toLowerCase())
          ),
        }))
        .filter((category) => category.questions.length > 0)
    : faqs;

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement API call to submit report
    console.log('Report submitted:', reportForm);
    alert(
      'Your report has been submitted. Our team will review it and contact you within 24 hours.'
    );
    setShowReportModal(false);
    setReportForm({
      category: '',
      subject: '',
      description: '',
      priority: 'normal',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
            How can we help you?
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions or contact our support team
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for help..."
              className="input-field pl-12 w-full text-lg"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          <button
            onClick={() => setShowReportModal(true)}
            className="card p-6 hover:shadow-lg transition-all text-left group"
          >
            <AlertCircle className="w-12 h-12 text-red-600 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-gray-900 mb-2">Report a Problem</h3>
            <p className="text-sm text-gray-600">
              Report safety concerns or issues immediately
            </p>
          </button>

          <a href="mailto:admin@hostfamilystay.com" className="card p-6 hover:shadow-lg transition-all text-left group">
            <Mail className="w-12 h-12 text-teal-600 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
            <p className="text-sm text-gray-600">
              Get help via email within 24 hours
            </p>
          </a>

          <a href="tel:+442012345678" className="card p-6 hover:shadow-lg transition-all text-left group">
            <Phone className="w-12 h-12 text-green-600 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
            <p className="text-sm text-gray-600">
              Speak to our team during business hours
            </p>
          </a>
        </div>

        {/* FAQ Sections */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>

          <div className="space-y-8">
            {filteredFaqs.map((category) => (
              <div key={category.category}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {category.category}
                  </h3>
                </div>

                <div className="space-y-3">
                  {category.questions.map((faq) => (
                    <div key={faq.id} className="card overflow-hidden">
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-900 pr-4">
                          {faq.question}
                        </span>
                        {expandedFaq === faq.id ? (
                          <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        )}
                      </button>

                      {expandedFaq === faq.id && (
                        <div className="px-6 pb-4 pt-2 bg-gray-50 border-t border-gray-200 animate-fade-in">
                          <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {searchTerm && filteredFaqs.length === 0 && (
            <div className="card p-12 text-center">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No results found
              </h3>
              <p className="text-gray-600 mb-6">
                Try different keywords or contact our support team
              </p>
              <button
                onClick={() => setSearchTerm('')}
                className="btn-primary"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>

        {/* Contact Section */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="card p-8 bg-gradient-to-br from-teal-50 to-teal-50 border-teal-200">
            <div className="text-center">
              <MessageCircle className="w-12 h-12 text-teal-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Still need help?
              </h3>
              <p className="text-gray-700 mb-6">
                Our support team is here to assist you
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="mailto:admin@hostfamilystay.com" className="btn-primary">
                  Email: admin@hostfamilystay.com
                </a>
                <a href="tel:+442012345678" className="btn-outline">
                  Call: +44 (0) 20 1234 5678
                </a>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Monday - Friday: 9am - 6pm GMT
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Report Problem Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Report a Problem
                  </h3>
                  <p className="text-sm text-gray-600">
                    We take all reports seriously
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleReportSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Category *
                </label>
                <select
                  required
                  value={reportForm.category}
                  onChange={(e) =>
                    setReportForm({ ...reportForm, category: e.target.value })
                  }
                  className="input-field"
                >
                  <option value="">Select a category</option>
                  {reportCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Priority
                </label>
                <select
                  value={reportForm.priority}
                  onChange={(e) =>
                    setReportForm({ ...reportForm, priority: e.target.value })
                  }
                  className="input-field"
                >
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent - Safety Concern</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={reportForm.subject}
                  onChange={(e) =>
                    setReportForm({ ...reportForm, subject: e.target.value })
                  }
                  className="input-field"
                  placeholder="Brief description of the issue"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  value={reportForm.description}
                  onChange={(e) =>
                    setReportForm({ ...reportForm, description: e.target.value })
                  }
                  rows="5"
                  className="input-field resize-none"
                  placeholder="Please provide as much detail as possible..."
                ></textarea>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-900">
                  <strong>Urgent safety concerns?</strong> If you're in immediate
                  danger, please contact emergency services (999) first, then submit
                  this report.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1 flex items-center justify-center space-x-2">
                  <Send className="w-4 h-4" />
                  <span>Submit Report</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Help;
