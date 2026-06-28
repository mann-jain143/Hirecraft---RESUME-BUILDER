import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target, CheckCircle2, XCircle, Lightbulb, Loader2, ChevronDown,
  BarChart3, FileText, Play, Check, HelpCircle, Terminal, Clipboard, Star
} from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import PremiumAnimatedBackground from '../components/layout/PremiumAnimatedBackground';
import API from '../utils/api';

const ScoreRing = ({ score, size = 160, stroke = 10 }) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';
  const textClass = score >= 75 ? 'text-emerald-400' : score >= 50 ? 'text-amber-400' : 'text-red-400';

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-3xl font-extrabold font-display ${textClass}`}>{score}%</span>
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Match Score</span>
      </div>
    </div>
  );
};

const KeywordBar = ({ label, value, maxValue, delay = 0 }) => {
  const pct = maxValue > 0 ? Math.min((value / maxValue) * 100, 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-300 font-medium">{label}</span>
        <span className="text-slate-500 font-semibold">{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay, ease: 'easeOut' }}
          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-indigo-500"
        />
      </div>
    </div>
  );
};

export default function JobMatchPage() {
  const [activeTab, setActiveTab] = useState('analyzer'); // analyzer | prep
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  
  // Resumes list
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [resumeData, setResumeData] = useState(null);

  // Interview Prep Questions state
  const [prepDifficulty, setPrepDifficulty] = useState('Medium');
  const [prepQuestions, setPrepQuestions] = useState([]);
  const [generatingPrep, setGeneratingPrep] = useState(false);
  const [practiceAnswers, setPracticeAnswers] = useState({});
  const [practiceActive, setPracticeActive] = useState({});

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const { data } = await API.get('/resumes');
        setResumes(data || []);
        if (data.length > 0) {
          setSelectedResumeId(data[0]._id);
          setResumeData(data[0].resumeData || data[0]);
        }
      } catch (err) {
        console.error('Failed to load resumes', err);
      }
    };
    fetchResumes();
  }, []);

  useEffect(() => {
    if (!selectedResumeId) return;
    const found = resumes.find((r) => r._id === selectedResumeId);
    if (found) setResumeData(found.resumeData || found);
  }, [selectedResumeId, resumes]);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please paste a job description first.');
      return;
    }
    if (!resumeData) {
      toast.error('Please select a resume to compare against.');
      return;
    }
    setLoading(true);
    setResults(null);
    try {
      const { data } = await API.post('/job-match/analyze', {
        jobDescription,
        resumeData,
      });
      setResults(data);
      toast.success('Job analysis complete!');
    } catch (err) {
      console.error(err);
      toast.error('Job description analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePrep = async () => {
    if (!resumeData) {
      toast.error('Please select a resume to generate prep questions.');
      return;
    }
    setGeneratingPrep(true);
    setPrepQuestions([]);
    try {
      const { data } = await API.post('/ai/interview-questions', {
        resumeData,
        jobDescription: jobDescription || 'General engineering role matching candidate profile',
        difficulty: prepDifficulty
      });
      setPrepQuestions(data || []);
      toast.success('Interview questions generated!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate interview prep questions.');
    } finally {
      setGeneratingPrep(false);
    }
  };

  const submitPracticeAnswer = (qIndex) => {
    const answer = practiceAnswers[qIndex];
    if (!answer?.trim()) {
      toast.error('Please input your practice answer before submitting');
      return;
    }
    toast.success('Practice answer saved locally! Review the Answer Tips for comparison.');
  };

  const maxKeyword = useMemo(() => {
    if (!results?.keywords?.length) return 1;
    return Math.max(...results.keywords.map((k) => k.count || k.value || 1));
  }, [results]);

  return (
    <div className="min-h-screen bg-[#050816] text-white relative font-sans">
      <PremiumAnimatedBackground />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 space-y-3"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-500/10 border border-brand-500/20 text-xs font-bold text-brand-400 rounded-full uppercase tracking-wider">
              <Target className="w-3.5 h-3.5" /> Resume Matcher Hub
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-display">Optimize ATS & Practice Interviews</h1>
            <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              Verify your resume ATS compatibility score and generate tailored AI practice questions instantly.
            </p>

            {/* Tab Swapping */}
            <div className="flex bg-white/5 rounded-2xl border border-white/10 p-0.5 max-w-sm mx-auto mt-4">
              <button
                onClick={() => setActiveTab('analyzer')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'analyzer' ? 'bg-[#7c5cff] text-white' : 'text-slate-500 hover:text-slate-200'
                }`}
              >
                ATS Match Analyzer
              </button>
              <button
                onClick={() => setActiveTab('prep')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'prep' ? 'bg-[#7c5cff] text-white' : 'text-slate-500 hover:text-slate-200'
                }`}
              >
                AI Interview Prep
              </button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Inputs Column */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 rounded-[24px] bg-white/[0.03] border border-white/5 backdrop-blur-xl space-y-4">
                
                {/* Resume Selector */}
                {resumes.length > 0 && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-brand-400" /> Select CV
                    </label>
                    <div className="relative">
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                      <select
                        value={selectedResumeId}
                        onChange={(e) => setSelectedResumeId(e.target.value)}
                        className="w-full appearance-none px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 cursor-pointer"
                      >
                        {resumes.map((r) => (
                          <option key={r._id} value={r._id} className="bg-dark-800 text-white">
                            {r.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Job Description paste text */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Job Description</label>
                  <textarea
                    rows={8}
                    placeholder="Paste the target job description details here to perform matching or generate tailored mock interviews..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="input-field py-2 text-xs resize-none"
                  />
                  <div className="text-right text-[10px] text-slate-500">
                    {jobDescription.length.toLocaleString()} characters
                  </div>
                </div>

                {activeTab === 'analyzer' ? (
                  <button
                    onClick={handleAnalyze}
                    disabled={loading || !jobDescription.trim()}
                    className="btn-primary w-full py-3 shadow-glow-brand flex items-center justify-center gap-1.5"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Analyzing CV...
                      </>
                    ) : (
                      <>
                        <Target className="w-4 h-4" /> Analyze ATS Match
                      </>
                    )}
                  </button>
                ) : (
                  <div className="space-y-4 pt-2">
                    {/* Difficulty Selection */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Question Difficulty</label>
                      <div className="flex bg-white/5 rounded-xl border border-white/10 p-0.5">
                        {['Easy', 'Medium', 'Hard'].map((diff) => (
                          <button
                            key={diff}
                            onClick={() => setPrepDifficulty(diff)}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                              prepDifficulty === diff ? 'bg-brand-500 text-white' : 'text-slate-500 hover:text-slate-200'
                            }`}
                          >
                            {diff}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleGeneratePrep}
                      disabled={generatingPrep}
                      className="btn-primary w-full py-3 shadow-glow-brand flex items-center justify-center gap-1.5"
                    >
                      {generatingPrep ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Generating Questions...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" /> Start Interview Prep
                        </>
                      )}
                    </button>
                  </div>
                )}

              </div>
            </div>

            {/* Right Display Column (Either Analyzer results or Prep questions) */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                
                {/* 1. ANALYZER TAB */}
                {activeTab === 'analyzer' && (
                  <div className="space-y-6">
                    {loading && (
                      <div className="p-12 text-center space-y-4">
                        <Loader2 className="w-8 h-8 text-brand-400 animate-spin mx-auto" />
                        <span className="text-sm text-slate-400 block">Optimizing and matching details...</span>
                      </div>
                    )}

                    {!loading && !results && (
                      <div className="p-12 border border-dashed border-white/10 rounded-[24px] bg-white/[0.01] text-center text-slate-500 space-y-3">
                        <Target className="w-10 h-10 text-slate-600 mx-auto" />
                        <p className="text-sm">Click "Analyze ATS Match" on the left panel to begin</p>
                      </div>
                    )}

                    {!loading && results && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                      >
                        {/* Score ring */}
                        <div className="p-6 rounded-[24px] bg-white/[0.03] border border-white/5 backdrop-blur-xl text-center">
                          <ScoreRing score={results.matchScore ?? results.score ?? 0} />
                        </div>

                        {/* Matching Skills */}
                        {results.matchingSkills?.length > 0 && (
                          <div className="p-6 rounded-[24px] bg-white/[0.03] border border-white/5 backdrop-blur-xl space-y-3">
                            <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4" /> Matching CV Skills ({results.matchingSkills.length})
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {results.matchingSkills.map((s, i) => (
                                <span key={i} className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 uppercase">
                                  {typeof s === 'string' ? s : s.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Missing Skills / Keywords */}
                        {results.missingSkills?.length > 0 && (
                          <div className="p-6 rounded-[24px] bg-white/[0.03] border border-white/5 backdrop-blur-xl space-y-3">
                            <h3 className="text-sm font-bold text-red-400 flex items-center gap-1.5">
                              <XCircle className="w-4 h-4" /> Missing Keywords / Keywords Density ({results.missingSkills.length})
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {results.missingSkills.map((s, i) => (
                                <div key={i} className="p-3 bg-red-400/5 border border-red-400/10 rounded-xl space-y-1">
                                  <span className="text-xs font-bold text-slate-200">{typeof s === 'string' ? s : s.name}</span>
                                  {s.suggestion && <p className="text-[10px] text-slate-400 leading-relaxed">{s.suggestion}</p>}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Keywords breakdown */}
                        {results.keywords?.length > 0 && (
                          <div className="p-6 rounded-[24px] bg-white/[0.03] border border-white/5 backdrop-blur-xl space-y-4">
                            <h3 className="text-sm font-bold text-brand-400 flex items-center gap-1.5">
                              <BarChart3 className="w-4 h-4" /> Keyword Occurrence density
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {results.keywords.map((kw, i) => (
                                <KeywordBar
                                  key={i}
                                  label={kw.keyword || kw.label || kw.name}
                                  value={kw.count || kw.value || 0}
                                  maxValue={maxKeyword}
                                  delay={0.05 * i}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                      </motion.div>
                    )}
                  </div>
                )}

                {/* 2. INTERVIEW PREP TAB */}
                {activeTab === 'prep' && (
                  <div className="space-y-6">
                    {generatingPrep && (
                      <div className="p-12 text-center space-y-4">
                        <Loader2 className="w-8 h-8 text-brand-400 animate-spin mx-auto" />
                        <span className="text-sm text-slate-400 block">Formulating category-specific practice questions...</span>
                      </div>
                    )}

                    {!generatingPrep && prepQuestions.length === 0 && (
                      <div className="p-12 border border-dashed border-white/10 rounded-[24px] bg-white/[0.01] text-center text-slate-500 space-y-3">
                        <HelpCircle className="w-10 h-10 text-slate-600 mx-auto" />
                        <p className="text-sm">Click "Start Interview Prep" on the left panel to generate role questions</p>
                      </div>
                    )}

                    {!generatingPrep && prepQuestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                      >
                        {prepQuestions.map((q, idx) => (
                          <div
                            key={idx}
                            className="p-6 rounded-[24px] bg-[#0b0e24]/60 border border-white/5 hover:border-brand-500/20 transition backdrop-blur-xl space-y-4"
                          >
                            <div className="flex justify-between items-center flex-wrap gap-2">
                              <span className="px-3 py-1 bg-brand-500/10 border border-brand-500/20 text-[10px] font-bold text-brand-400 rounded-full uppercase tracking-wider">
                                {q.category} Question
                              </span>
                              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                <span>Difficulty: {q.difficulty}</span>
                              </div>
                            </div>

                            <h4 className="text-sm sm:text-base font-bold text-slate-100">{q.question}</h4>

                            {/* Practice Mode toggler */}
                            <div className="space-y-3 pt-2">
                              <button
                                onClick={() => setPracticeActive(prev => ({ ...prev, [idx]: !prev[idx] }))}
                                className="text-xs font-bold text-[#7c5cff] hover:text-white flex items-center gap-1.5 transition"
                              >
                                {practiceActive[idx] ? 'Close Practice Mode' : 'Open Practice Mode'}
                              </button>

                              {practiceActive[idx] && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  className="space-y-3"
                                >
                                  <textarea
                                    rows={3}
                                    placeholder="Type your practice answer here to structure your thoughts..."
                                    value={practiceAnswers[idx] || ''}
                                    onChange={(e) => setPracticeAnswers(prev => ({ ...prev, [idx]: e.target.value }))}
                                    className="input-field py-2 text-xs resize-none"
                                  />
                                  <button
                                    onClick={() => submitPracticeAnswer(idx)}
                                    className="btn-secondary py-1.5 px-4 text-[10px] font-semibold flex items-center gap-1.5"
                                  >
                                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Save Response
                                  </button>
                                </motion.div>
                              )}
                            </div>

                            {/* Tips panel */}
                            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-400 leading-relaxed space-y-1">
                              <span className="font-bold text-brand-400 uppercase tracking-widest text-[9px] block">Hiring Manager Tips</span>
                              <p>{q.tips}</p>
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}

                  </div>
                )}

              </AnimatePresence>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
