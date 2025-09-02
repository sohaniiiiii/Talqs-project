import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">TALQS</h3>
            <p className="text-gray-400">
              AI-Powered Legal Summarization & Q&A Platform
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Privacy Policy', 'Terms of Service', 'Contact Us'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <p className="text-gray-400 mb-2">Email: contact@talqs.ai</p>
            <div className="flex space-x-4 mt-4">
              {/* Social Media Links */}
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                LinkedIn
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                Twitter
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} TALQS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;