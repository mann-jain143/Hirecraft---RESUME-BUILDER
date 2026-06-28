import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Map, Target, Zap, CheckCircle, ChevronRight, BookOpen, AlertCircle, RefreshCw, BarChart } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../utils/api';
import Navbar from '../components/Navbar';
import PremiumAnimatedBackground from '../components/layout/PremiumAnimatedBackground';
import Typewriter from '../components/ui/Typewriter';

const ROLES = ['Frontend Developer', 'Full Stack Developer', 'Data Scientist', 'DevOps Engineer', 'Product Manager'];

export default function CareerRoadmapPage() {
  const [role, setRole] = useState('Full Stack Developer');
  const [currentSkills, setCurrentSkills] = useState('HTML, CSS, basic JavaScript');
  
  const [loadingMap, setLoadingMap] = useState(false);
  const [roadmap, setRoadmap] = useState(null);
  
  const [loadingGap, setLoadingGap] = useState(false);
  const [skillGap, setSkillGap] = useState(null);

  const generateRoadmap = async () => {
    try {
      setLoadingMap(true);
      const { data } = await API.post('/ai/roadmap', { role });
      setRoadmap(data);
    } catch (err) {
      toast.error('Failed to generate roadmap');
    } finally {
      setLoadingMap(false);
    }
  };

  const analyzeGap = async () => {
    if (!currentSkills.trim()) return toast.error('Enter your current skills');
    try {
      setLoadingGap(true);
      const { data } = await API.post('/ai/skills', { dreamRole: role, currentSkills });
      setSkillGap(data);
    } catch (err) {
      toast.error('Failed to analyze skill gap');
    } finally {
      setLoadingGap(false);
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
              <Map className="w-8 h-8 text-brand-500" />
            </div>
            <h1 className="text-4xl font-black font-display tracking-tight text-slate-900 dark:text-white mb-4">
              Career <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-indigo-600">Roadmap & Skill Gap</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              Discover exactly what skills you're missing and generate a step-by-step timeline to reach your dream role.
            </p>
          </div>

          {/* Input Section */}
          <div className="bg-white/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Target className="w-4 h-4 text-brand-500" /> Dream Role
                </label>
                <div className="flex flex-wrap gap-2">
                  {ROLES.map(r => (
                    <button
                      key={r}
                      onClick={() => setRole(r)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                        role === r 
                          ? 'bg-brand-500 text-white border-brand-500 shadow-glow-brand' 
                          : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-brand-500/30'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <div className="mt-4">
                  <button onClick={generateRoadmap} disabled={loadingMap} className="btn-secondary w-full py-3 flex justify-center gap-2">
                    {loadingMap ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Map className="w-5 h-5" />}
                    Generate 12-Month Roadmap
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <BarChart className="w-4 h-4 text-emerald-500" /> Current Skills
                </label>
                <textarea
                  value={currentSkills}
                  onChange={e => setCurrentSkills(e.target.value)}
                  placeholder="E.g., HTML, CSS, intermediate Python..."
                  rows={3}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-brand-500 resize-none font-medium text-slate-700 dark:text-slate-300"
                />
                <button onClick={analyzeGap} disabled={loadingGap} className="btn-primary w-full py-3 flex justify-center gap-2">
                  {loadingGap ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                  Analyze Skill Gap
                </button>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Skill Gap Results */}
            {skillGap && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-xl">
                <h3 className="text-xl font-bold font-display flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-white/5 pb-4">
                  <AlertCircle className="w-6 h-6 text-amber-500" /> Skill Gap Analysis
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Missing Critical Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {skillGap.missingSkills.map((skill, i) => (
                        <span key={i} className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-semibold">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Recommended Certifications</h4>
                    <div className="space-y-2">
                      {skillGap.certifications.map((cert, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
                          <BookOpen className="w-4 h-4 text-brand-500 flex-shrink-0" />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5">
                    <h4 className="font-bold text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-2">
                      <Zap className="w-4 h-4" /> Recommended Learning Order
                    </h4>
                    <ol className="list-decimal list-inside space-y-1.5">
                      {skillGap.learningOrder.map((step, i) => (
                        <li key={i} className="text-sm text-slate-600 dark:text-slate-300"><Typewriter text={step} speed={10} /></li>
                      ))}
                    </ol>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Roadmap Results */}
            {roadmap && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-xl lg:col-span-1">
                <h3 className="text-xl font-bold font-display flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-white/5 pb-4">
                  <Map className="w-6 h-6 text-brand-500" /> 12-Month Progression Plan
                </h3>

                <div className="relative border-l-2 border-slate-200 dark:border-white/10 ml-3 space-y-8 pb-4">
                  
                  {/* 3 Months */}
                  <div className="relative pl-6">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 bg-brand-500 rounded-full ring-4 ring-white dark:ring-dark-800" />
                    <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-3 flex items-center gap-2">Phase 1: 0 - 3 Months</h4>
                    <ul className="space-y-2">
                      {roadmap.months3.map((item, i) => (
                        <li key={i} className="text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2 bg-slate-50 dark:bg-white/5 p-3 rounded-xl">
                          <CheckCircle className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" /> <Typewriter text={item} speed={5} />
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 6 Months */}
                  <div className="relative pl-6">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 bg-indigo-500 rounded-full ring-4 ring-white dark:ring-dark-800" />
                    <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-3 flex items-center gap-2">Phase 2: 3 - 6 Months</h4>
                    <ul className="space-y-2">
                      {roadmap.months6.map((item, i) => (
                        <li key={i} className="text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2 bg-slate-50 dark:bg-white/5 p-3 rounded-xl">
                          <ChevronRight className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" /> <Typewriter text={item} speed={5} />
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 12 Months */}
                  <div className="relative pl-6">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 bg-emerald-500 rounded-full ring-4 ring-white dark:ring-dark-800" />
                    <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-3 flex items-center gap-2">Phase 3: 6 - 12 Months</h4>
                    <ul className="space-y-2">
                      {roadmap.months12.map((item, i) => (
                        <li key={i} className="text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2 bg-slate-50 dark:bg-white/5 p-3 rounded-xl">
                          <Target className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" /> <Typewriter text={item} speed={5} />
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              </motion.div>
            )}

          </div>

        </main>
      </div>
    </div>
  );
}
