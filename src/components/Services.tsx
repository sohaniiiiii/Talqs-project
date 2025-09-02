import React from 'react';
import { FileText, MessageSquareText } from 'lucide-react';
import { Link } from 'react-router-dom';

const Services = () => {
  return (
    <section id="services" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="text-center mb-16 ">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 dark:text-white">Our Services</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto dark:text-white">
            Leverage the power of AI to streamline your legal research and document analysis
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
          {/* Summarization Service */}
          <Link to="/summarization" className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800">
            <div className="flex items-center mb-6">
              <FileText className="h-10 w-10 text-green-600" />
              <h3 className="text-2xl font-bold text-gray-900 ml-4 dark:text-white">Legal Document Summarization</h3>
            </div>
            <p className="text-gray-700 mb-6 dark:text-white">
              Get instant, accurate summaries of complex legal documents, including contracts, 
              case law, and regulatory documents. Our AI analyzes key points and presents them 
              in clear, concise formats.
            </p>
            <span className="inline-block px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200">
              Try Now
            </span>
          </Link>

          {/* Q&A Service */}
          <Link to="/qa" className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800">
            <div className="flex items-center mb-6">
              <MessageSquareText className="h-10 w-10 text-green-600" />
              <h3 className="text-2xl font-bold text-gray-900 ml-4 dark:text-white">Legal Q&A System</h3>
            </div>
            <p className="text-gray-700 mb-6 dark:text-white">
              Ask questions in natural language and receive accurate answers backed by legal 
              sources. Our AI understands context and provides relevant citations to support 
              its responses.
            </p>
            <span className="inline-block px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200">
              Try Now
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;