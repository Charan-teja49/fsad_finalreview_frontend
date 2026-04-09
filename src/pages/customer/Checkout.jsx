import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiCheckCircle, FiTruck, FiCreditCard, FiMapPin,
  FiPlus, FiLock, FiShield, FiChevronRight, FiEdit2
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Navbar from '../../components/common/Navbar';
import { useCart } from '../../context/CartContext';

const PAYMENT_METHODS = [
  {
    id: 'upi',
    name: 'UPI',
    desc: 'PhonePe, Google Pay, Paytm, BHIM',
    color: 'bg-purple-50 border-purple-300',
    activeColor: 'border-purple-600 bg-purple-50',
    badge: '⚡ Instant',
    badgeColor: 'bg-purple-100 text-purple-700',
    apps: ['PhonePe', 'GPay', 'Paytm', 'BHIM'],
  },
  {
    id: 'card',
    name: 'Credit / Debit Card',
    desc: 'Visa, Mastercard, RuPay supported',
    color: 'bg-blue-50 border-blue-200',
    activeColor: 'border-blue-600 bg-blue-50',
    badge: '🛡️ Secure',
    badgeColor: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'netbanking',
    name: 'Net Banking',
    desc: 'All major Indian banks — SBI, HDFC, ICICI, Axis',
    color: 'bg-green-50 border-green-200',
    activeColor: 'border-green-600 bg-green-50',
    badge: '🏦 100+ banks',
    badgeColor: 'bg-green-100 text-green-700',
  },
  {
    id: 'cod',
    name: 'Cash on Delivery',
    desc: 'Pay in cash when your order arrives',
    color: 'bg-amber-50 border-amber-200',
    activeColor: 'border-amber-600 bg-amber-50',
    badge: '📦 On arrival',
    badgeColor: 'bg-amber-100 text-amber-700',
  },
];

const STEP_LABELS = ['Delivery', 'Payment', 'Confirm'];

export default function Checkout() {
  const [step, setStep] = useState(1);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [cartData, setCartData] = useState(null);
  const [orderInfo, setOrderInfo] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newAddress, setNewAddress] = useState({
    name: '', phone: '', email: '', address_line1: '', address_line2: '',
    city: '', state: '', pincode: '', is_default: false
  });
  const [savingAddr, setSavingAddr] = useState(false);

  const { fetchCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Accept data passed from Cart page (subtotal/discount) or fetch fresh
  const passedState = location.state || {};

  useEffect(() => { loadCheckoutData(); }, []);

  const loadCheckoutData = async () => {
    setLoading(true);
    try {
      const [addrRes, cartRes] = await Promise.all([
        api.get('/addresses'),
        api.get('/cart'),
      ]);

      setAddresses(addrRes.data);
      const def = addrRes.data.find(a => a.is_default) || addrRes.data[0];
      if (def) setSelectedAddressId(def.id);
      else setShowAddForm(true);

      if (cartRes.data.items.length === 0) {
        toast.error('Your cart is empty');
        navigate('/customer/cart');
        return;
      }
      setCartData(cartRes.data);
    } catch {
      toast.error('Failed to load checkout data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setSavingAddr(true);
    try {
      const payload = { ...newAddress, is_default: newAddress.is_default ? 1 : 0 };
      const { data } = await api.post('/addresses', payload);
      toast.success('Address saved!');
      const renewed = await api.get('/addresses');
      setAddresses(renewed.data);
      setSelectedAddressId(data.id);
      setShowAddForm(false);
      setNewAddress({ name: '', phone: '', email: '', address_line1: '', address_line2: '', city: '', state: '', pincode: '', is_default: false });
    } catch {
      toast.error('Failed to save address');
    } finally {
      setSavingAddr(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) return toast.error('Select a delivery address');
    if (!paymentMethod) return toast.error('Select a payment method');
    if (paymentMethod === 'upi' && !upiId.includes('@')) return toast.error('Enter a valid UPI ID (e.g. name@upi)');

    setPlacing(true);
    try {
      const { data } = await api.post('/orders', {
        address_id: selectedAddressId,
        payment_method: paymentMethod,
        coupon_code: passedState.appliedCoupon || null,
      });
      toast.success('🎉 Order placed successfully!');
      await fetchCart();
      setOrderInfo(data.order);
      setStep(4); // success
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  // Totals — prefer passed state (has coupon), else calculate from cart
  const subtotal = passedState.subtotal ?? cartData?.subtotal ?? 0;
  const discount = passedState.discount ?? 0;
  const shipping = subtotal >= 1000 ? 0 : subtotal > 0 ? 99 : 0;
  const total = subtotal - discount + shipping;

  const selectedAddr = addresses.find(a => a.id === selectedAddressId);

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

  /* ── SUCCESS ── */
  if (step === 4 && orderInfo) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow flex items-center justify-center px-4 py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-10 text-center shadow-xl border border-gray-100 max-w-lg w-full"
          >
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
              className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <FiCheckCircle size={52} />
            </motion.div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Order Confirmed! 🎉</h1>
            <p className="text-gray-500 mb-2">Thank you for supporting India's artisans!</p>
            <p className="font-mono text-sm text-gray-400 mb-8">Order: <span className="font-bold text-gray-700">{orderInfo.orderNumber}</span></p>

            <div className="bg-gradient-to-br from-primary-50 to-amber-50 rounded-2xl p-6 mb-8 text-left space-y-3">
              <div className="flex justify-between items-center border-b border-white/60 pb-3">
                <span className="text-gray-600">Amount Paid</span>
                <span className="text-xl font-bold text-gray-900">₹{Number(orderInfo.total).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/60 pb-3">
                <span className="text-gray-600">Payment Mode</span>
                <span className="font-semibold text-gray-800 uppercase text-sm">{orderInfo.paymentMethod}</span>
              </div>
              <div className="flex items-start gap-3 pt-1">
                <FiTruck className="text-primary-600 mt-0.5 shrink-0" size={20} />
                <div>
                  <p className="font-semibold text-gray-900">Estimated Delivery</p>
                  <p className="text-gray-600 text-sm">{new Date(orderInfo.deliveryDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              <button 
                onClick={async () => {
                  if (window.confirm("Are you sure you want to cancel this order?")) {
                    try {
                      await api.put(`/orders/${orderInfo.orderNumber.split('-')[1]}/cancel`, { reason: 'Customer requested' });
                      toast.success("Order cancelled");
                      navigate('/customer/orders');
                    } catch (err) {
                      toast.error('Failed to cancel order');
                    }
                  }
                }}
                className="btn border border-red-200 text-red-600 hover:bg-red-50 px-6 py-2.5 transition-colors"
              >
                Cancel Order
              </button>
              <button onClick={() => navigate('/customer/orders')} className="btn btn-secondary px-6 py-2.5">
                Track Order
              </button>
              <button onClick={() => navigate('/products')} className="btn btn-primary px-8 py-2.5 shadow-md">
                Shop More
              </button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-10">
          {STEP_LABELS.map((label, i) => {
            const n = i + 1;
            const active = step === n;
            const done = step > n;
            return (
              <React.Fragment key={label}>
                <div className={`flex flex-col items-center ${active ? 'text-primary-800' : done ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${
                    done ? 'bg-green-500 border-green-500 text-white' :
                    active ? 'bg-primary-800 border-primary-800 text-white' :
                    'bg-white border-gray-200 text-gray-400'
                  }`}>
                    {done ? '✓' : n}
                  </div>
                  <span className="mt-1.5 text-xs font-semibold hidden sm:block">{label}</span>
                </div>
                {i < STEP_LABELS.length - 1 && (
                  <div className={`h-0.5 w-16 sm:w-24 mx-2 rounded transition-all ${step > n ? 'bg-green-400' : 'bg-gray-200'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── LEFT COLUMN ── */}
          <div className="flex-grow min-w-0 space-y-6">

            {/* STEP 1: DELIVERY ADDRESS */}
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="delivery"
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8"
                >
                  <h2 className="text-xl font-display font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="w-7 h-7 bg-primary-800 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    <FiMapPin className="text-primary-600" /> Delivery Address
                  </h2>

                  {!showAddForm && addresses.length > 0 ? (
                    <div className="space-y-3">
                      {addresses.map(addr => (
                        <div
                          key={addr.id}
                          onClick={() => setSelectedAddressId(addr.id)}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            selectedAddressId === addr.id
                              ? 'border-primary-500 bg-primary-50 shadow-sm'
                              : 'border-gray-200 hover:border-primary-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-bold text-gray-900">{addr.name}</p>
                                {addr.is_default === 1 && (
                                  <span className="text-[10px] bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-bold tracking-wide uppercase">Default</span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{addr.address_line1}{addr.address_line2 ? `, ${addr.address_line2}` : ''}</p>
                              <p className="text-sm text-gray-600">{addr.city}, {addr.state} — {addr.pincode}</p>
                              <p className="text-sm text-gray-400 mt-1">📞 {addr.phone}</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ml-4 transition-colors ${
                              selectedAddressId === addr.id ? 'border-primary-600' : 'border-gray-300'
                            }`}>
                              {selectedAddressId === addr.id && <div className="w-2.5 h-2.5 bg-primary-600 rounded-full" />}
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center gap-2 text-primary-700 font-medium hover:text-primary-900 mt-2 text-sm"
                      >
                        <FiPlus size={15} /> Add new address
                      </button>
                    </div>
                  ) : (
                    <motion.form
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      onSubmit={handleAddAddress}
                      className="space-y-4 bg-gray-50 p-5 rounded-xl border border-gray-200"
                    >
                      <h3 className="font-semibold text-gray-900">New Delivery Address</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input className="input-field" placeholder="Full Name *" required value={newAddress.name} onChange={e => setNewAddress({ ...newAddress, name: e.target.value })} />
                        <input className="input-field" placeholder="Phone Number *" required value={newAddress.phone} onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })} />
                        <input className="input-field" placeholder="Email (Optional)" value={newAddress.email} onChange={e => setNewAddress({ ...newAddress, email: e.target.value })} />
                        <input className="input-field" placeholder="Pincode *" required value={newAddress.pincode} onChange={e => setNewAddress({ ...newAddress, pincode: e.target.value })} />
                        <input className="input-field sm:col-span-2" placeholder="Address Line 1 *" required value={newAddress.address_line1} onChange={e => setNewAddress({ ...newAddress, address_line1: e.target.value })} />
                        <input className="input-field sm:col-span-2" placeholder="Landmark / Flat / Area (Optional)" value={newAddress.address_line2} onChange={e => setNewAddress({ ...newAddress, address_line2: e.target.value })} />
                        <input className="input-field" placeholder="City *" required value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} />
                        <input className="input-field" placeholder="State *" required value={newAddress.state} onChange={e => setNewAddress({ ...newAddress, state: e.target.value })} />
                      </div>
                      <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                        <input type="checkbox" checked={newAddress.is_default} onChange={e => setNewAddress({ ...newAddress, is_default: e.target.checked })} className="rounded" />
                        Set as default address
                      </label>
                      <div className="flex gap-3 pt-2">
                        <button type="submit" disabled={savingAddr} className="btn btn-primary px-6">
                          {savingAddr ? 'Saving...' : 'Save Address'}
                        </button>
                        {addresses.length > 0 && (
                          <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-secondary px-4">Cancel</button>
                        )}
                      </div>
                    </motion.form>
                  )}

                  {!showAddForm && selectedAddressId && (
                    <div className="mt-6 pt-5 border-t border-gray-100 flex justify-end">
                      <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => setStep(2)}
                        className="btn btn-primary px-8 py-3 font-semibold shadow-md flex items-center gap-2"
                      >
                        Continue to Payment <FiChevronRight />
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* STEP 2: PAYMENT */}
              {step === 2 && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-display font-bold text-gray-900 flex items-center gap-2">
                      <span className="w-7 h-7 bg-primary-800 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                      <FiCreditCard className="text-primary-600" /> Payment Method
                    </h2>
                    <button onClick={() => setStep(1)} className="text-sm text-primary-700 hover:underline font-medium flex items-center gap-1">
                      <FiEdit2 size={13} /> Change Address
                    </button>
                  </div>

                  {/* Delivery summary */}
                  {selectedAddr && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200 text-sm flex items-start gap-3">
                      <FiMapPin className="text-primary-500 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-semibold text-gray-900">{selectedAddr.name}</span>
                        <span className="text-gray-500 ml-2">📞 {selectedAddr.phone}</span>
                        <p className="text-gray-500 mt-0.5">{selectedAddr.address_line1}, {selectedAddr.city}, {selectedAddr.state} - {selectedAddr.pincode}</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {PAYMENT_METHODS.map(method => (
                      <div key={method.id}>
                        <div
                          onClick={() => setPaymentMethod(method.id)}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between gap-3 ${
                            paymentMethod === method.id ? method.activeColor + ' shadow-sm' : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-gray-900">{method.name}</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${method.badgeColor}`}>{method.badge}</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-0.5">{method.desc}</p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            paymentMethod === method.id ? 'border-primary-600' : 'border-gray-300'
                          }`}>
                            {paymentMethod === method.id && <div className="w-2.5 h-2.5 bg-primary-600 rounded-full" />}
                          </div>
                        </div>

                        {/* UPI Input */}
                        <AnimatePresence>
                          {paymentMethod === 'upi' && method.id === 'upi' && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-2 p-4 bg-purple-50 rounded-xl border border-purple-200 space-y-3">
                                <input
                                  className="input-field text-sm font-mono"
                                  placeholder="Enter UPI ID (e.g. yourname@upi)"
                                  value={upiId}
                                  onChange={e => setUpiId(e.target.value)}
                                />
                                <div className="flex flex-wrap gap-2">
                                  {['PhonePe', 'GPay', 'Paytm', 'BHIM'].map(app => (
                                    <span key={app} className="text-xs bg-white border border-purple-200 text-purple-700 px-2 py-1 rounded-full">{app}</span>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Card Input */}
                        <AnimatePresence>
                          {paymentMethod === 'card' && method.id === 'card' && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-2 p-4 bg-blue-50 rounded-xl border border-blue-200 space-y-3">
                                <p className="text-xs text-blue-600 font-medium flex items-center gap-1"><FiShield size={11} /> Demo mode — use any test card numbers</p>
                                <input className="input-field text-sm font-mono" placeholder="Card Number — 4242 4242 4242 4242" maxLength={19} />
                                <div className="grid grid-cols-2 gap-3">
                                  <input className="input-field text-sm" placeholder="MM / YY" />
                                  <input className="input-field text-sm" placeholder="CVV" type="password" maxLength={3} />
                                </div>
                                <input className="input-field text-sm" placeholder="Cardholder Name" />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Net Banking */}
                        <AnimatePresence>
                          {paymentMethod === 'netbanking' && method.id === 'netbanking' && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-2 p-4 bg-green-50 rounded-xl border border-green-200">
                                <select className="input-field text-sm">
                                  <option value="">Select your bank</option>
                                  {['SBI', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Bank', 'Punjab National Bank', 'Bank of Baroda', 'Canara Bank'].map(b => (
                                    <option key={b}>{b}</option>
                                  ))}
                                </select>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <motion.button
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      onClick={handlePlaceOrder}
                      disabled={!paymentMethod || placing}
                      className="w-full py-4 bg-primary-800 hover:bg-primary-900 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 text-base transition-colors disabled:opacity-60"
                    >
                      {placing ? (
                        <><span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span> Processing...</>
                      ) : (
                        <><FiLock size={16} /> Pay ₹{total.toLocaleString()} & Place Order</>
                      )}
                    </motion.button>
                    <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1.5">
                      <FiShield size={11} /> 256-bit SSL encrypted · No card data stored
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── RIGHT: Order Summary ── */}
          <div className="w-full lg:w-[340px] shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-24">
              <h3 className="font-display font-bold text-gray-900 text-lg mb-5">Order Summary</h3>

              {/* Items */}
              <div className="space-y-3 mb-5 max-h-56 overflow-y-auto pr-1">
                {cartData?.items.map(item => (
                  <div key={item.id} className="flex gap-3 text-sm items-start">
                    <div className="relative shrink-0">
                      <img src={item.image_url} alt={item.name} className="w-14 h-14 object-cover rounded-lg border border-gray-200" />
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{item.quantity}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 line-clamp-2 leading-snug">{item.name}</p>
                      <p className="text-gray-500 text-xs mt-0.5">₹{Number(item.price).toLocaleString()} each</p>
                    </div>
                    <span className="font-semibold text-gray-900 shrink-0">₹{(Number(item.price) * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-dashed border-gray-200 pt-4 space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{Number(subtotal).toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon Discount</span>
                    <span>-₹{Number(discount).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span>{shipping === 0 ? <span className="text-green-600 font-medium">FREE</span> : `₹${shipping}`}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-primary-900">₹{total.toLocaleString()}</span>
              </div>

              {discount > 0 && (
                <div className="mt-3 bg-green-50 text-green-700 text-xs font-medium rounded-lg px-3 py-2 text-center">
                  🎉 You're saving ₹{Number(discount).toLocaleString()} with your coupon!
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
