import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Bot, User, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../utils/api';

/* ------------------------------------------------------------------ */
/*  Suggestion chips shown when chat is empty                          */
/* ------------------------------------------------------------------ */
const SUGGESTIONS = [
  'How can I improve my resume?',
  'Suggest skills for a React Developer',
  'Generate better project descriptions',
  'Review my resume for ATS compatibility',
  'Suggest achievements for my role',
  'Help me write a professional summary',
];

/* ------------------------------------------------------------------ */
/*  Simple markdown-like renderer (bold, bullet lists, line breaks)    */
/* ------------------------------------------------------------------ */
const renderMarkdown = (text) => {
  if (!text) return null;

  return text.split('\n').map((line, i) => {
    // Bold: **text**
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((seg, j) => {
      if (seg.startsWith('**') && seg.endsWith('**')) {
        return (
          <strong key={j} className="font-semibold text-white">
            {seg.slice(2, -2)}
          </strong>
        );
      }
      return seg;
    });

    // Bullet list item
    if (line.trimStart().startsWith('- ') || line.trimStart().startsWith('• ')) {
      return (
        <li key={i} className="ml-4 list-disc text-gray-300 leading-relaxed">
          {parts.map((p) =>
            typeof p === 'string' ? p.replace(/^[-•]\s*/, '') : p
          )}
        </li>
      );
    }

    // Numbered list item
    if (/^\d+\.\s/.test(line.trimStart())) {
      return (
        <li key={i} className="ml-4 list-decimal text-gray-300 leading-relaxed">
          {parts.map((p) =>
            typeof p === 'string' ? p.replace(/^\d+\.\s*/, '') : p
          )}
        </li>
      );
    }

    return (
      <p key={i} className="text-gray-300 leading-relaxed">
        {parts}
      </p>
    );
  });
};

/* ------------------------------------------------------------------ */
/*  Typing indicator – 3 bouncing dots                                 */
/* ------------------------------------------------------------------ */
const TypingIndicator = () => (
  <div className="flex items-center gap-2 px-4 py-3" aria-label="AI is typing">
    <Bot className="w-5 h-5 text-brand-400 shrink-0" />
    <div className="glass-card px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full bg-brand-400"
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Panel animation variants                                           */
/* ------------------------------------------------------------------ */
const panelVariants = {
  hidden: { x: '100%', opacity: 0.5 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', damping: 28, stiffness: 300 },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: { duration: 0.25, ease: 'easeIn' },
  },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const chipVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.06 },
  }),
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
const AIAssistantPanel = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const messagesRef = useRef([]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  /* Auto-scroll to bottom on new messages */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  /* Focus input when panel opens */
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [isOpen]);

  /* Escape to close */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  /* Send message */
  const sendMessage = useCallback(
    async (text) => {
      const trimmed = (text || input).trim();
      if (!trimmed || isLoading) return;

      const userMsg = { sender: 'user', content: trimmed };
      const nextMessages = [...messagesRef.current, userMsg];
      setMessages(nextMessages);
      setInput('');
      setIsLoading(true);

      try {
        const chatMessages = nextMessages.map((m) => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.content,
        }));
        const { data } = await API.post('/ai/chat', { messages: chatMessages });
        setMessages((prev) => [...prev, { sender: 'ai', content: data.reply || 'No response received.' }]);
      } catch (err) {
        toast.error(err.response?.data?.message || 'AI unavailable. Check GEMINI_API_KEY.');
        setMessages((prev) => [
          ...prev,
          { sender: 'ai', content: "I'm having trouble connecting. Please try again." },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading]
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm lg:bg-black/20"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.aside
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-label="AI Assistant chat panel"
            className="fixed top-0 right-0 z-[95] h-full w-full sm:w-[400px] flex flex-col
                       bg-dark-900/95 backdrop-blur-xl border-l border-white/10 shadow-2xl"
          >
            {/* ---- Header ---- */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-brand-500/15">
                  <Sparkles className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">AI Assistant</h2>
                  <p className="text-xs text-gray-500">Powered by HireCraft AI</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close AI Assistant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ---- Messages ---- */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin"
            >
              {messages.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <div className="p-4 rounded-2xl bg-brand-500/10 mb-5">
                    <Sparkles className="w-10 h-10 text-brand-400" />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">
                    How can I help?
                  </h3>
                  <p className="text-gray-400 text-sm mb-6 max-w-xs">
                    Ask me anything about your resume, career advice, or let me
                    help you write better content.
                  </p>

                  {/* Suggestion chips */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    {SUGGESTIONS.map((s, i) => (
                      <motion.button
                        key={s}
                        custom={i}
                        variants={chipVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => sendMessage(s)}
                        className="px-3 py-2 text-xs font-medium rounded-xl border border-white/10
                                   bg-white/5 text-gray-300 hover:bg-brand-500/15 hover:text-brand-300
                                   hover:border-brand-500/30 transition-colors"
                        aria-label={`Ask: ${s}`}
                      >
                        {s}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Message bubbles */}
              <AnimatePresence>
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-start gap-2 ${
                      msg.sender === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`shrink-0 p-1.5 rounded-lg ${
                        msg.sender === 'user'
                          ? 'bg-brand-500/20'
                          : 'bg-white/10'
                      }`}
                    >
                      {msg.sender === 'user' ? (
                        <User className="w-4 h-4 text-brand-400" />
                      ) : (
                        <Bot className="w-4 h-4 text-gray-300" />
                      )}
                    </div>

                    {/* Bubble */}
                    <div
                      className={`max-w-[80%] px-4 py-3 text-sm rounded-2xl ${
                        msg.sender === 'user'
                          ? 'bg-brand-500 text-white rounded-br-sm'
                          : 'glass-card rounded-bl-sm'
                      }`}
                    >
                      {msg.sender === 'ai'
                        ? renderMarkdown(msg.content)
                        : msg.content}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              {isLoading && <TypingIndicator />}
            </div>

            {/* ---- Input area ---- */}
            <div className="p-4 border-t border-white/10">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything..."
                  rows={1}
                  className="flex-1 resize-none rounded-xl bg-white/5 border border-white/10
                             px-4 py-3 text-sm text-white placeholder-gray-500
                             focus:outline-none focus:ring-2 focus:ring-brand-500/50
                             focus:border-brand-500/50 transition-all"
                  aria-label="Type your message"
                  disabled={isLoading}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  className="p-3 rounded-xl bg-brand-500 text-white
                             hover:bg-brand-400 disabled:opacity-40 disabled:cursor-not-allowed
                             transition-colors shrink-0"
                  aria-label="Send message"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </motion.button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default AIAssistantPanel;
