import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'

import './styles/fonts.css';
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
import './styles/auth/LoginModal.css'
import './styles/auth/AuthButton.css'
import './styles/WatchlistButton.css'
import './styles/NowPlayingButton.css'
import './styles/StreamingProviders.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)