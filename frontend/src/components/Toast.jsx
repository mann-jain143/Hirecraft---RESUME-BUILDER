import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, X } from 'lucide-react';

const icons = {
  success: CheckCircle,
  error: XCircle,
};

const colors = {
  success: 'from-emerald-600 to-teal-600 border-emerald-500/30',
  error: 'from-red-600 to-rose-600 border-red-500/30',
};

const Toast = ({ message, type = 'success', onClose }) => {
  const Icon = icons[type] || CheckCircle;

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <div className={`flex items-center gap-3 px-5 py-4 rounded-xl bg-gradient-to-r ${colors[type]} border shadow-2xl backdrop-blur-sm text-white min-w-[280px]`}>
            <Icon className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium flex-1">{message}</p>
            <button type="button" onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition">
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
