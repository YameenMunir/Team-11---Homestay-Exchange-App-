import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Book,
  FileText,
  Scale,
  Heart,
  Users,
  Briefcase,
  Home,
  Shield,
  ExternalLink,
  Search,
  Download,
  BookOpen
} from 'lucide-react';

export default function KnowledgeHub() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Resources', icon: Book },
    { id: 'rights', name: 'Your Rights', icon: Scale },
    { id: 'safeguarding', name: 'Safeguarding', icon: Shield },
    { id: 'housing', name: 'Housing & Tenancy', icon: Home },
    { id: 'wellbeing', name: 'Well-being', icon: Heart },
    { id: 'volunteering', name: 'Volunteering', icon: Users },
    { id: 'employment', name: 'Employment', icon: Briefcase }
  ];

  const resources = [
    {
      id: 1,
      title: 'Student Rights in the UK',
      category: 'rights',
      description: 'Comprehensive guide to your legal rights as an international student in the UK',
      type: 'Guide',
      readTime: '10 min',
      downloadable: true,
      externalLink: null
    },
    {
      id: 2,
      title: 'Understanding Your Tenancy Agreement',
      category: 'housing',
      description: 'What you need to know about tenancy agreements and your responsibilities',
      type: 'Guide',
      readTime: '8 min',
      downloadable: true,
      externalLink: null
    },
    {
      id: 3,
      title: 'Safeguarding and Safety Best Practices',
      category: 'safeguarding',
      description: 'Essential safety information and what to do if you feel unsafe',
      type: 'Guide',
      readTime: '12 min',
      downloadable: false,
      externalLink: null
    },
    {
      id: 4,
      title: 'Mental Health Support Services',
      category: 'wellbeing',
      description: 'Free mental health resources and support services available to students',
      type: 'Resource List',
      readTime: '5 min',
      downloadable: false,
      externalLink: null
    },
    {
      id: 5,
      title: 'UK Equality Act 2010',
      category: 'rights',
      description: 'Your rights under the Equality Act and protected characteristics',
      type: 'Legal Reference',
      readTime: '15 min',
      downloadable: true,
      externalLink: 'https://www.gov.uk/guidance/equality-act-2010-guidance'
    },
    {
      id: 6,
      title: 'Volunteering While Studying',
      category: 'volunteering',
      description: 'Opportunities and guidelines for volunteering as an international student',
      type: 'Guide',
      readTime: '7 min',
      downloadable: false,
      externalLink: null
    },
    {
      id: 7,
      title: 'Student Visa Work Rights',
      category: 'employment',
      description: 'Understanding work restrictions and rights on a student visa',
      type: 'Legal Reference',
      readTime: '6 min',
      downloadable: true,
      externalLink: null
    },
    {
      id: 8,
      title: 'Reporting Discrimination',
      category: 'rights',
      description: 'How to report discrimination and where to get help',
      type: 'Guide',
      readTime: '8 min',
      downloadable: false,
      externalLink: null
    },
    {
      id: 9,
      title: 'Accommodation Standards',
      category: 'housing',
      description: 'Minimum standards for rented accommodation in the UK',
      type: 'Legal Reference',
      readTime: '10 min',
      downloadable: true,
      externalLink: null
    },
    {
      id: 10,
      title: 'Cultural Integration Tips',
      category: 'wellbeing',
      description: 'Advice for adjusting to life in the UK and building connections',
      type: 'Guide',
      readTime: '12 min',
      downloadable: false,
      externalLink: null
    },
    {
      id: 11,
      title: 'DBS Check Explained',
      category: 'safeguarding',
      description: 'What is a DBS check and why it matters for homestay arrangements',
      type: 'Explainer',
      readTime: '5 min',
      downloadable: false,
      externalLink: null
    },
    {
      id: 12,
      title: 'Financial Support Resources',
      category: 'wellbeing',
      description: 'Available financial support and hardship funds for students',
      type: 'Resource List',
      readTime: '7 min',
      downloadable: false,
      externalLink: null
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getTypeColor = (type) => {
    const colors = {
      'Guide': 'bg-purple-100 text-purple-700',
      'Legal Reference': 'bg-blue-100 text-blue-700',
      'Resource List': 'bg-green-100 text-green-700',
      'Explainer': 'bg-orange-100 text-orange-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

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

      {/* Search and Filter Section */}
      <div className="max-w-6xl mx-auto px-4 -mt-8 mb-8">
        <div className="card">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resources..."
              className="input-field pl-12"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        {filteredResources.length === 0 ? (
          <div className="card text-center py-12">
            <Book className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No resources found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <div key={resource.id} className="card-hover">
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded ${getTypeColor(resource.type)}`}>
                    {resource.type}
                  </span>
                  <span className="text-xs text-gray-500">{resource.readTime} read</span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {resource.title}
                </h3>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {resource.description}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/knowledge-hub/${resource.id}`)}
                    className="btn-outline flex-1 text-sm"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Read
                  </button>
                  {resource.downloadable && (
                    <button
                      onClick={() => {
                        console.log('Downloading resource:', resource.id);
                        // TODO: Implement download
                      }}
                      className="btn-secondary"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                  {resource.externalLink && (
                    <a
                      href={resource.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                      title="Open external link"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
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
