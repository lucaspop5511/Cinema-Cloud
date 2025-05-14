import React, { useState } from 'react';
import '../styles/Calendar.css';

function Calendar({ selectedDate, onDateSelect }) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  
  // Days of the week
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Get first day of the month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Generate calendar days
  const days = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }
  
  // Handle date selection - Fixed to avoid timezone issues
  const handleDateClick = (day) => {
    if (day) {
      // Create date in local timezone and format as YYYY-MM-DD
      const selected = new Date(currentYear, currentMonth, day);
      const year = selected.getFullYear();
      const month = String(selected.getMonth() + 1).padStart(2, '0');
      const dayStr = String(selected.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${dayStr}`;
      
      console.log(`Clicked day ${day}, formatted as: ${dateString}`);
      onDateSelect(dateString);
    }
  };
  
  // Check if date is today
  const isToday = (day) => {
    return day === today.getDate() && 
           currentMonth === today.getMonth() && 
           currentYear === today.getFullYear();
  };
  
  // Check if date is selected
  const isSelected = (day) => {
    if (!selectedDate || !day) return false;
    const currentDate = new Date(currentYear, currentMonth, day);
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(currentDate.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${dayStr}`;
    return dateString === selectedDate;
  };
  
  // Navigate months
  const previousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  return (
    <div className="calendar">
      <div className="calendar-header">
        <button className="nav-button" onClick={previousMonth}>&lt;</button>
        <h3 className="month-year">
          {monthNames[currentMonth]} {currentYear}
        </h3>
        <button className="nav-button" onClick={nextMonth}>&gt;</button>
      </div>
      
      <div className="calendar-grid">
        {/* Days of week header */}
        {daysOfWeek.map(day => (
          <div key={day} className="day-header">{day}</div>
        ))}
        
        {/* Calendar days */}
        {days.map((day, index) => (
          <div
            key={index}
            className={`calendar-day ${
              day === null ? 'empty' : ''
            } ${
              isToday(day) ? 'today' : ''
            } ${
              isSelected(day) ? 'selected' : ''
            }`}
            onClick={() => handleDateClick(day)}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Calendar;