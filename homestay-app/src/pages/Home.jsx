import { Link } from 'react-router-dom';
import {
  Home as HomeIcon,
  Users,
  Shield,
  Heart,
  Search,
  UserCheck,
  MessageCircle,
  Star,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Safe & Verified',
      description:
        'All hosts and students undergo thorough verification including ID checks and background screening.',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Perfect Matching',
      description:
        'Our smart matching system connects you based on location, needs, and preferences.',
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Build Relationships',
      description:
        'Create meaningful connections while providing companionship and support.',
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: 'Trusted Reviews',
      description:
        'Two-way rating system ensures transparency and builds community trust.',
    },
  ];

  const howItWorks = [
    {
      icon: <UserCheck className="w-12 h-12" />,
      title: 'Create Your Profile',
      description: 'Sign up as a host or student and complete verification.',
      step: '1',
    },
    {
      icon: <Search className="w-12 h-12" />,
      title: 'Browse & Match',
      description: 'Find the perfect match based on your needs and location.',
      step: '2',
    },
    {
      icon: <MessageCircle className="w-12 h-12" />,
      title: 'Get Facilitated',
      description: 'Our team helps arrange and coordinate your homestay.',
      step: '3',
    },
    {
      icon: <HomeIcon className="w-12 h-12" />,
      title: 'Start Your Stay',
      description: 'Begin building relationships and making a difference.',
      step: '4',
    },
  ];

  const benefits = {
    students: [
      'Free or low-cost accommodation',
      'Cultural immersion experience',
      'Build meaningful connections',
      'Recognition for community service',
      'Flexible arrangements',
    ],
    hosts: [
      'Companionship and support',
      'Help with daily tasks',
      'Combat loneliness',
      'Cultural exchange opportunities',
      'Fully vetted students',
    ],
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="container-custom relative">
          <div className="py-20 md:py-28 lg:py-32">
            <div className="max-w-4xl mx-auto text-center animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight">
                Making UK Education Accessible Through{' '}
                <span className="text-purple-200">Community</span>
              </h1>
              <p className="text-xl md:text-2xl text-purple-100 mb-10 leading-relaxed max-w-3xl mx-auto">
                Connect students seeking affordable accommodation with hosts who
                need support. Exchange help for housing in a safe, verified
                community.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <Link
                  to="/host/signup"
                  className="w-full sm:w-auto px-8 py-4 bg-white text-purple-700 font-semibold rounded-xl
                           hover:bg-purple-50 active:bg-purple-100
                           shadow-xl hover:shadow-2xl
                           transform hover:-translate-y-1
                           transition-all duration-200
                           focus:outline-none focus:ring-4 focus:ring-white/50
                           text-lg"
                >
                  I'm a Host
                  <ArrowRight className="inline-block ml-2 w-5 h-5" />
                </Link>
                <Link
                  to="/student/signup"
                  className="w-full sm:w-auto px-8 py-4 bg-purple-500 text-white font-semibold rounded-xl
                           border-2 border-white/30
                           hover:bg-purple-600 active:bg-purple-700
                           shadow-xl hover:shadow-2xl
                           transform hover:-translate-y-1
                           transition-all duration-200
                           focus:outline-none focus:ring-4 focus:ring-white/50
                           text-lg"
                >
                  I'm a Student
                  <ArrowRight className="inline-block ml-2 w-5 h-5" />
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center gap-8 text-purple-100">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm md:text-base">Fully Verified</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm md:text-base">DBS Checked</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm md:text-base">Safe & Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            <path
              d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
              fill="#f9fafb"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Why Choose Host Family Stay?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A trusted platform designed for safety, accessibility, and meaningful connections.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card p-8 text-center hover:shadow-xl transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Getting started is simple. Follow these four easy steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="relative">
                {/* Connection Line */}
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-purple-200 -z-10"></div>
                )}

                <div className="text-center">
                  {/* Step Number */}
                  <div className="w-16 h-16 bg-purple-600 text-white text-2xl font-bold rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    {step.step}
                  </div>

                  {/* Icon */}
                  <div className="w-20 h-20 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    {step.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Benefits for Everyone
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Students Benefits */}
            <div className="card p-8 lg:p-10">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                For Students
              </h3>
              <ul className="space-y-4">
                {benefits.students.map((benefit, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-lg">{benefit}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/student/signup"
                className="btn-primary w-full mt-8 text-center block"
              >
                Get Started as a Student
              </Link>
            </div>

            {/* Hosts Benefits */}
            <div className="card p-8 lg:p-10">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-xl flex items-center justify-center mb-6">
                <HomeIcon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                For Hosts
              </h3>
              <ul className="space-y-4">
                {benefits.hosts.map((benefit, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-lg">{benefit}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/host/signup"
                className="btn-primary w-full mt-8 text-center block bg-purple-600 hover:bg-purple-700 active:bg-purple-800 focus:ring-purple-300"
              >
                Get Started as a Host
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 to-purple-800 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-purple-100 mb-10 max-w-2xl mx-auto">
            Join our community today and start building meaningful connections.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/host/signup"
              className="w-full sm:w-auto px-8 py-4 bg-white text-purple-700 font-semibold rounded-xl
                       hover:bg-purple-50 shadow-xl hover:shadow-2xl
                       transform hover:-translate-y-1 transition-all duration-200
                       text-lg"
            >
              Become a Host
            </Link>
            <Link
              to="/student/signup"
              className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl
                       hover:bg-white/10 shadow-xl hover:shadow-2xl
                       transform hover:-translate-y-1 transition-all duration-200
                       text-lg"
            >
              Find a Host
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
