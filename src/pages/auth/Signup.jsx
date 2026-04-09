import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiBriefcase } from 'react-icons/fi';

export default function Signup() {
  const [role, setRole] = useState(''); // 'customer' or 'artisan'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { login } = useAuth();

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (formData.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      // First register the account
      const res = await api.post('/auth/signup', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: role,
        phone: formData.phone
      });

      // Then login using AuthContext so state updates properly
      await login(formData.email, formData.password);
      toast.success(res.data.message || 'Account created successfully!');

      if (role === 'artisan') navigate('/artisan/dashboard');
      else navigate('/customer/home');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float" style={{ animationDelay: '1.5s' }}></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-xl glass p-8 sm:p-12 rounded-3xl shadow-xl"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-display font-bold text-gray-900">Join HandCraft</h2>
          <p className="mt-2 text-sm text-gray-600">Create an account to start your journey</p>
        </div>

        <AnimatePresence mode="wait">
          {!role ? (
            <motion.div 
              key="role-selection"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-medium text-center text-gray-800 mb-4">I want to...</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <button
                  onClick={() => handleRoleSelect('customer')}
                  className="group relative flex flex-col items-center justify-center p-8 bg-white bg-opacity-60 border border-gray-200 rounded-2xl hover:border-primary-500 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <FiUser size={32} />
                  </div>
                  <span className="text-lg font-medium text-gray-900">Shop</span>
                  <span className="text-sm text-gray-500 mt-2 text-center">Buy handcrafted unique items</span>
                </button>

                <button
                  onClick={() => handleRoleSelect('artisan')}
                  className="group relative flex flex-col items-center justify-center p-8 bg-white bg-opacity-60 border border-gray-200 rounded-2xl hover:border-accent-500 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-accent-100 text-accent-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <FiBriefcase size={32} />
                  </div>
                  <span className="text-lg font-medium text-gray-900">Sell</span>
                  <span className="text-sm text-gray-500 mt-2 text-center">Showcase your artisanship</span>
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.form 
              key="signup-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleSubmit} 
              className="space-y-5"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-medium px-3 py-1 bg-primary-100 text-primary-800 rounded-full">
                  Registering as: {role === 'customer' ? 'Customer' : 'Artisan'}
                </span>
                <button 
                  type="button" 
                  onClick={() => setRole('')}
                  className="text-sm text-gray-500 hover:text-gray-800 hover:underline"
                >
                  Change role
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" name="name" required 
                  className="input-field bg-white bg-opacity-80" 
                  placeholder="John Doe"
                  value={formData.name} onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" name="email" required 
                    className="input-field bg-white bg-opacity-80" 
                    placeholder="you@email.com"
                    value={formData.email} onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Optional)</label>
                  <input 
                    type="tel" name="phone" 
                    className="input-field bg-white bg-opacity-80" 
                    placeholder="9876543210"
                    value={formData.phone} onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input 
                    type="password" name="password" required 
                    className="input-field bg-white bg-opacity-80" 
                    placeholder="••••••••"
                    value={formData.password} onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <input 
                    type="password" name="confirmPassword" required 
                    className="input-field bg-white bg-opacity-80" 
                    placeholder="••••••••"
                    value={formData.confirmPassword} onChange={handleChange}
                  />
                </div>
              </div>

              <div className="pt-4">
                <motion.button 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit" 
                  disabled={loading}
                  className={`w-full py-3 text-white font-medium rounded-lg shadow-sm transition-colors ${role === 'artisan' ? 'bg-accent-600 hover:bg-accent-700 focus:ring-accent-500' : 'bg-primary-800 hover:bg-primary-900 focus:ring-primary-500'} focus:outline-none focus:ring-2 focus:ring-offset-2`}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </motion.button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary-800 hover:underline">
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
