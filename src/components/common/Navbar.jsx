import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { useWishlist } from '../../context/WishlistContext';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import {
  FiArrowLeft, FiShoppingCart, FiUser, FiSearch, FiLogOut,
  FiHeart, FiSettings, FiBell, FiCheck, FiPackage, FiShoppingBag,
  FiSun, FiMoon
} from 'react-icons/fi';
import { BsDropletHalf } from 'react-icons/bs';
import api from '../../services/api';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { liquidGlass, toggleLiquidGlass, darkMode, toggleDarkMode } = useTheme();
  const { wishlistCount } = useWishlist();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef(null);

  useEffect(() => {
    if (user) fetchNotifications();
    const interval = user ? setInterval(fetchNotifications, 30000) : null;
    return () => interval && clearInterval(interval);
  }, [user]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch { /* silent */ }
  };

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch { /* silent */ }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setUnreadCount(prev => Math.max(0, prev - 1));
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch { /* silent */ }
  };

  const handleBack = () => navigate(-1);
  const isHome = location.pathname === '/' || location.pathname === '/customer/home' || location.pathname === '/products';

  const notifIcon = (type) => {
    if (type?.includes('order')) return <FiPackage className="text-blue-500" size={16} />;
    if (type?.includes('product')) return <FiShoppingBag className="text-amber-500" size={16} />;
    return <FiBell className="text-gray-400" size={16} />;
  };

  const getHomeLink = () => {
    if (!user) return '/';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'artisan') return '/artisan/dashboard';
    return '/customer/home';
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} ${liquidGlass ? (darkMode ? 'glass-dark' : 'glass') : (darkMode ? 'bg-gray-800 shadow-sm' : 'bg-white shadow-sm')}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Left: Back + Logo */}
          <div className="flex items-center space-x-3">
            {!isHome && (
              <button onClick={handleBack} className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`} title="Go Back">
                <FiArrowLeft size={20} />
              </button>
            )}
            <Link to={getHomeLink()} className="flex items-center">
              <span className="font-display font-bold text-2xl text-primary-800 tracking-tight">
                {t('brand', 'Hand')}<span className="text-accent-500">{t('brandSuffix', 'Craft')}</span>
              </span>
            </Link>
          </div>

          {/* Center: Search */}
          {(user?.role === 'customer' || !user) && (
            <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={t('searchPlaceholder', 'Search handcrafted items...')}
                className={`w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'border-gray-300 bg-gray-50 focus:bg-white'}`}
              />
            </div>
          )}
          {user?.role !== 'customer' && user && <div className="flex-1" />}

          {/* Right: Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-colors ${darkMode ? 'text-amber-400 bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}
              title={darkMode ? t('lightMode', 'Light Mode') : t('darkMode', 'Dark Mode')}
            >
              {darkMode ? <FiSun size={17} /> : <FiMoon size={17} />}
            </button>

            {/* Liquid Glass Toggle */}
            <button
              onClick={toggleLiquidGlass}
              className={`p-2 rounded-full transition-colors ${liquidGlass ? 'text-primary-600 bg-primary-50' : (darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100')}`}
              title="Toggle Liquid Glass Effect"
            >
              <BsDropletHalf size={17} />
            </button>

            <LanguageSwitcher />

            {user ? (
              <>
                {/* Wishlist */}
                {user.role === 'customer' && (
                  <>
                    <Link to="/customer/wishlist" className={`p-2 transition-colors relative ${darkMode ? 'text-gray-300 hover:text-red-400' : 'text-gray-600 hover:text-red-500'}`} title={t('wishlist', 'Wishlist')}>
                      <FiHeart size={19} />
                      {wishlistCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                          {wishlistCount}
                        </span>
                      )}
                    </Link>
                    <Link to="/customer/cart" className={`p-2 transition-colors relative ${darkMode ? 'text-gray-300 hover:text-primary-400' : 'text-gray-600 hover:text-primary-800'}`} title={t('cart', 'Cart')}>
                      <FiShoppingCart size={19} />
                      {cartCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 bg-accent-500 text-white text-[10px] font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                  </>
                )}

                {/* Notification Bell */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => setNotifOpen(!notifOpen)}
                    className={`p-2 transition-colors relative ${darkMode ? 'text-gray-300 hover:text-primary-400' : 'text-gray-600 hover:text-primary-800'}`}
                    title={t('notifications', 'Notifications')}
                  >
                    <FiBell size={19} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {notifOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className={`absolute right-0 mt-2 w-80 rounded-2xl shadow-xl border overflow-hidden z-50 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
                      >
                        <div className={`px-4 py-3 border-b flex justify-between items-center ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                          <h3 className={`font-bold text-sm ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{t('notifications', 'Notifications')}</h3>
                          {unreadCount > 0 && (
                            <button onClick={markAllRead} className="text-xs text-primary-700 hover:underline font-medium flex items-center gap-1">
                              <FiCheck size={12} /> {t('markAllRead', 'Mark all read')}
                            </button>
                          )}
                        </div>
                        <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                          {notifications.length > 0 ? notifications.slice(0, 10).map(n => (
                            <div 
                              key={n.id} 
                              onClick={() => { if(!n.is_read) markAsRead(n.id); }}
                              className={`px-4 py-3 flex gap-3 text-sm transition-colors cursor-pointer ${!n.is_read ? (darkMode ? 'bg-primary-900/30' : 'bg-primary-50/50') : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50')}`}
                            >
                              <div className="mt-0.5 shrink-0">{notifIcon(n.type)}</div>
                              <div className="flex-1 min-w-0">
                                <p className={`leading-snug ${!n.is_read ? 'font-semibold' : ''} ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{n.title}</p>
                                <p className={`text-xs mt-0.5 line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{n.message}</p>
                                <p className="text-gray-400 text-[10px] mt-1">{new Date(n.created_at).toLocaleDateString()}</p>
                              </div>
                              {!n.is_read && <span className="w-2 h-2 bg-primary-500 rounded-full mt-1.5 shrink-0"></span>}
                            </div>
                          )) : (
                            <div className={`py-10 text-center text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{t('noNotifications', 'No notifications yet')}</div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* User Menu */}
                <div className="relative group ml-1">
                  <button className={`flex items-center space-x-2 p-1 border border-transparent rounded-full transition-all ${darkMode ? 'hover:border-gray-600' : 'hover:border-gray-200'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-primary-900 text-primary-400' : 'bg-primary-100 text-primary-700'}`}>
                      <FiUser size={16} />
                    </div>
                  </button>
                  <div className={`absolute right-0 mt-2 w-52 rounded-xl shadow-lg py-1 border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right z-50 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <div className={`px-4 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      <p className={`text-sm font-semibold truncate ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{user.name}</p>
                      <p className={`text-xs capitalize ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user.role}</p>
                    </div>
                    <Link to="/profile" className={`px-4 py-2.5 text-sm flex items-center gap-2.5 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                      <FiSettings size={14} /> {t('profileSettings', 'Profile Settings')}
                    </Link>
                    {user.role === 'customer' && (
                      <Link to="/customer/orders" className={`px-4 py-2.5 text-sm flex items-center gap-2.5 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                        <FiPackage size={14} /> {t('myOrders', 'My Orders')}
                      </Link>
                    )}
                    <div className={`border-t mt-1 ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}></div>
                    <button
                      onClick={() => { logout(); navigate('/login'); }}
                      className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2.5 ${darkMode ? 'text-red-400 hover:bg-red-900/30' : 'text-red-600 hover:bg-red-50'}`}
                    >
                      <FiLogOut size={14} /> {t('logout', 'Logout')}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3 ml-3">
                <Link to="/login" className={`font-medium text-sm transition-colors ${darkMode ? 'text-gray-300 hover:text-primary-400' : 'text-gray-600 hover:text-primary-800'}`}>{t('login', 'Log in')}</Link>
                <Link to="/signup" className="btn btn-primary px-4 py-1.5 rounded-full text-sm">{t('signup', 'Sign up')}</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
