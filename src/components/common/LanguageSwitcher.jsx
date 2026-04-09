import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiGlobe } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { darkMode } = useTheme();

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
  };

  return (
    <div className={`flex items-center space-x-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
      <FiGlobe className="w-4 h-4" />
      <select 
        value={i18n.language?.split('-')[0] || 'en'} 
        onChange={handleLanguageChange}
        className={`bg-transparent text-sm focus:outline-none border-none py-1 pr-4 font-medium cursor-pointer ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
      >
        <option value="en">EN</option>
        <option value="te">తెలుగు</option>
        <option value="hi">हिंदी</option>
        <option value="ta">தமிழ்</option>
      </select>
    </div>
  );
}
