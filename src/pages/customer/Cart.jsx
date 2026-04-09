import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiArrowRight,
  FiShield, FiTag, FiTruck, FiGift, FiHeart, FiRefreshCw
} from 'react-icons/fi';
import { SiRazorpay } from 'react-icons/si';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Navbar from '../../components/common/Navbar';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function Cart() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [validating, setValidating] = useState(false);
  const { fetchCart, updateCartCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => { loadCart(); }, []);

  const loadCart = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/cart');
      setItems(data.items);
      setSubtotal(data.subtotal);
      updateCartCount(data.itemCount);
    } catch {
      toast.error('Failed to load cart. Please log in.');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (id, newQty) => {
    if (newQty < 1) return removeItem(id);
    const item = items.find(i => i.id === id);
    if (newQty > item.stock) return toast.error(`Only ${item.stock} in stock`);

    const updated = items.map(i => i.id === id ? { ...i, quantity: newQty } : i);
    const newSubtotal = updated.reduce((s, i) => s + Number(i.price) * i.quantity, 0);
    setItems(updated);
    setSubtotal(newSubtotal);

    try {
      await api.put(`/cart/${id}`, { quantity: newQty });
      if (appliedCoupon) revalidateCoupon(newSubtotal);
    } catch {
      toast.error('Failed to update');
      loadCart();
    }
  };

  const removeItem = async (id) => {
    setItems(prev => prev.filter(i => i.id !== id));
    try {
      await api.delete(`/cart/${id}`);
      toast.success('Item removed');
      loadCart();
    } catch {
      toast.error('Failed to remove');
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setValidating(true);
    try {
      const { data } = await api.post('/coupons/validate', { code: couponCode, subtotal });
      setDiscount(data.discount);
      setAppliedCoupon(couponCode);
      toast.success(`🎉 Coupon applied! You save ₹${data.discount.toFixed(2)}`);
    } catch (err) {
      setDiscount(0);
      setAppliedCoupon(null);
      toast.error(err.response?.data?.message || 'Invalid coupon code');
    } finally {
      setValidating(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setDiscount(0);
    toast('Coupon removed', { icon: '🗑️' });
  };

  const revalidateCoupon = async (newSubtotal) => {
    try {
      const { data } = await api.post('/coupons/validate', { code: appliedCoupon, subtotal: newSubtotal });
      setDiscount(data.discount);
    } catch {
      setDiscount(0);
      setAppliedCoupon(null);
    }
  };

  const shipping = subtotal >= 1000 ? 0 : subtotal > 0 ? 99 : 0;
  const total = subtotal - discount + shipping;

  const handleCheckout = () => {
    navigate('/checkout', {
      state: { items, subtotal, discount, appliedCoupon, shipping, total }
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center bg-white rounded-2xl p-12 shadow-sm border border-gray-100 max-w-md mx-4">
            <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <FiShoppingBag className="text-primary-300" size={40} />
            </div>
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-3">Please sign in</h2>
            <p className="text-gray-500 mb-6">You need to be logged in to view your cart.</p>
            <Link to="/login" className="btn btn-primary px-8 py-3 text-base">Sign In</Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-800 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">
              Shopping Cart
              {items.length > 0 && (
                <span className="ml-3 text-lg font-normal text-gray-400">({items.length} {items.length === 1 ? 'item' : 'items'})</span>
              )}
            </h1>
          </div>
          {items.length > 0 && (
            <Link to="/products" className="text-sm text-primary-700 hover:underline font-medium flex items-center gap-1">
              <FiRefreshCw size={14} /> Continue Shopping
            </Link>
          )}
        </div>

        {items.length === 0 ? (
          /* Empty Cart */
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm"
          >
            <div className="w-28 h-28 bg-gradient-to-br from-primary-50 to-accent-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiShoppingBag className="text-primary-300" size={52} />
            </div>
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-3">Your cart is empty</h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              Discover unique handcrafted treasures from India's finest artisans.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/products" className="btn btn-primary px-8 py-3 rounded-xl text-base shadow-md">
                Start Shopping
              </Link>
              <Link to="/customer/wishlist" className="btn btn-secondary px-6 py-3 rounded-xl text-base flex items-center gap-2">
                <FiHeart /> View Wishlist
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">

            {/* ── LEFT: Cart Items ── */}
            <div className="flex-grow min-w-0">

              {/* Trust bar */}
              <div className="flex gap-4 flex-wrap mb-4">
                {[
                  { icon: <FiTruck size={14} />, text: 'Free shipping above ₹1,000' },
                  { icon: <FiShield size={14} />, text: '100% Secure payment' },
                  { icon: <FiGift size={14} />, text: 'Gift wrapping available' },
                ].map((item, i) => (
                  <span key={i} className="flex items-center gap-1.5 text-xs text-gray-500 bg-white px-3 py-1.5 rounded-full border border-gray-200">
                    {item.icon} {item.text}
                  </span>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Table header */}
                <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-3 text-center">Quantity</div>
                  <div className="col-span-3 text-right">Total</div>
                </div>

                <ul className="divide-y divide-gray-100">
                  <AnimatePresence>
                    {items.map(item => (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -50, height: 0 }}
                        className="px-4 sm:px-6 py-5 hover:bg-amber-50/30 transition-colors"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                          {/* Product Info */}
                          <div className="sm:col-span-6 flex gap-4">
                            <Link to={`/products/${item.product_id}`} className="shrink-0">
                              <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-gray-200"
                              />
                            </Link>
                            <div className="flex flex-col justify-center min-w-0">
                              <Link to={`/products/${item.product_id}`} className="font-semibold text-gray-900 hover:text-primary-700 line-clamp-2 leading-snug mb-1">
                                {item.name}
                              </Link>
                              <p className="text-sm text-gray-400 mb-2">By {item.artisan_name}</p>
                              <div className="flex items-baseline gap-2">
                                <span className="font-bold text-gray-900">₹{Number(item.price).toLocaleString()}</span>
                                {item.compare_price && (
                                  <span className="text-xs text-gray-400 line-through">₹{Number(item.compare_price).toLocaleString()}</span>
                                )}
                                {item.compare_price && (
                                  <span className="text-xs text-green-600 font-medium">
                                    {Math.round((1 - item.price / item.compare_price) * 100)}% off
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Quantity */}
                          <div className="sm:col-span-3 flex justify-between sm:justify-center items-center">
                            <span className="sm:hidden text-sm text-gray-500">Qty:</span>
                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50 shadow-sm">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="px-3 py-2.5 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                              ><FiMinus size={13} /></button>
                              <span className="min-w-[2rem] text-center font-bold text-sm text-gray-900">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={item.quantity >= item.stock}
                                className="px-3 py-2.5 text-gray-500 hover:bg-green-50 hover:text-green-600 transition-colors disabled:opacity-30"
                              ><FiPlus size={13} /></button>
                            </div>
                          </div>

                          {/* Total + Remove */}
                          <div className="sm:col-span-3 flex justify-between sm:justify-end items-center gap-3">
                            <span className="sm:hidden text-sm text-gray-500">Total:</span>
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-gray-900 text-lg">
                                ₹{(Number(item.price) * item.quantity).toLocaleString()}
                              </span>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                              ><FiTrash2 size={15} /></button>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </div>

              {/* Payment Method Preview */}
              <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FiShield size={16} className="text-green-500" /> Accepted Payment Methods
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'UPI', desc: 'PhonePe, GPay, Paytm', color: 'bg-purple-50 border-purple-200 text-purple-700' },
                    { label: 'Credit Card', desc: 'Visa, Mastercard, RuPay', color: 'bg-blue-50 border-blue-200 text-blue-700' },
                    { label: 'Debit Card', desc: 'All major banks', color: 'bg-green-50 border-green-200 text-green-700' },
                    { label: 'Net Banking', desc: '100+ banks', color: 'bg-amber-50 border-amber-200 text-amber-700' },
                  ].map(m => (
                    <div key={m.label} className={`border rounded-xl p-3 text-center ${m.color}`}>
                      <p className="font-semibold text-sm">{m.label}</p>
                      <p className="text-xs opacity-70 mt-0.5">{m.desc}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                  <FiShield size={11} /> All transactions secured by 256-bit SSL encryption. Powered by Razorpay.
                </p>
              </div>
            </div>

            {/* ── RIGHT: Order Summary ── */}
            <div className="w-full lg:w-[360px] shrink-0">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-24 space-y-6">

                <h2 className="text-xl font-display font-bold text-gray-900">Order Summary</h2>

                {/* Price Breakdown */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>MRP ({items.length} items)</span>
                    <span>₹{items.reduce((s, i) => s + (Number(i.compare_price || i.price) * i.quantity), 0).toLocaleString()}</span>
                  </div>
                  {items.some(i => i.compare_price) && (
                    <div className="flex justify-between text-green-600">
                      <span>Product Discount</span>
                      <span>-₹{items.reduce((s, i) => s + ((Number(i.compare_price || i.price) - Number(i.price)) * i.quantity), 0).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">₹{Number(subtotal).toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 font-medium bg-green-50 rounded-lg px-3 py-2">
                      <span className="flex items-center gap-1"><FiTag size={13} /> Coupon ({appliedCoupon})</span>
                      <span>-₹{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span className="flex items-center gap-1"><FiTruck size={13} /> Delivery</span>
                    <span>{shipping === 0 ? <span className="text-green-600 font-medium">FREE</span> : `₹${shipping}`}</span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
                      Add ₹{(1000 - subtotal).toFixed(0)} more for FREE delivery
                    </p>
                  )}
                </div>

                {/* Total */}
                <div className="border-t border-dashed border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900 text-lg">Total Amount</span>
                    <span className="text-2xl font-bold text-primary-900">₹{total.toLocaleString()}</span>
                  </div>
                  {(discount > 0 || items.some(i => i.compare_price)) && (
                    <p className="text-green-600 text-sm font-medium mt-2 text-right">
                      🎉 You save ₹{(items.reduce((s, i) => s + ((Number(i.compare_price || i.price) - Number(i.price)) * i.quantity), 0) + discount).toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Coupon Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <FiTag size={13} /> Have a coupon?
                  </label>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                      <span className="text-sm text-green-700 font-mono font-bold">{appliedCoupon} applied ✓</span>
                      <button onClick={removeCoupon} className="text-xs text-red-500 hover:underline ml-2">Remove</button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter code"
                        className="input-field py-2 text-sm uppercase tracking-widest font-mono flex-1"
                        value={couponCode}
                        onChange={e => setCouponCode(e.target.value.toUpperCase().replace(/\s/g, ''))}
                        onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                      />
                      <button
                        onClick={applyCoupon}
                        disabled={!couponCode || validating}
                        className="btn btn-secondary px-4 py-2 text-sm whitespace-nowrap"
                      >
                        {validating ? '...' : 'Apply'}
                      </button>
                    </div>
                  )}
                </div>

                {/* CTA */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCheckout}
                  className="w-full py-4 bg-primary-800 hover:bg-primary-900 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 text-base transition-colors"
                >
                  Proceed to Checkout <FiArrowRight />
                </motion.button>

                <p className="text-xs text-center text-gray-400 flex items-center justify-center gap-1.5">
                  <FiShield size={11} /> Secured by 256-bit SSL · Powered by Razorpay
                </p>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
