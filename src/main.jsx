import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'

// Import all CSS files directly
import './styles/index.css'
import './styles/App.css'
import './styles/Header.css'
import './styles/Footer.css'
import './styles/SearchBar.css'
import './styles/panels/GenrePanel.css'
import './styles/panels/FilterHeader.css'
import './styles/Home.css'
import './styles/Cinema.css'
import './styles/SearchResults.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)