import React, { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, CheckCircle2, ChevronRight, BookOpen, Lightbulb } from 'lucide-react';

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', damping: 25, stiffness: 350 },
  },
  exit: { opacity: 0, scale: 0.95, y: 8, transition: { duration: 0.2 } },
};

export default function HelpModal({
  isOpen,
  onClose,
  title = 'Help Guide',
  subtitle = 'Learn more about this feature',
  sections = [],
  tips = [],
}) {
  const modalRef = useRef(null);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            ref={modalRef}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-10 w-full max-w-2xl bg-white dark:bg-[#0b0e24] border border-slate-200 dark:border-white/10 shadow-2xl rounded-3xl p-6 md:p-8 overflow-hidden max-h-[85vh] flex flex-col"
          >
            {/* Soft Glow Circles */}
            <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-[#7c5cff]/10 rounded-full blur-[40px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[150px] h-[150px] bg-emerald-500/5 rounded-full blur-[40px] pointer-events-none" />

            {/* Header */}
            <div className="flex justify-between items-start mb-6 pb-4 border-b border-slate-100 dark:border-white/5 relative z-10 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 rounded-xl">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white leading-tight">
                    {title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {subtitle}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-grow overflow-y-auto pr-2 space-y-6 relative z-10 no-scrollbar">
              {/* Extra explanation cards / sections */}
              {sections.length > 0 && (
                <div className="space-y-4">
                  {sections.map((section, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 rounded-2xl space-y-2 hover:border-indigo-500/20 transition-all duration-300"
                    >
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-indigo-500" />
                        {section.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-6">
                        {section.description}
                      </p>
                      {section.steps && section.steps.length > 0 && (
                        <ul className="pl-6 pt-2 space-y-1.5">
                          {section.steps.map((step, sIdx) => (
                            <li key={sIdx} className="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2">
                              <ChevronRight className="w-3 h-3 text-indigo-400 mt-1 flex-shrink-0" />
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Tips / Insights panel */}
              {tips.length > 0 && (
                <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl space-y-3">
                  <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Pro Student Tips & Tricks
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {tips.map((tip, idx) => (
                      <div key={idx} className="flex gap-2 items-start">
                        <CheckCircle2 className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {tip}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer action button */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex justify-end flex-shrink-0">
              <button
                onClick={onClose}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition active:scale-95 cursor-pointer"
              >
                Got it, thanks!
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
