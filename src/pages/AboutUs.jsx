import { Heart, Shield, Users, Target, Award, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Community First',
      description: 'Building meaningful connections between students and hosts through mutual support.',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Safety & Trust',
      description: 'Comprehensive verification and safeguarding measures to protect all users.',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Accessibility',
      description: 'Making UK education accessible while addressing loneliness in our communities.',
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Excellence',
      description: 'Committed to providing a high-quality, reliable platform for everyone.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-purple-800 text-white py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              About Homestay Exchange
            </h1>
            <p className="text-xl text-purple-100 leading-relaxed">
              We're on a mission to make UK education more accessible while building
              meaningful intergenerational connections that combat loneliness and
              create lasting impact.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="card p-8 md:p-12">
              <div className="flex items-center space-x-3 mb-6">
                <Target className="w-10 h-10 text-purple-600" />
                <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Homestay Exchange connects students seeking affordable accommodation with
                hosts who need support with daily tasks. Through our innovative "barter"
                system, students provide services such as companionship, light cleaning,
                grocery shopping, or technology help in exchange for free or low-cost
                housing.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                This creates a win-win situation: students gain affordable housing near
                their universities, while hosts receive valuable assistance and
                companionship. Together, we're building a more connected, supportive
                community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <div key={index} className="card p-8">
                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Help Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              How We Help
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="card p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  For Students
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">✓</span>
                    Affordable accommodation near universities
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">✓</span>
                    Cultural immersion and language practice
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">✓</span>
                    Recognition for community service
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">✓</span>
                    Safe, verified living arrangements
                  </li>
                </ul>
              </div>

              <div className="card p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  For Hosts
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">✓</span>
                    Companionship and social connection
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">✓</span>
                    Help with daily tasks and errands
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">✓</span>
                    Cultural exchange opportunities
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">✓</span>
                    Fully vetted, background-checked students
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-purple-600 to-purple-800 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join our community today and start building meaningful connections.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/host/signup" className="btn-primary bg-white text-purple-700 hover:bg-purple-50">
              Become a Host
            </Link>
            <Link to="/student/signup" className="btn-outline border-white text-white hover:bg-white/10">
              Find a Host
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <Mail className="w-16 h-16 text-purple-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Questions? We're Here to Help
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Get in touch with our team for more information about Homestay Exchange.
            </p>
            <Link to="/contact" className="btn-primary">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
