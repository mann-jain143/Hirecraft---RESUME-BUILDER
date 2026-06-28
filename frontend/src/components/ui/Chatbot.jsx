import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, Loader2, RefreshCw, Minus, Maximize2, Terminal, Code as CodeIcon } from 'lucide-react';
import API from '../../utils/api';
import toast from 'react-hot-toast';
import Typewriter from './Typewriter';

const SUGGESTED_PROMPTS = [
  "How do I explain ATS to a student?",
  "Give me a step-by-step STAR example.",
  "Suggest action verbs for resume entries.",
  "How should I structure my tech portfolio?"
];

// Helper function to format basic Markdown: lists, bold text, code blocks, line breaks
function parseMessageContent(content) {
  if (!content) return '';

  // 1. Code blocks check: ```code```
  const codeRegex = /```([\s\S]*?)```/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = codeRegex.exec(content)) !== null) {
    const textBefore = content.substring(lastIndex, match.index);
    if (textBefore) {
      parts.push({ type: 'text', value: textBefore });
    }
    parts.push({ type: 'code', value: match[1].trim() });
    lastIndex = codeRegex.lastIndex;
  }

  const textAfter = content.substring(lastIndex);
  if (textAfter) {
    parts.push({ type: 'text', value: textAfter });
  }

  // Helper to parse line-by-line formatting (bold, bullets)
  const parseInline = (text) => {
    return text.split('\n').map((line, lineIdx) => {
      let cleaned = line;
      let isBullet = false;

      // Bullet points detection
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ') || line.trim().startsWith('• ')) {
        isBullet = true;
        cleaned = line.trim().replace(/^[-*•]\s+/, '');
      }

      // Bold text replacement: **text**
      const boldParts = [];
      const boldRegex = /\*\*([\s\S]*?)\*\*/g;
      let boldLastIdx = 0;
      let boldMatch;

      while ((boldMatch = boldRegex.exec(cleaned)) !== null) {
        const textBeforeBold = cleaned.substring(boldLastIdx, boldMatch.index);
        if (textBeforeBold) {
          boldParts.push(<span key={`t-${boldLastIdx}`}>{textBeforeBold}</span>);
        }
        boldParts.push(<strong key={`b-${boldMatch.index}`} className="font-extrabold text-indigo-600 dark:text-indigo-400">{boldMatch[1]}</strong>);
        boldLastIdx = boldRegex.lastIndex;
      }

      const textAfterBold = cleaned.substring(boldLastIdx);
      if (textAfterBold) {
        boldParts.push(<span key={`t-${boldLastIdx}`}>{textAfterBold}</span>);
      }

      if (isBullet) {
        return (
          <li key={lineIdx} className="ml-4 list-disc pl-1 mb-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
            {boldParts.length > 0 ? boldParts : cleaned}
          </li>
        );
      }

      return (
        <p key={lineIdx} className="mb-2 text-[11px] leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
          {boldParts.length > 0 ? boldParts : cleaned}
        </p>
      );
    });
  };

  return (
    <div className="space-y-3">
      {parts.map((part, idx) => {
        if (part.type === 'code') {
          return (
            <div key={idx} className="my-2.5 rounded-xl border border-slate-200/50 dark:border-white/5 bg-slate-900 text-slate-100 font-mono text-[10px] overflow-hidden shadow-inner">
              <div className="bg-slate-950 px-3 py-1.5 flex items-center justify-between border-b border-white/5 text-[9px] text-slate-400 font-bold select-none">
                <span className="flex items-center gap-1"><Terminal className="w-3 h-3 text-indigo-400" /> CODE SNIPPET</span>
                <span className="uppercase tracking-widest text-[8px]">Gemini Compiler</span>
              </div>
              <pre className="p-3.5 overflow-x-auto whitespace-pre-wrap">{part.value}</pre>
            </div>
          );
        }
        return <div key={idx}>{parseInline(part.value)}</div>;
      })}
    </div>
  );
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasFetchedHistory, setHasFetchedHistory] = useState(false);
  
  // AI Coach Mode state
  const [mode, setMode] = useState(
    localStorage.getItem('hirecraft-ai-coach-mode') || 'student'
  );

  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hello! I am your HireCraft Career Coach. Ask me anything about resume formatting, work experience impact, portfolios, or interview prep!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const chatEndRef = useRef(null);
  const chatbotRef = useRef(null);

  // Auto scroll to bottom of chat thread when messages update
  useEffect(() => {
    if (!isMinimized && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized, loading]);

  // Listen for global window events to open chatbot
  useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true);
      setIsMinimized(false);
    };
    window.addEventListener('open-career-coach', handleOpenChat);
    return () => window.removeEventListener('open-career-coach', handleOpenChat);
  }, []);

  // Fetch chat history from database on first open
  useEffect(() => {
    if (isOpen && !hasFetchedHistory) {
      const fetchChatHistory = async () => {
        try {
          const { data } = await API.get('/ai/chat/history');
          if (data && data.messages && data.messages.length > 0) {
            const normalized = data.messages.map(msg => ({
              role: msg.role === 'assistant' ? 'ai' : msg.role,
              content: msg.content || msg.text || '',
              isError: false
            }));
            setMessages(normalized);
          }
          setHasFetchedHistory(true);
        } catch (err) {
          console.error("Failed to load chat history:", err);
        }
      };
      fetchChatHistory();
    }
  }, [isOpen, hasFetchedHistory]);

  // click-outside trigger to minimize
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatbotRef.current && !chatbotRef.current.contains(event.target)) {
        setIsMinimized(true);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Escape key press trigger to minimize
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsMinimized(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const activeMessages = messages.filter(m => !m.isError);
    const userMsg = { role: 'user', content: text };
    const updatedMessages = [...activeMessages, userMsg];
    setMessages(updatedMessages);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const { data } = await API.post('/ai/chat', { messages: updatedMessages, mode });
      setMessages((prev) => [...prev, { role: 'ai', content: data.reply }]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to receive response from Coach. Check connection.");
      setMessages((prev) => [
        ...prev,
        { role: 'ai', content: "Sorry, I encountered an issue compiling the response. Please try sending your question again.", isError: true }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    const userMsgs = messages.filter(m => m.role === 'user');
    if (userMsgs.length > 0) {
      const lastUserMsg = userMsgs[userMsgs.length - 1];
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === 'ai' && (lastMsg.isError || lastMsg.content.includes("Sorry, I encountered"))) {
        setMessages(prev => prev.slice(0, -1));
      }
      handleSend(lastUserMsg.content);
    }
  };

  const handleClear = () => {
    setMessages([
      { role: 'ai', content: "Hello! I am your HireCraft Career Coach. Ask me anything about resume formatting, work experience impact, portfolios, or interview prep!" }
    ]);
  };

  const handleModeSelection = (newMode) => {
    setMode(newMode);
    localStorage.setItem('hirecraft-ai-coach-mode', newMode);
    toast.success(`AI Coach Mode: ${newMode.charAt(0).toUpperCase() + newMode.slice(1)}`);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 no-print font-sans select-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatbotRef}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className={`w-[320px] sm:w-[380px] ${isMinimized ? 'h-[76px]' : 'h-[520px]'} bg-white/90 dark:bg-[#0b0e24]/90 border border-slate-200/60 dark:border-white/10 shadow-2xl dark:shadow-glow-brand rounded-3xl overflow-hidden flex flex-col mb-4 backdrop-blur-2xl transition-all duration-300`}
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-brand-600 to-indigo-600 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="relative w-9 h-9 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <Sparkles className="w-5 h-5 text-indigo-200" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-brand-600" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold font-display tracking-wide flex items-center gap-1">AI Coach</h3>
                  {/* Select Dropdown Mode Switcher */}
                  <select 
                    value={mode}
                    onChange={(e) => handleModeSelection(e.target.value)}
                    className="bg-white/10 dark:bg-black/25 text-white border-none rounded-lg text-[9px] py-0.5 px-1.5 focus:ring-1 focus:ring-white/20 outline-none cursor-pointer font-bold block"
                  >
                    <option value="beginner" className="text-slate-800 dark:text-white dark:bg-slate-900">🟢 Beginner Mode</option>
                    <option value="student" className="text-slate-800 dark:text-white dark:bg-slate-900">🟡 Student Mode</option>
                    <option value="professional" className="text-slate-800 dark:text-white dark:bg-slate-900">👑 Pro Mode</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
                  title="Clear Chat History"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
                  title={isMinimized ? "Maximize Window" : "Minimize Window"}
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
                  title="Close Coach"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Expanded Body Panel */}
            {!isMinimized && (
              <>
                {/* Scrollable Message Box */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30 dark:bg-transparent no-scrollbar select-text">
                  {messages.map((msg, index) => {
                    const isAi = msg.role === 'ai' || msg.role === 'model';
                    return (
                      <div
                        key={index}
                        className={`flex ${isAi ? 'justify-start' : 'justify-end'}`}
                      >
                        <div
                          className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                            isAi
                              ? 'bg-white/95 dark:bg-[#1a1b35] text-slate-800 dark:text-slate-200 border border-slate-200/50 dark:border-brand-500/10 rounded-tl-none shadow-md'
                              : 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-tr-none shadow-md'
                          }`}
                        >
                          {isAi ? (
                            <div className="flex flex-col gap-2">
                              {/* Message Markdown content renderer */}
                              {parseMessageContent(msg.content)}
                              {msg.isError && (
                                <button
                                  type="button"
                                  onClick={handleRetry}
                                  className="mt-1 self-start flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg text-[10px] transition cursor-pointer font-bold border border-red-500/20"
                                >
                                  <RefreshCw className="w-3 h-3 animate-spin-hover" />
                                  Retry Generation
                                </button>
                              )}
                            </div>
                          ) : (
                            <p className="text-[11px] font-semibold leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Typing Indicator */}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="p-3.5 bg-white/80 dark:bg-[#7c5cff]/10 rounded-2xl rounded-tl-none border border-slate-100/50 dark:border-brand-500/10 flex items-center gap-2 shadow-sm">
                        <div className="flex items-center gap-1 px-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">Coach is formulating...</span>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Pre-seeded prompts */}
                {messages.length === 1 && (
                  <div className="p-3 bg-slate-100/40 dark:bg-white/[0.01] border-t border-slate-200/40 dark:border-white/5 space-y-2 no-print">
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block px-1">Suggested Discussion Topics</span>
                    <div className="grid grid-cols-1 gap-1.5">
                      {SUGGESTED_PROMPTS.map((promptText, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSend(promptText)}
                          className="w-full text-left px-3 py-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200/50 dark:border-white/5 hover:border-brand-500/30 dark:hover:border-indigo-500/30 text-[10px] text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer"
                        >
                          {promptText}
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
                  className="p-3 bg-white/95 dark:bg-[#0b0e24]/95 border-t border-slate-200/60 dark:border-white/10 flex gap-2"
                >
                  <input
                    type="text"
                    placeholder="Ask about resume formatting, ATS scores, STAR formats..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={loading}
                    className="flex-grow px-4 py-2.5 border border-slate-200/60 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 rounded-xl text-xs outline-none focus:border-brand-500 dark:focus:border-indigo-500 transition-all duration-300 font-semibold"
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="p-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 disabled:from-slate-200 disabled:to-slate-200 dark:disabled:from-slate-800 dark:disabled:to-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 text-white rounded-xl transition flex items-center justify-center cursor-pointer shadow-md"
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
        {/* Pulsing Outer Glow */}
        <motion.div
          animate={{
            scale: [1, 1.35, 1],
            opacity: [0.35, 0.7, 0.35],
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-500 to-indigo-500 blur-[4px]"
          style={{ width: '56px', height: '56px' }}
        />
        
        <motion.button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            setIsMinimized(false);
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center shadow-2xl cursor-pointer hover:shadow-glow-brand transition-all duration-300"
          aria-label="Toggle AI Career Coach Chatbot"
        >
          {isOpen && !isMinimized ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <MessageSquare className="w-6 h-6 text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.4)]" />
          )}
        </motion.button>
      </div>
    </div>
  );
}
