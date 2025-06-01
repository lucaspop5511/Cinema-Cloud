import React, { useState, useContext } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AppContext } from '../AppWrapper';
import { createPortal } from 'react-dom';
import CloudsBackground from '../CloudsBackgroundLogin';
import '../../styles/auth/LoginModal.css';

const LoginModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, signup, loginWithGoogle, authError } = useAuth();
  const { isMobile, closePanel } = useContext(AppContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password, displayName);
      }
      onClose();
      resetForm();
    } catch (error) {
      console.error('Authentication error:', error);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    
    setLoading(true);
    try {
      await loginWithGoogle();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Google login error:', error);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setDisplayName('');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  if (!isOpen) return null;

  const GoogleLogo = () => (
    <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );

  // Use createPortal to render modal directly to document.body
  return createPortal(
    <div className="login-modal-overlay" onClick={onClose}>
      {/* Cloud background pattern */}
      <CloudsBackground />
      
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <div className="login-modal-header">
          {!isLogin ? <h2>Sing Up</h2> : <h2>Sign In</h2>}
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="login-modal-content">
          {authError && <div className="auth-error">{authError}</div>}
          
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="displayName">Display Name</label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required={!isLogin}
                />
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="auth-button primary"
              disabled={loading}
            >
              {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
            </button>
          </form>

          <div className="divider">
            <span>or</span>
          </div>

          <button 
            className="auth-button google"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <GoogleLogo />
            Continue with Google
          </button>

          <div className="auth-switch">
            <span>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button type="button" onClick={toggleMode} className="link-button">
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LoginModal;