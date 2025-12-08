import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Search } from 'lucide-react';

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  const faqCategories = [
    {
      category: 'Getting Started',
      questions: [
        {
          question: 'What is the Homestay Exchange Platform?',
          answer: 'The Homestay Exchange Platform connects international students with verified host families in the UK. Students can browse available hosts, submit facilitation requests, and arrange homestay accommodations with the help of our admin team.'
        },
        {
          question: 'How do I sign up as a student?',
          answer: 'Click on "Sign Up" in the navigation menu, select "Student" as your role, and complete the registration form with your details including university information. After signing up, you\'ll need to submit verification documents for admin approval before you can submit facilitation requests.'
        },
        {
          question: 'How do I sign up as a host?',
          answer: 'Click on "Sign Up" in the navigation menu, select "Host" as your role, and complete the registration form with your details including your address and postcode. You\'ll need to submit verification documents including a DBS check for admin approval before you can receive student requests.'
        },
        {
          question: 'What documents do I need to submit for verification?',
          answer: 'Students need to submit: Government-issued ID, Proof of address, and University admission proof. Hosts need to submit: Government-issued ID, Proof of address, and DBS check certificate. All documents must be clear and valid.'
        }
      ]
    },
    {
      category: 'For Students',
      questions: [
        {
          question: 'How do I find a suitable host?',
          answer: 'Once your account is verified, you can browse available hosts using the "Browse Hosts" page. You can filter hosts by location, services offered, and other preferences. Each host profile shows their location, available services, and basic information to help you make an informed choice.'
        },
        {
          question: 'How do facilitation requests work?',
          answer: 'After finding a suitable host, you can submit a facilitation request by clicking "Request to Connect" on their profile. Write a message introducing yourself and explaining why you\'d be a good match. The host reviews your request first, and if they accept, it goes to our admin team for final approval.'
        },
        {
          question: 'How long does the approval process take?',
          answer: 'Once a host accepts your request, our admin team typically reviews and approves matches within 24-48 hours. You\'ll receive email notifications at each stage. After admin approval, you\'ll receive the admin facilitator\'s contact details to arrange the next steps.'
        },
        {
          question: 'Can I message hosts directly?',
          answer: 'No, we do not provide direct messaging between students and hosts. All connections are facilitated by our admin team to ensure safety and proper verification. After a match is approved, our admin facilitator will coordinate communication between you and the host.'
        },
        {
          question: 'What happens after my request is approved?',
          answer: 'Once approved, you\'ll receive contact details for an admin facilitator who will arrange a meeting or call between you and the host. The admin will guide you through discussing the arrangement details, expectations, and next steps.'
        }
      ]
    },
    {
      category: 'For Hosts',
      questions: [
        {
          question: 'How do I receive student requests?',
          answer: 'Once your profile is verified and complete, students can find you through the "Browse Hosts" page and submit facilitation requests. You\'ll receive notifications when students express interest, and you can review their profiles and requests in your "Host Dashboard".'
        },
        {
          question: 'What information can I see about students?',
          answer: 'You can view student profiles including their name, university, field of study, and a message they write when requesting to connect. This helps you determine if they would be a good match for your homestay.'
        },
        {
          question: 'Can I reject student requests?',
          answer: 'Yes, you can review each facilitation request and choose to accept or decline. When you accept a request, it moves to our admin team for final approval. If you decline, the student is notified and can browse other available hosts.'
        },
        {
          question: 'What services should I offer?',
          answer: 'Common services include meals (breakfast, lunch, dinner), internet access, use of kitchen facilities, laundry services, and airport pickup. You can select which services you offer when creating or updating your host profile.'
        },
        {
          question: 'How do I update my availability?',
          answer: 'You can update your profile at any time through your Host Dashboard. Use the "Edit Profile" option to update your availability, services offered, or other details. Changes will be visible to students browsing host profiles.'
        }
      ]
    },
    {
      category: 'Verification & Safety',
      questions: [
        {
          question: 'Why do I need to verify my account?',
          answer: 'Account verification ensures the safety and authenticity of all platform users. It helps build trust between students and hosts, and ensures that everyone using the platform is who they claim to be.'
        },
        {
          question: 'How long does verification take?',
          answer: 'Our admin team typically reviews verification documents within 24-48 hours of submission. You\'ll receive an email notification once your account is verified or if additional documentation is needed.'
        },
        {
          question: 'What is a DBS check and why is it required for hosts?',
          answer: 'A DBS (Disclosure and Barring Service) check is a background check required in the UK for roles involving vulnerable people. It\'s required for all hosts to ensure student safety. You can apply for a DBS check through the official UK government website.'
        },
        {
          question: 'What happens if my verification is rejected?',
          answer: 'If your verification is rejected, you\'ll receive an email explaining the reason. Common reasons include unclear document images or missing information. You can resubmit corrected documents for review. If you believe the rejection was made in error, contact our support team.'
        },
        {
          question: 'Is my personal information secure?',
          answer: 'Yes, we take data security seriously. All personal information is stored securely and encrypted. We only share necessary information between verified students and hosts through our admin facilitation process. We do not sell or share your data with third parties.'
        }
      ]
    },
    {
      category: 'Payments & Arrangements',
      questions: [
        {
          question: 'How do I pay for homestay arrangements?',
          answer: 'Payment arrangements are discussed and agreed upon directly between you and your host with guidance from the admin facilitator. Our platform facilitates the connection but does not process payments. You\'ll arrange payment terms during your initial meeting with the host.'
        },
        {
          question: 'What is typically included in homestay fees?',
          answer: 'Homestay fees typically include accommodation, selected meals (as agreed), utilities (electricity, water, heating), and internet access. Additional services like airport pickup or laundry may be included depending on your arrangement. Specific details should be clarified with your host before finalizing the arrangement.'
        },
        {
          question: 'Can I cancel an arrangement?',
          answer: 'Cancellation policies vary by arrangement. It\'s important to discuss cancellation terms with your host before confirming. If issues arise, contact your admin facilitator who can help mediate and find solutions.'
        },
        {
          question: 'What if I have issues with my homestay arrangement?',
          answer: 'If you encounter problems during your homestay, first try to discuss them politely with your host. If issues persist or are serious, contact your admin facilitator immediately. We take disputes seriously and will work to mediate and find appropriate solutions.'
        }
      ]
    },
    {
      category: 'Technical Support',
      questions: [
        {
          question: 'I forgot my password. How do I reset it?',
          answer: 'Click on "Forgot Password" on the login page. Enter your email address, and we\'ll send you a password reset link. Follow the instructions in the email to create a new password.'
        },
        {
          question: 'How do I update my profile information?',
          answer: 'Log in to your account and navigate to your dashboard. Click on "Edit Profile" to update your personal information, contact details, or preferences. Remember to save changes before leaving the page.'
        },
        {
          question: 'I\'m not receiving email notifications. What should I do?',
          answer: 'Check your spam/junk folder first. If emails are not there, verify that your email address is correct in your profile settings. You may need to add our email domain to your email provider\'s safe sender list. If problems persist, contact support.'
        },
        {
          question: 'The website is not working properly. What should I do?',
          answer: 'Try clearing your browser cache and cookies, then refresh the page. Make sure you\'re using an up-to-date browser (Chrome, Firefox, Safari, or Edge). If issues persist, contact our support team with details about the problem and your browser information.'
        },
        {
          question: 'How do I delete my account?',
          answer: 'To delete your account, please contact our support team. We\'ll need to verify your identity before processing the deletion. Please note that account deletion is permanent and cannot be undone.'
        }
      ]
    }
  ];

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Flatten all questions for searching
  const allQuestions = faqCategories.flatMap((category, catIndex) =>
    category.questions.map((q, qIndex) => ({
      ...q,
      category: category.category,
      globalIndex: `${catIndex}-${qIndex}`
    }))
  );

  const filteredQuestions = searchTerm
    ? allQuestions.filter(
        (item) =>
          item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-600 to-teal-800 text-white py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <HelpCircle className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-teal-100">
              Find answers to common questions about our homestay platform
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-white border-b">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for answers..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            {searchTerm && (
              <p className="mt-2 text-sm text-gray-600">
                Found {filteredQuestions.length} result{filteredQuestions.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-12">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {filteredQuestions ? (
              // Search Results
              <div className="space-y-4">
                {filteredQuestions.length === 0 ? (
                  <div className="text-center py-12">
                    <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No results found. Try different keywords.</p>
                  </div>
                ) : (
                  filteredQuestions.map((item, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200">
                      <button
                        onClick={() => toggleQuestion(item.globalIndex)}
                        className="w-full px-6 py-4 flex items-start justify-between text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1">
                          <span className="text-xs font-semibold text-teal-600 uppercase tracking-wide mb-1 block">
                            {item.category}
                          </span>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {item.question}
                          </h3>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          {openIndex === item.globalIndex ? (
                            <ChevronUp className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                      </button>
                      {openIndex === item.globalIndex && (
                        <div className="px-6 pb-4 text-gray-700 leading-relaxed">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            ) : (
              // Category View
              <div className="space-y-8">
                {faqCategories.map((category, catIndex) => (
                  <div key={catIndex}>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      {category.category}
                    </h2>
                    <div className="space-y-4">
                      {category.questions.map((item, qIndex) => {
                        const globalIndex = `${catIndex}-${qIndex}`;
                        return (
                          <div
                            key={qIndex}
                            className="bg-white rounded-lg shadow-sm border border-gray-200"
                          >
                            <button
                              onClick={() => toggleQuestion(globalIndex)}
                              className="w-full px-6 py-4 flex items-start justify-between text-left hover:bg-gray-50 transition-colors"
                            >
                              <h3 className="text-lg font-semibold text-gray-900 flex-1">
                                {item.question}
                              </h3>
                              <div className="ml-4 flex-shrink-0">
                                {openIndex === globalIndex ? (
                                  <ChevronUp className="w-5 h-5 text-gray-500" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 text-gray-500" />
                                )}
                              </div>
                            </button>
                            {openIndex === globalIndex && (
                              <div className="px-6 pb-4 text-gray-700 leading-relaxed">
                                {item.answer}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Still Have Questions Section */}
      <section className="py-12 bg-white border-t">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Still Have Questions?
            </h2>
            <p className="text-gray-600 mb-6">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="btn-primary">
                Contact Support
              </a>
              <a href="/help" className="btn-outline">
                Visit Help Center
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
