import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Cinema from './pages/Cinema'
import Header from './components/Header'
import Footer from './components/Footer'
import './styles/App.css'

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cinema" element={<Cinema />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App