import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Film, BarChart2, Tv, ChevronDown, Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const categoriesRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleCategories = () => {
    setIsCategoriesOpen(!isCategoriesOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
        setIsCategoriesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const categories = [
    'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 
    'Animation', 'Documentary', 'Thriller', 'Romance'
  ];

  return (
    <header className="bg-gray-800 py-4 px-6 sticky top-0 z-50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center text-indigo-400 font-bold text-2xl">
            <Film className="mr-2" />
            <span>CinemaCloud</span>
          </Link>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* Categories Dropdown */}
            <div className="relative" ref={categoriesRef}>
              <button 
                className="flex items-center text-gray-300 hover:text-white transition"
                onClick={toggleCategories}
              >
                Categories <ChevronDown className="ml-1" size={16} />
              </button>

              {isCategoriesOpen && (
                <div className="dropdown-content absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50">
                  {categories.map((category) => (
                    <Link
                      key={category}
                      to={`/categories?genre=${category.toLowerCase()}`}
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                      onClick={() => setIsCategoriesOpen(false)}
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Statistics Link */}
            <Link to="/statistics" className="flex items-center text-gray-300 hover:text-white transition">
              <BarChart2 className="mr-1" size={18} />
              <span>Statistics</span>
            </Link>

            {/* Cinema Link */}
            <Link to="/cinema" className="flex items-center text-gray-300 hover:text-white transition">
              <Tv className="mr-1" size={18} />
              <span>Cinema</span>
            </Link>
          </nav>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-3 py-3 border-t border-gray-700">
            <div>
              <button 
                className="flex items-center w-full text-left text-gray-300 py-2 hover:text-white transition"
                onClick={toggleCategories}
              >
                Categories <ChevronDown className="ml-1" size={16} />
              </button>
              
              {isCategoriesOpen && (
                <div className="pl-4 pt-2 space-y-2">
                  {categories.map((category) => (
                    <Link
                      key={category}
                      to={`/categories?genre=${category.toLowerCase()}`}
                      className="block py-1 text-sm text-gray-400 hover:text-white"
                      onClick={() => {
                        setIsCategoriesOpen(false);
                        setIsMenuOpen(false);
                      }}
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link 
              to="/statistics" 
              className="flex items-center text-gray-300 py-2 hover:text-white transition"
              onClick={() => setIsMenuOpen(false)}
            >
              <BarChart2 className="mr-2" size={18} />
              <span>Statistics</span>
            </Link>

            <Link 
              to="/cinema" 
              className="flex items-center text-gray-300 py-2 hover:text-white transition"
              onClick={() => setIsMenuOpen(false)}
            >
              <Tv className="mr-2" size={18} />
              <span>Cinema</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;