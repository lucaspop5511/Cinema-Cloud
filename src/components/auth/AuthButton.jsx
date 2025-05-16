import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoginModal from './LoginModal';
import '../../styles/auth/AuthButton.css';

const AuthButton = ({ isMobile = false }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const profileMenuRef = useRef(null);

  const handleLogout = async () => {
    try {
      await logout();
      setShowProfileMenu(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleWatchlistClick = () => {
    setShowProfileMenu(false);
    navigate('/watchlist');
  };

  const getDisplayName = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName;
    }
    if (currentUser?.email) {
      return currentUser.email.split('@')[0];
    }
    return 'User';
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  // Cloud icon SVG component
  const CloudIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" className="cloud-icon">
      <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
    </svg>
  );

  if (currentUser) {
    return (
      <div className={`auth-container ${isMobile ? 'mobile' : ''}`} ref={profileMenuRef}>
        <div className="user-profile">
          <button 
            className="profile-name-button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <CloudIcon />
            <span className="profile-name-text">{getDisplayName()}</span>
          </button>
          
          {showProfileMenu && (
            <div className="profile-menu">
              <button 
                className="profile-menu-item"
                onClick={handleWatchlistClick}
              >
                Watchlist
              </button>
              <button 
                className="profile-menu-item logout"
                onClick={handleLogout}
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`auth-container ${isMobile ? 'mobile' : ''}`}>
      <button 
        className="login-button"
        onClick={() => setShowLoginModal(true)}
      >
        <CloudIcon />
        <span className="login-button-text">Sign In</span>
      </button>
      
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
};

export default AuthButton;