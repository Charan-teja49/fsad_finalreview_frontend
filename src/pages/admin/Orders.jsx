import React, { useState, useEffect } from 'react';
import { FiPackage } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/admin/orders');
      setOrders(data);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  const statusColors = {
    pending: 'bg-gray-100 text-gray-600',
    confirmed: 'bg-blue-100 text-blue-700',
    processing: 'bg-indigo-100 text-indigo-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar role="admin" />
        <main className="ml-64 p-8 w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-gray-900">All Orders</h1>
            <p className="text-gray-500 mt-1">{orders.length} orders across the platform</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-primary-200 border-t-primary-800 rounded-full animate-spin"></div></div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
              <FiPackage className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500">No orders yet</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-left text-xs uppercase tracking-wider font-semibold text-gray-500">
                      <th className="px-6 py-4">Order</th>
                      <th className="px-4 py-4">Customer</th>
                      <th className="px-4 py-4">Items</th>
                      <th className="px-4 py-4">Total</th>
                      <th className="px-4 py-4">Status</th>
                      <th className="px-4 py-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-mono font-semibold text-gray-900">{order.order_number}</td>
                        <td className="px-4 py-4 text-gray-700">{order.customer_name}</td>
                        <td className="px-4 py-4 text-gray-500">—</td>
                        <td className="px-4 py-4 font-bold text-gray-900">₹{Number(order.total).toLocaleString()}</td>
                        <td className="px-4 py-4">
                          <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${statusColors[order.status] || 'bg-gray-100'}`}>{order.status}</span>
                        </td>
                        <td className="px-4 py-4 text-gray-500 text-xs">{new Date(order.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
