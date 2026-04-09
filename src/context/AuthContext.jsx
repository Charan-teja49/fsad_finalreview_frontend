import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/profile');
          setUser(res.data);
        } catch (error) {
          console.error("Auth check failed", error);
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password, expectedRole = null) => {
    const res = await api.post('/auth/login', { email, password, expectedRole });
    localStorage.setItem('token', res.data.accessToken);
    localStorage.setItem('refreshToken', res.data.refreshToken);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
