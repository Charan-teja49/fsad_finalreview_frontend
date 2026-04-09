import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiTrash2, FiShoppingCart, FiInfo } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Navbar from '../../components/common/Navbar';
import ProductCard from '../../components/products/ProductCard';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

import { useWishlist } from '../../context/WishlistContext';

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchCart } = useCart();
  const { fetchWishlistCount } = useWishlist();

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const { data } = await api.get('/wishlist');
      setItems(data);
    } catch (error) {
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (id) => {
    try {
      setItems(items.filter(i => i.id !== id));
      await api.post('/wishlist', { product_id: items.find(i => i.id === id).product_id });
      toast.success('Removed from wishlist');
      fetchWishlistCount();
    } catch (error) {
      toast.error('Could not remove item');
      loadWishlist(); // Revert
    }
  };

  const moveToCart = async (id) => {
    try {
      await api.post('/wishlist/move-to-cart', { wishlist_id: id });
      setItems(items.filter(i => i.id !== id));
      toast.success('Moved to cart!');
      fetchCart();
      fetchWishlistCount();
    } catch (error) {
      toast.error('Could not move to cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-800 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-3 bg-red-50 text-red-500 rounded-xl">
            <FiHeart size={24} className="fill-current" />
          </div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Your Wishlist</h1>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm max-w-3xl mx-auto">
            <div className="w-24 h-24 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiHeart size={48} />
            </div>
            <h2 className="text-2xl font-display font-medium text-gray-900 mb-4">No items saved yet</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Save items you like in your wishlist. Review them anytime and easily move them to cart.</p>
            <Link to="/products" className="btn btn-primary px-8 py-3 rounded-full text-lg shadow-md">
              Discover Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {items.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group relative"
                >
                  <Link to={`/products/${item.product_id}`} className="relative h-64 overflow-hidden block">
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  </Link>

                  <button 
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md bg-white/70 shadow-sm hover:bg-white text-red-500 transition-colors z-10"
                    title="Remove from Wishlist"
                  >
                    <FiTrash2 />
                  </button>
                  
                  <div className="p-5 flex-grow flex flex-col">
                    <Link to={`/products/${item.product_id}`}>
                      <h3 className="font-display font-semibold text-lg text-gray-900 group-hover:text-primary-700 transition-colors line-clamp-1 mb-1">{item.name}</h3>
                    </Link>
                    <p className="text-sm text-gray-500 mb-4">By {item.artisan_name}</p>
                    
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-lg font-bold text-gray-900">₹{item.price}</span>
                      {item.compare_price && <span className="text-xs text-gray-400 line-through">₹{item.compare_price}</span>}
                    </div>
                    
                    <button 
                      onClick={() => moveToCart(item.id)}
                      className="mt-auto w-full btn btn-primary py-2.5 text-sm flex justify-center items-center gap-2 shadow-sm"
                    >
                      <FiShoppingCart /> Move to Cart
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
