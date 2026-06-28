import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Heart, Sparkles } from 'lucide-react';
import HireCraftLogo from '../HireCraftLogo';

const Linkedin = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const Github = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="relative w-full border-t border-slate-200 dark:border-white/5 bg-white/40 dark:bg-dark-950/40 backdrop-blur-xl overflow-hidden mt-auto">
      {/* Aurora light divider bar on top */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-brand-500 to-cyan-400 opacity-60 animate-gradient-shift" />
      
      {/* Decorative ambient background glows */}
      <div className="absolute -bottom-10 left-1/4 w-72 h-36 rounded-full bg-brand-500/5 blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-10 right-1/4 w-72 h-36 rounded-full bg-cyan-400/5 blur-[80px] pointer-events-none" />

      {/* Floating subtle dots particles */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <motion.div
          animate={{ y: [-10, -30, -10], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-8 left-[10%] w-1.5 h-1.5 rounded-full bg-brand-400"
        />
        <motion.div
          animate={{ y: [-20, -5, -20], opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-12 right-[15%] w-1 h-1 rounded-full bg-cyan-400"
        />
        <motion.div
          animate={{ y: [-15, -35, -15], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-6 left-[60%] w-1.5 h-1.5 rounded-full bg-pink-400"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center md:items-start text-center md:text-left">
          
          {/* Brand/Logo Section */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <Link to="/dashboard" className="transition-transform hover:scale-102">
              <HireCraftLogo />
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium flex items-center gap-1.5 justify-center md:justify-start">
              <span>Crafting Careers with AI.</span>
              <Sparkles className="w-3.5 h-3.5 text-brand-500 animate-pulse" />
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
              Quick Navigation
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm justify-center max-w-xs mx-auto md:mx-0">
              <Link 
                to="/dashboard" 
                className="text-slate-600 dark:text-slate-400 hover:text-brand-500 dark:hover:text-white transition-colors duration-200"
              >
                Dashboard
              </Link>
              <Link 
                to="/dashboard" 
                className="text-slate-600 dark:text-slate-400 hover:text-brand-500 dark:hover:text-white transition-colors duration-200"
              >
                Templates
              </Link>
              <Link 
                to="/job-match" 
                className="text-slate-600 dark:text-slate-400 hover:text-brand-500 dark:hover:text-white transition-colors duration-200"
              >
                AI Assistant
              </Link>
              <Link 
                to="/portfolio" 
                className="text-slate-600 dark:text-slate-400 hover:text-brand-500 dark:hover:text-white transition-colors duration-200"
              >
                Portfolio
              </Link>
            </div>
          </div>

          {/* Contact / Social Connections */}
          <div className="flex flex-col items-center md:items-end gap-3.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Connect With Us
            </h4>
            <div className="flex items-center gap-4">
              <motion.a 
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 text-slate-600 dark:text-slate-300 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 text-slate-600 dark:text-slate-300 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="mailto:mann.jain@example.com"
                className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 text-slate-600 dark:text-slate-300 transition-colors"
                aria-label="Email Support"
              >
                <Mail className="w-4 h-4" />
              </motion.a>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="border-t border-slate-200/60 dark:border-white/5 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
          <div className="font-semibold text-slate-700 dark:text-slate-200">
            © 2026 <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 to-cyan-400 font-black tracking-wider">MANNJAIN</span>. All rights reserved.
          </div>
          <div className="flex gap-4 text-slate-500 dark:text-slate-400">
            <span className="hover:text-brand-400 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-brand-400 cursor-pointer transition-colors">Terms</span>
            <span className="text-brand-400/80">HireCraft by Mann Jain</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
