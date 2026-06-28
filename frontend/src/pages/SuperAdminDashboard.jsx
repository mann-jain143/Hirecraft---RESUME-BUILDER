import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, FileText, Bot, Briefcase, Globe, BarChart2, Shield, Activity, 
  Settings, RefreshCw, Plus, Trash2, Search, X, Check, Power, AlertTriangle, 
  Download, Eye, UserCheck, Key, ShieldAlert, Cpu, Database, HardDrive, 
  ExternalLink, Mail, User, Clock, ShieldAlert as Star, LayoutGrid, CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../utils/api';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PremiumAnimatedBackground from '../components/layout/PremiumAnimatedBackground';
import ThreeJsBot from '../components/dashboard/ThreeJsBot';

export default function SuperAdminDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  const setActiveTab = (tabId) => {
    setSearchParams({ tab: tabId });
  };
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  
  // Tab states
  const [users, setUsers] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [aiUsage, setAiUsage] = useState(null);
  const [activities, setActivities] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [invites, setInvites] = useState([]);

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

  // User Inspector Modal state
  const [selectedUser, setSelectedUser] = useState(null);
  const [inspectData, setInspectData] = useState(null);
  const [inspectLoading, setInspectLoading] = useState(false);

  // Invite creation states
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('ADMIN');

  const filteredUsers = users;

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
          activeUsers: res.data.stats.activeToday,
          totalResumes: res.data.stats.resumesCreated,
          aiRequests: res.data.stats.aiRequests
        }));
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load users');
    } finally {
      setUserLoading(false);
    }
  };

  // Trigger refreshing stats & logs
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await API.get('/super-admin/stats');
      setStats(res.data);
      if (activeTab === 'users') {
        await fetchUsers();
      }
    } catch (err) {
      toast.error('Failed to load metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch data specific to the selected tab
  useEffect(() => {
    const fetchTabSpecific = async () => {
      try {
        if (activeTab === 'users') {
          await fetchUsers();
        } else if (activeTab === 'resumes') {
          const res = await API.get('/super-admin/resumes');
          setResumes(res.data);
        } else if (activeTab === 'portfolios') {
          const res = await API.get('/super-admin/portfolios');
          setPortfolios(res.data);
        } else if (activeTab === 'ai') {
          const res = await API.get('/super-admin/ai-usage');
          setAiUsage(res.data);
        } else if (activeTab === 'invites') {
          const res = await API.get('/super-admin/invites');
          setInvites(res.data);
        } else if (activeTab === 'activities') {
          const res = await API.get('/super-admin/activities');
          setActivities(res.data);
        } else if (activeTab === 'audit') {
          const res = await API.get('/super-admin/audit-logs');
          setAuditLogs(res.data);
        }
      } catch (err) {
        toast.error(`Failed to load ${activeTab} data`);
      }
    };
    fetchTabSpecific();
  }, [activeTab, userSearch, userRoleFilter, userStatusFilter, userPremiumFilter, userActiveTodayFilter, userRecentlyJoinedFilter, currentPage]);

  // Inspect user full details
  const handleInspectUser = async (userId) => {
    try {
      setInspectLoading(true);
      const res = await API.get(`/super-admin/users/${userId}/inspect`);
      setInspectData(res.data);
      setSelectedUser(res.data.user);
    } catch (err) {
      toast.error('Failed to inspect user');
    } finally {
      setInspectLoading(false);
    }
  };

  // Modify user role
  const handleRoleChange = async (userId, role) => {
    try {
      await API.patch(`/super-admin/users/${userId}/role`, { role });
      toast.success('User role updated');
      // Refresh user view
      setUsers(users.map(u => u._id === userId ? { ...u, role } : u));
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser({ ...selectedUser, role });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    }
  };

  // Modify user status (suspend, ban, activate)
  const handleStatusChange = async (userId, status) => {
    try {
      await API.patch(`/super-admin/users/${userId}/status`, { status });
      toast.success(`User status updated to ${status}`);
      setUsers(users.map(u => u._id === userId ? { ...u, status } : u));
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser({ ...selectedUser, status });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  // Delete user completely
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to permanently delete this user? This action is irreversible.')) return;
    try {
      await API.delete(`/super-admin/users/${userId}`);
      toast.success('User permanently deleted');
      setUsers(users.filter(u => u._id !== userId));
      setSelectedUser(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  // Soft delete resume
  const handleDeleteResume = async (resumeId) => {
    try {
      const res = await API.delete(`/super-admin/resumes/${resumeId}`);
      toast.success('Resume soft-deleted');
      setResumes(resumes.map(r => r._id === resumeId ? res.data.resume : r));
      if (inspectData) {
        setInspectData({
          ...inspectData,
          resumes: inspectData.resumes.map(r => r._id === resumeId ? res.data.resume : r)
        });
      }
    } catch (err) {
      toast.error('Failed to delete resume');
    }
  };

  // Restore resume
  const handleRestoreResume = async (resumeId) => {
    try {
      const res = await API.post(`/super-admin/resumes/${resumeId}/restore`);
      toast.success('Resume restored');
      setResumes(resumes.map(r => r._id === resumeId ? res.data.resume : r));
      if (inspectData) {
        setInspectData({
          ...inspectData,
          resumes: inspectData.resumes.map(r => r._id === resumeId ? res.data.resume : r)
        });
      }
    } catch (err) {
      toast.error('Failed to restore resume');
    }
  };

  // Create admin/recruiter invite link
  const handleCreateInvite = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/super-admin/invites/generate', {
        email: inviteEmail || undefined,
        role: inviteRole
      });
      toast.success('Invite link generated!');
      setInviteEmail('');
      setInvites([res.data.invite, ...invites]);
    } catch (err) {
      toast.error('Failed to generate invite');
    }
  };

  // Revoke admin/recruiter invite
  const handleRevokeInvite = async (inviteId) => {
    try {
      await API.delete(`/super-admin/invites/${inviteId}`);
      toast.success('Invite link revoked');
      setInvites(invites.filter(i => i._id !== inviteId));
    } catch (err) {
      toast.error('Failed to revoke invite');
    }
  };

  return (
    <>
      <Navbar />
      <PremiumAnimatedBackground />
      <main className="min-h-screen max-w-7xl w-full mx-auto text-slate-100 pt-24 pb-8 px-4 sm:px-6 lg:px-8 select-none relative z-10">
      
      {/* Header Grid with 3D Bot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8 items-stretch">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-8 p-6 sm:p-8 rounded-3xl relative overflow-hidden bg-gradient-to-br from-slate-900/80 via-indigo-950/20 to-slate-900/60 border border-white/10 backdrop-blur-xl shadow-xl flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[80px]" />
          
          <div className="z-10 max-w-lg space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-400 animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-extrabold">Console Mode: Platform Owner</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white leading-tight">
              Welcome back to <span className="bg-gradient-to-r from-indigo-400 to-[#ec4899] bg-clip-text text-transparent">HireCraftt Command</span>
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md font-semibold font-sans">
              Inspect real-time system metrics, manage verified profiles, verify AI ops efficiency, and track global user growth from this unified hub.
            </p>
          </div>

          <div className="flex gap-4 mt-6 z-10">
            <button
              onClick={fetchData}
              disabled={loading}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Sync Diagnostics
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
          <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-emerald-500/5 rounded-full blur-[40px]" />
          <div>
            <h3 className="text-xs font-black uppercase text-indigo-400 tracking-wider mb-4">Core Gateway Latency</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                <span>Database Response</span>
                <span className="text-emerald-400 font-extrabold">Optimal (12ms)</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                <span>Gemini API Stream</span>
                <span className="text-emerald-400 font-extrabold">Connected</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                <span>Memory Overhead</span>
                <span className="text-indigo-400 font-extrabold">Under 180MB</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Status</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-extrabold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" /> System Healthy
            </span>
          </div>
        </motion.div>
      </div>

      {/* Stats Cards (Grid) */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { title: 'Total Users', val: stats?.totalUsers || 0, icon: Users, color: 'text-indigo-400', glow: 'shadow-indigo-500/10' },
          { title: 'Active Users', val: stats?.activeUsers || 0, icon: UserCheck, color: 'text-emerald-400', glow: 'shadow-emerald-500/10' },
          { title: 'Resumes Generated', val: stats?.totalResumes || 0, icon: FileText, color: 'text-sky-400', glow: 'shadow-sky-500/10' },
          { title: 'AI requests', val: stats?.aiRequests || 0, icon: Bot, color: 'text-pink-400', glow: 'shadow-pink-500/10' },
        ].map((c, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -6, scale: 1.02 }}
            className={`backdrop-blur-xl bg-slate-900/60 border border-white/10 p-5 rounded-2xl flex items-center justify-between shadow-lg hover:shadow-2xl hover:border-white/20 transition-all duration-300 ${c.glow}`}
          >
            <div>
              <p className="text-xs font-bold text-slate-400 mb-1">{c.title}</p>
              <h3 className="text-2xl font-black text-white">{loading ? '...' : c.val}</h3>
            </div>
            <c.icon className={`w-8 h-8 ${c.color} opacity-80`} />
          </motion.div>
        ))}
      </div>

      {/* Tabs Menu */}
      <div className="max-w-7xl mx-auto flex flex-wrap gap-2 border-b border-white/10 pb-4 mb-8">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart2 },
          { id: 'users', label: 'Users', icon: Users },
          { id: 'resumes', label: 'Resumes', icon: FileText },
          { id: 'portfolios', label: 'Portfolios', icon: Globe },
          { id: 'ai', label: 'AI Usage', icon: Bot },
          { id: 'invites', label: 'Invites', icon: Key },
          { id: 'activities', label: 'User Activities', icon: Activity },
          { id: 'audit', label: 'Audit Logs', icon: ShieldAlert },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-sm transition ${
              activeTab === tab.id 
                ? 'bg-indigo-600/90 text-white shadow-lg border border-indigo-500/20' 
                : 'bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Tab Content */}
      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <RefreshCw className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
              <p className="text-slate-400 font-medium">Aggregating platform diagnostics...</p>
            </div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Tab views */}
              {activeTab === 'overview' && stats && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Chart Card */}
                  <div className="lg:col-span-2 min-w-0 overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-2xl shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-6">User Signups & AI Requests</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stats.chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0d" />
                          <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                          <YAxis stroke="#94a3b8" fontSize={11} />
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff1a', color: '#f1f5f9' }} />
                          <Legend />
                          <Area type="monotone" dataKey="signups" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorSignups)" name="New Users" />
                          <Area type="monotone" dataKey="aiRequests" stroke="#ec4899" strokeWidth={2} fillOpacity={1} fill="url(#colorAi)" name="AI Requests" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* System & Health Diagnostics */}
                  <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-6">System Health Diagnostics</h3>
                      <div className="space-y-4">
                        {[
                          { label: 'Server Engine', val: stats.systemStatus.serverStatus, status: 'ok', icon: Cpu },
                          { label: 'Database cluster', val: stats.systemStatus.databaseStatus, status: 'ok', icon: Database },
                          { label: 'Gateway latency', val: stats.systemStatus.apiHealth, status: 'ok', icon: HardDrive },
                          { label: 'Gemini NLP Gateway', val: stats.systemStatus.aiStatus, status: 'ok', icon: Bot },
                        ].map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                            <div className="flex items-center gap-2.5">
                              <item.icon className="w-4.5 h-4.5 text-indigo-400" />
                              <span className="text-xs font-semibold text-slate-300">{item.label}</span>
                            </div>
                            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{item.val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-6 border-t border-white/10 pt-4 text-xs space-y-2 text-slate-400 font-semibold">
                      <div className="flex justify-between"><span>Uptime:</span><span className="text-slate-200">{stats.systemStatus.uptime}</span></div>
                      <div className="flex justify-between"><span>Memory Overhead:</span><span className="text-slate-200">{stats.systemStatus.memoryUsage}</span></div>
                      <div className="flex justify-between"><span>CPU Threads:</span><span className="text-slate-200">{stats.systemStatus.cpuCount} Core</span></div>
                      <div className="flex justify-between"><span>Platform OS:</span><span className="text-slate-200 uppercase">{stats.systemStatus.platform}</span></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <div className="backdrop-blur-xl bg-slate-900/60 border border-white/10 p-6 rounded-3xl shadow-xl space-y-6">
                  {/* Search and Advanced Filters Bar */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      {/* Search box */}
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
                      
                      {/* Role Filter */}
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

                      {/* Status Filter */}
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

                    {/* Checkboxes row */}
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

                  {/* Users Table */}
                  <div className="overflow-x-auto border border-white/10 rounded-2xl bg-slate-950/40">
                    <table className="w-full text-left border-collapse min-w-[900px]">
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
                      <tbody className="divide-y divide-white/5 text-xs">
                        {userLoading ? (
                          // Loading Skeletons
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
                        ) : filteredUsers.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="py-12 text-center text-slate-500 font-bold">No matching users found</td>
                          </tr>
                        ) : (
                          filteredUsers.map((u) => (
                            <tr key={u._id} className="hover:bg-white/[0.02] transition duration-150">
                              {/* Column 1: Details & Connectivity */}
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
                                    {/* Online indicator */}
                                    <span 
                                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900 ${
                                        u.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'
                                      }`}
                                      title={u.isOnline ? 'Online' : 'Offline'}
                                    />
                                  </div>
                                  <div>
                                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                      {u.name}
                                      {u.isPremium && <span className="text-[10px] text-amber-400" title="Premium subscription">⭐</span>}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-semibold">{u.email}</div>
                                    {u.portfolioUsername && (
                                      <div className="text-[9px] text-indigo-400 font-bold mt-0.5">@{u.portfolioUsername}</div>
                                    )}
                                  </div>
                                </div>
                              </td>

                              {/* Column 2: Role / Status */}
                              <td className="py-4 px-5 space-y-1.5">
                                <select
                                  value={u.role}
                                  onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                  disabled={u.role === 'SUPER_ADMIN'}
                                  className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-[10px] font-bold text-slate-300 focus:outline-none cursor-pointer"
                                >
                                  <option value="USER">USER</option>
                                  <option value="ADMIN">ADMIN</option>
                                  <option value="SUPER_ADMIN">SUPER ADMIN</option>
                                </select>
                                <div className="block">
                                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                                    u.status === 'suspended' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                                    u.status === 'banned' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                    'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  }`}>
                                    {u.status || 'active'}
                                  </span>
                                </div>
                              </td>

                              {/* Column 3: Dates */}
                              <td className="py-4 px-5 font-semibold text-slate-300 space-y-0.5">
                                <div className="flex items-center gap-1">
                                  <span className="text-slate-500 text-[10px]">Joined:</span>
                                  <span>{new Date(u.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                                  <span className="text-slate-500 text-[9px]">Login:</span>
                                  <span>{u.lastLoginDate ? new Date(u.lastLoginDate).toLocaleDateString() : 'N/A'}</span>
                                </div>
                              </td>

                              {/* Column 4: Resumes & ATS */}
                              <td className="py-4 px-5 font-bold space-y-1">
                                <div className="flex items-center gap-1 text-slate-200">
                                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                                  <span>{u.totalResumes || 0} Resumes</span>
                                </div>
                                <div className="block">
                                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                                    (u.avgAtsScore || 0) >= 70 ? 'bg-emerald-500/10 text-emerald-400' :
                                    (u.avgAtsScore || 0) >= 50 ? 'bg-amber-500/10 text-amber-400' :
                                    'bg-red-500/10 text-red-400'
                                  }`}>
                                    Avg ATS: {u.avgAtsScore || 0}%
                                  </span>
                                </div>
                              </td>

                              {/* Column 5: Metrics */}
                              <td className="py-4 px-5 text-slate-300 font-semibold space-y-0.5">
                                <div className="flex justify-between max-w-[120px]">
                                  <span className="text-slate-500">Apps:</span>
                                  <span>{u.applicationsCount || 0}</span>
                                </div>
                                <div className="flex justify-between max-w-[120px]">
                                  <span className="text-slate-500">AI Ops:</span>
                                  <span>{u.aiUsageCount || 0}</span>
                                </div>
                                <div className="flex justify-between max-w-[120px] text-[10px] text-indigo-400">
                                  <span className="text-slate-500">Storage:</span>
                                  <span>{u.storageUsed || '0.00 KB'}</span>
                                </div>
                              </td>

                              {/* Column 6: Actions */}
                              <td className="py-4 px-5 text-right">
                                <div className="flex justify-end gap-1.5">
                                  <button
                                    onClick={() => handleInspectUser(u._id)}
                                    className="p-2 bg-white/5 border border-white/10 hover:bg-indigo-600 hover:text-white hover:border-indigo-500 rounded-xl text-slate-300 transition cursor-pointer"
                                    title="View Profile Details"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                  {u.role !== 'SUPER_ADMIN' && (
                                    <>
                                      <button
                                        onClick={() => handleStatusChange(u._id, u.status === 'suspended' ? 'active' : 'suspended')}
                                        className={`p-2 border rounded-xl transition cursor-pointer ${
                                          u.status === 'suspended'
                                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-600 hover:text-white hover:border-emerald-500'
                                            : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400 hover:bg-yellow-600 hover:text-white hover:border-yellow-500'
                                        }`}
                                        title={u.status === 'suspended' ? 'Activate Account' : 'Suspend Account'}
                                      >
                                        <Power className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteUser(u._id)}
                                        className="p-2 bg-red-500/10 border border-red-500/20 hover:bg-red-600 hover:text-white hover:border-red-500 text-red-400 rounded-xl transition cursor-pointer"
                                        title="Delete User permanently"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Controls */}
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
                </div>
              )}

              {/* Resumes Tab */}
              {activeTab === 'resumes' && (
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-2xl shadow-xl">
                  <h3 className="text-lg font-bold text-white mb-6">Resume Inventory</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-slate-400 text-xs font-bold uppercase tracking-wider">
                          <th className="py-4 px-4">Title</th>
                          <th className="py-4 px-4">Author</th>
                          <th className="py-4 px-4">Status</th>
                          <th className="py-4 px-4">Last Updated</th>
                          <th className="py-4 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-sm">
                        {resumes.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="py-8 text-center text-slate-500 font-medium">No resumes created yet</td>
                          </tr>
                        ) : (
                          resumes.map((r) => (
                            <tr key={r._id} className="hover:bg-white/5 transition duration-150">
                              <td className="py-4 px-4">
                                <div className="font-semibold text-slate-900 dark:text-white">{r.title}</div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="font-semibold text-slate-800 dark:text-slate-200">{r.user?.name || 'Unknown User'}</div>
                                <div className="text-xs text-slate-400">{r.user?.email || 'N/A'}</div>
                              </td>
                              <td className="py-4 px-4">
                                <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${
                                  r.isDeleted 
                                    ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                }`}>
                                  {r.isDeleted ? 'Deleted' : 'Active'}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-xs text-slate-400">
                                {new Date(r.updatedAt).toLocaleDateString()}
                              </td>
                              <td className="py-4 px-4 text-right">
                                <div className="flex justify-end gap-2">
                                  {r.isDeleted ? (
                                    <button
                                      onClick={() => handleRestoreResume(r._id)}
                                      className="py-1 px-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg text-xs transition"
                                    >
                                      Restore
                                    </button>
                                  ) : (
                                    <>
                                      <button
                                        onClick={() => handleDeleteResume(r._id)}
                                        className="p-1.5 bg-red-500/10 border border-red-500/20 hover:bg-red-600 hover:text-white text-red-400 rounded-lg transition"
                                        title="Delete Resume"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Portfolios Tab */}
              {activeTab === 'portfolios' && (
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-2xl shadow-xl">
                  <h3 className="text-lg font-bold text-white mb-6">User Portfolios</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-slate-400 text-xs font-bold uppercase tracking-wider">
                          <th className="py-4 px-4">User</th>
                          <th className="py-4 px-4">Theme</th>
                          <th className="py-4 px-4">Analytics (Views / Downloads)</th>
                          <th className="py-4 px-4">Public URL</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-sm">
                        {portfolios.length === 0 ? (
                          <tr>
                            <td colSpan="4" className="py-8 text-center text-slate-500 font-medium">No portfolios published yet</td>
                          </tr>
                        ) : (
                          portfolios.map((p) => (
                            <tr key={p._id} className="hover:bg-white/5 transition duration-150">
                              <td className="py-4 px-4">
                                <div className="font-semibold text-slate-900 dark:text-white">{p.user?.name || 'Unknown'}</div>
                                <div className="text-xs text-slate-400">{p.user?.email || 'N/A'}</div>
                              </td>
                              <td className="py-4 px-4 font-medium text-indigo-400 uppercase text-xs">
                                {p.theme || 'modern'}
                              </td>
                              <td className="py-4 px-4 text-xs font-medium text-slate-300">
                                {p.views || 0} Views / {p.downloads || 0} PDF Downloads
                              </td>
                              <td className="py-4 px-4">
                                <a
                                  href={`/u/${p.user?.portfolioUsername}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 hover:underline"
                                >
                                  View Portfolio <ExternalLink className="w-3 h-3" />
                                </a>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* AI Tab */}
              {activeTab === 'ai' && aiUsage && (
                <div className="space-y-8">
                  {/* Aggregated AI Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Metrics card */}
                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Total Operations</h4>
                        <div className="text-4xl font-extrabold text-pink-400">{aiUsage.totalAiRequests}</div>
                      </div>
                      <p className="text-xs text-slate-400 font-semibold mt-4">Total neural network completions mapped by NLP module.</p>
                    </div>

                    {/* Most Active Users */}
                    <div className="md:col-span-2 backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-2xl shadow-xl">
                      <h3 className="text-sm font-bold text-white mb-4">Most Active Users (AI Completion)</h3>
                      <div className="space-y-3">
                        {aiUsage.mostActive.map((user, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                            <div>
                              <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{user.name}</div>
                              <div className="text-xs text-slate-400">{user.email}</div>
                            </div>
                            <span className="text-xs font-bold text-pink-400 bg-pink-500/10 px-3 py-1 rounded border border-pink-500/20">
                              {user.count} Requests
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* AI Logs History */}
                  <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-2xl shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-6">AI Generation Logs</h3>
                    <div className="overflow-x-auto max-h-96">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/10 text-slate-400 text-xs font-bold uppercase tracking-wider">
                            <th className="py-4 px-4">User</th>
                            <th className="py-4 px-4">Prompt Type</th>
                            <th className="py-4 px-4">Details</th>
                            <th className="py-4 px-4">Generated At</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                          {aiUsage.history.length === 0 ? (
                            <tr>
                              <td colSpan="4" className="py-8 text-center text-slate-500 font-medium">No AI completions recorded</td>
                            </tr>
                          ) : (
                            aiUsage.history.map((log) => (
                              <tr key={log._id}>
                                <td className="py-4 px-4">
                                  <div className="font-semibold text-slate-900 dark:text-white">{log.user?.name || 'Unknown'}</div>
                                  <div className="text-xs text-slate-400">{log.user?.email || 'N/A'}</div>
                                </td>
                                <td className="py-4 px-4">
                                  <span className="text-xs font-bold bg-pink-500/10 text-pink-400 border border-pink-500/20 px-2.5 py-0.5 rounded">
                                    {log.promptType}
                                  </span>
                                </td>
                                <td className="py-4 px-4 text-xs font-medium text-slate-300 max-w-sm truncate">
                                  {log.promptText}
                                </td>
                                <td className="py-4 px-4 text-xs text-slate-400 font-medium">
                                  {new Date(log.createdAt).toLocaleString()}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Invites Tab */}
              {activeTab === 'invites' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Create invite */}
                  <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-2xl shadow-xl h-fit">
                    <h3 className="text-lg font-bold text-white mb-6">Create Admin Privilege Invite</h3>
                    <form onSubmit={handleCreateInvite} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Target Email (Optional)</label>
                        <input
                          type="email"
                          placeholder="e.g. name@example.com"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Target Privilege Role</label>
                        <select
                          value={inviteRole}
                          onChange={(e) => setInviteRole(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-300"
                        >
                          <option value="ADMIN">Admin</option>
                        </select>
                      </div>
                      <button
                        type="submit"
                        className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-lg shadow-indigo-600/10"
                      >
                        <Plus className="w-4 h-4" />
                        Generate Privilege Link
                      </button>
                    </form>
                  </div>

                  {/* Invites list */}
                  <div className="lg:col-span-2 backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-2xl shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-6">Invitation Links</h3>
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                      {invites.length === 0 ? (
                        <p className="text-center text-slate-500 py-8 font-medium">No invite links created yet</p>
                      ) : (
                        invites.map((invite) => {
                          const inviteUrl = `${window.location.origin}/admin/invite/${invite.token}`;
                          return (
                            <div key={invite._id} className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1.5">
                                  <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${
                                    invite.role === 'ADMIN' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                  }`}>
                                    {invite.role}
                                  </span>
                                  {invite.isUsed ? (
                                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">Claimed</span>
                                  ) : (
                                    <span className="text-xs font-bold text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded">Pending Claim</span>
                                  )}
                                </div>
                                <div className="text-xs font-semibold text-slate-300 break-all mb-1 font-mono">
                                  {inviteUrl}
                                </div>
                                <div className="text-xs text-slate-400">
                                  Created by {invite.createdBy?.name || 'Super Admin'} for {invite.email || 'Any Email'}
                                </div>
                              </div>
                              <button
                                onClick={() => handleRevokeInvite(invite._id)}
                                className="p-2 bg-red-500/10 border border-red-500/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition"
                                title="Revoke invite Link"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* User Activities Tab */}
              {activeTab === 'activities' && (
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-2xl shadow-xl">
                  <h3 className="text-lg font-bold text-white mb-6">User Activity Audit Logs</h3>
                  <div className="overflow-x-auto max-h-96">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-slate-400 text-xs font-bold uppercase tracking-wider">
                          <th className="py-4 px-4">User</th>
                          <th className="py-4 px-4">Action</th>
                          <th className="py-4 px-4">Details</th>
                          <th className="py-4 px-4">IP Address</th>
                          <th className="py-4 px-4">Logged At</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-sm">
                        {activities.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="py-8 text-center text-slate-500 font-medium">No actions logged yet</td>
                          </tr>
                        ) : (
                          activities.map((log) => (
                            <tr key={log._id}>
                              <td className="py-4 px-4">
                                <div className="font-semibold text-slate-900 dark:text-white">{log.user?.name || 'Unknown'}</div>
                                <div className="text-xs text-slate-400">{log.user?.email || 'N/A'}</div>
                              </td>
                              <td className="py-4 px-4">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                                  log.action === 'LOGIN' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                                  log.action === 'LOGOUT' ? 'bg-slate-500/10 text-slate-400 border border-slate-500/20' :
                                  'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                                }`}>
                                  {log.action}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-xs font-medium text-slate-300 max-w-sm truncate">
                                {log.details}
                              </td>
                              <td className="py-4 px-4 text-xs text-slate-400 font-mono">
                                {log.ipAddress || 'Unknown'}
                              </td>
                              <td className="py-4 px-4 text-xs text-slate-400 font-medium">
                                {new Date(log.createdAt).toLocaleString()}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Audit Logs Tab */}
              {activeTab === 'audit' && (
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-2xl shadow-xl">
                  <h3 className="text-lg font-bold text-white mb-6">Administrative Operations Audit</h3>
                  <div className="overflow-x-auto max-h-96">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-slate-400 text-xs font-bold uppercase tracking-wider">
                          <th className="py-4 px-4">Administrator</th>
                          <th className="py-4 px-4">Operation</th>
                          <th className="py-4 px-4">Target User</th>
                          <th className="py-4 px-4">Resource</th>
                          <th className="py-4 px-4">Details</th>
                          <th className="py-4 px-4">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-sm">
                        {auditLogs.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="py-8 text-center text-slate-500 font-medium">No administrative actions logged</td>
                          </tr>
                        ) : (
                          auditLogs.map((log) => (
                            <tr key={log._id}>
                              <td className="py-4 px-4">
                                <div className="font-semibold text-slate-900 dark:text-white">{log.admin?.name || 'Admin'}</div>
                                <div className="text-xs text-slate-400">{log.admin?.email}</div>
                              </td>
                              <td className="py-4 px-4">
                                <span className="text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded">
                                  {log.action}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                {log.targetUser ? (
                                  <>
                                    <div className="font-medium text-slate-800 dark:text-slate-200">{log.targetUser.name}</div>
                                    <div className="text-xs text-slate-400">{log.targetUser.email}</div>
                                  </>
                                ) : (
                                  <span className="text-slate-500">-</span>
                                )}
                              </td>
                              <td className="py-4 px-4 text-xs font-semibold text-indigo-400 uppercase">
                                {log.targetResource || '-'}
                              </td>
                              <td className="py-4 px-4 text-xs text-slate-300 max-w-xs truncate">
                                {log.details}
                              </td>
                              <td className="py-4 px-4 text-xs text-slate-400 font-medium">
                                {new Date(log.createdAt).toLocaleString()}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* User Inspector Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl max-h-[85vh] bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-2xl overflow-y-auto flex flex-col"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedUser(null)} 
                className="absolute top-4 right-4 p-1.5 hover:bg-white/5 border border-white/5 hover:border-white/10 rounded-lg text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="border-b border-white/10 pb-4 mb-6 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-indigo-600 border border-white/10 flex-shrink-0 flex items-center justify-center text-white text-2xl font-black overflow-hidden select-none">
                  {selectedUser.profilePicture ? (
                    <img src={selectedUser.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span>{selectedUser.name ? selectedUser.name.charAt(0).toUpperCase() : 'U'}</span>
                  )}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedUser.name}</h2>
                    <span className="text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded uppercase">{selectedUser.role}</span>
                    <span className="text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded uppercase">{selectedUser.status}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{selectedUser.email}</p>
                </div>
              </div>

              {inspectLoading ? (
                <div className="flex-1 flex items-center justify-center py-20">
                  <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
                </div>
              ) : (
                inspectData && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                    {/* Left Column: Account Details & Actions */}
                    <div className="space-y-6">
                      <div className="bg-white/5 border border-white/5 p-4 rounded-xl">
                        <h3 className="font-bold text-white mb-3 text-xs uppercase tracking-wider text-slate-400">Account Management</h3>
                        <div className="space-y-4">
                          {/* Role Update */}
                          <div>
                            <label className="block text-xs text-slate-400 mb-1 font-semibold">Change Role</label>
                            <select
                              value={selectedUser.role}
                              onChange={(e) => handleRoleChange(selectedUser._id, e.target.value)}
                              className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-lg text-xs focus:outline-none focus:border-indigo-500 text-slate-300"
                            >
                              <option value="USER">User</option>
                              <option value="ADMIN">Admin</option>
                            </select>
                          </div>

                          {/* Status Update */}
                          <div>
                            <label className="block text-xs text-slate-400 mb-1 font-semibold">Alter Access Status</label>
                            <select
                              value={selectedUser.status || 'active'}
                              onChange={(e) => handleStatusChange(selectedUser._id, e.target.value)}
                              className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-lg text-xs focus:outline-none focus:border-indigo-500 text-slate-300"
                            >
                              <option value="active">Active</option>
                              <option value="suspended">Suspended</option>
                              <option value="banned">Banned</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Resumes Inventory */}
                      <div className="bg-white/5 border border-white/5 p-4 rounded-xl">
                        <h3 className="font-bold text-white mb-3 text-xs uppercase tracking-wider text-slate-400">Resumes Inventory</h3>
                        {inspectData.resumes.length === 0 ? (
                          <p className="text-slate-500 text-xs">No resumes created yet</p>
                        ) : (
                          <div className="space-y-2">
                            {inspectData.resumes.map(res => (
                              <div key={res._id} className="flex justify-between items-center bg-slate-950/40 p-2.5 rounded-lg border border-white/5 text-xs">
                                <div>
                                  <div className="font-semibold text-slate-800 dark:text-slate-200">{res.title}</div>
                                  <div className="text-slate-400 font-mono">Last update: {new Date(res.updatedAt).toLocaleDateString()}</div>
                                </div>
                                <div className="flex gap-2">
                                  {res.isDeleted ? (
                                    <button
                                      onClick={() => handleRestoreResume(res._id)}
                                      className="py-1 px-2.5 bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 font-bold rounded hover:bg-emerald-600 hover:text-white transition"
                                    >
                                      Restore
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleDeleteResume(res._id)}
                                      className="py-1 px-2.5 bg-red-600/20 text-red-400 border border-red-500/20 font-bold rounded hover:bg-red-600 hover:text-white transition"
                                    >
                                      Delete
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Column: User activity, cover letters, AI usage logs */}
                    <div className="space-y-6">
                      {/* Portfolios & Cover letters list */}
                      <div className="bg-white/5 border border-white/5 p-4 rounded-xl">
                        <h3 className="font-bold text-white mb-3 text-xs uppercase tracking-wider text-slate-400">Portfolios & Documents</h3>
                        <div className="space-y-3 text-xs">
                          <div>
                            <span className="font-bold text-slate-300 block mb-1">Portfolios Published:</span>
                            {inspectData.portfolios.length === 0 ? (
                              <span className="text-slate-500">None</span>
                            ) : (
                              inspectData.portfolios.map(p => (
                                <a 
                                  key={p._id} 
                                  href={`/u/${selectedUser.portfolioUsername}`}
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-indigo-400 hover:underline block break-all font-semibold"
                                >
                                  {window.location.origin}/u/{selectedUser.portfolioUsername}
                                </a>
                              ))
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-slate-300 block mb-1">Cover Letters Created:</span>
                            {inspectData.coverLetters.length === 0 ? (
                              <span className="text-slate-500">None</span>
                            ) : (
                              <div className="space-y-1">
                                {inspectData.coverLetters.map(cl => (
                                  <div key={cl._id} className="text-slate-300 bg-slate-950/40 p-2 rounded border border-white/5">
                                    {cl.jobTitle} at {cl.companyName}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Login Audit Trail */}
                      <div className="bg-white/5 border border-white/5 p-4 rounded-xl">
                        <h3 className="font-bold text-white mb-3 text-xs uppercase tracking-wider text-slate-400">Login Audit Trail</h3>
                        {inspectData.loginHistory.length === 0 ? (
                          <p className="text-slate-500 text-xs">No logins recorded</p>
                        ) : (
                          <div className="space-y-2 max-h-48 overflow-y-auto text-xs pr-1 font-mono">
                            {inspectData.loginHistory.map(lh => (
                              <div key={lh._id} className="flex justify-between items-center text-slate-400">
                                <span>{lh.ipAddress || 'IP: N/A'}</span>
                                <span>{new Date(lh.timestamp).toLocaleDateString()} {new Date(lh.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </main>
    </>
  );
}
