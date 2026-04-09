import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiSave, FiLock, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Navbar from '../../components/common/Navbar';
import { useTranslation } from 'react-i18next';

export default function Profile() {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const { t } = useTranslation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const [form, setForm] = useState({ name: '', phone: '' });

  const [pwForm, setPwForm] = useState({
    currentPassword: '', newPassword: '', confirmPassword: ''
  });
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/auth/profile');
      setProfile(data);
      setForm({
        name: data.name || '',
        phone: data.phone || ''
      });
    } catch (err) {
      toast.error(t('failedLoadProfile', 'Failed to load profile'));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/auth/profile', {
        name: form.name,
        phone: form.phone
      });
      setProfile(data);
      toast.success(t('profileUpdated', 'Profile updated successfully!'));
    } catch (err) {
      toast.error(err.response?.data?.message || t('failedUpdateProfile', 'Failed to update profile'));
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      return toast.error(t('passwordNoMatch', 'New passwords do not match'));
    }
    if (pwForm.newPassword.length < 6) {
      return toast.error(t('passwordTooShort', 'Password must be at least 6 characters'));
    }
    setPwSaving(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword
      });
      toast.success(t('passwordChanged', 'Password changed successfully!'));
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || t('failedChangePassword', 'Failed to change password'));
    } finally {
      setPwSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-800 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Navbar />

      <main className="flex-grow max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <h1 className={`text-3xl font-display font-bold mb-8 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{t('myProfile', 'My Profile')}</h1>

        {/* Avatar Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl border shadow-sm p-8 mb-6 flex flex-col sm:flex-row items-center gap-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}
        >
          <div className="relative">
            <div className={`w-28 h-28 rounded-full overflow-hidden border-4 flex items-center justify-center ${darkMode ? 'border-primary-900 bg-primary-900/30' : 'border-primary-100 bg-primary-50'}`}>
              <FiUser className="text-primary-300 w-14 h-14" />
            </div>
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{profile?.name}</h2>
            <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{profile?.email}</p>
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${darkMode ? 'bg-primary-900/50 text-primary-300' : 'bg-primary-50 text-primary-700'}`}>
              {profile?.role}
            </span>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className={`flex border-b mb-6 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-4 font-medium text-sm transition-colors border-b-2 -mb-px ${activeTab === 'profile' ? 'border-primary-800 text-primary-900' : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}`}
          >
            {t('editProfile', 'Edit Profile')}
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`pb-3 px-4 font-medium text-sm transition-colors border-b-2 -mb-px ${activeTab === 'password' ? 'border-primary-800 text-primary-900' : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}`}
          >
            {t('changePassword', 'Change Password')}
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.form
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            onSubmit={handleSave}
            className={`rounded-2xl border shadow-sm p-8 space-y-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('fullName', 'Full Name')}</label>
                <input
                  type="text" required
                  className={`input-field ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : ''}`}
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('phoneNumber', 'Phone Number')}</label>
                <input
                  type="tel"
                  className={`input-field ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : ''}`}
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={saving}
                className="btn btn-primary px-8 py-2.5 flex items-center gap-2 shadow-md"
              >
                {saving ? t('saving', 'Saving...') : <><FiSave /> {t('saveChanges', 'Save Changes')}</>}
              </motion.button>
            </div>
          </motion.form>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <motion.form
            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
            onSubmit={handlePasswordChange}
            className={`rounded-2xl border shadow-sm p-8 space-y-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}
          >
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('currentPassword', 'Current Password')}</label>
              <input
                type="password" required
                className={`input-field ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : ''}`}
                value={pwForm.currentPassword}
                onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('newPassword', 'New Password')}</label>
                <input
                  type="password" required minLength={6}
                  className={`input-field ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : ''}`}
                  value={pwForm.newPassword}
                  onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('confirmPassword', 'Confirm New Password')}</label>
                <input
                  type="password" required minLength={6}
                  className={`input-field ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : ''}`}
                  value={pwForm.confirmPassword}
                  onChange={e => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                />
              </div>
            </div>

            <div className={`rounded-xl p-4 text-sm ${darkMode ? 'bg-amber-900/30 border border-amber-800 text-amber-300' : 'bg-amber-50 border border-amber-200 text-amber-800'}`}>
              <FiLock className="inline mr-2" />
              {t('passwordNote', "After changing your password, you'll stay logged in on this device.")}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={pwSaving}
                className="btn btn-primary px-8 py-2.5 flex items-center gap-2 shadow-md"
              >
                {pwSaving ? t('updating', 'Updating...') : <><FiCheckCircle /> {t('updatePassword', 'Update Password')}</>}
              </button>
            </div>
          </motion.form>
        )}
      </main>
    </div>
  );
}
