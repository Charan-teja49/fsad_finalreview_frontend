import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiFilter, FiChevronDown } from 'react-icons/fi';
import api from '../../services/api';
import Navbar from '../../components/common/Navbar';
import ProductCard from '../../components/products/ProductCard';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';

export default function CustomerHome() {
  const { darkMode } = useTheme();
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    sort: 'popular',
    search: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get('/products', { params: filters }),
          api.get('/products/categories')
        ]);
        setProducts(prodRes.data.products || []);
        setCategories(catRes.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters]);

  const skeletonCards = Array(8).fill(0);

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Banner */}
        <div className="bg-primary-900 rounded-2xl p-8 md:p-12 text-white mb-8 relative overflow-hidden shadow-lg">
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">{t('heroTitle', 'Crafted with Passion.')}</h1>
            <p className="text-primary-100 text-lg mb-6">{t('heroSubtitle', 'Discover unique pieces from independent artisans across the country.')}</p>
            <button className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-2.5 rounded-full font-medium transition-colors shadow-md shadow-accent-500/20">
              {t('shopNewArrivals', 'Shop New Arrivals')}
            </button>
          </div>
          <div className="absolute top-0 right-0 h-full w-1/2 hidden md:block opacity-40 mix-blend-overlay">
            <img src="https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800" alt="Banner" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900 via-primary-900/90 to-transparent hidden md:block z-0"></div>
        </div>

        {/* Filters and Sorting */}
        <div className={`flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b gap-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex space-x-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-hide">
            <button 
              onClick={() => setFilters({ ...filters, category: '' })}
              className={`px-4 py-1.5 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${!filters.category ? 'bg-primary-800 text-white' : `${darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}`}
            >
              {t('allCategories', 'All')}
            </button>
            {categories.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setFilters({ ...filters, category: cat.id })}
                className={`px-4 py-1.5 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${filters.category === cat.id ? 'bg-primary-800 text-white' : `${darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            <div className="relative group">
              <button className={`flex items-center space-x-1 text-sm font-medium border rounded-md px-3 py-1.5 ${darkMode ? 'text-gray-300 bg-gray-800 border-gray-600 hover:bg-gray-700' : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'}`}>
                <span>{t('sortBy', 'Sort by')}: {
                  filters.sort === 'popular' ? t('popular', 'Popular') :
                  filters.sort === 'newest' ? t('newest', 'Newest') :
                  filters.sort === 'price_low' ? t('priceLowHigh', 'Price: Low to High') :
                  filters.sort === 'price_high' ? t('priceHighLow', 'Price: High to Low') : t('topRated', 'Top Rated')
                }</span>
                <FiChevronDown />
              </button>
              <div className={`absolute right-0 mt-1 w-48 border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                {['popular', 'newest', 'rating', 'price_low', 'price_high'].map(sortOption => (
                  <button 
                    key={sortOption}
                    onClick={() => setFilters({ ...filters, sort: sortOption })}
                    className={`block w-full text-left px-4 py-2 text-sm capitalize ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    {sortOption.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
            <button className={`p-2 border rounded-md sm:hidden ${darkMode ? 'bg-gray-800 border-gray-600 text-gray-400' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
              <FiFilter />
            </button>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {skeletonCards.map((_, i) => (
              <div key={i} className={`animate-pulse rounded-2xl border overflow-hidden h-[400px] ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                <div className={`h-64 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                <div className="p-5">
                  <div className={`h-5 rounded w-3/4 mb-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                  <div className={`h-4 rounded w-1/2 mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                  <div className="flex justify-between mt-6">
                    <div className={`h-6 rounded w-1/3 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                    <div className={`h-8 w-8 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {products.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className={`text-center py-20 rounded-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <h3 className={`text-xl font-display mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{t('noProducts', 'No products found')}</h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('clearFiltersHint', 'Try adjusting your filters or search terms.')}</p>
            <button onClick={() => setFilters({ category: '', sort: 'popular', search: '' })} className="mt-4 text-primary-600 hover:text-primary-800 font-medium">
              {t('clearFilters', 'Clear all filters')}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
