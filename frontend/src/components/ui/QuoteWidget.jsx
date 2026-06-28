import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Quotes                                                             */
/* ------------------------------------------------------------------ */
const QUOTES = [
  'Your resume is your first impression — make it unforgettable.',
  'Every expert was once a beginner with a great resume.',
  'The only way to do great work is to love what you do.',
  'Your career is a marathon, not a sprint.',
  'A well-crafted resume opens doors to opportunities.',
  'Success is where preparation meets opportunity.',
  'Dream big. Start small. Act now.',
  "Opportunities don't happen — you create them.",
  'Your skills are the currency of the modern workplace.',
  'The best investment you can make is in yourself.',
  'Great careers are built one thoughtful step at a time.',
  'A resume tells your story — make it a page-turner.',
  'Innovation distinguishes between a leader and a follower.',
  "Hard work beats talent when talent doesn't work hard.",
  'Your next opportunity is one resume away.',
  "Be so good they can't ignore you.",
  'The future belongs to those who prepare for it today.',
  "Believe you can and you're halfway there.",
  'Clarity of purpose is the foundation of a great career.',
  'Craft your career story with intention and authenticity.',
  'Your potential is limitless when you commit to growth.',
  'Every accomplishment starts with the decision to try.',
  'Stand out by being genuine, not generic.',
  "Confidence comes from preparation — start with your resume.",
];

const ROTATE_INTERVAL = 8000;

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */
const fadeVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.35 } },
};

/* ------------------------------------------------------------------ */
/*  Variant-specific styles                                            */
/* ------------------------------------------------------------------ */
const variantStyles = {
  sidebar: {
    wrapper: 'text-left px-4 py-3',
    text: 'text-xs text-gray-400 leading-relaxed',
    icon: 14,
    iconClass: 'text-brand-400/60 mb-1',
  },
  inline: {
    wrapper: 'text-center px-6 py-5',
    text: 'text-base md:text-lg text-gray-200 leading-relaxed font-light italic',
    icon: 22,
    iconClass: 'text-brand-400 mx-auto mb-3',
  },
  footer: {
    wrapper: 'text-center px-4 py-2',
    text: 'text-[11px] text-gray-500 italic leading-snug',
    icon: 12,
    iconClass: 'text-gray-600 mx-auto mb-1',
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
const QuoteWidget = ({ variant = 'inline' }) => {
  const [index, setIndex] = useState(() =>
    Math.floor(Math.random() * QUOTES.length)
  );

  const next = useCallback(() => {
    setIndex((prev) => (prev + 1) % QUOTES.length);
  }, []);

  useEffect(() => {
    const id = setInterval(next, ROTATE_INTERVAL);
    return () => clearInterval(id);
  }, [next]);

  const s = variantStyles[variant] || variantStyles.inline;

  return (
    <div
      className={`relative overflow-hidden select-none ${s.wrapper}`}
      aria-live="polite"
      aria-atomic="true"
    >
      <Quote className={s.iconClass} size={s.icon} />

      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          variants={fadeVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className={s.text}
        >
          {variant === 'inline' && (
            <span className="text-brand-400 mr-1">&ldquo;</span>
          )}
          {QUOTES[index]}
          {variant === 'inline' && (
            <span className="text-brand-400 ml-1">&rdquo;</span>
          )}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};

export default QuoteWidget;
