import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-dark-900/50 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-brand-500/20 rounded-xl group-hover:bg-brand-500/40 transition-colors">
            <Sparkles className="w-6 h-6 text-brand-400" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            Hire<span className="text-gradient">Craft</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#templates" className="hover:text-white transition-colors">Templates</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Log in
          </Link>
          <Link to="/signup" className="px-5 py-2.5 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-400 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all hover:scale-105 active:scale-95">
            Get Started Free
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}