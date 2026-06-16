import React from 'react';

const PLACEHOLDER = 'data:image/svg+xml,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <rect fill="#e2e8f0" width="200" height="200"/>
    <circle cx="100" cy="75" r="35" fill="#94a3b8"/>
    <ellipse cx="100" cy="160" rx="55" ry="40" fill="#94a3b8"/>
  </svg>`
);

export const PhotoFrame = ({ src, shape = 'circle', size = 'md', className = '', borderClass = 'border-4 border-white' }) => {
  const sizes = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40',
    banner: 'w-full h-32',
    split: 'w-full h-full min-h-[180px]',
  };
  const shapes = {
    circle: 'rounded-full',
    square: 'rounded-lg',
    rounded: 'rounded-2xl',
    none: '',
  };
  const sizeClass = sizes[size] || sizes.md;
  const shapeClass = shapes[shape] || shapes.circle;

  return (
    <div className={`overflow-hidden shrink-0 ${sizeClass} ${shapeClass} ${borderClass} ${className}`}>
      <img
        src={src || PLACEHOLDER}
        alt="Profile"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default PhotoFrame;
