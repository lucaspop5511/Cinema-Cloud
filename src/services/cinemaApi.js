// Cinema API Service
const CINEMA_API_BASE = 'http://localhost:3001/api';

export const cinemaApi = {
  // Get all available cinemas
  async getCinemas() {
    try {
      const response = await fetch(`${CINEMA_API_BASE}/cinemas`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching cinemas:', error);
      throw error;
    }
  },

  // Get movies for a specific cinema and date
  async getMovies(cinemaId, date) {
    try {
      const response = await fetch(`${CINEMA_API_BASE}/movies/${cinemaId}/${date}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching movies:', error);
      throw error;
    }
  },

  // Health check
  async checkHealth() {
    try {
      const response = await fetch(`${CINEMA_API_BASE}/health`);
      return await response.json();
    } catch (error) {
      console.error('Error checking health:', error);
      throw error;
    }
  }
};