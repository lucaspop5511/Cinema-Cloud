import React, { useState } from 'react';
import { Search, Film, Tv } from 'lucide-react';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [contentType, setContentType] = useState('all'); // 'all', 'movies', 'tv'
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search logic here
    console.log(`Searching for ${searchQuery} in ${contentType}`);
    // You would typically navigate to results page or fetch data here
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const setFilter = (type) => {
    setContentType(type);
    setIsFilterOpen(false);
  };

  // Get the correct icon and text for the current filter
  const getFilterDisplay = () => {
    switch (contentType) {
      case 'movies':
        return { icon: <Film size={18} />, text: 'Movies' };
      case 'tv':
        return { icon: <Tv size={18} />, text: 'TV Shows' };
      default:
        return { icon: null, text: 'All' };
    }
  };

  const { icon, text } = getFilterDisplay();

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          className="w-full py-3 px-4 pr-24 bg-gray-800 border border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Search for movies, TV shows..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        {/* Filter Toggle Button */}
        <div className="search-filter-toggle">
          <button 
            type="button" 
            className="flex items-center text-gray-400 hover:text-white p-1"
            onClick={toggleFilter}
          >
            {icon} <span className="ml-1">{text}</span>
          </button>

          {/* Filter Dropdown */}
          {isFilterOpen && (
            <div className="absolute right-16 top-12 bg-gray-800 border border-gray-700 rounded-md shadow-lg overflow-hidden w-32 dropdown-content">
              <button
                type="button"
                className={`w-full text-left px-3 py-2 hover:bg-gray-700 flex items-center ${contentType === 'all' ? 'bg-gray-700 text-white' : 'text-gray-300'}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                type="button"
                className={`w-full text-left px-3 py-2 hover:bg-gray-700 flex items-center ${contentType === 'movies' ? 'bg-gray-700 text-white' : 'text-gray-300'}`}
                onClick={() => setFilter('movies')}
              >
                <Film size={16} className="mr-2" /> Movies
              </button>
              <button
                type="button"
                className={`w-full text-left px-3 py-2 hover:bg-gray-700 flex items-center ${contentType === 'tv' ? 'bg-gray-700 text-white' : 'text-gray-300'}`}
                onClick={() => setFilter('tv')}
              >
                <Tv size={16} className="mr-2" /> TV Shows
              </button>
            </div>
          )}
        </div>

        {/* Search Button */}
        <button 
          type="submit"
          className="search-button p-2 rounded-full bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <Search size={20} className="text-white" />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;