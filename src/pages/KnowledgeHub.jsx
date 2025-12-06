import { useNavigate } from 'react-router-dom';
import {
  Heart,
  Users,
  Home,
  Shield,
  ExternalLink,
  BookOpen,
  Globe,
  Award,
  HandHeart
} from 'lucide-react';

export default function KnowledgeHub() {
  const navigate = useNavigate();

  // Featured Community Resources for Quick Access
  const featuredCommunityResources = [
    {
      title: 'Homestay Rights & Responsibilities',
      description: 'Essential information about your rights in homestay arrangements',
      icon: Home,
      link: 'https://www.citizensadvice.org.uk/housing/renting-a-home/',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Housing Rights for Students',
      description: 'Know your housing rights as an international student',
      icon: Shield,
      link: 'https://www.gov.uk/private-renting',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'UKCISA Student Support',
      description: 'Expert guidance and support for international students in the UK',
      icon: Globe,
      link: 'https://www.ukcisa.org.uk/',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Volunteering Opportunities',
      description: 'UK charity creating volunteering opportunities for students',
      icon: HandHeart,
      link: 'https://volunteeringmatters.org.uk/',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Knowledge Hub
          </h1>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
            Your comprehensive resource center for rights, safety, housing information, and well-being support
          </p>
        </div>
      </div>

      {/* Featured Community & Integration Resources */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8 border border-purple-200 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-purple-600 rounded-lg p-2">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Community & Integration
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Essential resources for homestay, housing rights, and volunteering opportunities
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCommunityResources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <a
                  key={index}
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-purple-300"
                  aria-label={`${resource.title} - Opens in new window`}
                >
                  <div className={`bg-gradient-to-br ${resource.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {resource.description}
                  </p>
                  <div className="flex items-center gap-2 text-purple-600 text-sm font-medium">
                    <span>Visit Resource</span>
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Additional Community Resources - Comprehensive List */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-purple-100 rounded-lg p-2">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Additional Resources & Support
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Homestay & Housing Section */}
            <div className="bg-blue-50 rounded-lg p-5 border border-blue-200 hover:border-blue-300 transition-colors">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-blue-600 rounded-md p-1.5">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">Homestay & Housing Rights</h3>
              </div>
              <ul className="space-y-3" role="list">
                <li>
                  <a
                    href="https://www.citizensadvice.org.uk/housing/renting-a-home/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline group"
                    aria-label="Citizens Advice - Renting a Home - Opens in new window"
                  >
                    <ExternalLink className="w-4 h-4 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    <span>Citizens Advice - Renting a Home</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.shelter.org.uk/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline group"
                    aria-label="Shelter - Housing Advice - Opens in new window"
                  >
                    <ExternalLink className="w-4 h-4 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    <span>Shelter - Expert Housing Advice</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://homeshare.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline group"
                    aria-label="Homeshare International - Opens in new window"
                  >
                    <ExternalLink className="w-4 h-4 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    <span>Homeshare International</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.depositprotection.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline group"
                    aria-label="The Deposit Protection Service - Opens in new window"
                  >
                    <ExternalLink className="w-4 h-4 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    <span>Deposit Protection Service</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Volunteering Section */}
            <div className="bg-green-50 rounded-lg p-5 border border-green-200 hover:border-green-300 transition-colors">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-green-600 rounded-md p-1.5">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">Volunteering Opportunities</h3>
              </div>
              <ul className="space-y-3" role="list">
                <li>
                  <a
                    href="https://www.ncvo.org.uk/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-green-600 hover:text-green-800 hover:underline group"
                    aria-label="NCVO - National Council for Voluntary Organisations - Opens in new window"
                  >
                    <ExternalLink className="w-4 h-4 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    <span>NCVO - Volunteering Resources</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://volunteeringmatters.org.uk/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-green-600 hover:text-green-800 hover:underline group"
                    aria-label="Volunteering Matters - Opens in new window"
                  >
                    <ExternalLink className="w-4 h-4 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    <span>Volunteering Matters</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Student Support Section */}
            <div className="bg-purple-50 rounded-lg p-5 border border-purple-200 hover:border-purple-300 transition-colors">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-purple-600 rounded-md p-1.5">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">International Student Support</h3>
              </div>
              <ul className="space-y-3" role="list">
                <li>
                  <a
                    href="https://www.ukcisa.org.uk/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800 hover:underline group"
                    aria-label="UKCISA - International Student Support - Opens in new window"
                  >
                    <ExternalLink className="w-4 h-4 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    <span>UKCISA - Student Support & Advice</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.englishuk.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800 hover:underline group"
                    aria-label="English UK - Language Learning - Opens in new window"
                  >
                    <ExternalLink className="w-4 h-4 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    <span>English UK - Language Learning</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.meetup.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800 hover:underline group"
                    aria-label="Meetup - Local Community Groups - Opens in new window"
                  >
                    <ExternalLink className="w-4 h-4 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    <span>Meetup - Local Community Groups</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources for Hosts Section */}
            <div className="bg-orange-50 rounded-lg p-5 border border-orange-200 hover:border-orange-300 transition-colors">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-orange-600 rounded-md p-1.5">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">Resources for Hosts</h3>
              </div>
              <ul className="space-y-3" role="list">
                <li>
                  <a
                    href="https://www.ageuk.org.uk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-800 hover:underline group"
                    aria-label="Age UK - Support for Older People - Opens in new window"
                  >
                    <ExternalLink className="w-4 h-4 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    <span>Age UK - Hosting Resources</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://homeshare.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-800 hover:underline group"
                    aria-label="Homeshare International - Opens in new window"
                  >
                    <ExternalLink className="w-4 h-4 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    <span>Homeshare International</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>


      {/* Bottom CTA */}
      <div className="bg-purple-50 border-t border-purple-100 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-gray-600 mb-6">
            Our support team is here to help with any questions or concerns
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => navigate('/contact')}
              className="btn-primary"
            >
              Contact Support
            </button>
            <button
              onClick={() => navigate('/help')}
              className="btn-outline"
            >
              Visit Help Center
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
