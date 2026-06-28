import { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, ShieldAlert, X } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Variant config                                                     */
/* ------------------------------------------------------------------ */
const VARIANTS = {
  danger: {
    icon: ShieldAlert,
    iconColor: 'text-red-400',
    iconBg: 'bg-red-500/10',
    confirmBtn:
      'bg-red-500 hover:bg-red-600 focus-visible:ring-red-500/50 text-white',
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-500/10',
    confirmBtn:
      'bg-amber-500 hover:bg-amber-600 focus-visible:ring-amber-500/50 text-black',
  },
  info: {
    icon: Info,
    iconColor: 'text-brand-400',
    iconBg: 'bg-brand-500/10',
    confirmBtn:
      'bg-brand-500 hover:bg-brand-600 focus-visible:ring-brand-500/50 text-white',
  },
};

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', damping: 25, stiffness: 350 },
  },
  exit: { opacity: 0, scale: 0.92, y: 10, transition: { duration: 0.18 } },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
const ConfirmModal = ({
  isOpen,
  onConfirm,
  onCancel,
  title = 'Are you sure?',
  message = '',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
}) => {
  const modalRef = useRef(null);
  const confirmBtnRef = useRef(null);
  const cancelBtnRef = useRef(null);

  const v = VARIANTS[variant] || VARIANTS.danger;
  const Icon = v.icon;

  /* ---- Escape key ---- */
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        onCancel?.();
        return;
      }

      /* Simple focus trap between Cancel & Confirm */
      if (e.key === 'Tab') {
        const focusable = modalRef.current?.querySelectorAll(
          'button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onCancel]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', handleKeyDown);
    /* Auto-focus the cancel button so the user can quickly Escape / Enter */
    cancelBtnRef.current?.focus();
    /* Prevent background scroll */
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onCancel}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
            aria-describedby="confirm-modal-desc"
            className="relative z-10 w-full max-w-md glass-card rounded-2xl border border-white/10 p-6 shadow-2xl"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Close X */}
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {/* Icon */}
            <div
              className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${v.iconBg}`}
            >
              <Icon className={v.iconColor} size={28} />
            </div>

            {/* Title */}
            <h2
              id="confirm-modal-title"
              className="text-center text-lg font-semibold text-white mb-2"
            >
              {title}
            </h2>

            {/* Message */}
            {message && (
              <p
                id="confirm-modal-desc"
                className="text-center text-sm text-gray-400 mb-6 leading-relaxed"
              >
                {message}
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3">
              <motion.button
                ref={cancelBtnRef}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={onCancel}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-gray-300 hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
              >
                {cancelText}
              </motion.button>

              <motion.button
                ref={confirmBtnRef}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={onConfirm}
                className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 ${v.confirmBtn}`}
              >
                {confirmText}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
