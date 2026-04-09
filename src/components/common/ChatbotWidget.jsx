import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiX, FiSend, FiCpu } from 'react-icons/fi';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function ChatbotWidget() {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hello! 👋 I\'m your HandCraft assistant. Ask me about products, orders, payments, or returns!\n\nTry typing "help" to see what I can do!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!user) return null;

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await api.post('/chat/bot', { message: msg });
      setMessages(prev => [...prev, { role: 'bot', text: data.response }]);
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I\'m having trouble connecting. Please try again in a moment.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    send();
  };

  const quickActions = ['Recommend products', 'Track my order', 'Payment help', 'Return policy'];

  return (
    <>
      {/* FAB */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-primary-700 to-primary-900 text-white rounded-full shadow-xl flex items-center justify-center"
          >
            <FiMessageCircle size={24} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent-500 rounded-full animate-pulse"></span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            className={`fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] rounded-2xl shadow-2xl border overflow-hidden flex flex-col ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
            style={{ height: '520px' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-800 to-primary-900 p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <FiCpu className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">HandCraft AI</h3>
                  <p className="text-white/60 text-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span> Online
                  </p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition p-1">
                <FiX size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className={`flex-1 overflow-y-auto px-4 py-3 space-y-3 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-primary-800 text-white rounded-br-md'
                      : `${darkMode ? 'bg-gray-800 text-gray-200 border border-gray-700' : 'bg-white text-gray-800 border border-gray-200'} rounded-bl-md shadow-sm`
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className={`rounded-2xl rounded-bl-md px-4 py-3 shadow-sm ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Quick Actions */}
            {messages.length <= 2 && (
              <div className={`px-4 py-2 flex gap-2 flex-wrap border-t shrink-0 ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-white'}`}>
                {quickActions.map(q => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium transition ${darkMode ? 'bg-primary-900/50 text-primary-300 hover:bg-primary-900' : 'bg-primary-50 text-primary-700 hover:bg-primary-100'}`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className={`p-3 border-t flex gap-2 shrink-0 ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-white'}`}>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition ${darkMode ? 'bg-gray-700 text-gray-100 placeholder-gray-400' : 'bg-gray-100'}`}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="w-10 h-10 bg-primary-800 text-white rounded-xl flex items-center justify-center hover:bg-primary-900 transition disabled:opacity-40"
              >
                <FiSend size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
