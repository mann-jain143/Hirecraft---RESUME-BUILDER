import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, History, RotateCcw, Eye, Clock, GitBranch } from 'lucide-react';
import ConfirmModal from '../ui/ConfirmModal';

/* ------------------------------------------------------------------ */
/*  Relative time formatter                                            */
/* ------------------------------------------------------------------ */
const getRelativeTime = (timestamp) => {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
  if (diffHr < 24) return `${diffHr} hour${diffHr !== 1 ? 's' : ''} ago`;
  if (diffDay === 1) return 'Yesterday';
  if (diffDay < 7) return `${diffDay} days ago`;
  if (diffDay < 30) return `${Math.floor(diffDay / 7)} week${Math.floor(diffDay / 7) !== 1 ? 's' : ''} ago`;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
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

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.1 + i * 0.07, duration: 0.35 },
  }),
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
const VersionHistory = ({ versions = [], onRestore, isOpen, onClose, onPreview }) => {
  const [confirmRestore, setConfirmRestore] = useState(null);

  /* Escape to close */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const handleRestore = useCallback(() => {
    if (confirmRestore && onRestore) {
      onRestore(confirmRestore.id);
    }
    setConfirmRestore(null);
  }, [confirmRestore, onRestore]);

  return (
    <>
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
              aria-label="Version history panel"
              className="fixed top-0 right-0 z-[95] h-full w-full sm:w-[400px] flex flex-col
                         bg-dark-900/95 backdrop-blur-xl border-l border-white/10 shadow-2xl"
            >
              {/* ---- Header ---- */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-brand-500/15">
                    <History className="w-5 h-5 text-brand-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Version History</h2>
                    <p className="text-xs text-gray-500">
                      {versions.length} version{versions.length !== 1 ? 's' : ''} saved
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close version history"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* ---- Timeline ---- */}
              <div className="flex-1 overflow-y-auto px-5 py-4">
                {versions.length === 0 ? (
                  /* Empty state */
                  <div className="flex flex-col items-center justify-center h-full text-center px-4">
                    <div className="p-4 rounded-2xl bg-white/5 mb-5">
                      <GitBranch className="w-10 h-10 text-gray-600" />
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2">
                      No version history yet
                    </h3>
                    <p className="text-gray-400 text-sm max-w-xs">
                      Versions are saved automatically as you edit. Your change history will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Vertical timeline line */}
                    <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-white/10" />

                    <div className="space-y-1">
                      {versions.map((version, idx) => (
                        <motion.div
                          key={version.id}
                          custom={idx}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          className="relative pl-8 py-3 group"
                        >
                          {/* Timeline dot */}
                          <div
                            className={`absolute left-0 top-[18px] w-[23px] h-[23px] rounded-full border-2 flex items-center justify-center
                              ${idx === 0
                                ? 'border-brand-500 bg-brand-500/20'
                                : 'border-white/20 bg-dark-800 group-hover:border-brand-400/60'
                              } transition-colors`}
                          >
                            <div
                              className={`w-2 h-2 rounded-full ${
                                idx === 0 ? 'bg-brand-400' : 'bg-white/30 group-hover:bg-brand-400/60'
                              } transition-colors`}
                            />
                          </div>

                          {/* Content card */}
                          <div
                            className={`glass-card rounded-xl p-4 border transition-colors
                              ${idx === 0
                                ? 'border-brand-500/30 bg-brand-500/5'
                                : 'border-white/5 hover:border-white/15'
                              }`}
                          >
                            {/* Current version badge */}
                            {idx === 0 && (
                              <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-400 bg-brand-500/15 rounded-md mb-2">
                                Current
                              </span>
                            )}

                            {/* Timestamp */}
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <Clock className="w-3.5 h-3.5 text-gray-500" />
                              <span className="text-xs text-gray-400">
                                {getRelativeTime(version.timestamp)}
                              </span>
                            </div>

                            {/* Changes summary */}
                            <p className="text-sm text-gray-300 leading-relaxed mb-3">
                              {version.changes || 'Resume updated'}
                            </p>

                            {/* Actions */}
                            {idx !== 0 && (
                              <div className="flex items-center gap-2">
                                <motion.button
                                  whileHover={{ scale: 1.03 }}
                                  whileTap={{ scale: 0.97 }}
                                  onClick={() => setConfirmRestore(version)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium
                                             rounded-lg bg-brand-500/15 text-brand-400 hover:bg-brand-500/25 transition-colors"
                                  aria-label={`Restore version from ${getRelativeTime(version.timestamp)}`}
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  Restore
                                </motion.button>

                                {onPreview && (
                                  <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => onPreview(version.id)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium
                                               rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200 transition-colors"
                                    aria-label={`Preview version from ${getRelativeTime(version.timestamp)}`}
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    Preview
                                  </motion.button>
                                )}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Restore confirmation modal */}
      <ConfirmModal
        isOpen={!!confirmRestore}
        onConfirm={handleRestore}
        onCancel={() => setConfirmRestore(null)}
        title="Restore this version?"
        message={`This will replace your current resume with the version from ${
          confirmRestore ? getRelativeTime(confirmRestore.timestamp) : ''
        }. Your current work will be saved as a new version.`}
        confirmText="Restore"
        cancelText="Cancel"
        variant="warning"
      />
    </>
  );
};

export default VersionHistory;
