import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    if (user && user.role === 'customer') {
      fetchWishlistCount();
    } else {
      setWishlistCount(0);
    }
  }, [user]);

  const fetchWishlistCount = async () => {
    try {
      const { data } = await api.get('/wishlist/count');
      setWishlistCount(data.count || 0);
    } catch (err) {
      // silent
    }
  };

  const updateWishlistCount = (count) => {
    setWishlistCount(count);
  };

  return (
    <WishlistContext.Provider value={{ wishlistCount, fetchWishlistCount, updateWishlistCount }}>
      {children}
    </WishlistContext.Provider>
  );
};
