import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiShoppingBag, FiDollarSign, FiBox, FiTrendingUp, FiClock, FiArrowUpRight } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';

const StatCard = ({ icon: Icon, label, value, sub, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    transition={{ delay: delay * 0.1, duration: 0.4 }}
    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-start gap-4"
  >
    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center shrink-0`}>
      <Icon className="text-white" size={22} />
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  </motion.div>
);

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [dashRes, revRes] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/admin/revenue'),
        ]);
        setData(dashRes.data);
        setRevenue(revRes.data);
      } catch {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar role="admin" />
          <div className="ml-64 flex-1 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-800 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  const s = data?.stats || {};
  const monthly = revenue?.monthly?.map(m => ({ ...m, month: m.month.slice(5) }))?.reverse() || [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar role="admin" />

        <main className="ml-64 p-8 w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Platform overview and key metrics</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
            <StatCard icon={FiDollarSign} label="Total Revenue" value={`₹${Number(s.totalRevenue || 0).toLocaleString()}`} color="bg-emerald-500" delay={0} />
            <StatCard icon={FiShoppingBag} label="Total Orders" value={s.totalOrders || 0} sub={`${s.activeOrders || 0} active`} color="bg-blue-500" delay={1} />
            <StatCard icon={FiUsers} label="Total Users" value={s.totalUsers || 0} sub={`${s.customers || 0} customers · ${s.artisans || 0} artisans`} color="bg-violet-500" delay={2} />
            <StatCard icon={FiBox} label="Products" value={s.totalProducts || 0} sub={`${s.pendingProducts || 0} pending approval`} color="bg-amber-500" delay={3} />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Revenue Chart */}
            <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FiTrendingUp className="text-emerald-500" /> Monthly Revenue
              </h3>
              <div className="h-[280px]">
                {monthly.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthly}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={v => `₹${v}`} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} formatter={v => [`₹${Number(v).toLocaleString()}`, 'Revenue']} />
                      <Bar dataKey="revenue" fill="#10B981" radius={[6, 6, 0, 0]} barSize={36} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">No revenue data yet</div>
                )}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiClock className="text-blue-500" /> Recent Orders
              </h3>
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {data?.recentOrders?.length > 0 ? data.recentOrders.map(order => (
                  <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="font-mono text-sm font-medium text-gray-900">{order.order_number}</p>
                      <p className="text-xs text-gray-500">{order.customer_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 text-sm">₹{Number(order.total).toLocaleString()}</p>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>{order.status}</span>
                    </div>
                  </div>
                )) : (
                  <p className="text-gray-400 text-sm text-center py-8">No orders yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Category Revenue */}
          {revenue?.byCategory?.length > 0 && (
            <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue by Category</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {revenue.byCategory.map(cat => (
                  <div key={cat.name} className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-sm font-medium text-gray-700">{cat.name}</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">₹{Number(cat.revenue).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
