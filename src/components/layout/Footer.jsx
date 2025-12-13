import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container-custom px-4 sm:px-6">
        {/* Main Footer Content */}
        <div className="py-8 sm:py-10 md:py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* About Section */}
          <div>
            <div className="mb-4">
              <img
                src="/homestay-logo.jpg"
                alt="Homestay Exchange Logo"
                className="h-16 w-auto object-contain mb-2"
              />
              <h3 className="text-white font-display font-bold text-lg">
                Homestay Exchange
              </h3>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Connecting students with welcoming hosts to create meaningful
              relationships while making education more accessible.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-9 h-9 bg-gray-800 hover:bg-teal-600 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-gray-800 hover:bg-teal-600 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-gray-800 hover:bg-teal-600 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-gray-800 hover:bg-teal-600 rounded-lg flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors" aria-label="Home - Go to homepage">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/student/browse" className="hover:text-white transition-colors" aria-label="Browse Hosts - Find accommodation">
                  Browse Hosts
                </Link>
              </li>
              <li>
                <Link to="/knowledge-hub" className="hover:text-white transition-colors" aria-label="Knowledge Hub - Access resources and guides">
                  Knowledge Hub
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-white transition-colors" aria-label="Help and Support - Get assistance">
                  Help & Support
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors" aria-label="FAQ - Frequently asked questions">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors" aria-label="About Us - Learn about Homestay Exchange">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors" aria-label="Contact Us - Get in touch">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terms" className="hover:text-white transition-colors" aria-label="Terms and Conditions - Read our terms of service">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors" aria-label="Privacy Policy - How we handle your data">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/anti-discrimination" className="hover:text-white transition-colors" aria-label="Anti-Discrimination Policy - Our commitment to equality">
                  Anti-Discrimination Policy
                </Link>
              </li>
              <li>
                <Link to="/dispute-resolution" className="hover:text-white transition-colors" aria-label="Dispute Resolution - How we handle conflicts">
                  Dispute Resolution
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <a href="mailto:admin@hostfamilystay.com" className="hover:text-white transition-colors" aria-label="Email us at admin@hostfamilystay.com">
                  admin@hostfamilystay.com
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span aria-label="Phone number: +44 (0) 20 1234 5678">+44 (0) 20 1234 5678</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span aria-label="Location: London, United Kingdom">London, United Kingdom</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <p className="text-xs sm:text-sm text-center sm:text-left">
              &copy; {new Date().getFullYear()} Homestay Exchange. All rights reserved.
            </p>
            <p className="text-xs sm:text-sm text-center sm:text-right">
              Making UK education accessible for everyone
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
