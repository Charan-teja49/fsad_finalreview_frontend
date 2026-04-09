import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSend, FiArrowLeft, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Navbar from '../../components/common/Navbar';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function MessageArtisan() {
  const { artisanId } = useParams();
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [partner, setPartner] = useState(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [artisanId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const { data } = await api.get(`/messages/conversation/${artisanId}`);
      setMessages(data.messages || []);
      setPartner(data.partner);
    } catch (err) {
      if (loading) toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || sending) return;
    setSending(true);
    try {
      await api.post('/messages', {
        receiverId: artisanId,
        content: input.trim()
      });
      setInput('');
      fetchMessages();
    } catch {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Navbar />

      <div className="flex-grow flex flex-col max-w-4xl mx-auto w-full px-4 py-6">
        {/* Header */}
        <div className={`rounded-t-2xl border border-b-0 p-4 flex items-center gap-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <button onClick={() => navigate(-1)} className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}>
            <FiArrowLeft size={20} />
          </button>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${darkMode ? 'bg-primary-900 text-primary-400' : 'bg-primary-100 text-primary-700'}`}>
            <FiUser size={18} />
          </div>
          <div>
            <h2 className={`font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{partner?.name || 'Artisan'}</h2>
            <p className={`text-xs capitalize ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{partner?.role || 'artisan'}</p>
          </div>
        </div>

        {/* Messages */}
        <div className={`flex-grow border border-b-0 p-4 overflow-y-auto space-y-4 ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`} style={{ minHeight: '400px', maxHeight: '60vh' }}>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-800 rounded-full animate-spin"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className={`text-center py-16 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              <FiUser className="mx-auto mb-4 w-12 h-12" />
              <p className="text-lg font-medium mb-2">Start a conversation</p>
              <p className="text-sm">Send a message to ask about products, custom orders, or anything else!</p>
            </div>
          ) : messages.map((msg, i) => (
            <motion.div
              key={msg.id || i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm ${
                msg.isMine
                  ? 'bg-primary-800 text-white rounded-br-md'
                  : `${darkMode ? 'bg-gray-800 text-gray-200 border border-gray-700' : 'bg-white text-gray-800 border border-gray-200'} rounded-bl-md shadow-sm`
              }`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <p className={`text-[10px] mt-1 ${msg.isMine ? 'text-white/60' : (darkMode ? 'text-gray-500' : 'text-gray-400')}`}>
                  {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </p>
              </div>
            </motion.div>
          ))}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className={`rounded-b-2xl border p-4 flex gap-3 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..."
            className={`flex-1 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition ${darkMode ? 'bg-gray-700 text-gray-100 placeholder-gray-400' : 'bg-gray-100'}`}
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="w-12 h-12 bg-primary-800 text-white rounded-xl flex items-center justify-center hover:bg-primary-900 transition disabled:opacity-40"
          >
            <FiSend size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
