import React from 'react';

const HireCraftLogo = ({ className = 'w-8 h-8', showText = true, textClassName = '' }) => (
  <div className="flex items-center gap-2.5">
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="hc-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#818cf8" />
          <stop offset="1" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      {/* Background Gradient Box */}
      <rect width="40" height="40" rx="10" fill="url(#hc-grad)" />
      
      {/* Document Base */}
      <path 
        d="M 23 13 H 15 C 13.895 13 13 13.895 13 15 V 27 C 13 28.105 13.895 29 15 29 H 25 C 26.105 29 27 28.105 27 27 V 18" 
        stroke="white" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      
      {/* Upward Growth/Export Arrow */}
      <path 
        d="M 21 11 H 30 V 20 M 30 11 L 18 23" 
        stroke="white" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
    {showText && (
      <span className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-500 ${textClassName}`}>
        HireCraft
      </span>
    )}
  </div>
);

export default HireCraftLogo;