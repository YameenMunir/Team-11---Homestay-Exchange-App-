import { useNavigate } from 'react-router-dom';
import {
  Home,
  Users,
  Shield,
  Heart,
  CheckCircle,
  Star,
  TrendingUp,
  Globe,
  BookOpen,
  Scale,
  Download,
  ExternalLink,
  ArrowRight,
  Play
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const stats = [
    { icon: Users, value: '500+', label: 'Active Arrangements' },
    { icon: Home, value: '300+', label: 'Verified Hosts' },
    { icon: Star, value: '4.8/5', label: 'Average Rating' },
    { icon: TrendingUp, value: '95%', label: 'Satisfaction Rate' }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Safe & Verified',
      description: 'All hosts undergo DBS checks and document verification for your safety'
    },
    {
      icon: Heart,
      title: 'Fair Exchange',
      description: 'Barter-style arrangements: affordable housing in exchange for light help'
    },
    {
      icon: Scale,
      title: 'Legal Compliance',
      description: 'Full compliance with UK housing laws and equality regulations'
    },
    {
      icon: Globe,
      title: 'Accessible Platform',
      description: 'Senior-friendly, voice guidance, and screen reader compatible'
    }
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Sign Up',
      description: 'Create your profile and complete verification (students: ID + admission letter; hosts: ID + DBS + utility bill)'
    },
    {
      step: 2,
      title: 'Browse & Match',
      description: 'Students browse verified hosts or tasks. Hosts review student applicants'
    },
    {
      step: 3,
      title: 'Request Facilitation',
      description: 'Our team coordinates introductions and ensures both parties are comfortable'
    },
    {
      step: 4,
      title: 'Start Living',
      description: 'Move in and begin your arrangement with ongoing support from our team'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'International Student, King\'s College London',
      rating: 5,
      text: 'Homestay Exchange helped me find affordable accommodation close to campus. My host is wonderful, and I love helping with grocery shopping!',
      image: 'https://i.pravatar.cc/150?img=5'
    },
    {
      name: 'Margaret Thompson',
      role: 'Host, Kensington',
      rating: 5,
      text: 'Having a student stay with me has been a joy. I get the help I need with daily tasks, and she brings such positive energy to my home.',
      image: 'https://i.pravatar.cc/150?img=47'
    }
  ];

  const resources = [
    {
      title: 'Student Rights Guide',
      description: 'Comprehensive guide to your legal rights in UK student housing',
      downloadable: true
    },
    {
      title: 'Safeguarding Policy',
      description: 'Our commitment to safety and safeguarding best practices',
      link: '/anti-discrimination'
    },
    {
      title: 'Dispute Resolution',
      description: 'Fair and transparent process for resolving any issues',
      link: '/dispute-resolution'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 animate-fade-in">
              Affordable Student Housing<br />Through Community Connection
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto mb-8">
              Connecting international students with welcoming hosts for affordable accommodation in exchange for light help and companionship
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => navigate('/student/signup')}
                className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-purple-50 transition-colors flex items-center gap-2 text-lg"
              >
                Get Started as Student
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/host/signup')}
                className="bg-purple-800 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-900 transition-colors border-2 border-white/20 text-lg"
              >
                Become a Host
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Why Choose Homestay Exchange?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We combine safety, affordability, and community to create meaningful housing solutions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-purple-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in four simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item) => (
              <div key={item.step} className="relative">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-purple-100 h-full">
                  <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                {item.step < 4 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-8 h-8 text-purple-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              Hear from our community members
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resources Section */}
      <div className="bg-gray-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <BookOpen className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Legal Guidance & Resources
            </h2>
            <p className="text-xl text-gray-600">
              Access comprehensive information about your rights and responsibilities
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {resources.map((resource, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
                <p className="text-gray-600 mb-4 text-sm">{resource.description}</p>
                {resource.downloadable ? (
                  <button className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                ) : (
                  <button
                    onClick={() => navigate(resource.link)}
                    className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Read More
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate('/knowledge-hub')}
              className="btn-primary inline-flex items-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              Visit Knowledge Hub
            </button>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join our community of students and hosts creating meaningful connections
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => navigate('/student/signup')}
              className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-purple-50 transition-colors text-lg"
            >
              Sign Up as Student
            </button>
            <button
              onClick={() => navigate('/host/signup')}
              className="bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-900 transition-colors border-2 border-white/20 text-lg"
            >
              Sign Up as Host
            </button>
          </div>
          <p className="mt-6 text-purple-100">
            Already have an account?{' '}
            <button onClick={() => navigate('/student/login')} className="underline hover:text-white">
              Log in here
            </button>
          </p>
        </div>
      </div>

      {/* Footer Note */}
      <div className="bg-gray-900 text-gray-300 py-8 px-4 text-center text-sm">
        <p>
          Homestay Exchange is committed to equality, safeguarding, and legal compliance in all our services.
        </p>
      </div>
    </div>
  );
}
