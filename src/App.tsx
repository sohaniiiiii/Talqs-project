import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Summarization from './components/Summarization';
import QuestionAnswering from './components/QuestionAnswering';
import Auth from './components/Auth';
import History from './components/History';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  // Theme state management from new code
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage first, then system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply theme to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Toggle function to pass to ThemeToggle component
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <Navbar />
      
      {/* Always keep anchor-linked sections on the page - from old code structure */}
      {isHome && (
        <>
          <section id="home" className="pt-16">
            <Hero />
          </section>
          <section id="about" className="pt-15">
            <About />
          </section>
          <section id="services" className="pt-20 dark:bg-gray-900">
            <Services />
          </section>
          <section id="contact" className="pt-20 dark:bg-gray-900">
            <Contact />
          </section>
        </>
      )}

      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/summarization" element={<Summarization />} />
        <Route path="/qa" element={<QuestionAnswering />} />
        <Route path="/history" element={<History />} />
      </Routes>

      <Footer />
      
      {/* Theme Toggle Button - Pass props to control theme */}
      <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
    </div>
  );
}

export default App;

