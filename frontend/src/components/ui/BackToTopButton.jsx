import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

const SCROLL_THRESHOLD = 300;

const BackToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > SCROLL_THRESHOLD);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    /* Check on mount in case the page is already scrolled */
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="back-to-top"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          whileHover={{
            scale: 1.12,
            boxShadow: '0 0 24px rgba(99,102,241,0.45)',
          }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center
                     rounded-full border border-white/10 bg-brand-500/90 text-white
                     shadow-lg shadow-brand-500/20 backdrop-blur-md
                     transition-colors hover:bg-brand-400
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/60
                     md:bottom-8 md:right-8"
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTopButton;
