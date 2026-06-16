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
      <rect width="40" height="40" rx="10" fill="url(#hc-grad)" />
      <path d="M10 28V12h4.5l5.5 9.5L25.5 12H30v16h-3.5V18.5L21 28h-2L13.5 18.5V28H10z" fill="white" />
      <circle cx="32" cy="10" r="3" fill="#a5b4fc" />
    </svg>
    {showText && (
      <span className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-500 ${textClassName}`}>
        HireCraft
      </span>
    )}
  </div>
);

export default HireCraftLogo;
