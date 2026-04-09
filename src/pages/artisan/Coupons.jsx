import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTag, FiToggleLeft, FiToggleRight, FiTrash2, FiPercent, FiDollarSign, FiInfo } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';

const emptyForm = {
  code: '',
  discount_type: 'percentage', // 'percentage' or 'fixed'
  discount_value: '',
  min_order: '',
  max_discount: '',
  usage_limit: 100,
  expires_at: ''
};

export default function ArtisanCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/artisan/coupons');
      setCoupons(data);
    } catch (err) {
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/artisan/coupons', form);
      toast.success('Coupon created!');
      setShowModal(false);
      setForm(emptyForm);
      fetchCoupons();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create coupon');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id, current) => {
    try {
      await api.put(`/artisan/coupons/${id}/toggle`);
      toast.success(current ? 'Coupon deactivated' : 'Coupon activated');
      fetchCoupons();
    } catch (err) {
      toast.error('Failed to update coupon');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon permanently?')) return;
    try {
      await api.delete(`/artisan/coupons/${id}`);
      toast.success('Coupon deleted');
      fetchCoupons();
    } catch (err) {
      toast.error('Failed to delete coupon');
    }
  };

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const code = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    setForm({ ...form, code });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar role="artisan" />
        <main className="ml-64 p-8 w-full">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900">My Coupons</h1>
              <p className="text-gray-600 mt-1">Create discount codes to attract more customers</p>
            </div>
            <button
              onClick={() => { setForm(emptyForm); setShowModal(true); }}
              className="btn btn-primary flex items-center gap-2 px-5 py-2.5 shadow-md"
            >
              <FiPlus /> Create Coupon
            </button>
          </div>

          {/* Info Banner */}
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3 text-sm text-blue-800">
            <FiInfo className="mt-0.5 shrink-0" />
            <p>Coupons you create are available store-wide for all customers to use during checkout. Active coupons will automatically appear in the coupon validation system.</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-800 rounded-full animate-spin"></div>
            </div>
          ) : coupons.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
              <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTag size={40} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No coupons yet</h3>
              <p className="text-gray-500 mb-6">Create your first discount coupon to attract more buyers.</p>
              <button onClick={() => setShowModal(true)} className="btn btn-primary px-6">
                <FiPlus className="mr-2" /> Create First Coupon
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              <AnimatePresence>
                {coupons.map(coupon => (
                  <motion.div
                    key={coupon.id}
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                    className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${coupon.is_active ? 'border-green-200' : 'border-gray-200 opacity-70'}`}
                  >
                    {/* Top stripe */}
                    <div className={`h-2 ${coupon.is_active ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gray-200'}`}></div>

                    <div className="p-5">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono font-bold text-xl text-gray-900 tracking-wider">{coupon.code}</span>
                          </div>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${coupon.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {coupon.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary-800">
                            {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `₹${coupon.discount_value}`}
                          </p>
                          <p className="text-xs text-gray-500">OFF</p>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-sm text-gray-600 border-t border-dashed border-gray-200 pt-4 mt-2">
                        <div className="flex justify-between">
                          <span>Min. Order</span>
                          <span className="font-medium">₹{coupon.min_order || 0}</span>
                        </div>
                        {coupon.discount_type === 'percentage' && coupon.max_discount && (
                          <div className="flex justify-between">
                            <span>Max Discount</span>
                            <span className="font-medium">₹{coupon.max_discount}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Uses Left</span>
                          <span className="font-medium">{coupon.usage_limit - coupon.used_count} / {coupon.usage_limit}</span>
                        </div>
                        {coupon.expires_at && (
                          <div className="flex justify-between">
                            <span>Expires</span>
                            <span className="font-medium">{new Date(coupon.expires_at).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                        <button
                          onClick={() => handleToggle(coupon.id, coupon.is_active)}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-colors ${coupon.is_active ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                        >
                          {coupon.is_active ? <><FiToggleLeft /> Deactivate</> : <><FiToggleRight /> Activate</>}
                        </button>
                        <button
                          onClick={() => handleDelete(coupon.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete coupon"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </main>
      </div>

      {/* Create Coupon Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={e => e.target === e.currentTarget && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold font-display text-gray-900">Create Discount Coupon</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-700">✕</button>
              </div>

              <form onSubmit={handleCreate} className="p-6 space-y-5">
                {/* Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                  <div className="flex gap-2">
                    <input
                      required
                      className="input-field uppercase flex-1"
                      placeholder="e.g. SAVE20"
                      value={form.code}
                      onChange={e => setForm({ ...form, code: e.target.value.toUpperCase().replace(/\s/g, '') })}
                    />
                    <button type="button" onClick={generateCode} className="btn btn-secondary px-3 text-xs whitespace-nowrap">
                      Auto Generate
                    </button>
                  </div>
                </div>

                {/* Discount Type + Value */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, discount_type: 'percentage' })}
                        className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg border text-sm font-medium transition-colors ${form.discount_type === 'percentage' ? 'bg-primary-50 border-primary-400 text-primary-700' : 'border-gray-200 text-gray-500'}`}
                      >
                        <FiPercent size={14} /> %
                      </button>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, discount_type: 'fixed' })}
                        className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg border text-sm font-medium transition-colors ${form.discount_type === 'fixed' ? 'bg-primary-50 border-primary-400 text-primary-700' : 'border-gray-200 text-gray-500'}`}
                      >
                        <FiDollarSign size={14} /> ₹
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {form.discount_type === 'percentage' ? 'Percentage (%)' : 'Fixed Amount (₹)'}
                    </label>
                    <input
                      type="number" required min="1" max={form.discount_type === 'percentage' ? 99 : undefined}
                      className="input-field"
                      placeholder={form.discount_type === 'percentage' ? '20' : '100'}
                      value={form.discount_value}
                      onChange={e => setForm({ ...form, discount_value: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min. Order Value (₹)</label>
                    <input
                      type="number" min="0"
                      className="input-field"
                      placeholder="0 (no minimum)"
                      value={form.min_order}
                      onChange={e => setForm({ ...form, min_order: e.target.value })}
                    />
                  </div>
                  {form.discount_type === 'percentage' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Max Discount Cap (₹)</label>
                      <input
                        type="number" min="0"
                        className="input-field"
                        placeholder="Optional cap"
                        value={form.max_discount}
                        onChange={e => setForm({ ...form, max_discount: e.target.value })}
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit</label>
                    <input
                      type="number" min="1" required
                      className="input-field"
                      value={form.usage_limit}
                      onChange={e => setForm({ ...form, usage_limit: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date (Optional)</label>
                    <input
                      type="date"
                      className="input-field"
                      min={new Date().toISOString().split('T')[0]}
                      value={form.expires_at}
                      onChange={e => setForm({ ...form, expires_at: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary px-5">Cancel</button>
                  <button type="submit" disabled={saving} className="btn btn-primary px-6">
                    {saving ? 'Creating...' : 'Create Coupon'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
