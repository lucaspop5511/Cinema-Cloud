import React from 'react';
import SearchBar from '../components/SearchBar';
import { Sparkles, TrendingUp, Star } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Search Area */}
      <div className="search-container flex-grow flex flex-col items-center justify-center px-4">
        <div className="logo-large text-center mb-8">
          <span className="text-indigo-400">Cinema</span>
          <span className="text-indigo-300">Cloud</span>
        </div>
        
        <p className="text-gray-400 text-center mb-8 max-w-md">
          Your ultimate destination for discovering movies and TV shows. Search, explore, and find your next favorite.
        </p>
        
        <SearchBar />
        
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button className="flex items-center px-4 py-2 bg-gray-800 rounded-full text-sm text-gray-300 hover:bg-gray-700 transition">
            <Sparkles size={16} className="mr-2 text-yellow-400" />
            Popular Now
          </button>
          <button className="flex items-center px-4 py-2 bg-gray-800 rounded-full text-sm text-gray-300 hover:bg-gray-700 transition">
            <TrendingUp size={16} className="mr-2 text-green-400" />
            Trending
          </button>
          <button className="flex items-center px-4 py-2 bg-gray-800 rounded-full text-sm text-gray-300 hover:bg-gray-700 transition">
            <Star size={16} className="mr-2 text-purple-400" />
            Top Rated
          </button>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="text-center py-4 text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} CinemaCloud. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;