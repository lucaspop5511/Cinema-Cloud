import React, { useState, useEffect } from 'react';
import FilterHeader from '../components/FilterHeader';

// Romanian cities with major cinemas
const CINEMA_CITIES = [
  { value: 'bucharest', label: 'București', cinemaUrl: 'https://www.cinemacity.ro/xbk/buy-tickets-by-cinema/1806' },
  { value: 'cluj', label: 'Cluj-Napoca', cinemaUrl: 'https://www.cinemacity.ro/xbk/buy-tickets-by-cinema/1815' },
  { value: 'timisoara', label: 'Timișoara', cinemaUrl: 'https://www.cinemacity.ro/xbk/buy-tickets-by-cinema/1820' },
  { value: 'iasi', label: 'Iași', cinemaUrl: 'https://www.movieplex.ro/constanta/' },
  { value: 'constanta', label: 'Constanța', cinemaUrl: 'https://www.movieplex.ro/constanta/' }
];

function Cinema() {
  const [selectedCity, setSelectedCity] = useState(CINEMA_CITIES[0]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // TODO: Fetch now playing movies from TMDb API
    // For now, just set loading to false
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleCityChange = (event) => {
    const cityValue = event.target.value;
    const city = CINEMA_CITIES.find(c => c.value === cityValue);
    setSelectedCity(city);
  };

  if (loading) {
    return (
      <div className="cinema-container">
        <div className="cinema-loading">
          <p>Loading movies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cinema-container">
        <div className="cinema-error">
          <h3>Error loading movies</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cinema-container">
      <div className="cinema-header">
        <h1>Now Playing in Romanian Cinemas</h1>
        
        <div className="cinema-city-selector">
          <label htmlFor="city-select">Choose your city:</label>
          <select 
            id="city-select"
            value={selectedCity.value} 
            onChange={handleCityChange}
            className="cinema-dropdown"
          >
            {CINEMA_CITIES.map(city => (
              <option key={city.value} value={city.value}>
                {city.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="cinema-info">
        <p>
          Movies currently playing in {selectedCity.label}. 
          Click on any movie to view showtimes at your local cinema.
        </p>
      </div>

      {/* Add FilterHeader for consistency with Home page */}
      <FilterHeader />

      {/* Movie list will be added here */}
      <div className="movies-list">
        {nowPlayingMovies.length === 0 ? (
          <div className="no-movies">
            <p>Movies will be loaded here from TMDb "Now Playing" API</p>
          </div>
        ) : (
          /* Movies will be rendered here */
          <div>Movies coming soon...</div>
        )}
      </div>
    </div>
  );
}

export default Cinema;