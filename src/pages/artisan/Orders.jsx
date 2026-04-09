import React, { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiPackage, FiTruck, FiCheck, FiChevronRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function ArtisanOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/artisan/orders');
      setOrders(data);
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      await api.put(`/artisan/orders/${orderId}/status`, { status });
      toast.success(`Order marked as ${status}`);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar role="artisan" />
        
        <main className="ml-64 p-8 w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-gray-900">Manage Orders</h1>
            <p className="text-gray-600 mt-1">Fulfill your orders and update dispatch status</p>
          </div>

          {loading ? (
             <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-primary-200 border-t-primary-800 rounded-full animate-spin"></div></div>
          ) : orders.length === 0 ? (
             <div className="bg-white p-12 text-center rounded-2xl border border-gray-200">
               <FiPackage className="mx-auto text-gray-300 w-16 h-16 mb-4" />
               <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
               <p className="text-gray-500">When customers buy your products, they will appear here.</p>
             </div>
          ) : (
            <div className="space-y-6">
              {orders.map(order => (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-4 bg-gray-50 border-b border-gray-100 flex flex-wrap gap-4 items-center justify-between">
                     <div>
                       <span className="text-xs text-gray-500 uppercase font-medium mr-2">Order</span>
                       <span className="font-mono font-medium text-gray-900">{order.order_number}</span>
                     </div>
                     <div className="flex gap-4 items-center">
                       <span className="text-sm text-gray-600">Placed on {new Date(order.created_at).toLocaleDateString()}</span>
                       <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                         ${order.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                           order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                           order.status === 'shipped' ? 'bg-indigo-100 text-indigo-800' :
                           order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                         }`}>
                         {order.status}
                       </span>
                     </div>
                  </div>

                  <div className="p-6 flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-2/3 border-r border-gray-100 pr-0 md:pr-6">
                      <h4 className="font-medium text-gray-900 mb-4 text-sm uppercase tracking-wide">Items to Fulfill</h4>
                      <div className="space-y-4">
                        {order.items.map(item => (
                          <div key={item.id} className="flex gap-4">
                            <img src={item.image_url} alt="" className="w-16 h-16 rounded-md object-cover border border-gray-200 shrink-0" />
                            <div>
                              <p className="font-medium text-gray-900">{item.name}</p>
                              <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                              <p className="font-semibold text-gray-900 mt-1">₹{item.quantity * item.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="w-full md:w-1/3 flex flex-col justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2 text-sm uppercase tracking-wide">Customer Action</h4>
                        <p className="font-medium text-gray-900">{order.customer_name}</p>
                        
                        {(order.status === 'pending' || order.status === 'confirmed' || order.status === 'processing' || order.status === 'shipped') && (
                          <div className="mt-6 flex flex-col gap-2">
                            {order.status !== 'shipped' && order.status !== 'delivered' && (
                              <button 
                                onClick={() => updateStatus(order.id, 'shipped')}
                                disabled={updatingId === order.id}
                                className="w-full btn bg-indigo-600 hover:bg-indigo-700 text-white flex justify-center items-center gap-2"
                              >
                                {updatingId === order.id ? 'Updating...' : <><FiTruck /> Mark as Shipped</>}
                              </button>
                            )}
                            
                            {order.status === 'shipped' && (
                              <button 
                                onClick={() => updateStatus(order.id, 'delivered')}
                                disabled={updatingId === order.id}
                                className="w-full btn bg-green-600 hover:bg-green-700 text-white flex justify-center items-center gap-2"
                              >
                                {updatingId === order.id ? 'Updating...' : <><FiCheck /> Mark as Delivered</>}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
