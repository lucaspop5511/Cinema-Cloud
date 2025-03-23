import { useState } from 'react'

function GenreDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  
  const genres = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 
    'Documentary', 'Drama', 'Family', 'Fantasy', 'History',
    'Horror', 'Music', 'Mystery', 'Romance', 'Science Fiction',
    'Thriller', 'War', 'Western'
  ]
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }
  
  const handleGenreClick = (genre) => {
    console.log(`Selected genre: ${genre}`)
    // Uncomment the line below if you want the dropdown to close after selection
    // setIsOpen(false)
    // Handle genre selection logic here
  }

  return (
    <div className="genre-dropdown">
      <button className="genre-button" onClick={toggleDropdown}>
        Categories
      </button>
      <div className={`genre-dropdown-content ${isOpen ? 'show' : ''}`}>
        {genres.map((genre) => (
          <button 
            key={genre} 
            className="genre-item"
            onClick={() => handleGenreClick(genre)}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  )
}

export default GenreDropdown