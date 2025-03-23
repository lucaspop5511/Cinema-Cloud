import SearchBar from '../components/SearchBar'

function Home() {
  return (
    <div className="home-container">
      <h1 className="welcome-text">Cinema Cloud</h1>
      <p className="subtitle">Discover your next favorite movie or TV show</p>
      <SearchBar />
    </div>
  )
}

export default Home