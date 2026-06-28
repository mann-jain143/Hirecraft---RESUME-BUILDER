import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Palette,
  Sparkles,
  User,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Nav items                                                          */
/* ------------------------------------------------------------------ */
const NAV_ITEMS = [
  { label: 'Home', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Builder', icon: FileText, path: '/builder' },
  { label: 'Templates', icon: Palette, path: '/templates' },
  { label: 'AI', icon: Sparkles, path: '/interview-prep' },
  { label: 'Profile', icon: User, path: '/settings' },
];

/** Routes where the mobile nav should be hidden */
const HIDDEN_ROUTES = ['/login', '/register', '/signup', '/signin'];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
const MobileNavigation = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  /* Hide on auth pages */
  if (HIDDEN_ROUTES.some((r) => pathname.toLowerCase().startsWith(r))) {
    return null;
  }

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-50 md:hidden
                 border-t border-white/10 bg-dark-900/80 backdrop-blur-xl
                 safe-bottom"
    >
      <ul className="flex items-center justify-around px-1">
        {NAV_ITEMS.map(({ label, icon: Icon, path }) => {
          const isActive = pathname.startsWith(path);

          return (
            <li key={path} className="flex-1">
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={() => navigate(path)}
                aria-label={label}
                aria-current={isActive ? 'page' : undefined}
                className={`relative flex flex-col items-center justify-center gap-0.5
                            w-full min-h-[56px] py-2 text-[10px] font-medium
                            transition-colors focus-visible:outline-none
                            ${
                              isActive
                                ? 'text-brand-400'
                                : 'text-gray-500 hover:text-gray-300'
                            }`}
              >
                {/* Active pill indicator */}
                {isActive && (
                  <motion.span
                    layoutId="mobile-nav-indicator"
                    className="absolute -top-px left-1/2 h-[3px] w-8 -translate-x-1/2
                               rounded-full bg-brand-500 shadow-[0_0_10px_rgba(99,102,241,0.6)]"
                    transition={{ type: 'spring', damping: 28, stiffness: 380 }}
                  />
                )}

                <Icon size={22} strokeWidth={isActive ? 2.2 : 1.6} />
                <span>{label}</span>
              </motion.button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default MobileNavigation;
