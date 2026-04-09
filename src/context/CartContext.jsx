import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (user && user.role === 'customer') {
      fetchCart();
    } else {
      setCartCount(0);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const { data } = await api.get('/cart');
      setCartCount(data.itemCount);
    } catch (err) {
      console.error(err);
    }
  };

  const updateCartCount = (count) => {
    setCartCount(count);
  };

  return (
    <CartContext.Provider value={{ cartCount, fetchCart, updateCartCount }}>
      {children}
    </CartContext.Provider>
  );
};
