import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, CheckCircle, XCircle, MoreVertical, Calendar as CalendarIcon, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import API from '../utils/api';
import Navbar from '../components/Navbar';
import PremiumAnimatedBackground from '../components/layout/PremiumAnimatedBackground';

const GOAL_TYPES = ['Applications', 'Interviews', 'Skills', 'Offers'];
const STATUS_COLORS = {
  'In Progress': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  'Completed': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  'Failed': 'bg-red-500/10 text-red-500 border-red-500/20',
};

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState({
    type: 'Applications', title: '', targetValue: 10, currentValue: 0, deadline: '', status: 'In Progress'
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/goals');
      setGoals(data);
    } catch (err) {
      toast.error('Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingGoal) {
        await API.put(`/goals/${editingGoal._id}`, formData);
        toast.success('Goal updated');
      } else {
        await API.post('/goals', formData);
        toast.success('Goal created');
      }
      setIsModalOpen(false);
      fetchGoals();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save goal');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await API.delete(`/goals/${id}`);
        toast.success('Goal deleted');
        fetchGoals();
      } catch (err) {
        toast.error('Failed to delete');
      }
    }
  };

  const openModal = (goal = null) => {
    if (goal) {
      setEditingGoal(goal);
      setFormData({
        type: goal.type,
        title: goal.title,
        targetValue: goal.targetValue,
        currentValue: goal.currentValue,
        status: goal.status,
        deadline: goal.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : ''
      });
    } else {
      setEditingGoal(null);
      setFormData({
        type: 'Applications', title: '', targetValue: 10, currentValue: 0, deadline: '', status: 'In Progress'
      });
    }
    setIsModalOpen(true);
  };

  const updateProgress = async (goal, increment) => {
    try {
      const newValue = Math.max(0, Math.min(goal.targetValue, goal.currentValue + increment));
      const newStatus = newValue >= goal.targetValue ? 'Completed' : 'In Progress';
      
      await API.put(`/goals/${goal._id}`, { currentValue: newValue, status: newStatus });
      fetchGoals();
      if (newStatus === 'Completed' && goal.status !== 'Completed') {
        toast.success(`🎉 Congratulations! You achieved your goal: ${goal.title}`);
      }
    } catch (err) {
      toast.error('Failed to update progress');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050816] text-slate-900 dark:text-white relative transition-colors duration-300">
      <PremiumAnimatedBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight font-display flex items-center gap-3">
                <Target className="w-8 h-8 text-brand-500" />
                Goals & Milestones
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Set targets and track your career growth</p>
            </div>
            <button 
              onClick={() => openModal()}
              className="btn-primary flex items-center gap-2 py-2.5 px-5 shadow-glow-brand"
            >
              <Plus className="w-4 h-4" /> Create Goal
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <AnimatePresence>
              {goals.map((goal) => {
                const progressPercentage = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
                return (
                  <motion.div
                    key={goal._id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl hover:border-brand-500/30 transition-all group relative"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400">
                            {goal.type}
                          </span>
                          <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded border ${STATUS_COLORS[goal.status]}`}>
                            {goal.status}
                          </span>
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight pr-8">{goal.title}</h3>
                      </div>
                      <div className="relative group/menu">
                        <button className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-dark-800 border border-slate-200 dark:border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-20 overflow-hidden">
                          <button onClick={() => openModal(goal)} className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5">Edit</button>
                          <button onClick={() => handleDelete(goal._id)} className="w-full text-left px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">Delete</button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                        <span>Progress</span>
                        <span>{goal.currentValue} / {goal.targetValue}</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          className={`h-full ${goal.status === 'Completed' ? 'bg-emerald-500' : 'bg-brand-500'}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercentage}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center border-t border-slate-100 dark:border-white/5 pt-4">
                      {goal.deadline ? (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                          <CalendarIcon className="w-3.5 h-3.5" /> Due {format(new Date(goal.deadline), 'MMM dd, yyyy')}
                        </div>
                      ) : <div />}
                      
                      {goal.status !== 'Completed' && (
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateProgress(goal, -1)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-white transition">-</button>
                          <button onClick={() => updateProgress(goal, 1)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 hover:bg-brand-500 hover:text-white transition">+</button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            
            {goals.length === 0 && !loading && (
              <div className="col-span-full py-16 text-center bg-white/40 dark:bg-white/[0.01] border border-dashed border-slate-300 dark:border-white/10 rounded-3xl">
                <Target className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">No goals set</h3>
                <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">Set achievable targets for your job hunt and let HireCraft track your progress.</p>
                <button onClick={() => openModal()} className="mt-4 btn-primary py-2 px-5 text-sm inline-flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Setup First Goal
                </button>
              </div>
            )}
          </div>

        </main>
      </div>

      {/* Goal Modal */}
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
              className="relative w-full max-w-sm bg-white dark:bg-dark-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden"
            >
              <div className="p-5 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-white/[0.02]">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingGoal ? 'Edit Goal' : 'Create Goal'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSave} className="p-5 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Goal Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-brand-500 appearance-none">
                    {GOAL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Title *</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Apply to 50 jobs" className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-brand-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target</label>
                    <input required type="number" min="1" value={formData.targetValue} onChange={e => setFormData({...formData, targetValue: Number(e.target.value)})} className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-brand-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current</label>
                    <input type="number" min="0" value={formData.currentValue} onChange={e => setFormData({...formData, currentValue: Number(e.target.value)})} className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-brand-500" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Deadline (Optional)</label>
                  <input type="date" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-brand-500" />
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button type="submit" className="btn-primary w-full py-2.5">Save Goal</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
