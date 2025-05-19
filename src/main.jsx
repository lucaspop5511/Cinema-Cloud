import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'

// Import only the CSS files we're keeping
import './styles/index.css'
import './styles/App.css'
import './styles/Header.css'
import './styles/Footer.css'
import './styles/SearchBar.css'
import './styles/panels/GenrePanel.css'
import './styles/panels/FilterHeader.css'
import './styles/panels/DetailPanel.css'
import './styles/panels/SegmentedControl.css'
import './styles/Home.css'
import './styles/Cinema.css'
import './styles/SearchResults.css'
import './styles/Detail.css'
import './styles/Watchlist.css'
// Import auth styles
import './styles/auth/LoginModal.css'
import './styles/auth/AuthButton.css'
// Import watchlist styles
import './styles/WatchlistButton.css'
// Import button styles
import './styles/NowPlayingButton.css'
// Import streaming providers styles
import './styles/StreamingProviders.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)