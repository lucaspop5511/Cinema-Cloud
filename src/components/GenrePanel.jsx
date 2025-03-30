import { useEffect, useRef } from 'react'

function GenrePanel({ isOpen, selectedGenres, toggleGenre }) {
  const panelRef = useRef(null)
  
  const genres = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 
    'Documentary', 'Drama', 'Family', 'Fantasy', 'History',
    'Horror', 'Music', 'Mystery', 'Romance', 'Science Fiction',
    'Thriller', 'War', 'Western'
  ]

  // Handle escape key to close panel
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        // This would need a way to call the parent's togglePanel function
        // But we'll leave it out for now to avoid prop drilling
      }
    }

    document.addEventListener('keydown', handleEscKey)
    return () => {
      document.removeEventListener('keydown', handleEscKey)
    }
  }, [isOpen])

  return (
    <div className={`genre-panel ${isOpen ? 'open' : ''}`} ref={panelRef}>
      <div className="genre-panel-header">
        <h2>Categories</h2>
      </div>
      <div className="genre-panel-content">
        {genres.map((genre) => (
          <button 
            key={genre} 
            type="button"
            className={`genre-item ${selectedGenres.includes(genre) ? 'active' : ''}`}
            onClick={() => toggleGenre(genre)}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  )
}

export default GenrePanel