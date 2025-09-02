import { HashLink } from 'react-router-hash-link';
import React from 'react';
import { Scale } from 'lucide-react';

const About = () => {
  return (
    <section
      id="about"
      className="min-h-screen flex items-center justify-center px-4 py-16 bg-white dark:bg-gray-900 scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              Revolutionizing Legal Research with AI
            </h2>
            <div className="space-y-4">
              <p className="text-lg text-gray-700 dark:text-white">
                TALQS is at the forefront of legal technology, combining advanced AI with deep legal expertise to transform how legal professionals work with documents and research.
              </p>
              <p className="text-lg text-gray-700 dark:text-white">
                Our AI-powered platform provides instant, accurate summarizations of legal documents, case law, and regulations, enabling lawyers to focus on strategic decision-making rather than time-consuming document review.
              </p>
              <p className="text-lg text-gray-700 dark:text-white">
                With TALQS, you can:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-white">
                <li>Get instant summaries of complex legal documents</li>
                <li>Access AI-powered Q&A for quick legal research</li>
                <li>Generate comprehensive case analysis reports</li>
                <li>Stay updated with relevant legal precedents</li>
                {/* <li>Upload legal PDFs and receive structured insights in seconds</li> */}
              </ul>
            </div>
            <HashLink
              smooth
              to="/#contact"
              className="inline-block mt-6 px-8 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
            >
              Get in Touch
            </HashLink>
          </div>

          {/* Image/Icon Section */}
          <div className="relative h-full flex justify-center items-center">
            <div className="w-full h-[450px] bg-gray-50 rounded-lg overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1589994965851-a8f479c573a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Scales of Justice"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <Scale className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
