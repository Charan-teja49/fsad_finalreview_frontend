import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBox, FiClock, FiCheckCircle, FiXCircle, FiTruck, FiChevronDown, FiChevronUp, FiMapPin } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Navbar from '../../components/common/Navbar';
import { Link } from 'react-router-dom';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, active, past
  const [expandedId, setExpandedId] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [updatingAddressId, setUpdatingAddressId] = useState(null);
  const [allAddresses, setAllAddresses] = useState([]);
  const [showAddrModal, setShowAddrModal] = useState(false);
  const [targetOrder, setTargetOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders', { params: { status: filter } });
      setOrders(data);
      // Also fetch user addresses for change address feature
      const addrRes = await api.get('/addresses');
      setAllAddresses(addrRes.data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAddress = async (orderId, addressId) => {
    setUpdatingAddressId(orderId);
    try {
      await api.put(`/orders/${orderId}/address`, { address_id: addressId });
      toast.success("Shipping address updated!");
      setShowAddrModal(false);
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Address update failed');
    } finally {
      setUpdatingAddressId(null);
    }
  };

  const handleCancelOrder = async (id, created_at) => {
    const hoursSince = (Date.now() - new Date(created_at).getTime()) / (1000 * 60 * 60);
    if (hoursSince > 24) {
      return toast.error("Orders can only be cancelled within 24 hours.");
    }
    
    if (window.confirm("Are you sure you want to cancel this order?")) {
      setCancellingId(id);
      try {
        await api.put(`/orders/${id}/cancel`, { reason: 'Customer requested' });
        setOrders((prev) => prev.map((o) => (
          o.id === id ? { ...o, status: 'CANCELLED', cancel_reason: 'Customer requested' } : o
        )));
        toast.success("Order cancelled");
        fetchOrders();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Cancellation failed');
      } finally {
        setCancellingId(null);
      }
    }
  };

  const normalizeOrderStatus = (status) => {
    const normalized = String(status || '').toUpperCase();
    if (normalized === 'PENDING') return 'PROCESSING';
    if (normalized === 'CONFIRMED') return 'PLACED';
    return normalized;
  };

  const canCancelOrder = (status) => {
    const normalized = normalizeOrderStatus(status);
    return normalized === 'PLACED' || normalized === 'PROCESSING';
  };

  const getStatusInfo = (status) => {
    switch(normalizeOrderStatus(status)) {
      case 'PROCESSING': return { icon: <FiClock />, color: 'text-amber-500', bg: 'bg-amber-50', label: 'Processing' };
      case 'PLACED': return { icon: <FiCheckCircle />, color: 'text-blue-500', bg: 'bg-blue-50', label: 'Placed' };
      case 'SHIPPED': return { icon: <FiTruck />, color: 'text-indigo-500', bg: 'bg-indigo-50', label: 'Shipped' };
      case 'DELIVERED': return { icon: <FiBox />, color: 'text-green-500', bg: 'bg-green-50', label: 'Delivered' };
      case 'CANCELLED': return { icon: <FiXCircle />, color: 'text-red-500', bg: 'bg-red-50', label: 'Cancelled' };
      default: return { icon: <FiClock />, color: 'text-gray-500', bg: 'bg-gray-50', label: status };
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">My Orders</h1>

        {/* Filters */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 pb-2">
          {['all', 'active', 'past'].map(f => (
            <button 
              key={f} 
              onClick={() => setFilter(f)}
              className={`pb-2 px-2 capitalize font-medium transition-colors border-b-2 -mb-[3px] ${filter === f ? 'border-primary-800 text-primary-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              {f} Orders
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-800 rounded-full animate-spin"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiBox size={40} />
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">No orders found</h2>
            <p className="text-gray-500 mb-6">You haven't placed any {filter !== 'all' ? filter : ''} orders yet.</p>
            <Link to="/products" className="btn btn-primary px-6 rounded-full shadow-md">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {orders.map((order) => {
                const sInfo = getStatusInfo(order.status);
                const isExpanded = expandedId === order.id;
                
                return (
                  <motion.div 
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Header Summary */}
                    <div className="p-6 bg-gray-50 border-b border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Order Placed</p>
                        <p className="text-sm font-medium text-gray-900">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Total</p>
                        <p className="text-sm font-medium text-gray-900">₹{order.total}</p>
                      </div>
                      <div className="col-span-2 md:col-span-1 md:text-right">
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Order ID</p>
                        <p className="text-sm font-mono text-gray-900">{order.order_number}</p>
                      </div>
                      <div className="col-span-2 md:col-span-1 flex justify-end">
                        <button 
                          onClick={() => setExpandedId(isExpanded ? null : order.id)}
                          className="flex items-center gap-1 text-primary-700 font-medium hover:text-primary-900 transition-colors"
                        >
                          {isExpanded ? 'Hide Details' : 'Track Order'} {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                        </button>
                      </div>
                    </div>

                    {/* Status & Quick Items preview */}
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${sInfo.bg} ${sInfo.color}`}>
                            {sInfo.icon}
                          </div>
                          <div>
                            <h3 className={`font-semibold text-lg ${sInfo.color}`}>{sInfo.label}</h3>
                            {normalizeOrderStatus(order.status) !== 'CANCELLED' && order.delivery_date && (
                              <p className="text-sm text-gray-600">
                                {normalizeOrderStatus(order.status) === 'DELIVERED' ? 'Delivered on' : 'Expected delivery by'} {new Date(order.delivery_date).toLocaleDateString()}
                              </p>
                            )}
                            {normalizeOrderStatus(order.status) === 'CANCELLED' && (
                              <p className="text-sm text-gray-600 text-red-500">Reason: {order.cancel_reason}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Items loop */}
                      <div className="space-y-4">
                        {order.items.map(item => (
                          <div key={item.id} className="flex gap-4">
                            <Link to={`/products/${item.product_id}`} className="shrink-0">
                              <img src={item.image_url} alt={item.name} className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
                            </Link>
                            <div className="flex-grow flex justify-between">
                              <div>
                                <Link to={`/products/${item.product_id}`} className="font-medium text-gray-900 hover:text-primary-700 line-clamp-1">{item.name}</Link>
                                <p className="text-sm text-gray-500 mt-1">Quantity: {item.quantity}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-gray-900">₹{item.price}</p>
                                {normalizeOrderStatus(order.status) === 'DELIVERED' && (
                                  <Link to={`/products/${item.product_id}`} className="text-sm text-primary-600 hover:underline mt-2 inline-block">
                                    Write a review
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Expandable Details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden border-t border-gray-100 bg-gray-50/50"
                        >
                          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm">
                            <div>
                               <h4 className="font-semibold text-gray-900 mb-3 uppercase tracking-wider text-xs">Shipping Address</h4>
                               <p className="font-medium text-gray-800">{order.address_name}</p>
                               <p className="text-gray-600 mt-1">{order.city}, {order.state} - {order.pincode}</p>
                            </div>
                            <div>
                               <h4 className="font-semibold text-gray-900 mb-3 uppercase tracking-wider text-xs">Order Summary</h4>
                               <div className="space-y-2 text-gray-600">
                                 <div className="flex justify-between"><span>Subtotal</span><span>₹{order.subtotal}</span></div>
                                 <div className="flex justify-between"><span>Shipping</span><span>₹{order.shipping}</span></div>
                                 {Number(order.discount) > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-₹{order.discount}</span></div>}
                                 <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-200"><span>Total</span><span>₹{order.total}</span></div>
                                 {canCancelOrder(order.status) && (
                                   <button
                                     type="button"
                                     onClick={() => handleCancelOrder(order.id, order.created_at)}
                                     disabled={cancellingId === order.id}
                                     className="cancel-order-btn"
                                   >
                                     {cancellingId === order.id ? 'Cancelling...' : 'Cancel Order'}
                                   </button>
                                 )}
                               </div>
                             </div>
                           </div>
                           
                           {canCancelOrder(order.status) && (
                             <div className="px-6 pb-6 pt-2 flex flex-wrap gap-3 justify-end border-t border-gray-100 mt-4">
                               {((Date.now() - new Date(order.created_at).getTime()) / 3600000) <= 6 && (
                                 <button 
                                   onClick={() => { setTargetOrder(order); setShowAddrModal(true); }}
                                   className="text-sm text-primary-700 bg-white border border-primary-200 hover:bg-primary-50 px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
                                 >
                                   Edit Shipping Address
                                 </button>
                               )}
                             </div>
                           )}
                         </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Address Selection Modal */}
      <AnimatePresence>
        {showAddrModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95 }} animate={{ scale: 1 }}
              className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-md border border-gray-100"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold font-display text-gray-900">Change Shipping Address</h2>
                <button onClick={() => setShowAddrModal(false)} className="text-gray-400 hover:text-gray-700">✕</button>
              </div>
              <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {allAddresses.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No other addresses found. Please add one in profile.</p>
                ) : (
                  allAddresses.map(addr => (
                    <div 
                      key={addr.id}
                      onClick={() => handleUpdateAddress(targetOrder.id, addr.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:border-primary-300 hover:bg-primary-50 ${targetOrder?.address_id === addr.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}
                    >
                      <p className="font-bold text-gray-900">{addr.name}</p>
                      <p className="text-sm text-gray-600">{addr.city}, {addr.state} - {addr.pincode}</p>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-6 flex justify-end">
                <button onClick={() => setShowAddrModal(false)} className="btn btn-secondary px-6">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
