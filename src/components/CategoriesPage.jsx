import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SearchBar from '../components/SearchBar';

const CategoriesPage = () => {
  const location = useLocation();
  const [genre, setGenre] = useState('');
  
  // Parse genre from URL query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const genreParam = params.get('genre');
    setGenre(genreParam || '');
  }, [location.search]);

  // This would be replaced with actual API data
  const mockMovies = [
    { id: 1, title: 'The Dark Knight', year: 2008, rating: 9.0, poster: '/api/placeholder/200/300' },
    { id: 2, title: 'Inception', year: 2010, rating: 8.8, poster: '/api/placeholder/200/300' },
    { id: 3, title: 'Interstellar', year: 2014, rating: 8.6, poster: '/api/placeholder/200/300' },
    { id: 4, title: 'The Matrix', year: 1999, rating: 8.7, poster: '/api/placeholder/200/300' },
    { id: 5, title: 'Pulp Fiction', year: 1994, rating: 8.9, poster: '/api/placeholder/200/300' },
    { id: 6, title: 'The Shawshank Redemption', year: 1994, rating: 9.3, poster: '/api/placeholder/200/300' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 capitalize">
          {genre ? `${genre} Movies & Shows` : 'All Categories'}
        </h1>
        
        <div className="max-w-xl mb-8">
          <SearchBar />
        </div>
        
        {!genre && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-12">
            {['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Animation', 'Documentary', 'Thriller', 'Romance'].map((categoryName) => (
              <a 
                key={categoryName}
                href={`/categories?genre=${categoryName.toLowerCase()}`}
                className="bg-gray-800 rounded-lg p-6 text-center hover:bg-gray-700 transition"
              >
                <h3 className="text-lg font-medium">{categoryName}</h3>
              </a>
            ))}
          </div>
        )}
      </div>

      {genre && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {mockMovies.length} Results
            </h2>
            <div className="flex items-center">
              <label htmlFor="sort" className="mr-2 text-gray-400">Sort by:</label>
              <select 
                id="sort"
                className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option>Popularity</option>
                <option>Rating</option>
                <option>Release Date</option>
                <option>A-Z</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {mockMovies.map((movie) => (
              <div key={movie.id} className="movie-card">
                <div className="relative overflow-hidden rounded-lg bg-gray-800 mb-2">
                  <img 
                    src={movie.poster} 
                    alt={movie.title}
                    className="w-full h-auto transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-yellow-400 px-2 py-1 rounded text-sm font-bold">
                    {movie.rating.toFixed(1)}
                  </div>
                </div>
                <h3 className="font-medium text-white">{movie.title}</h3>
                <p className="text-gray-400 text-sm">{movie.year}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;