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

  if (currentUser) {
    return (
      <div className={`auth-container ${isMobile ? 'mobile' : ''}`} ref={profileMenuRef}>
        <div className="user-profile">
          <button 
            className="profile-name-button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            {getDisplayName()}
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
        Sign In
      </button>
      
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
};

export default AuthButton;