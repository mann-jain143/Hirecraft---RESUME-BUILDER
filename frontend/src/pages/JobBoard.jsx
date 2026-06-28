import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, DollarSign, Search, CheckCircle, Sparkles, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../utils/api';
import Navbar from '../components/Navbar';
import PremiumAnimatedBackground from '../components/layout/PremiumAnimatedBackground';

export default function JobBoard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data } = await API.get('/jobs/recommended');
      setJobs(data);
    } catch (err) {
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const applyToJob = async (id) => {
    try {
      await API.post(`/jobs/${id}/apply`);
      toast.success('Successfully applied! +10 Points earned!');
      // Update UI optimistically
      setJobs(jobs.map(j => j._id === id ? { ...j, applicants: [...j.applicants, 'me'] } : j));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050816] text-slate-900 dark:text-white relative transition-colors duration-300">
      <PremiumAnimatedBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-10 space-y-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-brand-500/10 rounded-2xl text-brand-500">
                <Briefcase className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-black font-display tracking-tight">AI Job Matches</h1>
                <p className="text-slate-500">Jobs recommended based on your resume skills.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="px-4 py-2 bg-purple-500/10 text-purple-500 font-bold text-sm rounded-xl flex items-center gap-2"><Sparkles className="w-4 h-4" /> AI Powered</span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20 animate-pulse text-slate-500 font-bold">Scanning job market...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job, i) => (
                <motion.div key={job._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl hover:-translate-y-1 transition flex flex-col">
                  
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 dark:bg-white/5 rounded-xl flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm leading-tight">{job.company?.companyName || 'Unknown Company'}</h4>
                        <span className="text-xs text-slate-500">{job.location}</span>
                      </div>
                    </div>
                    {job.matchScore > 70 && (
                      <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-xs font-black">{job.matchScore}% Match</span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-black mb-2">{job.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">{job.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {job.skills?.slice(0, 4).map((s, idx) => (
                      <span key={idx} className="px-2 py-1 bg-slate-100 dark:bg-white/5 rounded-md text-xs font-semibold">{s}</span>
                    ))}
                    {job.skills?.length > 4 && <span className="px-2 py-1 bg-slate-100 dark:bg-white/5 rounded-md text-xs font-semibold">+{job.skills.length - 4}</span>}
                  </div>

                  <div className="mt-auto border-t border-slate-200 dark:border-white/10 pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm font-bold text-brand-500">
                      <DollarSign className="w-4 h-4" />
                      {job.salaryRange || 'Not specified'}
                    </div>
                    <button 
                      onClick={() => applyToJob(job._id)} 
                      disabled={job.applicants?.includes('me')}
                      className={`px-6 py-2 rounded-xl font-bold text-sm transition ${job.applicants?.includes('me') ? 'bg-emerald-500/10 text-emerald-500 cursor-not-allowed' : 'btn-primary'}`}
                    >
                      {job.applicants?.includes('me') ? 'Applied' : 'Apply'}
                    </button>
                  </div>

                </motion.div>
              ))}
              {jobs.length === 0 && <div className="col-span-full text-center py-20 text-slate-500">No jobs found. Try adding more skills to your resume.</div>}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
