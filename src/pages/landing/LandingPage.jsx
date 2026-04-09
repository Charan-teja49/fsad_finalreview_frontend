import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield, FiGlobe, FiHeart } from 'react-icons/fi';
import Navbar from '../../components/common/Navbar';

export default function LandingPage() {
  const categories = [
    { title: 'Pottery & Ceramics', image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400' },
    { title: 'Textiles & Fabrics', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400' },
    { title: 'Jewelry', image: 'https://images.unsplash.com/photo-1515562141589-67f0d569b6d2?w=400' },
    { title: 'Woodwork', image: 'https://images.unsplash.com/photo-1605629921711-2f6b00c6bbf4?w=400' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-primary-900 text-white">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=1600" 
              alt="Crafts Background" 
              className="w-full h-full object-cover opacity-30 select-none pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900 via-primary-900/80 to-transparent"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex items-center">
            <div className="max-w-2xl">
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-block py-1 px-3 rounded-full bg-accent-500/20 text-accent-300 text-sm font-semibold tracking-wider mb-6"
              >
                AUTHENTIC & HANDMADE
              </motion.span>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-5xl lg:text-7xl font-display font-bold tracking-tight mb-6"
              >
                Discover the Soul of <span className="text-accent-400">Indian</span> Artisanship
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg text-primary-100 mb-8 max-w-xl leading-relaxed"
              >
                Every piece has a story. Connect directly with master artisans across India and bring authentic, handcrafted heritage into your home.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <Link to="/signup" className="btn bg-accent-500 text-white hover:bg-accent-600 px-8 py-3 rounded-full text-lg shadow-lg shadow-accent-500/30 font-medium flex items-center space-x-2">
                  <span>Start Exploring</span> <FiArrowRight />
                </Link>
                <Link to="/login" className="btn bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border border-white/20 px-8 py-3 rounded-full text-lg font-medium transition-all">
                  Join as Artisan
                </Link>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Features / Why Us */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: <FiShield size={32} />, title: 'Authentic & Verified', desc: 'Every artisan is verified to ensure you get genuine handcrafted products.' },
                { icon: <FiGlobe size={32} />, title: 'Direct from Source', desc: 'No middlemen. You buy directly from the creators across rural India.' },
                { icon: <FiHeart size={32} />, title: 'Fair Trade', desc: 'Your purchase directly empowers artisans and preserves dying art forms.' }
              ].map((feat, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex flex-col items-center text-center p-6 border border-gray-100 rounded-2xl bg-gray-50 hover:shadow-md transition-shadow"
                >
                  <div className="h-16 w-16 mb-4 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center">
                    {feat.icon}
                  </div>
                  <h3 className="text-xl font-bold font-display text-gray-900 mb-2">{feat.title}</h3>
                  <p className="text-gray-600">{feat.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Categories Showcase */}
        <div className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900">Explore Collections</h2>
                <p className="mt-2 text-gray-600">Discover crafts by categories</p>
              </div>
              <Link to="/products" className="hidden md:flex items-center text-primary-700 font-medium hover:text-primary-900 transition-colors">
                View all <FiArrowRight className="ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((cat, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ y: -5 }}
                  className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all"
                >
                  <img src={cat.image} alt={cat.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent font-medium"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-xl font-display font-semibold text-white mb-1">{cat.title}</h3>
                    <span className="text-sm border-b border-transparent group-hover:border-white text-white/90 pb-0.5 transition-colors">
                      Shop Collection
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-8 text-center md:hidden">
              <Link to="/products" className="btn btn-secondary rounded-full px-6 py-2">
                View all categories
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Simple Footer Placeholder */}
      <footer className="bg-primary-900 text-primary-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="font-display font-bold text-2xl text-white tracking-tight mb-4 block">Hand<span className="text-accent-500">Craft</span></span>
          <p className="mb-6 max-w-md mx-auto text-sm">Empowering artisans and preserving India's rich heritage of handicrafts.</p>
          <div className="pt-8 border-t border-primary-800 text-sm">
            &copy; {new Date().getFullYear()} HandCraft Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
