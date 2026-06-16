import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Sparkles, FileStack } from 'lucide-react';
import Navbar from '../components/Navbar';
import ResumeCard from '../components/ResumeCard';
import MeshBackground from '../components/layout/MeshBackground';
import API from '../utils/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchResumes = async () => {
    try {
      const { data } = await API.get('/resumes');
      setResumes(data);
    } catch (error) {
      console.error('Failed to fetch resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResumes(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resume? This cannot be undone.')) return;
    try {
      await API.delete(`/resumes/${id}`);
      setResumes((prev) => prev.filter((r) => r._id !== id));
    } catch (error) {
      alert('Failed to delete resume.');
    }
  };

  const handleDuplicate = async (id) => {
    try {
      const { data } = await API.post(`/resumes/${id}/duplicate`);
      setResumes((prev) => [data, ...prev]);
    } catch (error) {
      alert('Failed to duplicate resume.');
    }
  };

  return (
    <div className="min-h-screen relative font-sans">
      <MeshBackground />
      <div className="relative z-10">
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10"
          >
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                <FileStack className="w-8 h-8 text-indigo-500" />
                My Resumes
              </h1>
              <p className="text-slate-500 dark:text-slate-400">Create, manage, and export your tailored resumes.</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/builder/new')}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-500/25 transition transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              Create New Resume
            </button>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/builder/new')}
                className="cursor-pointer flex flex-col items-center justify-center p-8 min-h-[280px] bg-white/50 dark:bg-slate-900/40 backdrop-blur border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/5 transition-all"
              >
                <div className="w-14 h-14 bg-indigo-500/15 text-indigo-500 rounded-2xl flex items-center justify-center mb-4">
                  <Plus className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white">New Resume</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 text-center flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> AI-powered builder
                </p>
              </motion.div>

              <AnimatePresence>
                {resumes.map((resume) => (
                  <ResumeCard
                    key={resume._id}
                    resume={resume}
                    onDelete={handleDelete}
                    onDuplicate={handleDuplicate}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}

          {!loading && resumes.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-slate-500 dark:text-slate-400 mt-8"
            >
              No saved resumes yet. Create your first one above!
            </motion.p>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
