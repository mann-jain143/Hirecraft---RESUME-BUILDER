import React from 'react';
import { motion } from 'framer-motion';

export default function MeshBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-slate-50 dark:bg-dark-900 transition-colors duration-500">
      <motion.div
        animate={{ scale: [1, 1.2, 1], x: [0, 80, 0], y: [0, 40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        className="absolute top-[-15%] left-[-10%] w-[550px] h-[550px] rounded-full bg-indigo-500/20 dark:bg-brand-500/20 blur-[120px]"
      />
      <motion.div
        animate={{ scale: [1, 1.4, 1], x: [0, -60, 0], y: [0, 80, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-[-15%] right-[-10%] w-[650px] h-[650px] rounded-full bg-violet-500/15 dark:bg-brand-gradientEnd/20 blur-[150px]"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], x: [0, 40, 0], y: [0, -60, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute top-[35%] left-[35%] w-[450px] h-[450px] rounded-full bg-cyan-500/10 dark:bg-brand-gradientStart/15 blur-[100px]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:28px_28px]" />
    </div>
  );
}
