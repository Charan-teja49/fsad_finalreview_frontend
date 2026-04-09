import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiUser, FiBriefcase, FiShield, FiEye, FiEyeOff } from 'react-icons/fi';

const ROLES = [
  { id: 'customer', label: 'Customer', icon: <FiUser size={20} />, desc: 'Shop handcrafted items', color: 'primary' },
  { id: 'artisan', label: 'Artisan', icon: <FiBriefcase size={20} />, desc: 'Manage your store', color: 'accent' },
  { id: 'admin', label: 'Admin', icon: <FiShield size={20} />, desc: 'Platform management', color: 'gray' },
];

export default function Login() {
  const [selectedRole, setSelectedRole] = useState('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(email, password, selectedRole);

      // Validate the returned role matches what was selected
      if (data.user.role !== selectedRole) {
        // Logout to clear the token we just set
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        throw new Error(`No ${selectedRole} account found with these credentials.`);
      }

      toast.success(`Welcome back! Logged in as ${selectedRole}.`);

      if (data.user.role === 'admin') navigate('/admin/dashboard');
      else if (data.user.role === 'artisan') navigate('/artisan/dashboard');
      else navigate('/customer/home');
    } catch (error) {
      toast.error(error.message || error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const activeRole = ROLES.find(r => r.id === selectedRole);
  const colorMap = {
    primary: { btn: 'bg-primary-800 hover:bg-primary-900', ring: 'ring-primary-400', tab: 'border-primary-600 bg-primary-50 text-primary-800' },
    accent:  { btn: 'bg-accent-600 hover:bg-accent-700',   ring: 'ring-accent-400',  tab: 'border-accent-600 bg-accent-50 text-accent-800' },
    gray:    { btn: 'bg-gray-800 hover:bg-gray-900',        ring: 'ring-gray-400',    tab: 'border-gray-600 bg-gray-100 text-gray-800' },
  };
  const colors = colorMap[activeRole.color];

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #f5f0eb 0%, #ebe5dc 50%, #e0d5c7 100%)' }}
    >
      {/* Decorative blobs */}
      <div className="absolute top-[-15%] left-[-10%] w-96 h-96 bg-primary-200 rounded-full opacity-40 blur-3xl animate-float"></div>
      <div className="absolute bottom-[-15%] right-[-10%] w-96 h-96 bg-accent-200 rounded-full opacity-40 blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold text-primary-900 tracking-tight">
            Hand<span className="text-accent-500">Craft</span>
          </h1>
          <p className="text-gray-600 mt-2 text-sm">India's Finest Artisan Marketplace</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Role Tabs */}
          <div className="flex border-b border-gray-100">
            {ROLES.map(role => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`flex-1 flex flex-col items-center py-4 px-2 text-xs font-semibold transition-all border-b-2 ${
                  selectedRole === role.id
                    ? colorMap[role.color].tab + ' border-b-2'
                    : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="mb-1">{role.icon}</span>
                {role.label}
              </button>
            ))}
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedRole}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-xl font-display font-bold text-gray-900 mb-1">
                  {selectedRole === 'admin' ? 'Admin Access' : `Sign in as ${activeRole.label}`}
                </h2>
                <p className="text-sm text-gray-500 mb-6">{activeRole.desc}</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      className="input-field"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-medium text-gray-700">Password</label>
                      <Link to="/forgot-password" className="text-xs font-medium text-primary-700 hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        className="input-field pr-10"
                        placeholder="••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(p => !p)}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-700"
                      >
                        {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                      </button>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 text-white font-semibold rounded-xl shadow-md transition-colors text-base mt-2 ${colors.btn}`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Signing in...
                      </span>
                    ) : `Sign in as ${activeRole.label}`}
                  </motion.button>
                </form>
              </motion.div>
            </AnimatePresence>

            {selectedRole !== 'admin' && (
              <p className="mt-6 text-center text-sm text-gray-500">
                Don't have an account?{' '}
                <Link to="/signup" className="font-semibold text-primary-800 hover:underline">
                  Sign up
                </Link>
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
