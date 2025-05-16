import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

const WatchlistContext = createContext();

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};

export const WatchlistProvider = ({ children }) => {
  const { currentUser, loading: authLoading } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Function to fetch watchlist manually
  const fetchWatchlist = useCallback(async () => {
    if (!currentUser) {
      setWatchlist([]);
      setLoading(false);
      setHasLoaded(true);
      return;
    }

    setLoading(true);
    try {
      console.log('Fetching watchlist for user:', currentUser.uid);
      const watchlistRef = collection(db, 'users', currentUser.uid, 'watchlist');
      const snapshot = await getDocs(watchlistRef);
      
      const watchlistItems = [];
      snapshot.forEach((doc) => {
        watchlistItems.push({
          ...doc.data()
        });
      });
      
      console.log('Fetched watchlist items:', watchlistItems.length);
      setWatchlist(watchlistItems);
      setHasLoaded(true);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      setWatchlist([]);
      setHasLoaded(true);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Load user's watchlist when they log in
  useEffect(() => {
    if (authLoading) return;
    fetchWatchlist();
  }, [currentUser, authLoading, fetchWatchlist]);

  // Set up real-time listener after initial load (optional enhancement)
  useEffect(() => {
    if (!currentUser || !hasLoaded) return;

    const watchlistRef = collection(db, 'users', currentUser.uid, 'watchlist');
    
    // Set up listener with error handling
    const unsubscribe = onSnapshot(
      watchlistRef,
      (snapshot) => {
        console.log('Real-time update - watchlist items:', snapshot.size);
        const watchlistItems = [];
        snapshot.forEach((doc) => {
          watchlistItems.push({
            ...doc.data()
          });
        });
        setWatchlist(watchlistItems);
      },
      (error) => {
        console.warn('Real-time listener error (falling back to manual fetch):', error);
        // Don't fail completely, just fall back to manual fetching
        // The manual add/remove operations will still refresh the list
      }
    );

    return () => unsubscribe();
  }, [currentUser, hasLoaded]);

  // Add item to watchlist
  const addToWatchlist = async (item, mediaType) => {
    if (!currentUser) return false;

    try {
      const watchlistItem = {
        id: item.id,
        title: mediaType === 'movie' ? item.title : item.name,
        poster_path: item.poster_path,
        release_date: mediaType === 'movie' ? item.release_date : item.first_air_date,
        vote_average: item.vote_average,
        media_type: mediaType,
        added_at: new Date().toISOString()
      };

      const docRef = doc(db, 'users', currentUser.uid, 'watchlist', `${mediaType}_${item.id}`);
      await setDoc(docRef, watchlistItem);

      console.log('Added to watchlist:', watchlistItem.title);
      
      // Immediate UI update for better UX
      setWatchlist(prev => {
        // Check if item already exists
        const exists = prev.some(item => item.id === watchlistItem.id && item.media_type === watchlistItem.media_type);
        if (exists) return prev;
        return [...prev, watchlistItem];
      });
      
      return true;
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      // On error, refresh to ensure consistency
      await fetchWatchlist();
      return false;
    }
  };

  // Remove item from watchlist
  const removeFromWatchlist = async (itemId, mediaType) => {
    if (!currentUser) return false;

    try {
      const docRef = doc(db, 'users', currentUser.uid, 'watchlist', `${mediaType}_${itemId}`);
      await deleteDoc(docRef);
      
      console.log('Removed from watchlist:', `${mediaType}_${itemId}`);
      
      // Immediate UI update for better UX
      setWatchlist(prev => prev.filter(item => !(item.id === itemId && item.media_type === mediaType)));
      
      return true;
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      // On error, refresh to ensure consistency
      await fetchWatchlist();
      return false;
    }
  };

  // Check if item is in watchlist
  const isInWatchlist = (itemId, mediaType) => {
    return watchlist.some(item => item.id === itemId && item.media_type === mediaType);
  };

  // Get watchlist grouped by media type
  const getWatchlistByType = (mediaType) => {
    return watchlist.filter(item => item.media_type === mediaType);
  };

  const value = {
    watchlist,
    loading,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    getWatchlistByType,
    refreshWatchlist: fetchWatchlist
  };

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
};