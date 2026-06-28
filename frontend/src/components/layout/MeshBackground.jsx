import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function MeshBackground() {
  const particles = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      size: Math.random() * 3 + 1.5,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 12 + Math.random() * 18,
    }));
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#050816] pointer-events-none select-none">
      {/* Aurora Radial Gradients - 5% max opacity */}
      <motion.div
        animate={{
          scale: [1, 1.1, 0.9, 1],
          x: [0, 30, -20, 0],
          y: [0, -20, 15, 0],
        }}
        transition={{ duration: 35, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#4f46e5]/0.04 to-[#7c5cff]/0.04 blur-[120px]"
      />
      <motion.div
        animate={{
          scale: [1, 0.9, 1.1, 1],
          x: [0, -25, 30, 0],
          y: [0, 20, -15, 0],
        }}
        transition={{ duration: 40, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] rounded-full bg-gradient-to-br from-[#06b6d4]/0.03 to-[#4f46e5]/0.03 blur-[140px]"
      />
      <motion.div
        animate={{
          scale: [0.95, 1.05, 0.95],
          x: [0, 20, -20, 0],
          y: [0, 15, -20, 0],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[30%] left-[30%] w-[550px] h-[550px] rounded-full bg-[#8b5cf6]/0.03 blur-[120px]"
      />

      {/* Grid Mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:40px_40px] opacity-80" />

      {/* Slow Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          animate={{
            y: ['0px', '-30px', '0px'],
            x: ['0px', '15px', '0px'],
            opacity: [0.1, 0.5, 0.1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bg-[#7c5cff] rounded-full blur-[0.5px]"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
        />
      ))}
    </div>
  );
}
