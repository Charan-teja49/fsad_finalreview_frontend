import React, { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import { FiTrendingUp, FiShoppingBag, FiBox, FiDollarSign } from 'react-icons/fi';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function ArtisanDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/artisan/analytics');
        setStats({
          revenue: data.totals?.totalRevenue || 0,
          orders: data.totals?.totalOrders || 0,
          products: data.productCount || 0,
          rating: 4.8
        });
        
        setRecentOrders(data.recentOrders || []);
      } catch (err) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar role="artisan" />
      
      <main className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900">Artisan Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back. Here's what's happening with your store today.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-200 rounded-2xl animate-pulse"></div>)}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.totals?.totalRevenue || 0}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                <FiDollarSign size={24} />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totals?.totalOrders || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                <FiShoppingBag size={24} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Active Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.productCount || 0}</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
                <FiBox size={24} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Performance (30d)</p>
                <p className="text-2xl font-bold text-gray-900 text-green-500 flex items-center gap-1">
                   <FiTrendingUp /> Good
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
                <FiTrendingUp size={24} />
              </div>
            </div>
          </div>
        ) : null}

        {/* Quick Actions & Recent Activity placeholders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
             <button onClick={() => window.location.href='/artisan/products'} className="w-full text-left p-4 bg-gray-50 rounded-xl hover:bg-primary-50 transition-colors border border-gray-100 mb-3 font-medium text-primary-700 flex justify-between items-center">
               Add New Product <span>→</span>
             </button>
             <button onClick={() => window.location.href='/artisan/orders'} className="w-full text-left p-4 bg-gray-50 rounded-xl hover:bg-primary-50 transition-colors border border-gray-100 mb-3 font-medium text-primary-700 flex justify-between items-center">
               Manage Orders <span>→</span>
             </button>
           </div>
           
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Sales Trend</h3>
             <div className="h-48 flex items-center justify-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                Chart data loading... (See Analytics page)
             </div>
           </div>
        </div>
      </main>
    </div>
  );
}
