import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899', '#6366F1'];

export default function AdminRevenue() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/admin/revenue');
        setData({
          monthly: (data.monthly || []).map(m => ({ ...m, month: m.month.slice(5), revenue: Number(m.revenue) })).reverse(),
          byCategory: (data.byCategory || []).map(c => ({ ...c, revenue: Number(c.revenue) })),
        });
      } catch { toast.error('Failed to load revenue data'); }
      finally { setLoading(false); }
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

  const totalRev = data?.monthly?.reduce((s, m) => s + m.revenue, 0) || 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar role="admin" />
        <main className="ml-64 p-8 w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-gray-900">Revenue Analytics</h1>
            <p className="text-gray-500 mt-1">Financial performance and category breakdown</p>
          </div>

          {/* Summary */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-8 mb-8 text-white">
            <p className="text-sm opacity-80 font-medium">Total Platform Revenue</p>
            <p className="text-4xl font-bold mt-1">₹{totalRev.toLocaleString()}</p>
            <p className="text-sm opacity-70 mt-2">Across {data?.monthly?.length || 0} months of data</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Monthly Bar */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Monthly Revenue</h3>
              <div className="h-[300px]">
                {data?.monthly?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.monthly}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={v => `₹${v}`} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} formatter={v => [`₹${v.toLocaleString()}`, 'Revenue']} />
                      <Bar dataKey="revenue" fill="#10B981" radius={[6, 6, 0, 0]} barSize={36} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : <div className="h-full flex items-center justify-center text-gray-400">No data</div>}
              </div>
            </div>

            {/* Category Pie */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue by Category</h3>
              <div className="h-[300px]">
                {data?.byCategory?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.byCategory}
                        cx="50%" cy="50%"
                        innerRadius={60} outerRadius={100}
                        paddingAngle={4}
                        dataKey="revenue"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {data.byCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={v => [`₹${v.toLocaleString()}`, 'Revenue']} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : <div className="h-full flex items-center justify-center text-gray-400">No category data</div>}
              </div>
            </div>

            {/* Orders Trend Line */}
            <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Orders Trend</h3>
              <div className="h-[250px]">
                {data?.monthly?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.monthly}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} allowDecimals={false} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                      <Line type="monotone" dataKey="orders" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : <div className="h-full flex items-center justify-center text-gray-400">No data</div>}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
