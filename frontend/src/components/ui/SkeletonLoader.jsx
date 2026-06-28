import { motion } from 'framer-motion';

/* ------------------------------------------------------------------ */
/*  Shared shimmer keyframes injected once via a tiny <style> tag      */
/* ------------------------------------------------------------------ */
const shimmerCSS = `
@keyframes skeletonShimmer {
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
`;

const ShimmerStyle = () => <style>{shimmerCSS}</style>;

/* ------------------------------------------------------------------ */
/*  Base shimmer bar                                                   */
/* ------------------------------------------------------------------ */
const shimmerBg = {
  backgroundImage:
    'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)',
  backgroundSize: '400px 100%',
  animation: 'skeletonShimmer 1.6s ease-in-out infinite',
};

/* ------------------------------------------------------------------ */
/*  SkeletonLine                                                       */
/* ------------------------------------------------------------------ */
export const SkeletonLine = ({
  width = '100%',
  height = '0.75rem',
  rounded = 'rounded',
  className = '',
}) => (
  <>
    <ShimmerStyle />
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`bg-white/5 ${rounded} ${className}`}
      style={{ width, height, ...shimmerBg }}
      aria-hidden="true"
    />
  </>
);

/* ------------------------------------------------------------------ */
/*  SkeletonAvatar                                                     */
/* ------------------------------------------------------------------ */
export const SkeletonAvatar = ({ size = 48, className = '' }) => (
  <>
    <ShimmerStyle />
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-full bg-white/5 shrink-0 ${className}`}
      style={{ width: size, height: size, ...shimmerBg }}
      aria-hidden="true"
    />
  </>
);

/* ------------------------------------------------------------------ */
/*  SkeletonCard                                                       */
/* ------------------------------------------------------------------ */
export const SkeletonCard = ({ lines = 3, hasAvatar = false, className = '' }) => (
  <>
    <ShimmerStyle />
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`glass-card rounded-2xl p-6 space-y-4 ${className}`}
      aria-label="Loading content"
      role="status"
    >
      {hasAvatar && (
        <div className="flex items-center gap-3">
          <SkeletonAvatar size={40} />
          <div className="flex-1 space-y-2">
            <SkeletonLine width="50%" height="0.65rem" />
            <SkeletonLine width="30%" height="0.5rem" />
          </div>
        </div>
      )}

      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine
          key={i}
          width={i === lines - 1 ? '60%' : '100%'}
          height="0.65rem"
        />
      ))}
    </motion.div>
  </>
);

/* ------------------------------------------------------------------ */
/*  SkeletonTable                                                      */
/* ------------------------------------------------------------------ */
export const SkeletonTable = ({ rows = 5, cols = 4, className = '' }) => (
  <>
    <ShimmerStyle />
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className={`glass-card rounded-2xl overflow-hidden ${className}`}
      aria-label="Loading table"
      role="status"
    >
      {/* Header row */}
      <div
        className="grid gap-4 px-6 py-4 border-b border-white/5"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {Array.from({ length: cols }).map((_, i) => (
          <SkeletonLine key={`h-${i}`} height="0.6rem" width="70%" />
        ))}
      </div>

      {/* Body rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          className="grid gap-4 px-6 py-3.5 border-b border-white/[0.03] last:border-0"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {Array.from({ length: cols }).map((_, c) => (
            <SkeletonLine
              key={`${r}-${c}`}
              height="0.55rem"
              width={c === 0 ? '85%' : '60%'}
            />
          ))}
        </div>
      ))}
    </motion.div>
  </>
);
