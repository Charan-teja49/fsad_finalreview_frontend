import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [liquidGlass, setLiquidGlass] = useState(() => {
    const saved = localStorage.getItem('liquidGlass');
    return saved !== null ? saved === 'true' : true;
  });

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? saved === 'true' : false;
  });

  useEffect(() => {
    localStorage.setItem('liquidGlass', liquidGlass);
  }, [liquidGlass]);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleLiquidGlass = () => setLiquidGlass(prev => !prev);
  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return (
    <ThemeContext.Provider value={{ liquidGlass, toggleLiquidGlass, darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
