import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
};

const iconSizes = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
};

const AIGenerateButton = ({
  onGenerate,
  tooltip = 'Generate with AI',
  size = 'sm',
  disabled = false,
  'aria-label': ariaLabel,
  className = '',
}) => {
  const [loading, setLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const buttonRef = useRef(null);

  const handleClick = async () => {
    if (loading || disabled) return;
    setLoading(true);
    try {
      await onGenerate();
      toast.success('AI generation complete!');
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || 'AI generation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative inline-flex">
      <motion.button
        ref={buttonRef}
        type="button"
        onClick={handleClick}
        disabled={loading || disabled}
        whileHover={!loading && !disabled ? { scale: 1.05 } : {}}
        whileTap={!loading && !disabled ? { scale: 0.95 } : {}}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        aria-label={ariaLabel || tooltip}
        className={`
          relative inline-flex items-center font-semibold rounded-lg
          bg-gradient-to-r from-indigo-600 to-purple-600
          text-white shadow-md
          transition-all duration-300
          hover:from-indigo-500 hover:to-purple-500
          hover:shadow-lg hover:shadow-indigo-500/25
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none
          focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2
          focus:ring-offset-slate-900
          ${sizeClasses[size] || sizeClasses.sm}
          ${className}
        `}
      >
        {/* Glow effect on hover */}
        <span
          className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-400/20 to-purple-400/20 opacity-0 hover:opacity-100 blur-sm transition-opacity pointer-events-none"
          aria-hidden="true"
        />

        <AnimatePresence mode="wait" initial={false}>
          {loading ? (
            <motion.span
              key="loader"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
              className="inline-flex"
            >
              <Loader2 className={`${iconSizes[size] || iconSizes.sm} animate-spin`} />
            </motion.span>
          ) : (
            <motion.span
              key="sparkles"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              transition={{ duration: 0.2 }}
              className="inline-flex"
            >
              <Sparkles className={iconSizes[size] || iconSizes.sm} />
            </motion.span>
          )}
        </AnimatePresence>

        <span className="relative z-10">
          {loading ? 'Generating…' : 'AI Generate'}
        </span>
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none"
            role="tooltip"
          >
            <div className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 dark:bg-slate-700 rounded-lg shadow-lg whitespace-nowrap border border-slate-700 dark:border-slate-600">
              {tooltip}
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                <div className="w-2 h-2 bg-slate-900 dark:bg-slate-700 rotate-45 border-r border-b border-slate-700 dark:border-slate-600" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIGenerateButton;
