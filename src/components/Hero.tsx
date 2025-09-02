import React from 'react';
import { HashLink } from 'react-router-hash-link';
const Hero = () => {
  return (
    // <section
    //   className="relative min-h-screen flex items-center justify-center px-4 pt-0 pb-16 bg-black scroll-mt-20"
    //   id="hero" // ← This is the key update
    // >
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center px-4 pt-16 pb-16 bg-black scroll-mt-16"
      >

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')",
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">TALQS</h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
          AI-Powered Legal Summarization & Q&A
        </p>
        <HashLink
      smooth
      to="/#about"
      className="bg-green-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-green-700 transition-colors duration-200 transform hover:scale-105 inline-block"
    >
      Learn More
    </HashLink>
      </div>
    </section>
  );
};

export default Hero;
