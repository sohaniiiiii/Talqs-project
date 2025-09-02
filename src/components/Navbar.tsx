import React, { useState, useEffect, useRef } from 'react';
import { HashLink } from 'react-router-hash-link';
import { Menu, X, History, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

type User = {
  id: string;
  email: string;
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setDropdownOpen(false);
      // window.location.href = '/';
      toast.success('Successfully logged out');
      window.location.href = '/';
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const getInitial = (email: string) => email.charAt(0).toUpperCase();

  const sections = ['hero', 'about', 'services', 'contact'];

  return (
    <nav className="fixed w-full z-50 bg-white shadow-md h-16 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <HashLink smooth to="/#hero" className="text-2xl font-bold text-black dark:text-white">
            TALQS
          </HashLink>

          <div className="hidden md:flex items-center space-x-8">
            {sections.map((id) => (
              <HashLink
                key={id}
                smooth
                to={`/#${id}`}
                className="text-gray-900 hover:text-green-600 transition-colors duration-200 font-medium dark:text-white"
              >
                {id === 'hero' ? 'Home' : id.charAt(0).toUpperCase() + id.slice(1)}
              </HashLink>
            ))}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  className="w-10 h-10 rounded-full bg-green-600 text-white font-bold flex items-center justify-center"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  {getInitial(user.email)}
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      Signed in as<br />
                      <span className="font-medium">{user.email}</span>
                    </div>
                    <Link
                      to="/history"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <History size={16} /> History
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="text-gray-900 hover:text-green-600 transition-colors duration-200 font-medium dark:text-white"
              >
                Sign In
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-900 hover:text-green-600 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="px-4 pt-4 pb-4 space-y-2">
            {sections.map((id) => (
              <HashLink
                key={id}
                smooth
                to={`/#${id}`}
                onClick={() => setIsOpen(false)}
                className="block text-gray-900 hover:text-green-600 font-medium"
              >
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </HashLink>
            ))}
            {user ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="block w-full text-left text-gray-900 hover:text-green-600 font-medium"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/auth"
                onClick={() => setIsOpen(false)}
                className="block text-gray-900 hover:text-green-600 font-medium"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
