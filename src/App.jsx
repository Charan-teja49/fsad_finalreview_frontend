import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { WishlistProvider } from './context/WishlistContext';

import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import LandingPage from './pages/landing/LandingPage';
import CustomerHome from './pages/customer/Home';
import ProductDetail from './pages/customer/ProductDetail';
import Cart from './pages/customer/Cart';
import Wishlist from './pages/customer/Wishlist';
import Checkout from './pages/customer/Checkout';
import Orders from './pages/customer/Orders';
import MessageArtisan from './pages/customer/MessageArtisan';
import ArtisanDashboard from './pages/artisan/Dashboard';
import ArtisanProducts from './pages/artisan/Products';
import ArtisanOrders from './pages/artisan/Orders';
import ArtisanAnalytics from './pages/artisan/Analytics';
import ArtisanCoupons from './pages/artisan/Coupons';
import ArtisanChat from './pages/artisan/Chat';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminRevenue from './pages/admin/Revenue';
import AdminModeration from './pages/admin/Moderation';
import Profile from './pages/profile/Profile';
import ChatbotWidget from './components/common/ChatbotWidget';
import NotFound from './pages/NotFound';

function AppContent() {
  const { darkMode } = useTheme();
  
  return (
    <BrowserRouter>
      <Toaster position="top-center" toastOptions={{ duration: 3000, style: { borderRadius: '12px', padding: '12px 16px', fontSize: '14px' } }} />
      <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/customer/home" element={<CustomerHome />} />
          <Route path="/products" element={<CustomerHome />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/customer/cart" element={<Cart />} />
          <Route path="/customer/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/customer/orders" element={<Orders />} />
          <Route path="/customer/messages/:artisanId" element={<MessageArtisan />} />

          {/* Artisan Routes */}
          <Route path="/artisan/dashboard" element={<ArtisanDashboard />} />
          <Route path="/artisan/products" element={<ArtisanProducts />} />
          <Route path="/artisan/orders" element={<ArtisanOrders />} />
          <Route path="/artisan/analytics" element={<ArtisanAnalytics />} />
          <Route path="/artisan/coupons" element={<ArtisanCoupons />} />
          <Route path="/artisan/chat" element={<ArtisanChat />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/revenue" element={<AdminRevenue />} />
          <Route path="/admin/moderation" element={<AdminModeration />} />

          {/* Shared */}
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <ChatbotWidget />
    </BrowserRouter>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <AppContent />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
