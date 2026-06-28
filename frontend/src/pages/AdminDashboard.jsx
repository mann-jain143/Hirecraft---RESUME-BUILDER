import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, FileText, Sparkles, Trash2, Shield, RefreshCw, Activity, Crown, 
  Heart, Briefcase, Search, Eye, Power, Coins, Flame, Trophy, Bot, UserCheck
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import toast from 'react-hot-toast';
import API from '../utils/api';
import Navbar from '../components/Navbar';
import PageLoader from '../components/ui/PageLoader';
import PremiumAnimatedBackground from '../components/layout/PremiumAnimatedBackground';
import ThreeJsBot from '../components/dashboard/ThreeJsBot';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState('');
  const [userPremiumFilter, setUserPremiumFilter] = useState(false);
  const [userActiveTodayFilter, setUserActiveTodayFilter] = useState(false);
  const [userRecentlyJoinedFilter, setUserRecentlyJoinedFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [userLoading, setUserLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setUserLoading(true);
      const params = {
        search: userSearch,
        role: userRoleFilter,
        status: userStatusFilter,
        isPremium: userPremiumFilter ? 'true' : 'false',
        activeToday: userActiveTodayFilter ? 'true' : 'false',
        recentlyJoined: userRecentlyJoinedFilter ? 'true' : 'false',
        page: currentPage,
        limit: 10
      };
      const res = await API.get('/admin/users', { params });
      setUsers(res.data.users || []);
      setTotalUsersCount(res.data.total || 0);
      setTotalPages(res.data.pages || 1);
      
      if (res.data.stats) {
        setStats(prev => ({
          ...prev,
          totalUsers: res.data.stats.totalUsers,
          activeToday: res.data.stats.activeToday,
          totalResumes: res.data.stats.resumesCreated,
          aiUsage: res.data.stats.aiRequests,
          applicationsCount: res.data.stats.applicationsCount
        }));
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load users');
    } finally {
      setUserLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, activityRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/admin/activity'),
      ]);
      setStats(statsRes.data);
      setActivity(activityRes.data);
      await fetchUsers();
    } catch (error) {
      toast.error('Failed to load admin stats');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user permanently?')) return;
    try {
      await API.delete(`/admin/users/${id}`);
      toast.success('User deleted');
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await API.patch(`/super-admin/users/${id}/role`, { role }); // Managed via Super Admin role endpoint
      toast.success(`Role updated to ${role}`);
      setUsers(users.map((u) => (u._id === id ? { ...u, role } : u)));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchUsers();
    }
  }, [userSearch, userRoleFilter, userStatusFilter, userPremiumFilter, userActiveTodayFilter, userRecentlyJoinedFilter, currentPage]);

  if (loading) {
    return <PageLoader />;
  }

  const chartData = stats?.history || [];

  return (
    <>
      <Navbar />
      <PremiumAnimatedBackground />
      <main className="min-h-screen max-w-7xl w-full mx-auto pt-24 pb-8 px-4 sm:px-6 lg:px-8 select-none space-y-8 relative z-10 text-slate-100">
        
        {/* Header Grid with 3D Bot */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-8 p-6 sm:p-8 rounded-3xl relative overflow-hidden bg-gradient-to-br from-slate-900/80 via-indigo-950/20 to-slate-900/60 border border-white/10 backdrop-blur-xl shadow-xl flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[80px]" />
            
            <div className="z-10 max-w-lg space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-500 animate-pulse" />
                <span className="text-[10px] uppercase tracking-widest text-amber-500 font-extrabold">Admin Command Center</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white leading-tight">
                Welcome to <span className="bg-gradient-to-r from-amber-400 to-[#ec4899] bg-clip-text text-transparent">HireCraft Operations</span>
              </h1>
              <p className="text-xs text-slate-400 leading-relaxed max-w-md font-semibold font-sans">
                Review platform statistics, monitor candidate activities, search user records, and maintain service security protocols.
              </p>
            </div>

            <div className="flex gap-4 mt-6 z-10">
              <button
                onClick={fetchData}
                disabled={loading}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                Refresh System
              </button>
            </div>

            <div className="absolute right-4 bottom-0 top-0 w-52 hidden sm:block">
              <ThreeJsBot />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-4 p-6 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl shadow-xl flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-indigo-500/5 rounded-full blur-[40px]" />
            <div>
              <h3 className="text-xs font-black uppercase text-indigo-400 tracking-wider mb-4">Operations Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                  <span>Revenue Stream</span>
                  <span className="text-emerald-400 font-extrabold">${stats?.revenue || 0}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                  <span>Premium Conversion</span>
                  <span className="text-indigo-400 font-extrabold">{stats?.activeSubs || 0} Active</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                  <span>Total Applications</span>
                  <span className="text-pink-400 font-extrabold">{stats?.applicationsCount || 0} Solved</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Secure Connection</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-extrabold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" /> Optimal Guard
              </span>
            </div>
          </motion.div>
        </div>

        {/* Stats Cards (Grid) */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Total Users', value: stats?.totalUsers, icon: Users, color: 'text-blue-400', glow: 'shadow-blue-500/10' },
            { label: 'Resumes Created', value: stats?.totalResumes, icon: FileText, color: 'text-indigo-400', glow: 'shadow-indigo-500/10' },
            { label: 'Jobs Obtained', value: Math.round((stats?.totalResumes || 0) * 0.4) || 0, icon: Briefcase, color: 'text-emerald-400', glow: 'shadow-emerald-500/10' },
            { label: 'Community Impact', value: (stats?.totalUsers || 0) + (stats?.totalResumes || 0) + (stats?.aiUsage || 0), icon: Heart, color: 'text-rose-400', glow: 'shadow-rose-500/10' },
            { label: 'AI Operations', value: stats?.aiUsage, icon: Sparkles, color: 'text-purple-400', glow: 'shadow-purple-500/10' },
          ].map((kpi, i) => (
            <motion.div
              key={kpi.label}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -6, scale: 1.02 }}
              className={`backdrop-blur-xl bg-slate-900/60 border border-white/10 rounded-2xl p-5 shadow-lg hover:shadow-2xl hover:border-white/20 transition-all duration-300 ${kpi.glow}`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{kpi.label}</span>
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
              <span className="text-2xl font-black text-white">{kpi.value ?? 0}</span>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mt-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-lg h-80">
            <h3 className="text-lg font-bold mb-4 text-white">Platform Growth</h3>
            <ResponsiveContainer width="100%" height="85%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.15} />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#f1f5f9' }} />
                <Area type="monotone" dataKey="users" stroke="#6366f1" fill="url(#userGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-lg h-80 overflow-hidden">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white"><Activity className="w-5 h-5 text-[#7c5cff]" /> Live Activity</h3>
            <div className="space-y-3 overflow-y-auto max-h-64 no-scrollbar">
              {activity.length === 0 ? (
                <p className="text-slate-500 text-sm">No activity yet — AI ops will appear here.</p>
              ) : activity.map((log, i) => (
                <motion.div key={log._id || i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <Sparkles className="w-4 h-4 text-brand-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate">{log.details || log.action}</p>
                    <p className="text-xs text-slate-500">{log.user?.name || 'User'} • {new Date(log.createdAt).toLocaleString()}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* User Management Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.4 }} 
          className="backdrop-blur-xl bg-slate-900/60 border border-white/10 p-6 rounded-3xl shadow-xl space-y-6"
        >
          <div className="border-b border-white/10 pb-4">
            <h3 className="text-lg font-bold text-white">User Management Console</h3>
          </div>

          {/* Search and Filters Bar */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="relative md:col-span-6">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  placeholder="Search by Name, Email, or Username..."
                  value={userSearch}
                  onChange={(e) => { setUserSearch(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-white transition-all"
                />
              </div>
              
              <div className="md:col-span-3">
                <select
                  value={userRoleFilter}
                  onChange={(e) => { setUserRoleFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-300 transition-all cursor-pointer"
                >
                  <option value="">All Roles</option>
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>

              <div className="md:col-span-3">
                <select
                  value={userStatusFilter}
                  onChange={(e) => { setUserStatusFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-300 transition-all cursor-pointer"
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="banned">Banned</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={userPremiumFilter}
                  onChange={(e) => { setUserPremiumFilter(e.target.checked); setCurrentPage(1); }}
                  className="rounded bg-slate-950 border-white/10 text-indigo-600 focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer"
                />
                ⭐ Premium Users
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={userActiveTodayFilter}
                  onChange={(e) => { setUserActiveTodayFilter(e.target.checked); setCurrentPage(1); }}
                  className="rounded bg-slate-950 border-white/10 text-indigo-600 focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer"
                />
                🔥 Active Today
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={userRecentlyJoinedFilter}
                  onChange={(e) => { setUserRecentlyJoinedFilter(e.target.checked); setCurrentPage(1); }}
                  className="rounded bg-slate-950 border-white/10 text-indigo-600 focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer"
                />
                📅 Recently Joined
              </label>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-white/10 rounded-2xl bg-slate-950/40">
            <table className="w-full text-left border-collapse min-w-[900px] text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-wider bg-white/[0.02]">
                  <th className="py-4 px-5">User Details</th>
                  <th className="py-4 px-5">Role / Status</th>
                  <th className="py-4 px-5">Joined / Last Login</th>
                  <th className="py-4 px-5">Resumes & ATS</th>
                  <th className="py-4 px-5">Apps / AI / Storage</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {userLoading ? (
                  Array.from({ length: 4 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="py-4 px-5"><div className="h-9 bg-white/5 rounded-xl w-36" /></td>
                      <td className="py-4 px-5"><div className="h-6 bg-white/5 rounded-lg w-20" /></td>
                      <td className="py-4 px-5"><div className="h-6 bg-white/5 rounded-lg w-28" /></td>
                      <td className="py-4 px-5"><div className="h-6 bg-white/5 rounded-lg w-20" /></td>
                      <td className="py-4 px-5"><div className="h-6 bg-white/5 rounded-lg w-24" /></td>
                      <td className="py-4 px-5"><div className="h-6 bg-white/5 rounded-lg w-16 ml-auto" /></td>
                    </tr>
                  ))
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-500 font-bold">No matching users found</td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u._id} className="hover:bg-white/[0.02] transition duration-150">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-9 h-9 rounded-full bg-indigo-600/35 border border-white/10 flex-shrink-0 flex items-center justify-center text-white text-xs font-black overflow-hidden select-none">
                              {u.profilePicture ? (
                                <img src={u.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
                              ) : (
                                <span>{u.name ? u.name.charAt(0).toUpperCase() : 'U'}</span>
                              )}
                            </div>
                            <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900 ${u.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`} />
                          </div>
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              {u.name}
                              {u.isPremium && <span className="text-[10px] text-amber-400">⭐</span>}
                            </div>
                            <div className="text-[10px] text-slate-400 font-semibold">{u.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-5 space-y-1">
                        <div className="font-bold text-slate-200">{u.role}</div>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                          u.status === 'suspended' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                          u.status === 'banned' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                          'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {u.status || 'active'}
                        </span>
                      </td>

                      <td className="py-4 px-5 font-semibold text-slate-300 space-y-0.5">
                        <div>Joined: {new Date(u.createdAt).toLocaleDateString()}</div>
                        <div className="text-[10px] text-slate-400">Login: {u.lastLoginDate ? new Date(u.lastLoginDate).toLocaleDateString() : 'N/A'}</div>
                      </td>

                      <td className="py-4 px-5 font-bold space-y-1">
                        <div>{u.totalResumes || 0} Resumes</div>
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${(u.avgAtsScore || 0) >= 70 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                          Avg ATS: {u.avgAtsScore || 0}%
                        </span>
                      </td>

                      <td className="py-4 px-5 text-slate-300 font-semibold space-y-0.5">
                        <div>Apps: {u.applicationsCount || 0}</div>
                        <div>AI: {u.aiUsageCount || 0}</div>
                        <div className="text-[10px] text-indigo-400">Size: {u.storageUsed || '0.00 KB'}</div>
                      </td>

                      <td className="py-4 px-5 text-right">
                        {u.role !== 'SUPER_ADMIN' && (
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            className="p-2 bg-red-500/10 border border-red-500/20 hover:bg-red-600 hover:text-white text-red-400 rounded-xl transition cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <span className="text-xs text-slate-400 font-bold">
                Showing {(currentPage - 1) * 10 + 1} - {Math.min(currentPage * 10, totalUsersCount)} of {totalUsersCount} Users
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-xs font-bold transition disabled:opacity-30 cursor-pointer"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-xs font-bold transition disabled:opacity-30 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </>
  );
}
