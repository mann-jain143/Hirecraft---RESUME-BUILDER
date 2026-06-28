import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, Moon, Cloud, CloudOff, Check, Loader2, Palette, Droplet, Leaf, 
  Sparkles, ChevronDown, Bell, Menu, X, Search, LogOut, Settings, 
  User, Briefcase, Shield, Activity, FileText, Globe, CreditCard, 
  Users, Key, Laptop, MessageSquare, Target, Map, Award, HelpCircle,
  GraduationCap, BarChart3
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import CommandPalette from './ui/CommandPalette';
import HireCraftLogo from './HireCraftLogo';
import API from '../utils/api';
import toast from 'react-hot-toast';

const syncLabels = {
  idle: null,
  pending: { icon: Cloud, text: 'Unsaved changes...', className: 'text-slate-400' },
  syncing: { icon: Loader2, text: 'Cloud Syncing...', className: 'text-indigo-400 animate-spin' },
  saved: { icon: Check, text: 'All changes saved', className: 'text-emerald-400' },
  error: { icon: CloudOff, text: 'Sync failed', className: 'text-red-400' },
};

const themeMeta = {
  auto: { label: 'Auto Mode', icon: Laptop, color: 'text-indigo-500 dark:text-indigo-400' },
  dark: { label: 'Dark Mode', icon: Moon, color: 'text-violet-500 dark:text-violet-400' },
  light: { label: 'Light Mode', icon: Sun, color: 'text-amber-500' },
};

export default function Navbar({ syncStatus = 'idle' }) {
  const { user, originalRole, switchRole, logout } = useContext(AuthContext);
  const { theme, setTheme, themes } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [switchingTo, setSwitchingTo] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
  const [beginnerMode, setBeginnerMode] = useState(
    localStorage.getItem('hirecraftt-beginner-mode') === 'true'
  );

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleBeginnerMode = () => {
    const newValue = !beginnerMode;
    setBeginnerMode(newValue);
    localStorage.setItem('hirecraftt-beginner-mode', String(newValue));
    window.dispatchEvent(new CustomEvent('beginner-mode-change', { detail: newValue }));
    toast.success(newValue ? 'Beginner Mode Enabled! Helpful tips will be shown.' : 'Beginner Mode Disabled.');
  };

  const themeRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const roleRef = useRef(null);

  const sync = syncLabels[syncStatus];
  const ActiveIcon = themeMeta[theme]?.icon || Laptop;
  const activeColor = themeMeta[theme]?.color || 'text-slate-400';

  // Determine if sidebar should be shown
  const showSidebar = user && 
    !['/', '/login', '/register', '/forgot-password'].includes(location.pathname) && 
    !location.pathname.startsWith('/reset-password') && 
    !location.pathname.startsWith('/u/') && 
    !location.pathname.startsWith('/shared/') && 
    !location.pathname.startsWith('/builder');

  useEffect(() => {
    if (showSidebar) {
      document.body.classList.add('has-sidebar');
    } else {
      document.body.classList.remove('has-sidebar');
    }
    return () => {
      document.body.classList.remove('has-sidebar');
    };
  }, [showSidebar]);

  useEffect(() => {
    if (showSidebar && isSidebarHovered && isLargeScreen) {
      document.body.classList.add('sidebar-expanded');
    } else {
      document.body.classList.remove('sidebar-expanded');
    }
    return () => {
      document.body.classList.remove('sidebar-expanded');
    };
  }, [showSidebar, isSidebarHovered, isLargeScreen]);

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const { data } = await API.get('/notifications');
      setNotifications(data);
    } catch {
      console.warn('Failed to fetch notifications');
    }
  };

  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch {
      console.warn('Failed to mark read');
    }
  };

  const markAllRead = async () => {
    try {
      await API.put('/notifications/read-all');
      fetchNotifications();
    } catch {
      console.warn('Failed to mark all read');
    }
  };

  const handleWorkspaceSwitch = async (roleId, displayName) => {
    setShowRoleModal(false);
    setSwitchingTo(displayName);
    
    try {
      const result = await switchRole(roleId);
      if (result.success) {
        toast.success(`Welcome to the ${displayName} Workspace!`);
        // Navigate to dashboard since all roles load their dashboard components under /dashboard
        navigate('/dashboard');
      } else {
        toast.error(result.error || 'Failed to switch workspace');
      }
    } catch (err) {
      toast.error('Failed to switch workspace');
    } finally {
      setSwitchingTo(null);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (themeRef.current && !themeRef.current.contains(e.target)) setThemeMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifMenuOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileMenuOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Define sidebar menu options based on role
  const isItemActive = (itemPath) => {
    const currentPath = location.pathname;
    
    if (itemPath.includes('?tab=')) {
      const [path, query] = itemPath.split('?');
      const tabName = new URLSearchParams(query).get('tab');
      const activeTab = new URLSearchParams(location.search).get('tab') || 'overview';
      return currentPath === path && activeTab === tabName;
    }

    if (itemPath === '/builder/new') {
      return currentPath.startsWith('/builder') || currentPath.startsWith('/templates') || currentPath.startsWith('/import');
    }

    if (itemPath === '/interview-prep') {
      return currentPath.startsWith('/interview-prep') || currentPath.startsWith('/roadmap') || currentPath.startsWith('/projects');
    }

    return currentPath === itemPath;
  };

  const getSidebarMenu = () => {
    const role = user?.role || 'USER';
    
    if (role === 'SUPER_ADMIN') {
      return [
        {
          group: 'Super Admin',
          items: [
            { label: 'Everything', path: '/dashboard?tab=overview', icon: Laptop },
            { label: 'Users', path: '/dashboard?tab=users', icon: Users },
            { label: 'AI', path: '/dashboard?tab=ai', icon: Sparkles },
            { label: 'System', path: '/dashboard?tab=invites', icon: Key },
            { label: 'Activities', path: '/dashboard?tab=activities', icon: Activity },
            { label: 'Logs', path: '/dashboard?tab=audit', icon: Shield },
            { label: 'Analytics', path: '/dashboard?tab=overview', icon: BarChart3 },
            { label: 'Management', path: '/settings', icon: Settings },
          ]
        }
      ];
    }

    if (role === 'ADMIN') {
      return [
        {
          group: 'Admin View',
          items: [
            { label: 'Users', path: '/admin?tab=users', icon: Users },
            { label: 'Reports', path: '/admin?tab=reports', icon: Shield },
            { label: 'Analytics', path: '/admin?tab=analytics', icon: Activity },
            { label: 'Settings', path: '/settings', icon: Settings },
          ]
        }
      ];
    }

    // Default USER menu
    return [
      {
        group: 'User View',
        items: [
          { label: 'Dashboard', path: '/dashboard', icon: Laptop },
          { label: 'Resume Builder', path: '/builder/new', icon: FileText },
          { label: 'Portfolio Builder', path: '/portfolio', icon: Globe },
          { label: 'AI Coach', path: '/interview-prep', icon: Sparkles },
          { label: 'Cover Letter', path: '/cover-letter', icon: MessageSquare },
          { label: 'ATS Check', path: '/job-match', icon: Shield },
          { label: 'Applications', path: '/tracker', icon: Briefcase },
          { label: 'Placement Prep', path: '/placement-prep', icon: Award },
          { label: 'Settings', path: '/settings', icon: Settings },
        ]
      }
    ];
  };

  const menuGroups = getSidebarMenu();

  return (
    <>
      {/* Top Navbar */}
      <nav className="bg-white/80 dark:bg-dark-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 fixed top-0 w-full z-50 h-16 transition-colors duration-300">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4">
          
          {/* Left: Logo & Mobile Toggle */}
          <div className="flex items-center gap-3">
            {showSidebar && (
              <button
                onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                className="p-1.5 md:hidden hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/5 text-slate-500 dark:text-slate-400 rounded-lg transition"
              >
                {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
            <Link to="/dashboard" className="flex items-center">
              <HireCraftLogo className="w-8 h-8" />
            </Link>

            {/* Main Links */}
            {user && user.role !== 'ADMIN' && (
              <div className="hidden lg:flex items-center gap-1.5 ml-6 pl-6 border-l border-slate-200 dark:border-white/10 text-xs font-semibold">
                <Link to="/dashboard" className="px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition">Dashboard</Link>
                <Link to="/builder/new" className="px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition">Resume Builder</Link>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('open-career-coach'))}
                  className="px-3 py-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition flex items-center gap-1 font-bold"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Coach
                </button>
              </div>
            )}
          </div>

          {/* Center: Search Trigger */}
          {user && (
            <div className="flex-1 max-w-[240px] hidden sm:block relative">
              <CommandPalette />
            </div>
          )}

          {/* Right Controls */}
          <div className="flex items-center gap-2.5 md:gap-3.5">
            
            {/* Sync State */}
            {sync && (
              <div className={`hidden lg:flex items-center gap-1.5 text-xs font-medium ${sync.className}`}>
                <sync.icon className="w-3.5 h-3.5" />
                <span>{sync.text}</span>
              </div>
            )}

            {/* Notifications */}
            {user && (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotifMenuOpen(!notifMenuOpen)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/5 text-slate-500 dark:text-slate-400 rounded-lg transition relative"
                >
                  <Bell className="w-5 h-5" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-dark-900" />
                  )}
                </button>
                
                <AnimatePresence>
                  {notifMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-800 border border-slate-200 dark:border-white/5 rounded-xl shadow-2xl z-50 overflow-hidden"
                    >
                      <div className="p-4 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50 dark:bg-white/[0.02]">
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">Notifications</h3>
                        <button onClick={markAllRead} className="text-[10px] font-bold text-indigo-500 hover:text-indigo-600 uppercase tracking-widest">Mark all read</button>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                           <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-xs font-semibold">No notifications</div>
                        ) : (
                          notifications.map(n => (
                            <div 
                              key={n._id} 
                              onClick={() => !n.read && markAsRead(n._id)}
                              className={`p-4 border-b border-slate-100 dark:border-white/5 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 transition ${!n.read ? 'bg-indigo-500/5' : ''}`}
                            >
                              <div className="space-y-1">
                                <h4 className={`text-xs ${!n.read ? 'font-bold text-slate-900 dark:text-white' : 'font-semibold text-slate-700 dark:text-slate-300'}`}>{n.title}</h4>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">{n.message}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Student Beginner Mode Toggle (hidden on mobile) */}
            {user && (
              <button
                onClick={toggleBeginnerMode}
                className={`hidden lg:flex p-2 rounded-lg border transition items-center justify-center relative cursor-pointer ${
                  beginnerMode 
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 shadow-glow-amber' 
                    : 'hover:bg-slate-100 dark:hover:bg-white/5 border-transparent hover:border-slate-200 dark:hover:border-white/5 text-slate-500 dark:text-slate-400'
                }`}
                title="Toggle Student Beginner Mode"
              >
                <GraduationCap className="w-5 h-5 animate-pulse" style={{ animationDuration: '4s' }} />
                {beginnerMode && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-dark-900" />
                )}
              </button>
            )}

            {/* Appearance Selector (hidden on mobile) */}
            <div className="hidden lg:block relative" ref={themeRef}>
              <button
                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/5 rounded-lg text-slate-500 dark:text-slate-400 transition flex items-center gap-0.5"
                title="Appearance Settings"
              >
                <ActiveIcon className={`w-5 h-5 ${activeColor}`} />
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              
              <AnimatePresence>
                {themeMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-72 bg-white dark:bg-dark-800 border border-slate-200 dark:border-white/5 rounded-2xl shadow-2xl z-50 p-2 space-y-1.5"
                  >
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01] rounded-t-xl mb-1.5">
                      <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Appearance</span>
                    </div>

                    {[
                      {
                        id: 'auto',
                        title: 'Auto',
                        recommended: true,
                        desc: 'Follow your device theme automatically.',
                        icon: Laptop,
                        color: 'text-indigo-500 dark:text-indigo-400 bg-indigo-500/10'
                      },
                      {
                        id: 'dark',
                        title: 'Dark',
                        desc: 'Premium dark workspace.',
                        icon: Moon,
                        color: 'text-violet-500 dark:text-violet-400 bg-violet-500/10'
                      },
                      {
                        id: 'light',
                        title: 'Light',
                        desc: 'Clean professional workspace.',
                        icon: Sun,
                        color: 'text-amber-500 bg-amber-500/10'
                      }
                    ].map(option => {
                      const Icon = option.icon;
                      const active = theme === option.id;
                      return (
                        <button
                          key={option.id}
                          onClick={() => { setTheme(option.id); setThemeMenuOpen(false); }}
                          className={`w-full p-2.5 rounded-xl text-left transition flex items-start gap-3 border ${
                            active 
                              ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold' 
                              : 'bg-transparent border-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-white/5'
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${option.color} flex-shrink-0`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1 space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold">{option.title}</span>
                              {option.recommended && (
                                <span className="text-[9px] font-black bg-indigo-500/20 text-indigo-500 px-1.5 py-0.5 rounded-md uppercase tracking-wider scale-90">
                                  Recommended
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold leading-snug">
                              {option.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Super Admin Viewing As Pill */}
            {user && originalRole === 'SUPER_ADMIN' && (
              <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 text-[10px] font-black rounded-full uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                Current View: {user?.role === 'SUPER_ADMIN' ? '👑 Super Admin View' : user?.role === 'ADMIN' ? '🛡 Admin View' : '👤 User View'}
              </div>
            )}

            {/* Profile Dropdown with avatar, settings, workspace swappers */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-1.5 p-1 hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/5 rounded-xl transition cursor-pointer select-none"
                >
                  <div className="w-8 h-8 rounded-full border border-indigo-500/20 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold flex items-center justify-center text-sm shadow-md overflow-hidden flex-shrink-0">
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="hidden sm:block text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">{user.name}</span>
                  <span className={`hidden lg:inline-block px-2 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-wider ${
                    originalRole === 'SUPER_ADMIN' 
                      ? 'bg-purple-500/15 text-purple-400 border border-purple-500/20' 
                      : user.role === 'ADMIN' 
                        ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                        : 'bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300'
                  }`}>
                    {originalRole === 'SUPER_ADMIN' ? 'OWNER' : user.role === 'ADMIN' ? 'Admin' : 'User'}
                  </span>
                  <ChevronDown className="hidden sm:block w-3.5 h-3.5 text-slate-400" />
                </button>
 
                <AnimatePresence>
                  {profileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-800 border border-slate-200 dark:border-white/5 rounded-2xl shadow-2xl z-50 py-1.5"
                    >
                      <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5 flex flex-col gap-2.5 bg-slate-50 dark:bg-white/[0.02]">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full border border-indigo-500/20 bg-indigo-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md overflow-hidden flex-shrink-0">
                            {user.profilePicture ? (
                              <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                              user.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-950 dark:text-white truncate">{user.name}</p>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold mt-0.5">
                              Role: {originalRole === 'SUPER_ADMIN' ? 'Super Admin' : user.role === 'ADMIN' ? 'Admin' : 'User'}
                            </span>
                          </div>
                        </div>
                        {originalRole === 'SUPER_ADMIN' && (
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold border-t border-slate-200/50 dark:border-white/5 pt-1.5 flex items-center gap-1">
                            <span>Current View:</span>
                            <span className="text-indigo-500 dark:text-indigo-400 font-black">
                              {user.role === 'SUPER_ADMIN' ? '👑 Super Admin View' : user.role === 'ADMIN' ? '🛡 Admin View' : '👤 User View'}
                            </span>
                          </div>
                        )}
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-950 dark:hover:text-white transition"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>Profile</span>
                      </Link>

                      {/* Current Role (Display ONLY) */}
                      <div className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-white/5">
                        <Shield className="w-4 h-4 text-slate-400" />
                        <span>
                          Current Role: {user.role === 'SUPER_ADMIN' ? 'Super Admin' : user.role === 'ADMIN' ? 'Admin' : 'User'}
                        </span>
                      </div>

                      {/* Switch Workspace View options for Owner */}
                      {originalRole === 'SUPER_ADMIN' && (
                        <div className="border-t border-slate-100 dark:border-white/5 my-1">
                          <div className="px-4 py-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                            Switch Workspace
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setProfileMenuOpen(false);
                              handleWorkspaceSwitch('SUPER_ADMIN', 'Super Admin');
                            }}
                            className={`w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold transition text-left cursor-pointer ${
                              user.role === 'SUPER_ADMIN'
                                ? 'text-indigo-500 dark:text-indigo-400 bg-indigo-500/5 font-bold'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-950 dark:hover:text-white'
                            }`}
                          >
                            <span>👑</span>
                            <span>Super Admin View</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setProfileMenuOpen(false);
                              handleWorkspaceSwitch('ADMIN', 'Admin');
                            }}
                            className={`w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold transition text-left cursor-pointer ${
                              user.role === 'ADMIN'
                                ? 'text-indigo-500 dark:text-indigo-400 bg-indigo-500/5 font-bold'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-950 dark:hover:text-white'
                            }`}
                          >
                            <span>🛡</span>
                            <span>Admin View</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setProfileMenuOpen(false);
                              handleWorkspaceSwitch('USER', 'User');
                            }}
                            className={`w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold transition text-left cursor-pointer ${
                              user.role === 'USER'
                                ? 'text-indigo-500 dark:text-indigo-400 bg-indigo-500/5 font-bold'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-950 dark:hover:text-white'
                            }`}
                          >
                            <span>👤</span>
                            <span>User View</span>
                          </button>
                        </div>
                      )}

                      <Link
                        to="/settings"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-950 dark:hover:text-white transition border-t border-slate-100 dark:border-white/5"
                      >
                        <Settings className="w-4 h-4 text-slate-400" />
                        <span>Settings</span>
                      </Link>

                      <div className="border-t border-slate-100 dark:border-white/5 my-1" />

                      <button
                        type="button"
                        onClick={() => {
                          setProfileMenuOpen(false);
                          logout();
                          navigate('/login');
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-500/10 transition text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-white/5 rounded-lg transition">Login</Link>
                <Link to="/register" className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition shadow-md">Sign Up</Link>
              </div>
            )}

          </div>
        </div>
      </nav>

      {/* Sidebar System (Desktop & Tablet) */}
      {showSidebar && (
        <aside 
          onMouseEnter={() => setIsSidebarHovered(true)}
          onMouseLeave={() => setIsSidebarHovered(false)}
          style={{ width: (isLargeScreen && isSidebarHovered) ? '260px' : '80px' }}
          className="hidden md:flex flex-col bg-[#0c0a24]/60 backdrop-blur-xl border-r border-slate-200 dark:border-white/10 fixed left-0 top-16 h-[calc(100vh-4rem)] z-40 p-4 justify-between select-none transition-[width] duration-300 ease-in-out overflow-hidden"
        >
          <div className="space-y-6 overflow-y-auto no-scrollbar">
            {menuGroups.map((group, groupIdx) => {
              const isExpanded = isLargeScreen && isSidebarHovered;
              return (
                <div key={groupIdx} className="space-y-1.5">
                  {isExpanded ? (
                    <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2 transition-all duration-300">
                      {group.group}
                    </h4>
                  ) : (
                    groupIdx > 0 && <div className="border-t border-slate-200 dark:border-white/10 my-3 transition-all duration-300" />
                  )}
                  <div className="space-y-0.5">
                    {group.items.map((item, itemIdx) => {
                      const Icon = item.icon;
                      const isActive = isItemActive(item.path);
                      return (
                        <Link
                          key={itemIdx}
                          to={item.path}
                          title={!isExpanded ? item.label : undefined}
                          className={`relative flex items-center rounded-xl text-xs font-semibold transition-all duration-300 transform active:scale-95 ${
                            isExpanded ? 'justify-start pl-4 pr-3 py-2.5 gap-3' : 'justify-center py-2.5 w-10 mx-auto'
                          } ${
                            isActive 
                              ? 'hc-sidebar-active bg-gradient-to-r from-[#6366F1] to-[#7C3AED] text-white shadow-lg shadow-indigo-500/25 scale-102 font-bold' 
                              : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                          }`}
                        >
                          {isActive && (
                            <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-white" />
                          )}
                          <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                          {isExpanded && (
                            <motion.span
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              transition={{ duration: 0.2 }}
                              className="whitespace-nowrap"
                            >
                              {item.label}
                            </motion.span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-white/5 pt-4 flex flex-col gap-3">
            {/* User Profile Block */}
            {(isLargeScreen && isSidebarHovered) ? (
              <div className="flex items-center gap-2.5 px-2 py-1 bg-white/5 border border-white/5 rounded-xl">
                <div className="relative w-8 h-8 rounded-full bg-indigo-600 border border-white/10 flex-shrink-0 flex items-center justify-center text-white text-xs font-black overflow-hidden select-none">
                  {user?.profilePicture ? (
                    <img src={user.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span>{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">{user?.name}</span>
                  <span className="text-[9px] text-slate-500 block truncate">{user?.email}</span>
                </div>
              </div>
            ) : (
              <div className="flex justify-center" title={user?.name}>
                <div className="relative w-8 h-8 rounded-full bg-indigo-600 border border-white/10 flex items-center justify-center text-white text-xs font-black overflow-hidden select-none">
                  {user?.profilePicture ? (
                    <img src={user.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span>{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                  )}
                </div>
              </div>
            )}

            {(isLargeScreen && isSidebarHovered) ? (
              <div className="bg-gradient-to-r from-indigo-950 to-indigo-900 border border-indigo-500/10 rounded-xl p-3 flex items-center justify-between gap-2 shadow-inner transition-all duration-300">
                <div className="space-y-0.5">
                  <span className="text-[9px] uppercase tracking-wider text-indigo-400 font-bold block">Assigned Role</span>
                  <span className="text-[11px] font-bold text-white block capitalize">{user?.role}</span>
                </div>
                <Shield className="w-5 h-5 text-indigo-400 opacity-80" />
              </div>
            ) : (
              <div className="flex justify-center p-2.5 bg-gradient-to-r from-indigo-950 to-indigo-900 border border-indigo-500/10 rounded-xl text-indigo-400 transition-all duration-300" title={`Assigned Role: ${user?.role}`}>
                <Shield className="w-4 h-4" />
              </div>
            )}
          </div>
        </aside>
      )}

      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {showSidebar && isMobileSidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden flex">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            {/* Sidebar drawer content */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-64 bg-slate-900 h-full p-5 flex flex-col justify-between z-50 border-r border-white/5 select-none"
            >
              <div className="space-y-6 overflow-y-auto no-scrollbar pt-12">
                {menuGroups.map((group, groupIdx) => (
                  <div key={groupIdx} className="space-y-1.5">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">{group.group}</h4>
                    <div className="space-y-0.5">
                      {group.items.map((item, itemIdx) => {
                        const Icon = item.icon;
                        const isActive = isItemActive(item.path);
                        return (
                          <Link
                            key={itemIdx}
                            to={item.path}
                            onClick={() => setIsMobileSidebarOpen(false)}
                            className={`relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition transform active:scale-95 ${
                              isActive 
                                ? 'hc-sidebar-active bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 font-bold' 
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            {isActive && (
                              <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-white" />
                            )}
                            <Icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/5 pt-4 flex flex-col gap-3">
                {/* User Profile Block */}
                <div className="flex items-center gap-2.5 px-2 py-1 bg-white/5 border border-white/5 rounded-xl">
                  <div className="relative w-8 h-8 rounded-full bg-indigo-600 border border-white/10 flex-shrink-0 flex items-center justify-center text-white text-xs font-black overflow-hidden select-none">
                    {user?.profilePicture ? (
                      <img src={user.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span>{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">{user?.name}</span>
                    <span className="text-[9px] text-slate-500 dark:text-slate-400 block truncate">{user?.email}</span>
                  </div>
                </div>
 
                <div className="bg-slate-950 border border-white/5 rounded-xl p-3 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block">Assigned Role</span>
                    <span className="text-[11px] font-bold text-white block capitalize">{user?.role}</span>
                  </div>
                  <Shield className="w-4 h-4 text-indigo-400" />
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
 
      {/* Fullscreen Workspace Loading Overlay */}
      <AnimatePresence>
        {switchingTo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/95 z-[9999] flex flex-col items-center justify-center select-none"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center space-y-6"
            >
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20" />
                <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 animate-spin" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold font-display text-white tracking-tight">
                  Switching to {switchingTo} Workspace...
                </h2>
                <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Loading environment details...</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Workspace Switcher Modal */}
      <AnimatePresence>
        {showRoleModal && (
          <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRoleModal(false)}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="relative w-full max-w-md bg-white dark:bg-[#0b0e24] border border-slate-200 dark:border-white/10 shadow-2xl rounded-3xl p-6 overflow-hidden z-50 backdrop-blur-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-black font-display text-slate-900 dark:text-white">Switch Workspace</h3>
                  <p className="text-xs text-slate-400 mt-1">Select the environment mode to enter.</p>
                </div>
                <button
                  onClick={() => setShowRoleModal(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {[
                  { id: 'USER', name: 'User', icon: User, label: '👤 User Workspace', desc: 'Create resumes, generate AI portfolios, edit profile' },
                  { id: 'ADMIN', name: 'Admin', icon: Shield, label: '🛡 Admin Workspace', desc: 'Manage user profiles, view metrics & reports' },
                  { id: 'SUPER_ADMIN', name: 'Super Admin', icon: Laptop, label: '👑 Super Admin Workspace', desc: 'Full control, invites generation, db diagnostics' }
                ].map((mode) => {
                  const isActive = (user?.role === mode.id);
                  return (
                    <button
                      key={mode.id}
                      onClick={() => handleWorkspaceSwitch(mode.id, mode.name)}
                      className={`w-full text-left p-4 rounded-2xl border flex items-start gap-4 transition-all duration-300 group cursor-pointer ${
                        isActive 
                          ? 'bg-indigo-600/10 border-indigo-500/30 text-indigo-500 dark:text-indigo-400 font-bold' 
                          : 'bg-slate-50/50 dark:bg-white/[0.02] border-slate-100 dark:border-white/5 hover:border-indigo-500/20 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-[#7c5cff]/5'
                      } hover:translate-x-1 hover:shadow-md`}
                    >
                      <div className={`p-2.5 rounded-xl transition ${
                        isActive 
                          ? 'bg-indigo-600/20 text-indigo-500' 
                          : 'bg-slate-100 dark:bg-white/5 text-slate-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/10'
                      }`}>
                        <mode.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <span className="text-sm font-bold block">{mode.label}</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-normal leading-normal">{mode.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
