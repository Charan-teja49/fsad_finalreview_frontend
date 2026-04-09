import React, { useState, useEffect } from 'react';
import { FiStar, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';

export default function AdminModeration() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    try {
      const { data } = await api.get('/admin/reviews');
      setReviews(data);
    } catch { toast.error('Failed to load reviews'); }
    finally { setLoading(false); }
  };

  const deleteReview = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await api.delete(`/admin/reviews/${id}`);
      toast.success('Review removed');
      fetchReviews();
    } catch { toast.error('Failed to delete'); }
  };

  const renderStars = (rating) => Array.from({ length: 5 }, (_, i) => (
    <FiStar key={i} size={13} className={i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
  ));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar role="admin" />
        <main className="ml-64 p-8 w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-gray-900">Content Moderation</h1>
            <p className="text-gray-500 mt-1">Review and moderate user-generated content</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-primary-200 border-t-primary-800 rounded-full animate-spin"></div></div>
          ) : reviews.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
              <p className="text-gray-400">No reviews to moderate</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex gap-5 items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="font-semibold text-gray-900">{review.user_name}</span>
                      <span className="text-gray-300">→</span>
                      <span className="text-sm text-gray-600">{review.product_name}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">{renderStars(review.rating)}</div>
                    <p className="text-gray-700 text-sm">{review.comment || <span className="italic text-gray-400">No comment</span>}</p>
                    <p className="text-xs text-gray-400 mt-2">{new Date(review.created_at).toLocaleDateString()}</p>
                  </div>
                  <button
                    onClick={() => deleteReview(review.id)}
                    className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors shrink-0"
                    title="Remove review"
                  >
                    <FiTrash2 size={17} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
