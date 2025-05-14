import React, { useEffect, useState } from 'react';
import { cinemaApi } from '../services/cinemaApi';
import Calendar from '../components/Calendar';
import CinemaSelector from '../components/CinemaSelector';
import MovieCards from '../components/MovieCards';

function Cinema() {
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [movies, setMovies] = useState([]);
  const [moviesLoading, setMoviesLoading] = useState(false);
  const [moviesError, setMoviesError] = useState(null);

  useEffect(() => {
    // Load cinemas on component mount
    const loadCinemas = async () => {
      try {
        console.log('Loading cinemas...');
        const cinemasData = await cinemaApi.getCinemas();
        console.log('Loaded cinemas:', cinemasData);
        setCinemas(cinemasData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load cinemas:', error);
        setLoading(false);
      }
    };

    loadCinemas();
  }, []);

  // Load movies when both cinema and date are selected
  useEffect(() => {
    if (selectedCinema && selectedDate) {
      loadMovies();
    }
  }, [selectedCinema, selectedDate]);

  const loadMovies = async () => {
    if (!selectedCinema || !selectedDate) return;

    setMoviesLoading(true);
    setMoviesError(null);
    
    try {
      console.log(`Loading movies for ${selectedCinema.name} on ${selectedDate}`);
      const moviesData = await cinemaApi.getMovies(selectedCinema.id, selectedDate);
      console.log('Loaded movies:', moviesData);
      setMovies(moviesData);
    } catch (error) {
      console.error('Failed to load movies:', error);
      setMoviesError(error.message);
      setMovies([]);
    } finally {
      setMoviesLoading(false);
    }
  };

  const handleDateSelect = (date) => {
    console.log('Selected date:', date);
    setSelectedDate(date);
  };

  const handleCinemaSelect = (cinema) => {
    console.log('Selected cinema:', cinema);
    setSelectedCinema(cinema);
    // Clear movies when cinema changes
    setMovies([]);
    setMoviesError(null);
  };

  if (loading) {
    return <div>Loading cinemas...</div>;
  }

  return (
    <div className="cinema-container">
      <h1 className="cinema-title">Cinema Schedule</h1>
      
      <div className="cinema-controls">
        <div className="cinema-selector-section">
          <h3>Select Cinema</h3>
          <CinemaSelector
            cinemas={cinemas}
            selectedCinema={selectedCinema}
            onCinemaSelect={handleCinemaSelect}
          />
          {selectedCinema && (
            <div className="selected-cinema-info">
              <p><strong>{selectedCinema.name}</strong></p>
              <p>{selectedCinema.city} • {selectedCinema.address}</p>
            </div>
          )}
        </div>

        <div className="calendar-section">
          <h3>Select Date</h3>
          <Calendar 
            selectedDate={selectedDate} 
            onDateSelect={handleDateSelect} 
          />
          {selectedDate && (
            <p>Selected: {selectedDate}</p>
          )}
        </div>
      </div>

      {/* Movies Display */}
      {(selectedCinema && selectedDate) && (
        <MovieCards 
          movies={movies}
          loading={moviesLoading}
          error={moviesError}
        />
      )}
    </div>
  );
}

export default Cinema;