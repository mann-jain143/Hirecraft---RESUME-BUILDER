import React, { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut } from 'lucide-react';

const ZOOM_LEVELS = [50, 75, 100, 125];

const ZoomControl = ({ zoom = 100, onZoomChange }) => {
  const currentIndex = ZOOM_LEVELS.indexOf(zoom);

  const zoomIn = useCallback(() => {
    const idx = ZOOM_LEVELS.indexOf(zoom);
    if (idx < ZOOM_LEVELS.length - 1) {
      onZoomChange(ZOOM_LEVELS[idx + 1]);
    }
  }, [zoom, onZoomChange]);

  const zoomOut = useCallback(() => {
    const idx = ZOOM_LEVELS.indexOf(zoom);
    if (idx > 0) {
      onZoomChange(ZOOM_LEVELS[idx - 1]);
    }
  }, [zoom, onZoomChange]);

  // Keyboard shortcuts: Ctrl+= zoom in, Ctrl+- zoom out
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        zoomIn();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === '-' || e.key === '_')) {
        e.preventDefault();
        zoomOut();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomIn, zoomOut]);

  const canZoomOut = currentIndex > 0;
  const canZoomIn = currentIndex < ZOOM_LEVELS.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="inline-flex items-center gap-1 px-2 py-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-lg"
      role="toolbar"
      aria-label="Zoom controls"
    >
      {/* Zoom Out */}
      <motion.button
        type="button"
        onClick={zoomOut}
        disabled={!canZoomOut}
        whileHover={canZoomOut ? { scale: 1.1 } : {}}
        whileTap={canZoomOut ? { scale: 0.9 } : {}}
        aria-label="Zoom out"
        title="Zoom out (Ctrl+-)"
        className={`p-1.5 rounded-lg transition-colors ${
          canZoomOut
            ? 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400'
            : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
        }`}
      >
        <ZoomOut className="w-4 h-4" />
      </motion.button>

      {/* Zoom Level Display */}
      <div className="min-w-[52px] text-center">
        <span className="text-xs font-bold tabular-nums text-slate-700 dark:text-slate-200">
          {zoom}%
        </span>
      </div>

      {/* Zoom In */}
      <motion.button
        type="button"
        onClick={zoomIn}
        disabled={!canZoomIn}
        whileHover={canZoomIn ? { scale: 1.1 } : {}}
        whileTap={canZoomIn ? { scale: 0.9 } : {}}
        aria-label="Zoom in"
        title="Zoom in (Ctrl+=)"
        className={`p-1.5 rounded-lg transition-colors ${
          canZoomIn
            ? 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400'
            : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
        }`}
      >
        <ZoomIn className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
};

export default ZoomControl;
