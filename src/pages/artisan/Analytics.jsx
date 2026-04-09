import React, { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line 
} from 'recharts';

export default function ArtisanAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/artisan/analytics');
      
      // format dates for the chart
      const formattedWeekly = res.data.weekly?.map(item => ({
        ...item,
        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      })) || [];
      
      setData({ ...res.data, weekly: formattedWeekly });
    } catch (err) {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar role="artisan" />
        
        <main className="ml-64 p-8 w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-1">Track your performance and sales over time</p>
          </div>

          {loading ? (
             <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-primary-200 border-t-primary-800 rounded-full animate-spin"></div></div>
          ) : data ? (
            <div className="space-y-8">
              
              {/* Daily Sales Chart */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue Trend (Last 30 Days)</h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.weekly} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(val) => `₹${val}`} />
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value) => [`₹${value}`, 'Revenue']}
                      />
                      <Line type="monotone" dataKey="revenue" stroke="#a3a380" strokeWidth={3} dot={{ r: 4, fill: '#a3a380' }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Order Volume Chart */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Order Volume</h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.weekly} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} allowDecimals={false} />
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        cursor={{ fill: '#F3F4F6' }}
                      />
                      <Bar dataKey="orders" fill="#53533e" radius={[4, 4, 0, 0]} barSize={32} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
               <p className="text-gray-500">No data available yet to display analytics.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
