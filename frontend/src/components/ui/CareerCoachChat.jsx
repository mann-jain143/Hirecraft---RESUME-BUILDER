import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, Loader2, RefreshCw, Minus, Maximize2 } from 'lucide-react';
import API from '../../utils/api';
import toast from 'react-hot-toast';
import Typewriter from './Typewriter';

const MOCK_QUESTIONS = [
  "How can I optimize my resume ATS score?",
  "Give me 5 strong action verbs for engineering experience.",
  "Explain the STAR method for behavioral interviews.",
  "Suggest a good summary tagline for a UI/UX designer."
];

export default function CareerCoachChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', content: "Hello! I am your HireCraft AI Career Coach. Ask me anything about resume writing, portfolio building, LinkedIn SEO, or interview prep!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const chatEndRef = useRef(null);

  // Auto scroll to bottom of chat thread
  useEffect(() => {
    if (!isMinimized) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  // Listen for global window event to open chatbot
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setIsMinimized(false);
    };
    window.addEventListener('open-career-coach', handleOpen);
    return () => window.removeEventListener('open-career-coach', handleOpen);
  }, []);

  // Fetch chat history from DB on first open
  useEffect(() => {
    if (isOpen && !hasFetched) {
      const fetchHistory = async () => {
        try {
          const { data } = await API.get('/ai/chat/history');
          if (data && data.messages && data.messages.length > 0) {
            const normalized = data.messages.map(msg => ({
              role: msg.role === 'assistant' ? 'model' : msg.role,
              content: msg.content || msg.text || '',
              isError: false
            }));
            setMessages(normalized);
          }
          setHasFetched(true);
        } catch (err) {
          console.error("Error fetching chat history:", err);
        }
      };
      fetchHistory();
    }
  }, [isOpen, hasFetched]);

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    // Filter out error messages before sending
    const cleanedMessages = messages.filter(m => !m.isError);

    // Add user message to history
    const userMsg = { role: 'user', content: text };
    const updatedMessages = [...cleanedMessages, userMsg];
    setMessages(updatedMessages);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const { data } = await API.post('/ai/chat', { messages: updatedMessages });
      setMessages((prev) => [...prev, { role: 'model', content: data.reply }]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to receive feedback. Check connection.");
      setMessages((prev) => [
        ...prev,
        { role: 'model', content: "Sorry, I encountered an issue compiling the suggestions. Please try sending your question again.", isError: true }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    // Find the last user message
    const userMessages = messages.filter(m => m.role === 'user');
    if (userMessages.length > 0) {
      const lastUserMsg = userMessages[userMessages.length - 1];
      // Remove any trailing error message if it's there
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === 'model' && (lastMsg.isError || lastMsg.content.includes("Sorry, I encountered"))) {
        setMessages(prev => prev.slice(0, -1));
      }
      handleSend(lastUserMsg.content);
    }
  };

  const handleClear = () => {
    setMessages([
      { role: 'model', content: "Hello! I am your HireCraft AI Career Coach. Ask me anything about resume writing, portfolio building, LinkedIn SEO, or interview prep!" }
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 no-print font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className={`w-[320px] sm:w-[360px] ${isMinimized ? 'h-[72px]' : 'h-[480px]'} bg-white dark:bg-[#0b0e24] border border-slate-200 dark:border-white/10 shadow-2xl dark:shadow-glow-brand rounded-3xl overflow-hidden flex flex-col mb-4 backdrop-blur-2xl transition-all duration-300`}
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-brand-500 to-brand-600 dark:from-brand-600 dark:to-brand-500 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center border border-white/10 animate-pulse">
                  <Sparkles className="w-4.5 h-4.5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-display">Career Coach</h3>
                  <span className="text-[9px] text-[#a78bfa] font-bold uppercase tracking-wider block">Real-time Advice</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleClear}
                  className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
                  title="Restart Chat"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
                  title={isMinimized ? "Maximize Chat" : "Minimize Chat"}
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Content Panel */}
            {!isMinimized && (
              <>
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 dark:bg-transparent no-scrollbar">
                  {messages.map((msg, index) => {
                    const isModel = msg.role === 'model' || msg.role === 'assistant';
                    return (
                      <div
                        key={index}
                        className={`flex ${isModel ? 'justify-start' : 'justify-end'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                            isModel
                              ? 'bg-white dark:bg-[#7c5cff]/10 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-brand-500/10 rounded-tl-sm'
                              : 'bg-[#7c5cff] text-white rounded-tr-sm shadow-md'
                          }`}
                        >
                          {isModel ? (
                            <div className="flex flex-col gap-2">
                              <Typewriter text={msg.content} speed={10} onComplete={() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })} />
                              {msg.isError && (
                                <button
                                  type="button"
                                  onClick={handleRetry}
                                  className="mt-1.5 self-start flex items-center gap-1 px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg text-[10px] transition cursor-pointer font-bold border border-red-500/20"
                                >
                                  <RefreshCw className="w-3 h-3" />
                                  Retry Question
                                </button>
                              )}
                            </div>
                          ) : (
                            msg.content
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Loader */}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="p-3 bg-white dark:bg-[#7c5cff]/10 rounded-2xl rounded-tl-sm border border-slate-100 dark:border-brand-500/10 flex items-center gap-1.5">
                        <Loader2 className="w-3.5 h-3.5 text-brand-400 animate-spin" />
                        <span className="text-[10px] text-slate-500">Coach is thinking...</span>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Pre-seeded prompts */}
                {messages.length === 1 && (
                  <div className="p-3 bg-slate-100/50 dark:bg-white/[0.01] border-t border-slate-200/50 dark:border-white/5 space-y-1.5 no-print">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block px-1">SUGGESTED QUESTIONS</span>
                    <div className="flex flex-col gap-1">
                      {MOCK_QUESTIONS.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(q)}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-brand-500/30 text-[10px] text-slate-600 dark:text-slate-300 hover:text-[#7c5cff] transition"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input Row */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="p-3 bg-white dark:bg-[#0b0e24]/90 border-t border-slate-200 dark:border-white/10 flex gap-2"
                >
                  <input
                    type="text"
                    placeholder="Ask about resumes, interviews..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={loading}
                    className="flex-grow px-3 py-2 border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 rounded-xl text-xs outline-none focus:border-brand-500 transition"
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="p-2 bg-[#7c5cff] hover:bg-[#8b5cf6] disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl transition flex items-center justify-center cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button Bubble */}
      <div className="relative mt-2 flex justify-end">
        {/* Pulsing Outer Ring */}
        <motion.div
          animate={{
            scale: [1, 1.35, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-brand-600 blur-[3px]"
          style={{ width: '56px', height: '56px' }}
        />
        
        <motion.button
          onClick={() => {
            setIsOpen(!isOpen);
            setIsMinimized(false);
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-14 h-14 rounded-full bg-white/10 dark:bg-[#7c5cff]/10 border border-white/20 dark:border-[#7c5cff]/30 text-white flex items-center justify-center shadow-2xl backdrop-blur-md cursor-pointer hover:bg-white/20 dark:hover:bg-[#7c5cff]/20 transition-all duration-300"
          aria-label="Toggle Career Coach Assistant"
        >
          <MessageSquare className="w-6 h-6 text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.4)]" />
        </motion.button>
      </div>
    </div>
  );
}
