import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileCheck,
  Shield,
  Sparkles,
  Trophy,
  Palette,
  Zap,
  Lock,
  Check,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Badge definitions                                                  */
/* ------------------------------------------------------------------ */
const BADGE_DEFS = [
  {
    id: 'resume-completed',
    name: 'Resume Completed',
    description: 'Complete at least one full resume',
    icon: FileCheck,
    gradient: 'from-emerald-500 to-green-600',
    glowColor: 'shadow-emerald-500/30',
    bgRing: 'ring-emerald-500/30',
  },
  {
    id: 'ats-expert',
    name: 'ATS Expert',
    description: 'Score 90%+ on ATS analysis',
    icon: Shield,
    gradient: 'from-blue-500 to-cyan-500',
    glowColor: 'shadow-blue-500/30',
    bgRing: 'ring-blue-500/30',
  },
  {
    id: 'ai-optimized',
    name: 'AI Optimized',
    description: 'Use AI features 10+ times',
    icon: Sparkles,
    gradient: 'from-violet-500 to-purple-600',
    glowColor: 'shadow-violet-500/30',
    bgRing: 'ring-violet-500/30',
  },
  {
    id: 'top-performer',
    name: 'Top Performer',
    description: 'Create 5+ resumes',
    icon: Trophy,
    gradient: 'from-amber-500 to-yellow-500',
    glowColor: 'shadow-amber-500/30',
    bgRing: 'ring-amber-500/30',
  },
  {
    id: 'template-explorer',
    name: 'Template Explorer',
    description: 'Try 5+ different templates',
    icon: Palette,
    gradient: 'from-pink-500 to-rose-500',
    glowColor: 'shadow-pink-500/30',
    bgRing: 'ring-pink-500/30',
  },
  {
    id: 'quick-builder',
    name: 'Quick Builder',
    description: 'Complete a resume in under 10 minutes',
    icon: Zap,
    gradient: 'from-cyan-400 to-teal-500',
    glowColor: 'shadow-cyan-400/30',
    bgRing: 'ring-cyan-400/30',
  },
];

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const badgeVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.85 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', damping: 18, stiffness: 260 },
  },
};

/* ------------------------------------------------------------------ */
/*  Tooltip component                                                  */
/* ------------------------------------------------------------------ */
const Tooltip = ({ text, children }) => {
  const [show, setShow] = useState(false);

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full
                     px-3 py-2 text-xs text-white bg-dark-800 border border-white/10
                     rounded-lg shadow-xl whitespace-nowrap z-50 pointer-events-none"
        >
          {text}
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 bg-dark-800 border-r border-b border-white/10 rotate-45 -mt-1" />
        </motion.div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Badge card                                                         */
/* ------------------------------------------------------------------ */
const BadgeCard = ({ badge, unlocked }) => {
  const Icon = badge.icon;

  return (
    <Tooltip text={unlocked ? `✅ ${badge.name} — Unlocked!` : `🔒 ${badge.description}`}>
      <motion.div
        variants={badgeVariants}
        whileHover={unlocked ? { scale: 1.08, y: -4 } : { scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        className={`flex flex-col items-center gap-3 p-5 rounded-2xl transition-all cursor-default
          ${unlocked
            ? `glass-card border border-white/10 ${badge.glowColor} shadow-lg`
            : 'bg-white/[0.02] border border-white/5'
          }`}
        tabIndex={0}
        role="listitem"
        aria-label={`${badge.name}: ${unlocked ? 'Unlocked' : 'Locked — ' + badge.description}`}
      >
        {/* Icon circle */}
        <div className="relative">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ring-2 transition-all
              ${unlocked
                ? `bg-gradient-to-br ${badge.gradient} ${badge.bgRing} shadow-lg ${badge.glowColor}`
                : 'bg-white/5 ring-white/10 grayscale opacity-40'
              }`}
          >
            <Icon className={`w-7 h-7 ${unlocked ? 'text-white' : 'text-gray-500'}`} />
          </div>

          {/* Lock / check overlay */}
          <div
            className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center
              ${unlocked
                ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30'
                : 'bg-dark-800 border border-white/10'
              }`}
          >
            {unlocked ? (
              <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
            ) : (
              <Lock className="w-3 h-3 text-gray-500" />
            )}
          </div>
        </div>

        {/* Badge name */}
        <span
          className={`text-sm font-semibold text-center leading-tight ${
            unlocked ? 'text-white' : 'text-gray-600'
          }`}
        >
          {badge.name}
        </span>
      </motion.div>
    </Tooltip>
  );
};

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */
const AchievementBadges = ({ achievements = [] }) => {
  // Determine which badges are unlocked
  const unlockedSet = new Set(
    achievements.length > 0
      ? achievements.map((a) => (typeof a === 'string' ? a : a.id))
      : // Mock data: first 2 unlocked for demo
        ['resume-completed', 'ai-optimized']
  );

  return (
    <div className="w-full" role="list" aria-label="Achievement badges">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-3 gap-4"
      >
        {BADGE_DEFS.map((badge) => (
          <BadgeCard
            key={badge.id}
            badge={badge}
            unlocked={unlockedSet.has(badge.id)}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default AchievementBadges;
