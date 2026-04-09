import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiArrowLeft } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #f5f0eb 0%, #ebe5dc 50%, #e0d5c7 100%)' }}
    >
      <div className="absolute top-[-10%] left-[-5%] w-72 h-72 bg-primary-200 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-72 h-72 bg-accent-200 rounded-full opacity-30 blur-3xl"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center px-6"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12, delay: 0.1 }}
        >
          <h1 className="text-[120px] sm:text-[160px] font-display font-black text-primary-200 leading-none select-none">
            404
          </h1>
        </motion.div>

        <h2 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 -mt-4 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-500 max-w-md mx-auto mb-8 text-base">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/" className="btn btn-primary px-6 py-3 flex items-center gap-2 shadow-md text-base">
            <FiHome size={16} /> Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn btn-secondary px-6 py-3 flex items-center gap-2 text-base"
          >
            <FiArrowLeft size={16} /> Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}
