import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, Cloud, CloudOff, Check, Loader2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import HireCraftLogo from './HireCraftLogo';

const syncLabels = {
  idle: null,
  pending: { icon: Cloud, text: 'Unsaved changes...', className: 'text-slate-400' },
  syncing: { icon: Loader2, text: 'Cloud Syncing...', className: 'text-indigo-400 animate-spin' },
  saved: { icon: Check, text: 'All changes saved', className: 'text-emerald-400' },
  error: { icon: CloudOff, text: 'Sync failed', className: 'text-red-400' },
};

const Navbar = ({ syncStatus = 'idle' }) => {
  const { user, logout } = useContext(AuthContext);
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const sync = syncLabels[syncStatus];

  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard">
            <HireCraftLogo />
          </Link>

          <div className="flex items-center gap-3">
            {sync && (
              <div className={`hidden sm:flex items-center gap-1.5 text-xs font-medium ${sync.className}`}>
                <sync.icon className={`w-3.5 h-3.5 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                {sync.text}
              </div>
            )}

            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <span className="text-slate-600 dark:text-slate-300 hidden md:block text-sm">
              Hello, <span className="text-slate-900 dark:text-white font-semibold">{user?.name}</span>
            </span>

            <button
              type="button"
              onClick={() => { logout(); navigate('/login'); }}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
