import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      toast.success(res.data.message || 'OTP sent!');
      if (res.data.otp) {
        toast('Demo OTP: ' + res.data.otp, { icon: '🔍', duration: 8000 }); // Just for dev convenience
      }
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/reset-password', { email, otp, newPassword });
      toast.success(res.data.message || 'Password reset successfully!');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-display font-extrabold text-gray-900">
          Reset Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            return to login
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200"
        >
          {step === 1 ? (
            <form className="space-y-6" onSubmit={handleRequestOtp}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email address</label>
                <div className="mt-1">
                  <input 
                    type="email" required 
                    className="input-field" 
                    value={email} onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <button type="submit" disabled={loading} className="w-full btn btn-primary">
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
              </div>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleResetPassword}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email verified</label>
                <div className="mt-1">
                  <input type="email" disabled className="input-field bg-gray-100" value={email} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
                <div className="mt-1">
                  <input 
                    type="text" required maxLength={6}
                    className="input-field text-center tracking-widest text-lg font-mono" 
                    value={otp} onChange={(e) => setOtp(e.target.value)}
                    placeholder="••••••"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <div className="mt-1">
                  <input 
                    type="password" required 
                    className="input-field" 
                    value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <button type="submit" disabled={loading} className="w-full btn btn-primary">
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
