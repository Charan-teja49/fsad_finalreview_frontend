import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiUser, FiMessageCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function ArtisanChat() {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [conversations, setConversations] = useState([]);
  const [activePartnerId, setActivePartnerId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [partner, setPartner] = useState(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activePartnerId) {
      fetchMessages(activePartnerId);
      const interval = setInterval(() => fetchMessages(activePartnerId), 5000);
      return () => clearInterval(interval);
    }
  }, [activePartnerId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const { data } = await api.get('/messages/conversations');
      setConversations(data || []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (partnerId) => {
    try {
      const { data } = await api.get(`/messages/conversation/${partnerId}`);
      setMessages(data.messages || []);
      setPartner(data.partner);
    } catch {
      // silent
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || sending || !activePartnerId) return;
    setSending(true);
    try {
      await api.post('/messages', {
        receiverId: activePartnerId,
        content: input.trim()
      });
      setInput('');
      fetchMessages(activePartnerId);
    } catch {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Navbar />
      <div className="flex flex-1">
        <Sidebar role="artisan" />
        
        <main className="ml-64 flex-1 flex">
          {/* Conversation List */}
          <div className={`w-80 border-r flex flex-col ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className={`p-4 border-b font-bold ${darkMode ? 'text-gray-100 border-gray-700' : 'text-gray-900 border-gray-200'}`}>
              <FiMessageCircle className="inline mr-2" /> Messages
            </div>
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-primary-200 border-t-primary-800 rounded-full animate-spin"></div>
                </div>
              ) : conversations.length === 0 ? (
                <div className={`p-6 text-center text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  No conversations yet. Customers will appear here when they message you.
                </div>
              ) : conversations.map(conv => (
                <button
                  key={conv.partnerId}
                  onClick={() => setActivePartnerId(conv.partnerId)}
                  className={`w-full text-left p-4 border-b flex gap-3 items-center transition-colors ${
                    activePartnerId === conv.partnerId
                      ? (darkMode ? 'bg-primary-900/50' : 'bg-primary-50')
                      : (darkMode ? 'hover:bg-gray-700 border-gray-700' : 'hover:bg-gray-50 border-gray-100')
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                    <FiUser size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <span className={`font-semibold text-sm truncate ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{conv.partnerName}</span>
                      {conv.unreadCount > 0 && (
                        <span className="bg-primary-800 text-white text-[10px] font-bold rounded-full h-5 min-w-5 px-1.5 flex items-center justify-center shrink-0 ml-2">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className={`text-xs truncate mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{conv.lastMessage}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {!activePartnerId ? (
              <div className={`flex-1 flex items-center justify-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                <div className="text-center">
                  <FiMessageCircle className="mx-auto mb-4" size={48} />
                  <p className="text-lg font-medium">Select a conversation</p>
                  <p className="text-sm">Choose from the list to start chatting</p>
                </div>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className={`p-4 border-b flex items-center gap-3 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${darkMode ? 'bg-primary-900 text-primary-400' : 'bg-primary-100 text-primary-700'}`}>
                    <FiUser size={18} />
                  </div>
                  <div>
                    <h3 className={`font-bold text-sm ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{partner?.name || 'Customer'}</h3>
                    <p className={`text-xs capitalize ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{partner?.role || 'customer'}</p>
                  </div>
                </div>

                {/* Messages */}
                <div className={`flex-1 overflow-y-auto p-4 space-y-3 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                  {messages.map((msg, i) => (
                    <motion.div
                      key={msg.id || i}
                      initial={{ opacity: 0, y: 5 }}
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
                <form onSubmit={handleSend} className={`p-4 border-t flex gap-3 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Type your reply..."
                    className={`flex-1 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition ${darkMode ? 'bg-gray-700 text-gray-100 placeholder-gray-400' : 'bg-gray-100'}`}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || sending}
                    className="px-6 py-3 bg-primary-800 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-primary-900 transition disabled:opacity-40 font-medium"
                  >
                    <FiSend size={16} /> Send
                  </button>
                </form>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
