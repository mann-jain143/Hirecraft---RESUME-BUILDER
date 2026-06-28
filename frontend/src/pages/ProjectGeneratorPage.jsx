import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, RefreshCw, Box, Layers, Server, Cpu, ExternalLink, Hash, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../utils/api';
import Navbar from '../components/Navbar';
import PremiumAnimatedBackground from '../components/layout/PremiumAnimatedBackground';

const CATEGORIES = ['Web Development', 'AI/ML', 'Data Science', 'Mobile Apps'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

export default function ProjectGeneratorPage() {
  const [category, setCategory] = useState('Web Development');
  const [level, setLevel] = useState('Intermediate');
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);

  const generateProjects = async () => {
    try {
      setLoading(true);
      const { data } = await API.post('/ai/projects', { category, level });
      setProjects(data);
    } catch (err) {
      toast.error('Failed to generate projects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050816] text-slate-900 dark:text-white relative transition-colors duration-300">
      <PremiumAnimatedBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
          
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center p-3 bg-brand-500/10 rounded-2xl mb-4">
              <Code className="w-8 h-8 text-brand-500" />
            </div>
            <h1 className="text-4xl font-black font-display tracking-tight text-slate-900 dark:text-white mb-4">
              AI Project <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-indigo-600">Generator</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              Get highly customized portfolio project ideas complete with feature sets and tech stacks to stand out to recruiters.
            </p>
          </div>

          <div className="bg-white/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-grow w-full space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2">Category</label>
              <select 
                value={category} onChange={e => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl font-medium focus:outline-none focus:border-brand-500 appearance-none"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            
            <div className="flex-grow w-full space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2">Difficulty</label>
              <select 
                value={level} onChange={e => setLevel(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl font-medium focus:outline-none focus:border-brand-500 appearance-none"
              >
                {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <div className="w-full sm:w-auto pt-6 flex-shrink-0">
              <button onClick={generateProjects} disabled={loading} className="btn-primary py-3 px-8 w-full flex items-center justify-center gap-2 shadow-glow-brand">
                {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Box className="w-5 h-5" />}
                Generate Ideas
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {projects.map((proj, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl hover:border-brand-500/30 transition-all flex flex-col"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-brand-500/10 rounded-xl text-brand-500">
                      {category.includes('Web') ? <Layers className="w-5 h-5" /> : category.includes('Data') ? <Server className="w-5 h-5" /> : <Cpu className="w-5 h-5" />}
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-md border ${
                      proj.difficulty === 'Hard' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                      proj.difficulty === 'Intermediate' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                      'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    }`}>
                      {proj.difficulty || level}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white mb-2 leading-tight">
                    {proj.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 flex-grow">
                    {proj.description}
                  </p>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" /> Key Features</h4>
                      <ul className="space-y-1">
                        {proj.features.map((f, idx) => (
                          <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-1.5">
                            <span className="text-brand-500 mt-0.5">•</span> {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Hash className="w-3.5 h-3.5" /> Tech Stack</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {proj.technologies.map((t, idx) => (
                          <span key={idx} className="text-[10px] font-bold bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 px-2 py-1 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <button className="mt-6 w-full py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-white/5 transition flex items-center justify-center gap-2">
                    <ExternalLink className="w-4 h-4" /> Start Project
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

        </main>
      </div>
    </div>
  );
}
