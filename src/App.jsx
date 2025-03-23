import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import CategoriesPage from './pages/CategoriesPage';
import CinemaPage from './pages/CinemaPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container min-h-screen bg-gray-900 text-white">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/cinema" element={<CinemaPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;