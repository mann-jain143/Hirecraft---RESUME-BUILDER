import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const completionRules = [
  { key: 'personalInfo.fullName', weight: 10, label: 'Full Name' },
  { key: 'personalInfo.email', weight: 5, label: 'Email' },
  { key: 'personalInfo.phone', weight: 5, label: 'Phone' },
  { key: 'personalInfo.jobTitle', weight: 5, label: 'Job Title' },
  { key: 'personalInfo.location', weight: 5, label: 'Location' },
  { key: 'summary', weight: 15, label: 'Summary' },
  { key: 'experience', weight: 15, label: 'Experience' },
  { key: 'education', weight: 15, label: 'Education' },
  { key: 'skills', weight: 10, label: 'Skills' },
  { key: 'projects', weight: 10, label: 'Projects' },
  { key: 'certifications', weight: 3, label: 'Certifications' },
  { key: 'achievements', weight: 2, label: 'Achievements' },
];

const getNestedValue = (obj, path) => {
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
};

const isFilled = (value) => {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'string') return value.trim().length > 0;
  return !!value;
};

const getColorClasses = (pct) => {
  if (pct <= 33) return { bar: 'from-red-500 to-rose-500', text: 'text-red-500 dark:text-red-400', bg: 'bg-red-500/10' };
  if (pct <= 66) return { bar: 'from-amber-500 to-yellow-500', text: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-500/10' };
  return { bar: 'from-emerald-500 to-green-500', text: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-500/10' };
};

const getMessage = (pct) => {
  if (pct === 0) return 'Start building your resume';
  if (pct <= 20) return 'Just getting started…';
  if (pct <= 40) return 'Good start, keep going!';
  if (pct <= 60) return 'Halfway there!';
  if (pct <= 80) return 'Looking great!';
  if (pct < 100) return 'Almost complete!';
  return 'Resume complete! 🎉';
};

const ProgressBar = ({ resumeData }) => {
  const { percentage, filledCount } = useMemo(() => {
    if (!resumeData) return { percentage: 0, filledCount: 0 };

    let total = 0;
    let filled = 0;

    completionRules.forEach(({ key, weight }) => {
      const value = getNestedValue(resumeData, key);
      if (isFilled(value)) {
        total += weight;
        filled += 1;
      } else {
        total += 0;
      }
    });

    // Sum all weights for the denominator
    const maxWeight = completionRules.reduce((sum, r) => sum + r.weight, 0);
    const pct = Math.round(
      completionRules.reduce((sum, { key, weight }) => {
        const value = getNestedValue(resumeData, key);
        return sum + (isFilled(value) ? weight : 0);
      }, 0) / maxWeight * 100
    );

    return { percentage: pct, filledCount: filled };
  }, [resumeData]);

  const colors = getColorClasses(percentage);
  const message = getMessage(percentage);

  return (
    <div className="w-full" role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100} aria-label={`Resume completion: ${percentage}%`}>
      {/* Header row */}
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {message}
        </span>
        <motion.span
          key={percentage}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`text-xs font-bold tabular-nums ${colors.text}`}
        >
          {percentage}%
        </motion.span>
      </div>

      {/* Track */}
      <div className="relative h-2 rounded-full bg-slate-200 dark:bg-slate-700/60 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${colors.bar}`}
        >
          {/* Shimmer effect */}
          {percentage > 0 && percentage < 100 && (
            <div className="absolute inset-0 overflow-hidden rounded-full">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            </div>
          )}
        </motion.div>
      </div>

      {/* Sections count */}
      <div className="mt-1">
        <span className="text-[10px] text-slate-400 dark:text-slate-500">
          {filledCount}/{completionRules.length} sections filled
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;
