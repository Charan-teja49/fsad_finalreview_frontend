import React, { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus, FiImage } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400&q=80';

const CATEGORIES = [
  'Wood Craft', 'Pottery', 'Textiles', 'Metal Craft', 'Paintings', 'Home Decor'
];

export default function ArtisanProducts() {
  const { darkMode } = useTheme();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '', description: '', story: '', price: '', stock: '', category: '', imageUrls: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/artisan/products');
      setProducts(data);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: formData.category,
        imageUrls: formData.imageUrls || 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800'
      };

      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        toast.success('Product updated');
      } else {
        await api.post('/products', payload);
        toast.success('Product created');
      }
      setShowModal(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Delete this product permanently?')) {
      try {
        await api.delete(`/products/${id}`);
        toast.success('Product deleted');
        fetchProducts();
      } catch (error) {
        toast.error('Could not delete product');
      }
    }
  };

  const openEdit = (product) => {
    setFormData({
      name: product.name, 
      description: product.description, 
      story: product.story || '',
      price: product.price, 
      stock: product.stock, 
      category: product.category_name || '',
      imageUrls: product.image_url || ''
    });
    setEditingId(product.id);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', story: '', price: '', stock: '', category: '', imageUrls: '' });
    setEditingId(null);
  };

  const handleImgError = (e) => {
    e.target.src = FALLBACK_IMAGE;
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Navbar />
      <div className="flex flex-1">
        <Sidebar role="artisan" />
        
        <main className="ml-64 p-8 w-full">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className={`text-3xl font-display font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>My Products</h1>
              <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Manage your catalog and inventory</p>
            </div>
            <button 
              onClick={() => { resetForm(); setShowModal(true); }}
              className="btn btn-primary flex items-center gap-2 px-4 py-2"
            >
              <FiPlus /> Add Product
            </button>
          </div>

          <div className={`rounded-2xl shadow-sm border overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`text-sm uppercase tracking-wider border-b ${darkMode ? 'bg-gray-700 text-gray-400 border-gray-600' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                    <th className="px-6 py-4 font-medium">Product</th>
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 font-medium text-right">Price</th>
                    <th className="px-6 py-4 font-medium text-center">Stock</th>
                    <th className="px-6 py-4 font-medium text-center">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                  {loading ? (
                     <tr><td colSpan="6" className="text-center py-8">Loading...</td></tr>
                  ) : products.length === 0 ? (
                     <tr><td colSpan="6" className={`text-center py-8 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>No products found. Add your first product!</td></tr>
                  ) : products.map(product => (
                    <tr key={product.id} className={`transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                      <td className="px-6 py-4 flex items-center gap-4">
                        <img src={product.image_url || FALLBACK_IMAGE} alt="" className="w-12 h-12 rounded-lg object-cover border border-gray-200" onError={handleImgError} />
                        <div>
                          <p className={`font-medium line-clamp-1 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{product.name}</p>
                          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Sold: {product.total_sold || 0}</p>
                        </div>
                      </td>
                      <td className={`px-6 py-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{product.category_name}</td>
                      <td className={`px-6 py-4 text-right font-medium ${darkMode ? 'text-gray-200' : ''}`}>₹{product.price}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${product.stock > 10 ? 'bg-green-100 text-green-800' : product.stock > 0 ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                         <span className={`px-2 py-1 text-xs rounded-md uppercase font-bold tracking-wider ${product.status === 'approved' ? 'text-green-600 bg-green-50' : product.status === 'pending' ? 'text-amber-600 bg-amber-50' : 'text-red-600 bg-red-50'}`}>
                           {product.status || 'approved'}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className={`flex justify-end gap-2 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>
                          <button onClick={() => openEdit(product)} className="p-2 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit"><FiEdit2 /></button>
                          <button onClick={() => handleDelete(product.id)} className="p-2 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><FiTrash2 /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className={`rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className={`p-6 border-b flex justify-between items-center sticky top-0 z-10 backdrop-blur ${darkMode ? 'border-gray-700 bg-gray-800/95' : 'border-gray-100 bg-white/95'}`}>
                <h2 className={`text-xl font-bold font-display ${darkMode ? 'text-gray-100' : ''}`}>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
                <button onClick={() => setShowModal(false)} className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-800'}`}>✕</button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Product Name</label>
                    <input name="name" required value={formData.name} onChange={handleInputChange} className={`input-field ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : ''}`} placeholder="E.g. Handwoven Silk Saree" />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Category</label>
                    <select name="category" required value={formData.category} onChange={handleInputChange} className={`input-field ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white'}`}>
                      <option value="">Select Category...</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Price (₹)</label>
                    <input type="number" name="price" required min="0" step="0.01" value={formData.price} onChange={handleInputChange} className={`input-field ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : ''}`} placeholder="1000" />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Stock Quantity</label>
                    <input type="number" name="stock" required min="0" value={formData.stock} onChange={handleInputChange} className={`input-field ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : ''}`} placeholder="5" />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Image URL</label>
                    <input type="url" name="imageUrls" value={formData.imageUrls} onChange={handleInputChange} className={`input-field ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : ''}`} placeholder="https://unsplash.com/..." />
                  </div>
                  <div className="col-span-2">
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Description</label>
                    <textarea name="description" required value={formData.description} onChange={handleInputChange} className={`input-field min-h-[80px] ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : ''}`} placeholder="Briefly describe the product..."></textarea>
                  </div>
                  <div className="col-span-2">
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>The Story Behind the Craft</label>
                    <textarea name="story" value={formData.story} onChange={handleInputChange} className={`input-field min-h-[100px] ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : ''}`} placeholder="Share the history, technique, and inspiration behind this piece..."></textarea>
                  </div>
                </div>
                <div className={`border-t pt-6 flex justify-end gap-3 ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                  <button type="button" onClick={() => setShowModal(false)} className={`btn px-6 ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Cancel</button>
                  <button type="submit" disabled={saving} className="btn btn-primary px-6">{saving ? 'Saving...' : 'Save Product'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
