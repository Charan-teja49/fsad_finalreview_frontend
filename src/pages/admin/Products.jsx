import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiX, FiTrash2, FiFilter, FiExternalLink } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => { fetchProducts(); }, [statusFilter]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = statusFilter ? `?status=${statusFilter}` : '';
      const { data } = await api.get(`/admin/products${params}`);
      setProducts(data);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  const handleApprove = async (id, status) => {
    try {
      await api.put(`/admin/products/${id}/approve`, { status });
      toast.success(`Product ${status}`);
      fetchProducts();
    } catch { toast.error('Failed to update product'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this product?')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch { toast.error('Failed to delete'); }
  };

  const statusColors = {
    pending: 'bg-amber-100 text-amber-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar role="admin" />
        <main className="ml-64 p-8 w-full">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900">Product Control</h1>
              <p className="text-gray-500 mt-1">Approve, reject, or remove products</p>
            </div>

            <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1">
              {[{ v: '', l: 'All' }, { v: 'pending', l: '⏳ Pending' }, { v: 'approved', l: '✅ Approved' }, { v: 'rejected', l: '❌ Rejected' }].map(f => (
                <button key={f.v} onClick={() => setStatusFilter(f.v)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${statusFilter === f.v ? 'bg-primary-800 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                >{f.l}</button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-primary-200 border-t-primary-800 rounded-full animate-spin"></div></div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
              <p className="text-gray-400">No products match this filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {products.map(product => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  <div className="relative">
                    <img src={product.image_url} alt="" className="w-full h-44 object-cover" />
                    <span className={`absolute top-3 right-3 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${statusColors[product.status]}`}>
                      {product.status}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 line-clamp-1 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-500 mb-1">by {product.artisan_name || 'Unknown'}</p>
                    <p className="text-xs text-gray-400 mb-3">{product.category_name || 'Uncategorized'}</p>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-lg font-bold text-gray-900">₹{Number(product.price).toLocaleString()}</span>
                      {product.compare_price && (
                        <span className="text-sm text-gray-400 line-through">₹{Number(product.compare_price).toLocaleString()}</span>
                      )}
                      <span className="text-xs text-gray-400 ml-auto">Stock: {product.stock}</span>
                    </div>

                    <div className="flex gap-2">
                      {product.status === 'pending' && (
                        <>
                          <button onClick={() => handleApprove(product.id, 'approved')} className="flex-1 flex items-center justify-center gap-1 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-sm font-semibold transition">
                            <FiCheck size={14} /> Approve
                          </button>
                          <button onClick={() => handleApprove(product.id, 'rejected')} className="flex-1 flex items-center justify-center gap-1 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm font-semibold transition">
                            <FiX size={14} /> Reject
                          </button>
                        </>
                      )}
                      {product.status === 'rejected' && (
                        <button onClick={() => handleApprove(product.id, 'approved')} className="flex-1 flex items-center justify-center gap-1 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-sm font-semibold transition">
                          <FiCheck size={14} /> Approve
                        </button>
                      )}
                      <button onClick={() => handleDelete(product.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition" title="Delete">
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
