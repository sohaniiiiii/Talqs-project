// ThemeToggle.jsx
import React from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ isDarkMode, toggleTheme }) => {
  // Add console log to debug
  console.log('ThemeToggle props:', { isDarkMode, toggleTheme });

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-white dark:bg-gray-800 
                 shadow-lg border border-gray-200 dark:border-gray-700 
                 hover:shadow-xl transition-all duration-300 
                 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-500"
      aria-label="Toggle theme"
    >
      {isDarkMode ? (
        <Sun className="w-6 h-6 text-yellow-500 transition-transform duration-300" />
      ) : (
        <Moon className="w-6 h-6 text-gray-700 transition-transform duration-300" />
      )}
    </button>
  );
};

export default ThemeToggle;
