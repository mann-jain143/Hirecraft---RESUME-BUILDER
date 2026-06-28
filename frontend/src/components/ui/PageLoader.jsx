import { motion } from 'framer-motion';
import HireCraftLogo from '../HireCraftLogo';

export default function PageLoader({ label = 'Loading...' }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-50 dark:bg-[#050816]"
    >
      <motion.div
        animate={{ scale: [1, 1.08, 1], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <HireCraftLogo className="w-12 h-12" showText={false} />
      </motion.div>
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-[3px] border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm font-medium text-slate-500 dark:text-gray-400"
        >
          {label}
        </motion.p>
      </div>
    </motion.div>
  );
}
