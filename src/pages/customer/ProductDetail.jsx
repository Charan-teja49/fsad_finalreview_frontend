import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiShare2, FiStar, FiChevronRight, FiMinus, FiPlus, FiShoppingCart, FiCheck, FiTruck, FiShield, FiMessageCircle, FiCopy } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Navbar from '../../components/common/Navbar';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&q=80';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchCart } = useCart();
  const { fetchWishlistCount } = useWishlist();
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const { t } = useTranslation();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [activeTab, setActiveTab] = useState('story');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        toast.error('Product not found');
        navigate('/customer/home');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await api.post('/cart', { product_id: product.id, quantity });
      toast.success(t('addedToCart', 'Added to cart!'));
      fetchCart();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not add to cart');
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleWishlist = async () => {
    try {
      const res = await api.post('/wishlist', { product_id: product.id });
      setInWishlist(res.data.added);
      fetchWishlistCount();
      toast(res.data.added ? 'Added to Wishlist!' : 'Removed from Wishlist', { icon: res.data.added ? '❤️' : '💔' });
    } catch {
      toast.error('Could not update wishlist');
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = product.name + ' - HandCraft';
    
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyToClipboard(url);
        }
      }
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Link copied to clipboard! 📋');
    }).catch(() => {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      toast.success('Link copied to clipboard! 📋');
    });
  };

  const handleImgError = (e) => {
    e.target.src = FALLBACK_IMAGE;
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

  if (!product) return null;

  const mainImage = product.image_url || FALLBACK_IMAGE;

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <Navbar />

      <main className="flex-grow">
        {/* Breadcrumb */}
        <div className={`border-b py-3 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center text-sm">
            <button onClick={() => navigate('/customer/home')} className={`hover:text-primary-800 transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('home', 'Home')}</button>
            <FiChevronRight className="mx-2 text-gray-400" />
            <span className={`hover:text-primary-800 transition-colors cursor-pointer ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{product.category_name}</span>
            <FiChevronRight className="mx-2 text-gray-400" />
            <span className={`truncate max-w-[200px] ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{product.name}</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex flex-col md:flex-row gap-10 lg:gap-16">
            
            {/* Image Gallery */}
            <div className="w-full md:w-1/2 flex flex-col gap-4">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className={`aspect-w-4 aspect-h-4 md:aspect-h-5 rounded-2xl overflow-hidden border relative ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-100'}`}
              >
                <img 
                  src={mainImage} 
                  alt={product.name} 
                  className="w-full h-full object-cover origin-center hover:scale-105 transition-transform duration-500 cursor-zoom-in"
                  onError={handleImgError}
                />
                
                {product.stock > 0 && product.stock <= 5 && (
                  <div className="absolute top-4 left-4 bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    {t('onlyLeft', 'Only')} {product.stock} {t('leftInStock', 'left in stock')}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Product Details right column */}
            <div className="w-full md:w-1/2 flex flex-col">
              <div className="flex justify-between items-start">
                <h1 className={`text-3xl md:text-4xl font-display font-bold mb-2 tracking-tight pr-4 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  {product.name}
                </h1>
                <div className="flex gap-2">
                  <button 
                    onClick={handleToggleWishlist}
                    className={`p-2.5 rounded-full border transition-all shadow-sm ${inWishlist ? 'text-red-500 border-red-200 bg-red-50' : `${darkMode ? 'border-gray-600 text-gray-400 hover:text-red-400' : 'border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 hover:bg-gray-50'}`}`}
                  >
                    <FiHeart size={20} className={inWishlist ? 'fill-current' : ''} />
                  </button>
                  <button 
                    onClick={handleShare}
                    className={`p-2.5 rounded-full border transition-all shadow-sm ${darkMode ? 'border-gray-600 text-gray-400 hover:text-blue-400' : 'border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-blue-500 hover:border-blue-200'}`}
                  >
                    <FiShare2 size={20} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md">
                  <FiStar className="fill-current text-sm mr-1" />
                  <span className="font-semibold text-sm">{Number(product.avg_rating).toFixed(1)}</span>
                </div>
                <span className={`text-sm hover:underline cursor-pointer transition-colors ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-900'}`} onClick={() => setActiveTab('reviews')}>
                  {product.review_count} {t('reviews', 'reviews')}
                </span>
                <span className="text-gray-300">|</span>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {t('soldBy', 'Sold by')} <span className="font-medium text-primary-700">{product.artisan_name}</span>
                </span>
              </div>

              <div className="mb-8">
                <div className="flex items-end gap-3 mb-2">
                  <span className={`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>₹{product.price}</span>
                  {product.compare_price && (
                    <span className="text-lg text-gray-400 line-through mb-1">₹{product.compare_price}</span>
                  )}
                  {product.compare_price && (
                    <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded mb-1.5 ml-2">
                      {Math.round((1 - product.price / product.compare_price) * 100)}% OFF
                    </span>
                  )}
                </div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('mrpInclusive', 'M.R.P. inclusive of all taxes')}</p>
              </div>

              <p className={`mb-8 leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {product.description}
              </p>

              {/* Add to Cart Area */}
              <div className={`p-6 border rounded-2xl mb-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                {product.stock > 0 ? (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className={`flex items-center border rounded-lg shrink-0 overflow-hidden shadow-sm ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}>
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className={`px-4 py-3 disabled:opacity-50 transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-500 hover:bg-gray-50'}`}
                      >
                        <FiMinus />
                      </button>
                      <span className={`w-10 text-center font-semibold select-none ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{quantity}</span>
                      <button 
                        onClick={() => setQuantity(Math.max(1, Math.min(product.stock, quantity + 1)))}
                        disabled={quantity >= product.stock}
                        className={`px-4 py-3 disabled:opacity-50 transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-500 hover:bg-gray-50'}`}
                      >
                        <FiPlus />
                      </button>
                    </div>
                    
                    <motion.button 
                      whileHover={{ scale: isAdding ? 1 : 1.02 }}
                      whileTap={{ scale: isAdding ? 1 : 0.98 }}
                      onClick={handleAddToCart}
                      disabled={isAdding}
                      className="flex-grow btn btn-primary py-3 text-lg font-semibold shadow-md flex justify-center items-center gap-2"
                    >
                      {isAdding ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <FiShoppingCart /> <span>{t('addToCart', 'Add to Cart')}</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                ) : (
                  <div className={`w-full py-4 text-center rounded-xl font-medium ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'}`}>
                    {t('outOfStock', 'Currently Out of Stock')}
                  </div>
                )}
                
                <ul className={`mt-6 space-y-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <li className="flex items-center gap-2">
                    <FiCheck className="text-green-500" /> {t('dispatch48', 'Dispatch within 48 hours')}
                  </li>
                  <li className="flex items-center gap-2">
                    <FiTruck className="text-blue-500" /> {t('freeDelivery', 'Free delivery across India')}
                  </li>
                  <li className="flex items-center gap-2">
                    <FiShield className="text-primary-500" /> {t('securePayment', 'Secure payment & Easy returns')}
                  </li>
                </ul>
              </div>

              {/* Message Artisan Button */}
              {user && user.role === 'customer' && product.artisan_id && (
                <Link
                  to={`/customer/messages/${product.artisan_id}`}
                  className={`flex items-center justify-center gap-2 py-3 px-6 rounded-xl border-2 font-medium text-sm transition-all mb-4 ${darkMode ? 'border-primary-700 text-primary-400 hover:bg-primary-900/30' : 'border-primary-200 text-primary-700 hover:bg-primary-50'}`}
                >
                  <FiMessageCircle size={18} />
                  {t('messageArtisan', 'Message')} {product.artisan_name}
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Story & Reviews Tabs */}
        <div className={`py-12 border-t ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`flex justify-center space-x-8 border-b mb-8 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <button 
                onClick={() => setActiveTab('story')}
                className={`pb-4 text-lg font-display font-medium transition-colors border-b-2 ${activeTab === 'story' ? 'border-primary-800 text-primary-900' : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-800'}`}`}
              >
                {t('artisanStory', "The Artisan's Story")}
              </button>
              <button 
                onClick={() => setActiveTab('reviews')}
                className={`pb-4 text-lg font-display font-medium transition-colors border-b-2 flex items-center ${activeTab === 'reviews' ? 'border-primary-800 text-primary-900' : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-800'}`}`}
              >
                {t('reviews', 'Reviews')} <span className={`ml-2 text-xs py-0.5 px-2 rounded-full font-sans ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>{product.review_count}</span>
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'story' && (
                <motion.div 
                  key="story"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className={`p-8 rounded-2xl shadow-sm border ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100'}`}
                >
                  <div className="flex items-start gap-6 mb-6">
                    <img 
                      src={'https://ui-avatars.com/api/?name=' + product.artisan_name + '&background=a3a380&color=fff'} 
                      alt={product.artisan_name} 
                      className="w-16 h-16 rounded-full object-cover border border-gray-200"
                    />
                    <div>
                      <h3 className={`text-xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{product.artisan_name}</h3>
                      <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t('masterCraftsman', 'Master Craftsman')}</p>
                    </div>
                  </div>
                  <div className={`prose max-w-none leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <p className={`whitespace-pre-line text-lg italic mb-6 border-l-4 border-accent-300 pl-4 py-1 ${darkMode ? 'text-gray-400 bg-gray-800' : 'text-gray-600 bg-gray-50'}`}>
                      "{t('artisanQuote', 'Every piece tells a story of tradition, passed down through generations of skilled artisans.')}"
                    </p>
                    <h4 className={`text-lg font-medium mt-6 mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{t('aboutMaker', 'About the Maker')}</h4>
                    <p>{t('artisanBio', "This artisan dedicates their life to preserving traditional Indian craftsmanship. Each piece is handmade with love, care, and generations of knowledge.")}</p>
                  </div>
                </motion.div>
              )}

              {activeTab === 'reviews' && (
                <motion.div 
                  key="reviews"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                >
                  <div className={`text-center py-12 rounded-2xl border ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100'}`}>
                    <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('noReviews', 'No reviews yet for this product.')}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
