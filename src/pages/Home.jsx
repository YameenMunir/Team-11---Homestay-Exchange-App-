import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
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
  Sparkles,
  Award,
  TrendingUp,
  Globe,
  Clock,
  Zap,
  User,
} from 'lucide-react';
import { reviewsService } from '../services/reviewsService';

const Home = () => {
  const [topReviews, setTopReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  useEffect(() => {
    const fetchTopReviews = async () => {
      try {
        const reviews = await reviewsService.getTopReviews(3);
        setTopReviews(reviews);
      } catch (error) {
        console.error('Error fetching top reviews:', error);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    fetchTopReviews();
  }, []);
  const statistics = [
    {
      icon: <Users className="w-8 h-8" />,
      number: '500+',
      label: 'Active Users',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
    {
      icon: <HomeIcon className="w-8 h-8" />,
      number: '200+',
      label: 'Successful Matches',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
    },
    {
      icon: <Star className="w-8 h-8" />,
      number: '4.8/5',
      label: 'Average Rating',
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
    },
    {
      icon: <Award className="w-8 h-8" />,
      number: '98%',
      label: 'Satisfaction Rate',
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-100',
      textColor: 'text-teal-600',
    },
  ];

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Safe & Verified',
      description:
        'All hosts and students undergo thorough verification including ID checks and background screening.',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Perfect Matching',
      description:
        'Our smart matching system connects you based on location, needs, and preferences.',
      gradient: 'from-teal-500 to-teal-600',
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Build Relationships',
      description:
        'Create meaningful connections while providing companionship and support.',
      gradient: 'from-pink-500 to-pink-600',
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: 'Trusted Reviews',
      description:
        'Two-way rating system ensures transparency and builds community trust.',
      gradient: 'from-amber-500 to-amber-600',
    },
  ];

  // Fallback testimonials if no reviews are available
  const fallbackTestimonials = [
    {
      name: 'Sarah Johnson',
      role: 'International Student',
      image: '👩‍🎓',
      quote: 'Finding affordable accommodation seemed impossible until I discovered Homestay Exchange. Now I have a safe home and a wonderful host family!',
      rating: 5,
    },
    {
      name: 'Margaret Thompson',
      role: 'Host',
      image: '👵',
      quote: 'Having a student stay with me has brought so much joy to my life. The companionship and help around the house is invaluable.',
      rating: 5,
    },
    {
      name: 'David Chen',
      role: 'University Student',
      image: '👨‍🎓',
      quote: 'This platform made my UK education dream possible. I get accommodation while helping someone in need. It\'s a win-win!',
      rating: 5,
    },
  ];

  // Helper function to get role display name
  const getRoleDisplayName = (role) => {
    if (!role) return 'User';
    switch (role.toLowerCase()) {
      case 'host':
        return 'Host';
      case 'guest':
        return 'Student';
      default:
        return role.charAt(0).toUpperCase() + role.slice(1);
    }
  };

  // Helper function to get initials from name
  const getInitials = (name) => {
    if (!name || name === 'Anonymous User') return '?';
    const names = name.trim().split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

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
    <div className="bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 text-white overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient Orbs */}
          <div className="absolute top-20 -left-20 w-72 h-72 md:w-96 md:h-96 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 -right-20 w-72 h-72 md:w-96 md:h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute -bottom-20 left-1/3 w-72 h-72 md:w-96 md:h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>
        </div>

        <div className="container-custom relative z-10">
          <div className="py-16 md:py-20 lg:py-24">
            <div className="max-w-4xl mx-auto">
              {/* Badge */}
              <div className="flex justify-center mb-6 md:mb-8 animate-fade-in">
                <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 md:px-6 py-2 md:py-3 rounded-full border border-white/20">
                  <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-teal-200" />
                  <span className="text-sm md:text-base text-white font-medium">Trusted by 500+ Students & Hosts</span>
                  <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-teal-200" />
                </div>
              </div>

              {/* Main Heading */}
              <div className="text-center animate-fade-in">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 md:mb-6 leading-tight px-2">
                  Making UK Education{' '}
                  <span className="relative inline-block">
                    <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-cyan-200 to-teal-200">
                      Accessible
                    </span>
                    <span className="absolute bottom-1 md:bottom-2 left-0 w-full h-2 md:h-3 bg-teal-400/40 rounded"></span>
                  </span>
                  {' '}Through Community
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-teal-50/90 mb-8 md:mb-10 leading-relaxed max-w-2xl mx-auto px-4">
                  Connect students seeking affordable accommodation with hosts who need support.
                  <span className="font-semibold text-white"> Exchange help for housing</span> in a safe, verified community.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mb-8 md:mb-10 px-4">
                  <Link
                    to="/host/signup"
                    className="group w-full sm:w-auto min-w-[180px] px-6 md:px-8 py-3 md:py-4 bg-white text-teal-700 font-semibold rounded-xl
                             hover:bg-teal-50 active:bg-teal-100
                             shadow-xl hover:shadow-2xl hover:shadow-teal-500/30
                             transform hover:-translate-y-1
                             transition-all duration-300
                             focus:outline-none focus:ring-4 focus:ring-white/50
                             text-base md:text-lg flex items-center justify-center"
                  >
                    I'm a Host
                    <ArrowRight className="inline-block ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/student/signup"
                    className="group w-full sm:w-auto min-w-[180px] px-6 md:px-8 py-3 md:py-4 bg-teal-500/80 text-white font-semibold rounded-xl
                             border-2 border-white/30
                             hover:bg-teal-400 active:bg-teal-600
                             shadow-xl hover:shadow-2xl hover:shadow-teal-300/30
                             transform hover:-translate-y-1
                             transition-all duration-300
                             focus:outline-none focus:ring-4 focus:ring-white/50
                             text-base md:text-lg flex items-center justify-center"
                  >
                    I'm a Student
                    <ArrowRight className="inline-block ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 px-4 pb-4">
                  <div className="flex items-center gap-2 bg-green-500/20 backdrop-blur-sm px-5 md:px-6 py-3 rounded-full border border-green-400/40">
                    <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
                    <span className="text-sm md:text-base font-semibold text-white">Fully Verified</span>
                  </div>
                  <div className="flex items-center gap-2 bg-green-500/20 backdrop-blur-sm px-5 md:px-6 py-3 rounded-full border border-green-400/40">
                    <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
                    <span className="text-sm md:text-base font-semibold text-white">DBS Checked</span>
                  </div>
                  <div className="flex items-center gap-2 bg-green-500/20 backdrop-blur-sm px-5 md:px-6 py-3 rounded-full border border-green-400/40">
                    <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
                    <span className="text-sm md:text-base font-semibold text-white">Safe & Secure</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="relative -mb-1">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
            preserveAspectRatio="none"
          >
            <path
              d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
              fill="#f9fafb"
            />
          </svg>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 md:py-16 bg-gray-50 -mt-1">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {statistics.map((stat, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-6 md:p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} text-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>
                <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-br ${stat.color} bg-clip-text text-transparent mb-2`}>
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 relative">
        {/* Decorative element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-100 rounded-full filter blur-3xl opacity-20"></div>

        <div className="container-custom relative">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full font-medium mb-4">
              <Zap className="w-4 h-4" />
              <span>Why Choose Us</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-4">
              Why Choose Homestay Exchange?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              A trusted platform designed for safety, accessibility, and meaningful connections.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-up border border-gray-100 overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                <div className="relative z-10">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} text-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-teal-100 to-blue-100 text-teal-700 px-4 py-2 rounded-full font-medium mb-4">
              <TrendingUp className="w-4 h-4" />
              <span>Simple Process</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Getting started is simple. Follow these four easy steps to begin your journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {howItWorks.map((step, index) => (
              <div key={index} className="relative">
                {/* Connection Line */}
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-1 bg-gradient-to-r from-teal-400 to-teal-200 -z-10" style={{ width: 'calc(100% - 2rem)' }}></div>
                )}

                <div className="relative group">
                  {/* Step Card */}
                  <div className="bg-white rounded-2xl p-6 text-center border-2 border-gray-100 group-hover:border-teal-300 transition-all duration-300 group-hover:shadow-xl">
                    {/* Step Number */}
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 text-white text-2xl font-bold rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300 relative">
                      {step.step}
                      <div className="absolute -inset-1 bg-gradient-to-br from-teal-400 to-teal-500 rounded-full -z-10 opacity-50 group-hover:opacity-100 transition-opacity blur"></div>
                    </div>

                    {/* Icon */}
                    <div className="w-20 h-20 bg-gradient-to-br from-teal-50 to-blue-50 text-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-300">
                      {step.icon}
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Link
              to="/student/signup"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold rounded-xl hover:from-teal-700 hover:to-teal-800 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-100 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-20"></div>

        <div className="container-custom relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-4 py-2 rounded-full font-medium mb-4">
              <Star className="w-4 h-4" />
              <span>Success Stories</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-4">
              What Our Community Says
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Real stories from students and hosts who found their perfect match.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoadingReviews ? (
              // Loading skeleton
              [...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 animate-pulse"
                >
                  <div className="flex items-center mb-4 space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-5 h-5 bg-gray-200 rounded" />
                    ))}
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                    <div className="h-4 bg-gray-200 rounded w-4/6" />
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full" />
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-24" />
                      <div className="h-3 bg-gray-200 rounded w-16" />
                    </div>
                  </div>
                </div>
              ))
            ) : topReviews.length > 0 ? (
              // Display real reviews from database
              topReviews.map((review, index) => (
                <div
                  key={review.id}
                  className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Rating Stars */}
                  <div className="flex items-center mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-gray-700 leading-relaxed mb-6 italic line-clamp-4">
                    "{review.reviewText}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                      review.authorRole === 'host'
                        ? 'bg-gradient-to-br from-orange-500 to-orange-600'
                        : 'bg-gradient-to-br from-teal-500 to-teal-600'
                    }`}>
                      {review.isAnonymous ? (
                        <User className="w-6 h-6" />
                      ) : (
                        getInitials(review.author)
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{review.author}</div>
                      <div className={`text-sm ${
                        review.authorRole === 'host' ? 'text-orange-600' : 'text-teal-600'
                      }`}>
                        {getRoleDisplayName(review.authorRole)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Fallback to static testimonials if no reviews
              fallbackTestimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Rating Stars */}
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-gray-700 leading-relaxed mb-6 italic">
                    "{testimonial.quote}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{testimonial.image}</div>
                    <div>
                      <div className="font-bold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-teal-600">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* View All Reviews Button */}
          <div className="text-center mt-12">
            <Link
              to="/reviews"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-teal-700 hover:to-teal-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <MessageCircle className="w-5 h-5" />
              <span>View All Reviews</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white relative">
        <div className="container-custom">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-100 to-teal-100 text-green-700 px-4 py-2 rounded-full font-medium mb-4">
              <Heart className="w-4 h-4" />
              <span>Win-Win Solution</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-4">
              Benefits for Everyone
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Discover how Homestay Exchange creates value for both students and hosts.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
            {/* Students Benefits */}
            <div className="group relative bg-gradient-to-br from-teal-50 via-white to-blue-50 rounded-3xl p-8 lg:p-10 border-2 border-teal-100 hover:border-teal-300 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-200 rounded-full filter blur-3xl opacity-20"></div>

              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-10 h-10" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                  For Students
                </h3>
                <ul className="space-y-4 mb-8">
                  {benefits.students.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-3 group/item">
                      <CheckCircle className="w-6 h-6 text-teal-600 flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform" />
                      <span className="text-gray-700 text-lg leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/student/signup"
                  className="group/btn inline-flex items-center justify-center space-x-2 w-full px-8 py-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold rounded-xl hover:from-teal-700 hover:to-teal-800 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  <span>Get Started as a Student</span>
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Hosts Benefits */}
            <div className="group relative bg-gradient-to-br from-orange-50 via-white to-amber-50 rounded-3xl p-8 lg:p-10 border-2 border-orange-100 hover:border-orange-300 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200 rounded-full filter blur-3xl opacity-20"></div>

              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <HomeIcon className="w-10 h-10" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                  For Hosts
                </h3>
                <ul className="space-y-4 mb-8">
                  {benefits.hosts.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-3 group/item">
                      <CheckCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform" />
                      <span className="text-gray-700 text-lg leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/host/signup"
                  className="group/btn inline-flex items-center justify-center space-x-2 w-full px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-semibold rounded-xl hover:from-orange-700 hover:to-orange-800 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  <span>Get Started as a Host</span>
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-900 text-white overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="container-custom text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 mb-8">
              <Globe className="w-5 h-5 text-teal-200" />
              <span className="text-white font-medium">Join Our Growing Community</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight">
              Ready to Get Started?
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-teal-50 mb-12 leading-relaxed max-w-3xl mx-auto">
              Join our community today and start building meaningful connections.
              <span className="block mt-2 font-semibold text-white">Your journey begins here.</span>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                to="/host/signup"
                className="group w-full sm:w-auto px-8 py-5 bg-white text-teal-700 font-bold rounded-xl
                         hover:bg-teal-50 shadow-2xl hover:shadow-teal-300/50
                         transform hover:-translate-y-1 hover:scale-105 transition-all duration-300
                         text-lg flex items-center justify-center"
              >
                Become a Host
                <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/student/signup"
                className="group w-full sm:w-auto px-8 py-5 bg-teal-500 border-2 border-white/40 text-white font-bold rounded-xl
                         hover:bg-teal-400 shadow-2xl hover:shadow-white/20
                         transform hover:-translate-y-1 hover:scale-105 transition-all duration-300
                         text-lg flex items-center justify-center"
              >
                Find a Host
                <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Trust Elements */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-teal-50">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span className="text-sm">Quick Setup</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span className="text-sm">100% Secure</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm">No Hidden Fees</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
