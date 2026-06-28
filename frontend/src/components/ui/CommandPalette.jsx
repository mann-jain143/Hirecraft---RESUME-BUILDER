import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Palette, BookOpen, User, Sparkles, Globe, Terminal, FileText, X, AlertCircle } from 'lucide-react';
import API from '../../utils/api';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [resumes, setResumes] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Toggle open with CTRL+K or CMD+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch resumes for search when open
  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
      const fetchResumes = async () => {
        setLoading(true);
        try {
          const { data } = await API.get('/resumes');
          setResumes(data || []);
        } catch (err) {
          console.error('Failed to load resumes for command palette', err);
        } finally {
          setLoading(false);
        }
      };
      fetchResumes();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Command palette actions
  const actions = [
    { id: 'create', title: 'Create New Resume', description: 'Start a new resume from scratch', icon: Plus, action: () => navigate('/builder/new') },
    { id: 'templates', title: 'Browse Templates', description: 'Pick a designer-made resume template', icon: Palette, action: () => navigate('/templates') },
    { id: 'cover-letter', title: 'Generate Cover Letter', description: 'AI Cover Letter builder', icon: BookOpen, action: () => navigate('/cover-letter') },
    { id: 'linkedin', title: 'LinkedIn Profile Optimizer', description: 'Optimize summary & keywords', icon: Sparkles, action: () => navigate('/dashboard?linkedin=true') },
    { id: 'portfolio', title: 'Portfolio Generator', description: 'Turn resume into a personal site', icon: Globe, action: () => navigate('/portfolio') },
    { id: 'job-prep', title: 'Interview Question Prep', description: 'Tailored practice questions', icon: Terminal, action: () => navigate('/job-match') },
  ];

  // Filter actions and resumes based on query
  const filteredActions = actions.filter((act) =>
    act.title.toLowerCase().includes(search.toLowerCase()) ||
    act.description.toLowerCase().includes(search.toLowerCase())
  );

  const filteredResumes = resumes.filter((r) =>
    r.title?.toLowerCase().includes(search.toLowerCase())
  );

  const combinedItems = [
    ...filteredActions.map(a => ({ ...a, type: 'action' })),
    ...filteredResumes.map(r => ({
      id: r._id,
      title: r.title,
      description: `Resume • Last updated: ${new Date(r.updatedAt).toLocaleDateString()}`,
      icon: FileText,
      type: 'resume',
      action: () => navigate(`/builder/${r._id}`)
    }))
  ];

  // Key navigation
  useEffect(() => {
    const handleKeys = (e) => {
      if (!isOpen) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, combinedItems.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + combinedItems.length) % Math.max(1, combinedItems.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (combinedItems[selectedIndex]) {
          combinedItems[selectedIndex].action();
          setIsOpen(false);
        }
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeys);
    return () => window.removeEventListener('keydown', handleKeys);
  }, [isOpen, selectedIndex, combinedItems]);

  return (
    <>
      {/* Floating Spotlight shortcut indicator for dashboard header */}
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-brand-500/30 transition text-xs font-medium"
      >
        <Search className="w-3.5 h-3.5" />
        <span>Search actions...</span>
        <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-mono border border-white/10 ml-2">Ctrl + K</kbd>
      </button>

      {/* Mobile Search Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        aria-label="Search"
      >
        <Search className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-[#050816]/75 backdrop-blur-md"
            />

            {/* Raycast Spotlight Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="relative w-full max-w-2xl bg-[#0b0e24]/90 border border-brand-500/20 shadow-glow-brand-lg rounded-2xl overflow-hidden backdrop-blur-2xl flex flex-col max-h-[500px]"
            >
              {/* Search input header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                <Search className="w-5 h-5 text-brand-400" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type a command or search resumes..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setSelectedIndex(0);
                  }}
                  className="flex-1 bg-transparent border-0 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-0 w-full"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Suggestions / List view */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1 no-scrollbar">
                {combinedItems.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-sm flex flex-col items-center gap-2">
                    <AlertCircle className="w-8 h-8 text-slate-600" />
                    <span>No results found matching "{search}"</span>
                  </div>
                ) : (
                  <>
                    {/* Header for categories if we have both actions and resumes */}
                    {filteredActions.length > 0 && (
                      <div className="text-[10px] font-bold text-brand-400 tracking-widest px-3 py-1.5 uppercase">
                        Commands / Quick Links
                      </div>
                    )}
                    {combinedItems.map((item, idx) => {
                      const Icon = item.icon;
                      const isSelected = idx === selectedIndex;
                      
                      // Render separator if we switch category type
                      const showResumeHeader = item.type === 'resume' && (idx === 0 || combinedItems[idx - 1]?.type === 'action');

                      return (
                        <React.Fragment key={item.id}>
                          {showResumeHeader && (
                            <div className="text-[10px] font-bold text-brand-400 tracking-widest px-3 py-2 uppercase mt-2">
                              Your Resumes
                            </div>
                          )}
                          <button
                            onClick={() => {
                              item.action();
                              setIsOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 transition-all ${
                              isSelected
                                ? 'bg-brand-500/20 border border-brand-500/30 text-white shadow-glow-brand'
                                : 'bg-transparent border border-transparent text-slate-400 hover:text-white hover:bg-white/[0.02]'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                              isSelected ? 'bg-brand-500 text-white' : 'bg-white/5'
                            }`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-semibold text-slate-200 truncate">{item.title}</div>
                              <div className="text-xs text-slate-500 truncate">{item.description}</div>
                            </div>
                            {isSelected && (
                              <kbd className="hidden sm:block text-[10px] bg-brand-500/30 text-white border border-brand-500/40 px-1.5 py-0.5 rounded font-mono">
                                Enter
                              </kbd>
                            )}
                          </button>
                        </React.Fragment>
                      );
                    })}
                  </>
                )}
              </div>

              {/* Raycast Footer */}
              <div className="px-4 py-2 bg-slate-950/80 border-t border-white/5 text-[10px] text-slate-500 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>Navigate with <kbd className="bg-white/5 px-1 py-0.5 rounded border border-white/10 font-mono">↑</kbd> <kbd className="bg-white/5 px-1 py-0.5 rounded border border-white/10 font-mono">↓</kbd></span>
                  <span>•</span>
                  <span>Select with <kbd className="bg-white/5 px-1 py-0.5 rounded border border-white/10 font-mono">Enter</kbd></span>
                </div>
                <div>Press <kbd className="bg-white/5 px-1 py-0.5 rounded border border-white/10 font-mono">Esc</kbd> to close</div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
