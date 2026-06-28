import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, Search, Plus, Filter, Calendar as CalendarIcon, 
  LayoutGrid, List, MoreVertical, Building, MapPin, DollarSign,
  PieChart as PieChartIcon, BarChart3, TrendingUp, CheckCircle, 
  XCircle, Clock, Check
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { format, isSameDay, parseISO } from 'date-fns';
import toast from 'react-hot-toast';
import API from '../utils/api';
import Navbar from '../components/Navbar';
import PremiumAnimatedBackground from '../components/layout/PremiumAnimatedBackground';

const STATUS_COLORS = {
  'Applied': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  'Under Review': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  'Interview': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  'Offer': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  'Rejected': 'bg-red-500/10 text-red-500 border-red-500/20',
};

const CHART_COLORS = {
  'Applied': '#3b82f6',
  'Under Review': '#f59e0b',
  'Interview': '#a855f7',
  'Offer': '#10b981',
  'Rejected': '#ef4444',
};

export default function TrackerPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'calendar'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [formData, setFormData] = useState({
    company: '', position: '', status: 'Applied', appliedDate: new Date().toISOString().split('T')[0],
    salary: '', location: '', notes: ''
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/applications');
      setApplications(data);
    } catch (err) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingApp) {
        await API.put(`/applications/${editingApp._id}`, formData);
        toast.success('Application updated');
      } else {
        await API.post('/applications', formData);
        toast.success('Application tracked');
      }
      setIsModalOpen(false);
      fetchApplications();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save application');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await API.delete(`/applications/${id}`);
        toast.success('Application deleted');
        fetchApplications();
      } catch (err) {
        toast.error('Failed to delete');
      }
    }
  };

  const openModal = (app = null) => {
    if (app) {
      setEditingApp(app);
      setFormData({
        company: app.company,
        position: app.position,
        status: app.status,
        appliedDate: new Date(app.appliedDate).toISOString().split('T')[0],
        salary: app.salary || '',
        location: app.location || '',
        notes: app.notes || ''
      });
    } else {
      setEditingApp(null);
      setFormData({
        company: '', position: '', status: 'Applied', appliedDate: new Date().toISOString().split('T')[0],
        salary: '', location: '', notes: ''
      });
    }
    setIsModalOpen(true);
  };

  const filteredApps = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch = app.company.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            app.position.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [applications, searchQuery, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = applications.length;
    const interviews = applications.filter(a => a.status === 'Interview').length;
    const offers = applications.filter(a => a.status === 'Offer').length;
    const rejections = applications.filter(a => a.status === 'Rejected').length;
    const successRate = total > 0 ? Math.round((offers / total) * 100) : 0;
    
    const pieData = Object.keys(CHART_COLORS).map(status => ({
      name: status,
      value: applications.filter(a => a.status === status).length
    })).filter(d => d.value > 0);

    return { total, interviews, offers, rejections, successRate, pieData };
  }, [applications]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050816] text-slate-900 dark:text-white relative transition-colors duration-300">
      <PremiumAnimatedBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8 space-y-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight font-display flex items-center gap-3">
                <Briefcase className="w-8 h-8 text-brand-500" />
                Application Tracker
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Manage and track your job search progress</p>
            </div>
            <button 
              onClick={() => openModal()}
              className="btn-primary flex items-center gap-2 py-2.5 px-5 shadow-glow-brand"
            >
              <Plus className="w-4 h-4" /> Add Application
            </button>
          </div>

          {/* Analytics Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Total Applied', val: stats.total, icon: Briefcase, color: 'text-blue-500' },
                { label: 'Interviews', val: stats.interviews, icon: Clock, color: 'text-purple-500' },
                { label: 'Offers', val: stats.offers, icon: CheckCircle, color: 'text-emerald-500' },
                { label: 'Success Rate', val: `${stats.successRate}%`, icon: TrendingUp, color: 'text-brand-500' },
              ].map((s, i) => (
                <div key={i} className="bg-white/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-2xl p-5 backdrop-blur-xl shadow-xl flex flex-col items-center text-center">
                  <div className={`p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 mb-3 ${s.color}`}>
                    <s.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-2xl font-bold font-display">{s.val}</h3>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>
            
            <div className="lg:col-span-4 bg-white/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-2xl p-5 backdrop-blur-xl shadow-xl flex items-center justify-center min-h-[200px]">
              {stats.pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={stats.pieData} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                      {stats.pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[entry.name]} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-slate-500 dark:text-slate-400">
                  <PieChartIcon className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  <p className="text-xs">No data to chart</p>
                </div>
              )}
            </div>
          </div>

          {/* Filters & Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/50 dark:bg-white/[0.02] p-4 rounded-2xl border border-slate-200 dark:border-white/10 backdrop-blur-xl">
            <div className="flex w-full sm:w-auto items-center gap-2">
              <div className="relative flex-grow sm:flex-grow-0 min-w-[250px]">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search company or position..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-brand-500"
                />
              </div>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="py-2 px-4 text-sm bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-brand-500 appearance-none font-medium"
              >
                <option value="All">All Statuses</option>
                {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="flex bg-slate-200/50 dark:bg-white/5 p-1 rounded-xl">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg flex items-center justify-center transition ${viewMode === 'grid' ? 'bg-white dark:bg-white/10 shadow text-brand-500' : 'text-slate-500 hover:text-slate-700 dark:hover:text-white'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('calendar')}
                className={`p-2 rounded-lg flex items-center justify-center transition ${viewMode === 'calendar' ? 'bg-white dark:bg-white/10 shadow text-brand-500' : 'text-slate-500 hover:text-slate-700 dark:hover:text-white'}`}
              >
                <CalendarIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence>
                {filteredApps.map((app) => (
                  <motion.div
                    key={app._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-2xl p-5 backdrop-blur-xl shadow-lg hover:border-brand-500/30 transition-all group relative"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">{app.position}</h3>
                        <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                          <Building className="w-3.5 h-3.5" /> {app.company}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${STATUS_COLORS[app.status]}`}>
                          {app.status}
                        </span>
                        <div className="relative group/menu">
                          <button className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-dark-800 border border-slate-200 dark:border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-20 overflow-hidden">
                            <button onClick={() => openModal(app)} className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5">Edit</button>
                            <button onClick={() => handleDelete(app._id)} className="w-full text-left px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">Delete</button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {app.location && (
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" /> {app.location}
                        </div>
                      )}
                      {app.salary && (
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <DollarSign className="w-3.5 h-3.5 text-slate-400" /> {app.salary}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <CalendarIcon className="w-3.5 h-3.5 text-slate-400" /> {format(new Date(app.appliedDate), 'MMM dd, yyyy')}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {filteredApps.length === 0 && !loading && (
                <div className="col-span-full py-12 text-center bg-white/40 dark:bg-white/[0.01] border border-dashed border-slate-300 dark:border-white/10 rounded-3xl">
                  <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">No applications found.</p>
                </div>
              )}
            </div>
          )}

          {/* Calendar View Placeholder (Can expand later) */}
          {viewMode === 'calendar' && (
            <div className="bg-white/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-3xl p-8 backdrop-blur-xl text-center shadow-xl">
              <CalendarIcon className="w-16 h-16 text-brand-500/50 mx-auto mb-4" />
              <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">Calendar View</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
                Applications grouped by date. Implement full grid or list by date here based on date-fns formatting.
              </p>
              <div className="mt-8 space-y-3 max-w-lg mx-auto text-left">
                {applications.slice(0, 5).map(app => (
                  <div key={app._id} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                    <div className="bg-brand-500/10 text-brand-500 px-3 py-2 rounded-lg text-center min-w-[60px]">
                      <div className="text-xs font-bold uppercase">{format(new Date(app.appliedDate), 'MMM')}</div>
                      <div className="text-lg font-black leading-none">{format(new Date(app.appliedDate), 'dd')}</div>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{app.position}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{app.company} • {app.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 dark:bg-[#050816]/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-dark-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-white/[0.02]">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingApp ? 'Edit Application' : 'Add Application'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Company *</label>
                    <input required type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-brand-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Position *</label>
                    <input required type="text" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-brand-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</label>
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-brand-500 appearance-none">
                      {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Applied Date</label>
                    <input type="date" value={formData.appliedDate} onChange={e => setFormData({...formData, appliedDate: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-brand-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Location</label>
                    <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g. Remote, NY" className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-brand-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Salary</label>
                    <input type="text" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} placeholder="e.g. $120k - $150k" className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-brand-500" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Notes</label>
                  <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} rows={3} placeholder="Any details, interview links, etc." className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-brand-500 resize-none" />
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition">Cancel</button>
                  <button type="submit" className="btn-primary py-2.5 px-6">Save Application</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
