import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Filter } from 'lucide-react';

const StatisticsPage = () => {
  const [timeRange, setTimeRange] = useState('weekly');
  const [showFilters, setShowFilters] = useState(false);

  // Mock data for charts
  const moviesByGenre = [
    { name: 'Action', value: 4800 },
    { name: 'Drama', value: 3200 },
    { name: 'Comedy', value: 2800 },
    { name: 'Sci-Fi', value: 2400 },
    { name: 'Horror', value: 1800 },
    { name: 'Romance', value: 1600 },
  ];

  const weeklyViews = [
    { name: 'Mon', movies: 120, tvShows: 80 },
    { name: 'Tue', movies: 140, tvShows: 100 },
    { name: 'Wed', movies: 180, tvShows: 120 },
    { name: 'Thu', movies: 160, tvShows: 110 },
    { name: 'Fri', movies: 220, tvShows: 140 },
    { name: 'Sat', movies: 280, tvShows: 220 },
    { name: 'Sun', movies: 250, tvShows: 180 },
  ];

  const monthlyViews = [
    { name: 'Jan', movies: 4200, tvShows: 2800 },
    { name: 'Feb', movies: 3800, tvShows: 2600 },
    { name: 'Mar', movies: 4600, tvShows: 3100 },
    { name: 'Apr', movies: 5200, tvShows: 3400 },
    { name: 'May', movies: 5800, tvShows: 3800 },
    { name: 'Jun', movies: 6500, tvShows: 4200 },
    { name: 'Jul', movies: 6300, tvShows: 4100 },
    { name: 'Aug', movies: 5900, tvShows: 3900 },
    { name: 'Sep', movies: 6100, tvShows: 4000 },
    { name: 'Oct', movies: 6700, tvShows: 4400 },
    { name: 'Nov', movies: 7200, tvShows: 4800 },
    { name: 'Dec', movies: 7800, tvShows: 5200 },
  ];

  // Determine which data set to use based on timeRange
  const viewData = timeRange === 'weekly' ? weeklyViews : monthlyViews;

  // Colors for pie chart
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Statistics</h1>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex rounded-md overflow-hidden">
            <button 
              className={`px-4 py-2 ${timeRange === 'weekly' ? 'bg-indigo-600' : 'bg-gray-700'}`}
              onClick={() => setTimeRange('weekly')}
            >
              Weekly
            </button>
            <button 
              className={`px-4 py-2 ${timeRange === 'monthly' ? 'bg-indigo-600' : 'bg-gray-700'}`}
              onClick={() => setTimeRange('monthly')}
            >
              Monthly
            </button>
          </div>
          
          <button 
            className="flex items-center px-4 py-2 bg-gray-700 rounded-md"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} className="mr-2" />
            Filters
          </button>
        </div>
      </div>
      
      {showFilters && (
        <div className="bg-gray-800 p-4 rounded-lg mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-400 mb-2">Content Type</label>
            <select className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2">
              <option>All Content</option>
              <option>Movies Only</option>
              <option>TV Shows Only</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-400 mb-2">Date Range</label>
            <div className="relative">
              <input 
                type="text" 
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 pl-10"
                placeholder="Select date range"
              />
              <Calendar size={16} className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          
          <div>
            <label className="block text-gray-400 mb-2">Region</label>
            <select className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2">
              <option>Global</option>
              <option>North America</option>
              <option>Europe</option>
              <option>Asia</option>
            </select>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Viewing Trends Chart */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Viewing Trends</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={viewData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#333', border: 'none' }}
                  cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                />
                <Legend />
                <Bar dataKey="movies" name="Movies" fill="#8884d8" />
                <Bar dataKey="tvShows" name="TV Shows" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Genre Distribution Chart */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Genre Distribution</h2>
          <div className