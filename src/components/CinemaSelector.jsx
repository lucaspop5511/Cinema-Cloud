import React, { useState, useEffect, useRef } from 'react';
import '../styles/CinemaSelector.css';

function CinemaSelector({ cinemas, selectedCinema, onCinemaSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredCinemas, setFilteredCinemas] = useState([]);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Update search term when cinema is selected
  useEffect(() => {
    if (selectedCinema) {
      setSearchTerm(selectedCinema.name);
    }
  }, [selectedCinema]);

  // Filter cinemas based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredCinemas([]);
      return;
    }

    const filtered = cinemas.filter(cinema => {
      const searchLower = searchTerm.toLowerCase();
      return (
        cinema.name.toLowerCase().includes(searchLower) ||
        cinema.city.toLowerCase().includes(searchLower) ||
        cinema.address.toLowerCase().includes(searchLower) ||
        cinema.chain.toLowerCase().includes(searchLower)
      );
    });

    setFilteredCinemas(filtered.slice(0, 8)); // Limit to 8 results
  }, [searchTerm, cinemas]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
  };

  // Handle cinema selection
  const handleCinemaSelect = (cinema) => {
    setSearchTerm(cinema.name);
    setShowDropdown(false);
    onCinemaSelect(cinema);
  };

  // Handle input focus
  const handleFocus = () => {
    if (searchTerm && filteredCinemas.length > 0) {
      setShowDropdown(true);
    }
  };

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clear selection
  const clearSelection = () => {
    setSearchTerm('');
    setShowDropdown(false);
    onCinemaSelect(null);
  };

  return (
    <div className="cinema-selector">
      <div className="search-container">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={handleFocus}
          placeholder="Search cinema by name, city, or address..."
          className="cinema-search-input"
        />
        {searchTerm && (
          <button 
            className="clear-button"
            onClick={clearSelection}
            type="button"
          >
            ✕
          </button>
        )}
      </div>

      {showDropdown && filteredCinemas.length > 0 && (
        <div ref={dropdownRef} className="cinema-dropdown">
          {filteredCinemas.map(cinema => (
            <div
              key={cinema.id}
              className="cinema-option"
              onClick={() => handleCinemaSelect(cinema)}
            >
              <div className="cinema-name">{cinema.name}</div>
              <div className="cinema-details">
                <span className="cinema-city">{cinema.city}</span>
                <span className="cinema-chain">{cinema.chain}</span>
              </div>
              <div className="cinema-address">{cinema.address}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CinemaSelector;