import { useEffect, useRef, useContext, useState } from 'react'
import { usePathname } from 'next/navigation'
import { AppContext } from './AppWrapper'
import AuthButton from './auth/AuthButton'
import '../styles/panels/GenrePanel.css'

function GenrePanel({ isOpen, closePanel }) {
  const pathname = usePathname()
  const { 
    selectedGenres, 
    toggleGenre, 
    setSelectedGenres,
    minYear, 
    setMinYear, 
    maxYear, 
    setMaxYear,
    minRuntime, 
    maxRuntime, 
    setMinRuntime, 
    setMaxRuntime,
    imdbRating,
    setImdbRating,
    applyFilters,
    searchType,
    isFilterActive,
    filterCounter,
    searchQuery,
    isMobile
  } = useContext(AppContext)
  
  const panelRef = useRef(null)
  const currentYear = new Date().getFullYear()
  
  const [sliderRangeStyle, setSliderRangeStyle] = useState({
    left: '0%',
    width: '0%'
  })
  
  // Track if filters have been modified since last search
  const [filtersModified, setFiltersModified] = useState(false)
  
  // Store initial filter states to detect changes
  const [initialFilters, setInitialFilters] = useState({
    genres: [],
    minYear: 1990,
    maxYear: currentYear,
    minRuntime: 0,
    maxRuntime: 240,
    imdbRating: 'none',
    searchType: 'movie'
  })
  
  // Check if filters should be disabled (movies on cinema page)
  const isFiltersDisabled = pathname === '/cinema' && searchType === 'movie';
  
  // Update initial filters when search is performed
  useEffect(() => {
    if (isFilterActive) {
      setInitialFilters({
        genres: [...selectedGenres],
        minYear,
        maxYear,
        minRuntime,
        maxRuntime,
        imdbRating,
        searchType
      })
      setFiltersModified(false)
    }
  }, [filterCounter])
  
  // Detect changes to any filter
  useEffect(() => {
    const checkForChanges = () => {
      if (selectedGenres.length !== initialFilters.genres.length) {
        return true
      }
      
      for (const genre of selectedGenres) {
        if (!initialFilters.genres.includes(genre)) {
          return true
        }
      }
      
      // Check other filters
      if (minYear !== initialFilters.minYear ||
          maxYear !== initialFilters.maxYear ||
          minRuntime !== initialFilters.minRuntime ||
          maxRuntime !== initialFilters.maxRuntime ||
          searchType !== initialFilters.searchType ||
          imdbRating !== initialFilters.imdbRating) {
        return true
      }
      
      return false
    }
    
    setFiltersModified(checkForChanges())
  }, [
    selectedGenres, 
    minYear, 
    maxYear, 
    minRuntime, 
    maxRuntime, 
    imdbRating,
    searchType
  ])
  
  const genres = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 
    'Documentary', 'Drama', 'Family', 'Fantasy', 'History',
    'Horror', 'Music', 'Mystery', 'Romance', 'Science Fiction',
    'Thriller', 'War', 'Western'
  ].sort();
  
  const imdbRatingOptions = [
    { value: 'none', label: '⊘' }, 
    { value: '<6', label: '<6' },
    { value: '6-7', label: '6-7' },
    { value: '7-8', label: '7-8' },
    { value: '8+', label: '8+' }
  ];
  
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOpen && window.innerWidth < 768) {
        closePanel()
      }
    }

    document.addEventListener('keydown', handleEscKey)
    return () => {
      document.removeEventListener('keydown', handleEscKey)
    }
  }, [isOpen, closePanel])

  const handleMinYearChange = (e) => {
    setMinYear(e.target.value)
  }
  
  const handleMaxYearChange = (e) => {
    setMaxYear(e.target.value)
  }
  
  const validateMinYear = () => {
    let validatedValue = parseInt(minYear)
    if (isNaN(validatedValue) || validatedValue < 1900) {
      validatedValue = 1990
    } else if (validatedValue > parseInt(maxYear)) {
      validatedValue = parseInt(maxYear)
    }
    setMinYear(validatedValue)
  }
  
  const validateMaxYear = () => {
    let validatedValue = parseInt(maxYear)
    if (isNaN(validatedValue) || validatedValue > currentYear) {
      validatedValue = currentYear
    } else if (validatedValue < parseInt(minYear)) {
      validatedValue = parseInt(minYear)
    }
    setMaxYear(validatedValue)
  }
  
  // Year increment/decrement
  const incrementYear = (setter, currentValue) => {
    const nextValue = Math.ceil((parseInt(currentValue) + 1) / 5) * 5;
    setter(nextValue > currentYear ? currentYear : nextValue);
  }
  
  const decrementYear = (setter, currentValue) => {
    const nextValue = Math.floor((parseInt(currentValue) - 1) / 5) * 5;
    setter(nextValue < 1900 ? 1900 : nextValue);
  }
  
  // Handle runtime changes
  const handleMinRuntimeChange = (e) => {
    let newMinRuntime = parseInt(e.target.value)
    // Minimum 30 minute difference
    if (maxRuntime - newMinRuntime < 30) {
      newMinRuntime = maxRuntime - 30
    }
    setMinRuntime(newMinRuntime)
    updateSliderRangeStyle()
  }
  
  const handleMaxRuntimeChange = (e) => {
    let newMaxRuntime = parseInt(e.target.value)
    // Minimum 30 minute difference
    if (newMaxRuntime - minRuntime < 30) {
      newMaxRuntime = minRuntime + 30
    }
    setMaxRuntime(newMaxRuntime)
    updateSliderRangeStyle()
  }
  
  // Format runtime as hours and minutes
  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours === 0) {
      return `${mins}m`
    } else if (mins === 0) {
      return `${hours}h`
    } else {
      return `${hours}h${mins}m`
    }
  }

  const updateSliderRangeStyle = () => {
    const min = minRuntime
    const max = maxRuntime
    const rangeMin = 0
    const rangeMax = 240
    
    const leftPosition = ((min - rangeMin) / (rangeMax - rangeMin)) * 100
    const rightPosition = ((max - rangeMin) / (rangeMax - rangeMin)) * 100
    const rangeWidth = rightPosition - leftPosition
    
    setSliderRangeStyle({
      left: `${leftPosition}%`,
      width: `${rangeWidth}%`
    })
  }
  
  useEffect(() => {
    updateSliderRangeStyle()
  }, [minRuntime, maxRuntime])
  
  // Limit genre selection to 3
  const handleGenreToggle = (genre) => {
    if (selectedGenres.includes(genre)) {
      toggleGenre(genre);
    } else if (selectedGenres.length < 3) {
      toggleGenre(genre);
    }
  }
  
  const hasActiveFilters = () => {
    return selectedGenres.length > 0 || 
           minYear !== 1990 || 
           maxYear !== new Date().getFullYear() ||
           minRuntime !== 0 ||
           maxRuntime !== 240 ||
           imdbRating !== 'none';
  };
  
  // Handle search button click
  const handleSearch = () => {
    // Dont do anything if filters are disabled
    if (isFiltersDisabled) {
      return;
    }
    
    console.log('Search button clicked with filters:', {
      selectedGenres,
      minYear,
      maxYear,
      minRuntime,
      maxRuntime,
      imdbRating,
      searchType,
      hasSearchQuery: !!(searchQuery && searchQuery.trim()),
      currentPage: pathname
    });
    
    applyFilters();
    
    // Close panel on mobile after search
    if (window.innerWidth < 768) {
      closePanel();
    }
  }
  
  // Determine search button state and label
  const getSearchButtonClass = () => {
    if (isFiltersDisabled) {
      return "search-button disabled";
    }
    return isFilterActive && !filtersModified ? "search-button active" : "search-button";
  }
  
  const getSearchButtonLabel = () => {
    if (isFiltersDisabled) {
      return 'Not Available';
    }
    
    if (pathname === '/watchlist') {
      return 'Apply Filters';
    }
    if (searchQuery && searchQuery.trim() !== '' && hasActiveFilters()) {
      return 'Apply Filters';
    }
    if (searchQuery && searchQuery.trim() !== '' && !hasActiveFilters()) {
      return 'Search';
    }
    return 'Filter';
  }

  return (
    <div className={`genre-panel ${isOpen ? 'open' : ''}`} ref={panelRef}>
      <div className="genre-panel-header">
        <div className="panel-header-left">
          {isMobile && isOpen && (
            <button 
              type="button"
              className="close-panel-btn"
              onClick={closePanel}
              aria-label="Close panel"
            >
              ✕
            </button>
          )}
          {!isMobile && <AuthButton isMobile={isMobile} />}
        </div>
        
        <div className="panel-header-right">
          {isMobile && <AuthButton isMobile={isMobile} />}
        </div>
      </div>
      
      <div className="genre-panel-content">
        
        <section className={`filter-section ${isFiltersDisabled ? 'disabled' : ''}`}>
          <h3 className="filter-section-title">Categories (max 3)</h3>
          <div className="genre-grid">
            {genres.map((genre) => (
              <button 
                key={genre} 
                type="button"
                className={`genre-item ${selectedGenres.includes(genre) ? 'active' : ''} ${isFiltersDisabled ? 'disabled' : ''}`}
                onClick={() => !isFiltersDisabled && handleGenreToggle(genre)}
                disabled={isFiltersDisabled}
              >
                {genre}
              </button>
            ))}
          </div>
        </section>
        
        <section className={`filter-section ${isFiltersDisabled ? 'disabled' : ''}`}>
          <h3 className="filter-section-title">Year Released</h3>
          <div className="year-inputs">
            <div className="input-group">
              <label htmlFor="min-year">From</label>
              <div className="year-input-container">
                <input 
                  id="min-year"
                  type="number" 
                  min="1900" 
                  max={currentYear}
                  value={minYear}
                  onChange={handleMinYearChange}
                  onBlur={validateMinYear}
                  disabled={isFiltersDisabled}
                />
                <div className="year-controls">
                  <button 
                    type="button" 
                    className="year-control-btn up"
                    onClick={() => !isFiltersDisabled && incrementYear(setMinYear, minYear)}
                    aria-label="Increase minimum year"
                    disabled={isFiltersDisabled}
                  >
                    <span className="arrow-up">&#9650;</span>
                  </button>
                  <button 
                    type="button" 
                    className="year-control-btn down"
                    onClick={() => !isFiltersDisabled && decrementYear(setMinYear, minYear)}
                    aria-label="Decrease minimum year"
                    disabled={isFiltersDisabled}
                  >
                    <span className="arrow-down">&#9660;</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="year-separator">-</div>
            <div className="input-group">
              <label htmlFor="max-year">To</label>
              <div className="year-input-container">
                <input 
                  id="max-year"
                  type="number" 
                  min="1900" 
                  max={currentYear} 
                  value={maxYear}
                  onChange={handleMaxYearChange}
                  onBlur={validateMaxYear}
                  disabled={isFiltersDisabled}
                />
                <div className="year-controls">
                  <button 
                    type="button" 
                    className="year-control-btn up"
                    onClick={() => !isFiltersDisabled && incrementYear(setMaxYear, maxYear)}
                    aria-label="Increase maximum year"
                    disabled={isFiltersDisabled}
                  >
                    <span className="arrow-up">&#9650;</span>
                  </button>
                  <button 
                    type="button" 
                    className="year-control-btn down"
                    onClick={() => !isFiltersDisabled && decrementYear(setMaxYear, maxYear)}
                    aria-label="Decrease maximum year"
                    disabled={isFiltersDisabled}
                  >
                    <span className="arrow-down">&#9660;</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className={`filter-section ${isFiltersDisabled ? 'disabled' : ''}`}>
          <h3 className="filter-section-title">
            {searchType === 'tv' ? 'Episode Runtime' : 'Runtime'}
          </h3>
          <div className="runtime-slider-container">
            <div className="runtime-labels">
              <span>{formatRuntime(minRuntime)}</span>
              <span>{formatRuntime(maxRuntime)}</span>
            </div>
            <div className="dual-slider">
              <div className={`slider-track ${isFiltersDisabled ? 'disabled' : ''}`}></div>
              <div 
                className={`slider-range ${isFiltersDisabled ? 'disabled' : ''}`}
                style={sliderRangeStyle}
              ></div>
              <input 
                type="range" 
                min="0" 
                max="240" 
                step="10"
                value={minRuntime}
                onChange={handleMinRuntimeChange}
                className={`slider min-slider ${isFiltersDisabled ? 'disabled' : ''}`}
                disabled={isFiltersDisabled}
              />
              <input 
                type="range" 
                min="0" 
                max="240" 
                step="10"
                value={maxRuntime}
                onChange={handleMaxRuntimeChange}
                className={`slider max-slider ${isFiltersDisabled ? 'disabled' : ''}`}
                disabled={isFiltersDisabled}
              />
            </div>
          </div>
        </section>
        
        <section className={`filter-section ${isFiltersDisabled ? 'disabled' : ''}`}>
          <h3 className="filter-section-title">IMDB Rating</h3>
          <div className={`segmented-control ${isFiltersDisabled ? 'disabled' : ''}`} data-selected={imdbRating}>
            {imdbRatingOptions.map((option) => (
              <button 
                key={option.value} 
                type="button"
                className={`segmented-control-item ${imdbRating === option.value ? 'active' : ''} ${option.value === 'none' ? 'none-option' : ''} ${isFiltersDisabled ? 'disabled' : ''}`}
                onClick={() => !isFiltersDisabled && setImdbRating(option.value)}
                disabled={isFiltersDisabled}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>
      </div>
      
      <div className="genre-panel-footer">
        <button 
          type="button"
          className={getSearchButtonClass()}
          onClick={handleSearch}
          disabled={isFiltersDisabled}
        >
          {getSearchButtonLabel()}
        </button>
      </div>
    </div>
  )
}

export default GenrePanel