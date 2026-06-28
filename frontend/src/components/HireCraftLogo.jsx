import React from 'react';
import { motion } from 'framer-motion';

const HireCraftLogo = ({ className = 'w-8 h-8', showText = true, textClassName = '' }) => (
  <div className="flex items-center gap-2.5 select-none">
    <motion.div
      whileHover={{ scale: 1.15, rotate: 10 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      className="relative flex items-center justify-center cursor-pointer"
    >
      {/* Outer Radial Glow effect on Hover */}
      <div className="absolute inset-0 bg-[#7c5cff]/30 rounded-full blur-lg opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ transform: 'scale(1.8)' }} />
      
      <svg className={`${className} relative z-10`} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="hc-grad-3d" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#818cf8" />
            <stop offset="0.4" stopColor="#a78bfa" />
            <stop offset="1" stopColor="#7c5cff" />
          </linearGradient>
          <linearGradient id="glass-overlay" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="white" stopOpacity="0.2" />
            <stop offset="1" stopColor="white" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        
        {/* Hexagonal Shield for structure & 3D feel */}
        <path 
          d="M 20 3 L 35 11 L 35 29 L 20 37 L 5 29 L 5 11 Z" 
          fill="url(#hc-grad-3d)"
          stroke="white" 
          strokeOpacity="0.25" 
          strokeWidth="1.2"
        />
        
        {/* Semi-transparent 3D Glass shading */}
        <path 
          d="M 20 3 L 35 11 L 35 29 L 20 37 Z" 
          fill="url(#glass-overlay)"
        />

        {/* Career Growth Ladder / Bar chart */}
        <rect x="11" y="24" width="4" height="6" rx="1.2" fill="white" fillOpacity="0.95" />
        <rect x="17.5" y="17" width="4" height="13" rx="1.2" fill="white" fillOpacity="0.95" />
        <rect x="24" y="11" width="4" height="19" rx="1.2" fill="white" fillOpacity="0.95" />

        {/* Shiny AI Peak Sparkle (Star) */}
        <path 
          d="M 29.5 5 C 29.5 6.2 30.5 6.2 30.5 6.2 C 30.5 6.2 29.5 6.2 29.5 7.4 C 29.5 6.2 28.5 6.2 28.5 6.2 C 28.5 6.2 29.5 6.2 29.5 5 Z" 
          fill="#fbbf24"
        />
      </svg>
    </motion.div>
    
    {showText && (
      <span className={`text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-violet-500 hover:from-indigo-300 hover:to-violet-400 transition-colors duration-300 font-display ${textClassName}`}>
        HireCraftt
      </span>
    )}
  </div>
);

export default HireCraftLogo;