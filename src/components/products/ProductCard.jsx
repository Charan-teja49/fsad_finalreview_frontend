import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';
import api from '../../services/api';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400&q=80';

export default function ProductCard({ product }) {
  const { fetchCart } = useCart();
  const { fetchWishlistCount } = useWishlist();
  const { darkMode } = useTheme();
  const [isAdding, setIsAdding] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const deriveImage = (p) => {
    if (!p) return FALLBACK_IMAGE;
    if (p.image_url && p.image_url.trim() !== '') return p.image_url.trim();
    if (p.imageUrls && p.imageUrls.trim() !== '') return p.imageUrls.split(',')[0].trim();
    return FALLBACK_IMAGE;
  };

  const [imgSrc, setImgSrc] = useState(deriveImage(product));

  useEffect(() => {
    setImgSrc(deriveImage(product));
  }, [product]);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      await api.post('/cart', { product_id: product.id, quantity: 1 });
      toast.success('Added to cart!');
      fetchCart();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not add to cart');
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/wishlist', { product_id: product.id });
      setInWishlist(res.data.added);
      fetchWishlistCount();
      if (res.data.added) {
        toast('Added to Wishlist!', { icon: '❤️' });
      } else {
        toast('Removed from Wishlist', { icon: '💔' });
      }
    } catch (error) {
      toast.error('Could not update wishlist');
    }
  };

  const handleImgError = () => {
    setImgSrc(FALLBACK_IMAGE);
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}
    >
      <Link to={`/products/${product.id}`} className="relative h-64 overflow-hidden block">
        <img 
          src={imgSrc} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={handleImgError}
        />
        <button 
          onClick={handleToggleWishlist}
          className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md bg-white/70 shadow-sm hover:bg-white transition-colors ${inWishlist ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
        >
          <FiHeart className={inWishlist ? "fill-current" : ""} />
        </button>
        {product.stock < 5 && product.stock > 0 && (
          <span className="absolute top-4 left-4 bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-1 rounded-md">
            Only {product.stock} left
          </span>
        )}
      </Link>
      
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/products/${product.id}`} className="block flex-grow pr-2">
            <h3 className={`font-display font-semibold text-lg transition-colors line-clamp-1 ${darkMode ? 'text-gray-100 group-hover:text-primary-400' : 'text-gray-900 group-hover:text-primary-700'}`}>{product.name}</h3>
          </Link>
          <div className="flex items-center space-x-1 shrink-0 text-amber-500">
            <FiStar className="fill-current text-sm" />
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{Number(product.avg_rating).toFixed(1)}</span>
          </div>
        </div>
        
        <p className={`text-sm mb-4 flex-grow line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          By <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{product.artisan_name}</span> in <span className="text-primary-700">{product.category_name}</span>
        </p>
        
        <div className={`flex items-center justify-between mt-auto pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <div className="flex flex-col">
            <span className={`text-lg font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>₹{product.price}</span>
            {product.compare_price && (
              <span className="text-xs text-gray-400 line-through">₹{product.compare_price}</span>
            )}
          </div>
          
          <button 
            onClick={handleAddToCart}
            disabled={isAdding || product.stock === 0}
            className={`p-2.5 rounded-full flex items-center justify-center transition-all ${
              product.stock === 0 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-primary-50 text-primary-700 hover:bg-primary-800 hover:text-white'
            }`}
            title={product.stock === 0 ? "Out of stock" : "Add to cart"}
          >
            {isAdding ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <FiShoppingCart size={18} />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
