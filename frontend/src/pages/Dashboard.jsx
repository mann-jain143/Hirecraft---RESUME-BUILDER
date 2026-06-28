import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Sparkles, FileText, Upload, Globe, BarChart3, Palette, Target, BookOpen,
  Search, LayoutGrid, List, ArrowRight, Eye, Download, Award, Shield, Zap, Star,
  Briefcase, MessageSquare, PlusCircle, Trash2, Copy, FileEdit, Share2, Check,
  Lightbulb, Activity, ChevronRight, HelpCircle, GraduationCap, Info
} from 'lucide-react';
import Navbar from '../components/Navbar';
import ResumeCard from '../components/ResumeCard';
import PremiumAnimatedBackground from '../components/layout/PremiumAnimatedBackground';
import Onboarding from '../components/dashboard/Onboarding';
import ConfirmModal from '../components/ui/ConfirmModal';
import HelpModal from '../components/ui/HelpModal';
import ThreeJsBot from '../components/dashboard/ThreeJsBot';
import { useTheme } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';
import toast from 'react-hot-toast';

import AdminDashboard from './AdminDashboard';
import SuperAdminDashboard from './SuperAdminDashboard';

// -------------------------------------------------------------
// Badge descriptions & progress criteria
// -------------------------------------------------------------
const BADGES = [
  { id: 'First Resume', name: 'First Resume', icon: FileText, desc: 'Create your first resume', target: 1 },
  { id: 'ATS 90+', name: 'ATS Expert', icon: Shield, desc: 'Achieve a 90+ ATS Score', target: 90 },
  { id: 'First Download', name: 'Quick Builder', icon: Zap, desc: 'Export your resume to PDF', target: 1 },
  { id: 'Portfolio Created', name: 'Portfolio Master', icon: Globe, desc: 'Configure a portfolio URL', target: 1 },
  { id: 'Resume Shared', name: 'Public Influencer', icon: Share2, desc: 'Share link with password lock', target: 1 },
];

// Career Development Constants for dynamic recommendations
const CAREER_INSIGHTS = {
  'Software Engineering': {
    learning: [
      { title: 'System Design Interview Guide', desc: 'Master horizontal scaling, load balancers, and caching strategies.', difficulty: 'Intermediate' },
      { title: 'Advanced React Patterns', desc: 'Dive into Compound Components, Custom Hooks, and state reducers.', difficulty: 'Advanced' },
      { title: 'Data Structures & Algorithms', desc: 'Solve 2 LeetCode problems daily focusing on Hash Maps and Trees.', difficulty: 'Beginner' }
    ],
    advice: [
      'Focus on building end-to-end projects. Real-world applications stand out more than simple tutorial code.',
      'Contribute to open source projects or collaborate on GitHub to show collaborative software development skills.',
      'Always write clean code and write simple unit tests for your projects to demonstrate enterprise engineering readiness.'
    ]
  },
  'Data Science': {
    learning: [
      { title: 'Machine Learning Pipelines with Scikit-Learn', desc: 'Learn how to construct robust, leakage-free modeling workflows.', difficulty: 'Intermediate' },
      { title: 'SQL for Data Analysis', desc: 'Practice window functions, CTEs, and query optimization techniques.', difficulty: 'Beginner' },
      { title: 'Deep Learning with PyTorch', desc: 'Implement simple CNNs and RNNs from scratch for image and text processing.', difficulty: 'Advanced' }
    ],
    advice: [
      'Focus on business value. Your models are only as good as the decisions they drive.',
      'Document your data cleaning process thoroughly. In the real world, 80% of data science is data cleaning.',
      'Build a strong portfolio on Kaggle or GitHub containing real data analysis with clear narrative explanations.'
    ]
  },
  'UI/UX Design': {
    learning: [
      { title: 'Figma Auto-Layout & Design Systems', desc: 'Master production-ready component sheets and responsive grid alignment.', difficulty: 'Intermediate' },
      { title: 'Human-Computer Interaction Principles', desc: 'Study typography contrast ratios, Fitts Law, and visual hierarchy.', difficulty: 'Beginner' },
      { title: 'Interactive Prototyping & Micro-interactions', desc: 'Use Figma smart animate to craft interactive user journeys.', difficulty: 'Advanced' }
    ],
    advice: [
      'Always focus on user research. Never design based on assumptions; back your choices with user feedback.',
      'Keep a visual journal. Document screenshots of bad and good designs you find in daily products.',
      'Your portfolio should explain the "Why", not just show the final polished graphics. Show your wireframes and design decisions.'
    ]
  },
  'Product Management': {
    learning: [
      { title: 'Product Analytics & A/B Testing', desc: 'Understand metrics tracking, funnel conversion, and statistical significance.', difficulty: 'Intermediate' },
      { title: 'Agile & Scrum Methodologies', desc: 'Learn how to prioritize backlogs and coordinate cross-functional sprints.', difficulty: 'Beginner' },
      { title: 'Product Strategy & Roadmapping', desc: 'Develop frameworks to evaluate product-market fit and customer needs.', difficulty: 'Advanced' }
    ],
    advice: [
      'Learn how to communicate across engineering, design, and marketing. PMs are the translators of the team.',
      'Focus on problems, not solutions. Be clear on what problem you are trying to solve before sketching any feature list.',
      'Develop strong empathy for the end user by conducting regular user interviews.'
    ]
  }
};

const DEFAULT_INSIGHTS = {
  learning: [
    { title: 'Mastering Professional Networking', desc: 'Create a professional LinkedIn profile and send targeted outreach messages.', difficulty: 'Beginner' },
    { title: 'Resume Writing & ATS Optimization', desc: 'Learn to inject relevant industry keywords into your CV summaries.', difficulty: 'Intermediate' },
    { title: 'Behavioral Interview Strategies', desc: 'Use the STAR method (Situation, Task, Action, Result) to answer behavioral questions.', difficulty: 'Advanced' }
  ],
  advice: [
    'Tailor your resume for every single job application. Generic resumes rarely pass the ATS.',
    'Build a professional network. Up to 70-80% of jobs are never published publicly and are filled via referrals.',
    'Be persistent and treat the job search itself like a full-time job. Track your progress daily.'
  ]
};

function UserDashboard() {
  const { user, updateProfile } = useContext(AuthContext);
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Dashboard Data State
  const [resumes, setResumes] = useState([]);
  const [stats, setStats] = useState({
    totalResumes: 0,
    avgAtsScore: 0,
    totalViews: 0,
    totalDownloads: 0
  });
  const [gamification, setGamification] = useState({ points: 0, streak: 0 });
  const [dailyTip, setDailyTip] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [atsChartData, setAtsChartData] = useState([]);
  const [activityTimeline, setActivityTimeline] = useState([]);
  const [applications, setApplications] = useState([]);
  const [goals, setGoals] = useState([]);
  const [onboardingCompleted, setOnboardingCompleted] = useState(true);
  const [careerField, setCareerField] = useState('');
  const [portfolioUsername, setPortfolioUsername] = useState('');
  const [prepStats, setPrepStats] = useState({
    questionsSolved: 0,
    dailyStreak: 0,
    longestStreak: 0,
    accuracyRate: 0,
    placementReadiness: 0,
    strongestCategory: 'N/A',
    weeklyImprovement: 0
  });
  
  const [beginnerMode, setBeginnerMode] = useState(
    localStorage.getItem('hirecraft-beginner-mode') === 'true'
  );
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const getInsights = () => {
    if (!careerField) return DEFAULT_INSIGHTS;
    const normalized = careerField.toLowerCase().trim();
    if (normalized.includes('software') || normalized.includes('computer') || normalized.includes('developer') || normalized.includes('code')) {
      return CAREER_INSIGHTS['Software Engineering'];
    }
    if (normalized.includes('data') || normalized.includes('analyst') || normalized.includes('science') || normalized.includes('analytics')) {
      return CAREER_INSIGHTS['Data Science'];
    }
    if (normalized.includes('design') || normalized.includes('ux') || normalized.includes('ui') || normalized.includes('graphic')) {
      return CAREER_INSIGHTS['UI/UX Design'];
    }
    if (normalized.includes('product') || normalized.includes('project') || normalized.includes('management') || normalized.includes('pm')) {
      return CAREER_INSIGHTS['Product Management'];
    }
    return DEFAULT_INSIGHTS;
  };
  const insights = getInsights();

  useEffect(() => {
    const handleModeChange = (e) => {
      setBeginnerMode(e.detail);
    };
    window.addEventListener('beginner-mode-change', handleModeChange);
    return () => window.removeEventListener('beginner-mode-change', handleModeChange);
  }, []);
  
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  
  // LinkedIn profile optimizer toggle / trigger
  const [showLinkedInOptimizer, setShowLinkedInOptimizer] = useState(false);
  const [optimizingLinkedIn, setOptimizingLinkedIn] = useState(false);
  const [linkedInSuggestions, setLinkedInSuggestions] = useState(null);

  // New Search & Interactive Checklist state
  const [searchQuery, setSearchQuery] = useState('');
  const [checklist, setChecklist] = useState([]);

  // Dynamic greetings
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Profile completion calculation
  const calculateCompletion = () => {
    let score = 25; // base score for account creation
    if (resumes.length > 0) score += 30; // created resume
    if (stats.avgAtsScore >= 75) score += 15; // good average score
    if (portfolioUsername) score += 15; // portfolio created
    if (stats.totalViews > 0 || stats.totalDownloads > 0) score += 15; // views or downloads
    return Math.min(score, 100);
  };

  // Retrieve a motivational tagline
  const getMotivationalQuote = () => {
    const quotes = [
      "Your capability is only limited by your conviction. Let's design something spectacular.",
      "The best way to predict the future is to create it. Start building your next opportunity.",
      "Opportunity does not knock, it presents itself when you stand prepared. Let's prepare today.",
      "Craft your story, project your value, and land your dream role. HireCraft is here to support you."
    ];
    return quotes[new Date().getDate() % quotes.length];
  };

  // Sync checklist goals to candidate status
  useEffect(() => {
    setChecklist([
      { id: 1, text: 'Create an ATS-optimized Resume', done: resumes.length > 0 },
      { id: 2, text: 'Analyze resume match with a Job Post', done: false },
      { id: 3, text: 'Export Resume PDF or share Link', done: stats.totalDownloads > 0 || stats.totalViews > 0 },
      { id: 4, text: 'Launch your online Portfolio website', done: !!portfolioUsername },
    ]);
  }, [resumes, stats, portfolioUsername]);

  const toggleChecklist = (id) => {
    setChecklist(prev => prev.map(g => g.id === id ? { ...g, done: !g.done } : g));
  };

  // Fetch Dashboard Stats and resumes
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const resResumes = await API.get('/resumes');
      setResumes(resResumes.data || []);
      
      const [appRes, goalRes, prepStatsRes] = await Promise.all([
        API.get('/applications').catch(() => ({ data: [] })),
        API.get('/goals').catch(() => ({ data: [] })),
        API.get('/placement-prep/stats').catch(() => ({ data: { data: {} } }))
      ]);
      setApplications(appRes.data || []);
      setGoals(goalRes.data || []);
      setPrepStats(prepStatsRes.data?.data || {});

      const resStats = await API.get('/users/dashboard-stats');
      const d = resStats.data;
      setStats(d.stats || { totalResumes: 0, avgAtsScore: 0, totalViews: 0, totalDownloads: 0 });
      setDailyTip(d.dailyTip);
      setAchievements(d.achievements || []);
      setAtsChartData(d.atsChartData || []);
      setActivityTimeline(d.activityTimeline || []);
      setOnboardingCompleted(true);
      setCareerField(d.careerField);
      setPortfolioUsername(d.portfolioUsername);
      setGamification({ points: d.points || 0, streak: d.currentStreak || 0 });
    } catch (err) {
      console.error(err);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    if (searchParams.get('linkedin') === 'true') {
      setShowLinkedInOptimizer(true);
    }
  }, [searchParams]);

  // Handle deletions
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await API.delete(`/resumes/${deleteTarget}`);
      toast.success('Resume deleted successfully');
      loadDashboardData();
    } catch (err) {
      toast.error('Failed to delete resume');
    } finally {
      setDeleteTarget(null);
    }
  };

  // Handle duplication
  const handleDuplicate = async (id) => {
    try {
      await API.post(`/resumes/${id}/duplicate`);
      toast.success('Resume duplicated!');
      loadDashboardData();
    } catch (err) {
      toast.error('Failed to duplicate resume');
    }
  };

  // LinkedIn Optimizer Action
  const handleOptimizeLinkedIn = async () => {
    if (resumes.length === 0) {
      toast.error('Please create at least one resume to optimize your LinkedIn profile');
      return;
    }
    setOptimizingLinkedIn(true);
    try {
      // Fetch full details of the first resume
      const { data: fullResume } = await API.get(`/resumes/${resumes[0]._id}`);
      const { data: optimization } = await API.post('/ai/optimize-linkedin', {
        resumeData: fullResume.resumeData
      });
      setLinkedInSuggestions(optimization);
      toast.success('LinkedIn profile optimized successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to optimize LinkedIn profile');
    } finally {
      setOptimizingLinkedIn(false);
    }
  };

  // Onboarding completion
  const handleOnboardingComplete = (field) => {
    setCareerField(field);
    navigate('/profile');
  };

  // Filter recommendations based on resume properties
  const getAiRecommendations = () => {
    const recs = [];
    if (resumes.length === 0) {
      recs.push({
        title: 'Create Your First Resume',
        desc: 'Kick off your job search by designing a new ATS-friendly resume from our high-converting templates.',
        action: () => navigate('/builder/new'),
        btnText: 'Create Resume'
      });
    }
    if (stats.avgAtsScore < 85 && resumes.length > 0) {
      recs.push({
        title: 'Polish summary sections',
        desc: `Your current average ATS score is ${stats.avgAtsScore || 70}%. Try using "Improve with AI" to add stronger verbs and increase ATS readability.`,
        action: () => navigate(`/builder/${resumes[0]._id}`),
        btnText: 'Optimize Resume'
      });
    }
    if (!portfolioUsername) {
      recs.push({
        title: 'Publish a Professional Portfolio',
        desc: 'Create a custom online portfolio link (e.g. portfolio/username) matching Modern, Minimal, and Dark styles to share with recruiters.',
        action: () => navigate('/portfolio'),
        btnText: 'Generate Portfolio'
      });
    }
    if (recs.length === 0) {
      recs.push({
        title: 'Practice for Upcoming Interviews',
        desc: 'Generate role-specific HR, behavioral, technical, and coding interview prep questions directly from your CV skills.',
        action: () => navigate('/job-match'),
        btnText: 'Prepare Now'
      });
    }
    return recs;
  };

  // Filter resumes by search query
  const filteredResumes = resumes.filter(resume => 
    resume.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Quick Action Configuration
  const quickActions = [
    { 
      label: 'Create Resume', 
      icon: PlusCircle, 
      color: 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:border-emerald-500/30', 
      action: () => navigate('/builder/new') 
    },
    { 
      label: '✨ AI Assistant', 
      icon: Sparkles, 
      color: 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/20 hover:border-purple-500/30', 
      action: () => {
        const event = new CustomEvent('open-career-coach');
        window.dispatchEvent(event);
      } 
    },
    { 
      label: 'Generate Cover Letter', 
      icon: FileText, 
      color: 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/20 hover:border-blue-500/30', 
      action: () => navigate('/cover-letter') 
    },
    { 
      label: 'ATS Check', 
      icon: Target, 
      color: 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border-cyan-500/20 hover:border-cyan-500/30', 
      action: () => navigate('/job-match') 
    },
    { 
      label: 'Portfolio Builder', 
      icon: Globe, 
      color: 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/20 hover:border-orange-500/30', 
      action: () => navigate('/portfolio') 
    },
  ];

  // Activity colors and icons
  const getActivityMeta = (action) => {
    const actLower = action.toLowerCase();
    if (actLower.includes('created')) {
      return { icon: PlusCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
    }
    if (actLower.includes('download')) {
      return { icon: Download, color: 'text-indigo-500', bg: 'bg-indigo-500/10' };
    }
    if (actLower.includes('ats') || actLower.includes('analyzed')) {
      return { icon: Target, color: 'text-cyan-500', bg: 'bg-cyan-500/10' };
    }
    if (actLower.includes('ai') || actLower.includes('generated') || actLower.includes('improve')) {
      return { icon: Sparkles, color: 'text-purple-500', bg: 'bg-purple-500/10' };
    }
    return { icon: FileEdit, color: 'text-blue-500', bg: 'bg-blue-500/10' };
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-main relative transition-colors duration-300">
      {/* Premium animated background */}
      <PremiumAnimatedBackground />

      {/* Render Onboarding Overlay if new user */}
      {!loading && !onboardingCompleted && (
        <Onboarding user={user} userName={user?.name} onComplete={handleOnboardingComplete} />
      )}

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        {/* Main Dashboard Container */}
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8 space-y-6">
          
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/5">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-905 dark:text-white flex items-center gap-2">
                Candidate Dashboard
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Track your profile strength, design ATS-compliant resumes, and build your digital footprint.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsHelpOpen(true)}
                className="px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer"
              >
                <HelpCircle className="w-4 h-4" />
                What is this?
              </button>
            </div>
          </div>

          {/* Beginner Mode Helper Cards */}
          {beginnerMode && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl space-y-3 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-3 text-amber-500/10">
                <GraduationCap className="w-24 h-24 transform translate-x-6 -translate-y-6" />
              </div>
              <div className="flex items-center gap-2.5 text-amber-500">
                <Info className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-wider">Student Beginner Mode Enabled</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
                Welcome to HireCraft! To get started, complete your <strong>Resume checklist</strong> on the right. 
                Keep track of your <strong>ATS Score</strong>: companies use applicant tracking software to scan your resume, 
                so keeping it above 75 is crucial. Generate a <strong>Portfolio</strong> to show recruiters your work.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-3 bg-white/40 dark:bg-white/5 rounded-xl border border-white/10 space-y-1">
                  <span className="text-[10px] font-extrabold text-indigo-400 block uppercase">ATS Score Guide</span>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                    "ATS means Applicant Tracking System. Large companies use it to scan and screen resumes automatically before a human sees them."
                  </p>
                </div>
                <div className="p-3 bg-white/40 dark:bg-white/5 rounded-xl border border-white/10 space-y-1">
                  <span className="text-[10px] font-extrabold text-emerald-400 block uppercase">Digital Portfolio</span>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                    "Your portfolio is your online professional website. It hosts your dynamic resumes, skills matrix, and project sandbox showcases."
                  </p>
                </div>
                <div className="p-3 bg-white/40 dark:bg-white/5 rounded-xl border border-white/10 space-y-1">
                  <span className="text-[10px] font-extrabold text-amber-400 block uppercase">AI Interview Prep</span>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                    "Prepare for HR, Technical, and Behavioral rounds. Practice before real interviews using the simulator."
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Responsive CSS Grid (3 Columns on Desktop) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column (spans 2 on desktop) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Welcome Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/30 dark:shadow-none dark:hover:shadow-indigo-500/20 transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#7c5cff]/10 rounded-full blur-[60px] pointer-events-none" />
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-7 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                    {/* User Profile Image */}
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-indigo-500/30 bg-indigo-600 flex-shrink-0 flex items-center justify-center text-white text-xl font-bold overflow-hidden shadow-md">
                      {user?.profilePicture ? (
                        <img src={user.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span>{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <span className="px-3 py-1 text-[10px] font-bold tracking-widest text-[#7c5cff] dark:text-[#a78bfa] bg-[#7c5cff]/10 rounded-full uppercase">
                        {getGreeting()} 👋
                      </span>
                      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-slate-900 dark:text-white leading-none">
                        Good {getGreeting().split(' ')[1] || 'Day'}, {user?.name || 'Mann'} 👋
                      </h1>
                      <p className="text-base font-semibold text-slate-700 dark:text-slate-200">
                        Ready to build your next opportunity today?
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 italic max-w-lg leading-relaxed">
                        "{getMotivationalQuote()}"
                      </p>
                    </div>
                  </div>

                  {/* Floating 3D metallic chatbot/AI graphic */}
                  <div className="hidden md:block md:col-span-3 h-32 pointer-events-none relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ThreeJsBot />
                    </div>
                  </div>

                  {/* Completion percentage circle */}
                  <div className="md:col-span-2 flex items-center gap-4 md:flex-col md:items-center bg-slate-100/50 dark:bg-white/5 p-4 rounded-2xl border border-slate-200/50 dark:border-white/5 self-stretch justify-center">
                    <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-slate-200 dark:text-white/10"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-brand-500"
                          strokeWidth="3.5"
                          strokeDasharray={`${calculateCompletion()}, 100`}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-extrabold text-slate-900 dark:text-white">{calculateCompletion()}%</span>
                      </div>
                    </div>
                    <div className="space-y-0.5 text-center md:text-center">
                      <span className="text-xs font-extrabold text-slate-950 dark:text-white block">Profile Strength</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">Complete items below</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Quick Actions Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="w-full grid grid-cols-2 sm:grid-cols-5 gap-4"
              >
                {quickActions.map((action, i) => (
                  <motion.button
                    key={i}
                    onClick={action.action}
                    whileHover={{ scale: 1.02, y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex flex-col sm:flex-row items-center gap-2.5 p-4 rounded-2xl border text-center justify-center sm:justify-start transition-all duration-300 font-semibold text-xs cursor-pointer bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl border-white/40 dark:border-slate-700/50 shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/30 dark:shadow-none dark:hover:shadow-indigo-500/20 ${action.color}`}
                  >
                    <action.icon className="w-5 h-5 flex-shrink-0" />
                    <span>{action.label}</span>
                  </motion.button>
                ))}
              </motion.div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Total Resumes', value: stats.totalResumes, icon: FileText, color: 'border-l-indigo-500' },
                  { label: 'Avg ATS Score', value: `${stats.avgAtsScore}%`, icon: Target, color: 'border-l-purple-500' },
                  { label: 'Recruiter Views', value: stats.totalViews, icon: Eye, color: 'border-l-blue-500' },
                  { label: 'Downloads', value: stats.totalDownloads, icon: Download, color: 'border-l-emerald-500' },
                  { label: 'AI Operations', value: stats.aiUsage ?? 0, icon: Sparkles, color: 'border-l-[#7c5cff]' },
                  { label: 'Points Earned', value: gamification.points, icon: Zap, color: 'border-l-amber-500' },
                ].map((stat, idx) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.02, y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                    className={`relative overflow-hidden group border-l-4 ${stat.color} p-5 rounded-2xl bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/30 dark:shadow-none dark:hover:shadow-indigo-500/20 cursor-pointer transition-all duration-300`}
                  >
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
                      <stat.icon className="w-12 h-12 text-slate-800 dark:text-white" />
                    </div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">{stat.label}</p>
                    <p className="text-2xl font-bold font-display mt-2 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                      {stat.value}
                    </p>
                  </motion.div>
                ))}
              </div>
              
              {/* Placement Preparation Status Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-3xl bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 shadow-xl"
              >
                <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-indigo-500" />
                    <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white">Placement Hub Progress</h2>
                  </div>
                  <button 
                    onClick={() => navigate('/placement-prep')}
                    className="text-xs text-indigo-500 hover:text-indigo-400 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    Go to Placement Hub <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Questions Solved', value: prepStats.questionsSolved || 0, icon: BookOpen, color: 'text-blue-500' },
                    { label: 'Daily Streak', value: `🔥 ${prepStats.dailyStreak || 0} Days`, icon: Zap, color: 'text-orange-500' },
                    { label: 'Placement Readiness', value: `${prepStats.placementReadiness || 0}%`, icon: Award, color: 'text-purple-500' },
                    { label: 'Accuracy Rate', value: `${prepStats.accuracyRate || 0}%`, icon: Target, color: 'text-emerald-500' },
                    { label: 'Strongest Category', value: prepStats.strongestCategory || 'N/A', icon: Star, color: 'text-amber-500' },
                    { label: 'Weekly Improvement', value: `${prepStats.weeklyImprovement >= 0 ? '+' : ''}${prepStats.weeklyImprovement || 0}%`, icon: Activity, color: 'text-[#ec4899]' },
                  ].map((stat) => (
                    <div key={stat.label} className="p-4 bg-slate-50/50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 rounded-2xl flex flex-col justify-between h-24">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">{stat.label}</span>
                        <stat.icon className={`w-4 h-4 ${stat.color}`} />
                      </div>
                      <span className="text-xl font-extrabold text-slate-900 dark:text-white block mt-2 truncate">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Saved Resumes Section */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <h2 className="text-xl font-bold tracking-tight font-display text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-500" />
                    Saved Resumes
                  </h2>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-grow sm:flex-grow-0">
                      <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search saved resumes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-4 py-2 text-xs w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-brand-500 placeholder-slate-400 transition"
                      />
                    </div>
                    <button
                      onClick={() => navigate('/templates')}
                      className="text-xs font-semibold text-[#7c5cff] hover:text-indigo-600 dark:hover:text-white transition flex items-center gap-1 flex-shrink-0"
                    >
                      All templates <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="h-64 rounded-2xl bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/5 animate-pulse" />
                    ))}
                  </div>
                ) : filteredResumes.length === 0 ? (
                  <div className="p-12 text-center bg-white/60 dark:bg-white/[0.02] border border-dashed border-slate-200 dark:border-white/10 rounded-[24px] space-y-5 shadow-2xl backdrop-blur-xl">
                    <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto text-indigo-500 border border-indigo-500/20">
                      <FileText className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Your career journey starts here</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-xs max-w-sm mx-auto">
                        {searchQuery ? "No resumes matched your search parameters. Try another name." : "No saved resumes yet. Kickstart your next career move with an AI-optimized resume."}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate('/builder/new')}
                      className="btn-primary inline-flex items-center gap-2 py-2 px-5 text-xs shadow-glow-brand"
                    >
                      <Plus className="w-4 h-4" /> Create Resume
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {filteredResumes.map((resume) => (
                      <ResumeCard
                        key={resume._id}
                        resume={resume}
                        onDelete={(id) => setDeleteTarget(id)}
                        onDuplicate={handleDuplicate}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* AI Insights Recommendations Block */}
              <div className="space-y-4 pt-4">
                <h2 className="text-xl font-bold tracking-tight font-display text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  AI Coach Suggestions
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {getAiRecommendations().map((rec, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex flex-col justify-between space-y-3 p-5 rounded-2xl hc-3d-card cursor-pointer"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">{rec.title}</h3>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-300 leading-relaxed">{rec.desc}</p>
                      </div>
                      <button
                        onClick={rec.action}
                        className="text-xs font-bold text-[#7c5cff] hover:text-brand-600 dark:hover:text-white flex items-center gap-1.5 transition self-start cursor-pointer mt-2"
                      >
                        {rec.btnText} <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))}
 
                  {/* LinkedIn Profile Optimizer card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col justify-between space-y-3 p-5 rounded-2xl hc-3d-card cursor-pointer"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">Optimize LinkedIn Profile</h3>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-300 leading-relaxed">
                        Optimize your LinkedIn headline, summary, and experience section descriptions to boost searchability.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowLinkedInOptimizer(true)}
                      className="text-xs font-bold text-[#7c5cff] hover:text-brand-600 dark:hover:text-white flex items-center gap-1.5 transition self-start cursor-pointer mt-2"
                    >
                      Analyze Profile <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                </div>
              </div>
 
              {/* Career Development Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                {/* Learning Recommendations */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold tracking-tight font-display text-slate-900 dark:text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-500" />
                    Learning Recommendations
                  </h2>
                  <div className="space-y-3">
                    {insights.learning.map((item, idx) => (
                      <div key={idx} className="p-4 rounded-2xl hc-3d-card">
                        <div className="flex justify-between items-start gap-2 mb-1.5">
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.title}</h4>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            item.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-500' :
                            item.difficulty === 'Intermediate' ? 'bg-amber-500/10 text-amber-550' :
                            'bg-red-500/10 text-red-500'
                          }`}>
                            {item.difficulty}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-300 leading-normal font-sans">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
 
                {/* Career Advice */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold tracking-tight font-display text-slate-900 dark:text-white flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-emerald-500" />
                    Career Advice for {careerField || 'Your Field'}
                  </h2>
                  <div className="p-5 rounded-2xl hc-3d-card space-y-4 h-[calc(100%-2.5rem)]">
                    {insights.advice.map((tip, idx) => (
                      <div key={idx} className="flex gap-3 items-start text-xs font-semibold text-slate-700 dark:text-slate-200">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-[10px] font-black flex-shrink-0">
                          {idx + 1}
                        </span>
                        <p className="leading-relaxed font-sans">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column (spans 1 on desktop) */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Checklist Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4 p-6 rounded-3xl bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/30 dark:shadow-none dark:hover:shadow-indigo-500/20 transition-all duration-300"
              >
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Today's Resume Checklist</h3>
                <div className="space-y-2.5">
                  {checklist.map(g => (
                    <div 
                      key={g.id} 
                      onClick={() => toggleChecklist(g.id)}
                      className="flex items-center gap-3 cursor-pointer p-1 rounded-lg hover:bg-slate-100/50 dark:hover:bg-white/5 transition-colors"
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                        g.done 
                          ? 'bg-brand-500 border-brand-500 text-white' 
                          : 'border-slate-300 dark:border-white/20'
                      }`}>
                        {g.done && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className={`text-xs font-semibold ${
                        g.done 
                          ? 'text-slate-400 dark:text-slate-500 line-through' 
                          : 'text-slate-700 dark:text-slate-300'
                      }`}>
                        {g.text}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* ATS Score Progress Ring */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-center space-y-4 p-6 rounded-3xl bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/30 dark:shadow-none dark:hover:shadow-indigo-500/20 transition-all duration-300"
              >
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Average ATS Score</h3>
                
                <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="stroke-slate-200 dark:stroke-white/5 fill-transparent"
                      strokeWidth="8"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="stroke-brand-500 fill-transparent"
                      strokeWidth="8"
                      strokeDasharray="251.2"
                      initial={{ strokeDashoffset: 251.2 }}
                      animate={{ strokeDashoffset: 251.2 - (251.2 * (stats.avgAtsScore || 70)) / 100 }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">{stats.avgAtsScore || 0}%</span>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">ATS Readiness</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed px-2">
                  {stats.avgAtsScore >= 85
                    ? 'Excellent score! Your resumes are highly optimized to bypass automated screenings.'
                    : 'Add more keywords directly matching the job description to bypass corporate ATS screening.'}
                </p>
              </motion.div>

              {/* Goal Progress Widget */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.02, y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                className="flex flex-col justify-between p-6 rounded-3xl bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/30 dark:shadow-none dark:hover:shadow-indigo-500/20 cursor-pointer transition-all duration-300"
              >
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5 text-brand-500" />
                    Goal Progress
                  </h3>
                  {goals.length === 0 ? (
                    <p className="text-xs text-slate-500">No goals set yet. Visit the Goals page to start tracking.</p>
                  ) : (
                    <div className="space-y-4">
                      {goals.slice(0, 3).map(g => (
                        <div key={g._id} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                            <span>{g.title}</span>
                            <span>{g.currentValue}/{g.targetValue}</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${g.status === 'Completed' ? 'bg-emerald-500' : 'bg-brand-500'}`} 
                              style={{ width: `${Math.min(100, (g.currentValue / g.targetValue) * 100)}%` }} 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={() => navigate('/goals')} className="mt-4 text-xs font-bold text-[#7c5cff] hover:text-indigo-600 dark:hover:text-white transition flex items-center gap-1 self-start">
                  View all goals <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>

              {/* Recent Applications Widget */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                whileHover={{ scale: 1.02, y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                className="flex flex-col justify-between p-6 rounded-3xl bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/30 dark:shadow-none dark:hover:shadow-indigo-500/20 cursor-pointer transition-all duration-300"
              >
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                    <Briefcase className="w-5 h-5 text-blue-500" />
                    Recent Applications
                  </h3>
                  {applications.length === 0 ? (
                    <p className="text-xs text-slate-500">You haven't tracked any applications yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {applications.slice(0, 3).map(app => (
                        <div key={app._id} className="flex justify-between items-center p-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                          <div>
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{app.position}</p>
                            <p className="text-[10px] text-slate-500">{app.company}</p>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300">
                            {app.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={() => navigate('/tracker')} className="mt-4 text-xs font-bold text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition flex items-center gap-1 self-start">
                  Open tracker <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>

              {/* Daily Career Tip Widget */}
              {dailyTip && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.02, y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                  className="relative overflow-hidden group p-6 rounded-3xl bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/30 dark:shadow-none dark:hover:shadow-indigo-500/20 cursor-pointer transition-all duration-300"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10">
                    <Lightbulb className="w-14 h-14 text-brand-500" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-500 animate-pulse" />
                      <span className="text-[10px] font-bold text-amber-500 dark:text-amber-400 uppercase tracking-widest">{dailyTip.category}</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-relaxed">
                      "{dailyTip.tip}"
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Achievements panel */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="space-y-4 p-6 rounded-3xl bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/30 dark:shadow-none dark:hover:shadow-indigo-500/20 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Award className="w-4 h-4 text-brand-500" />
                    Achievements
                  </h3>
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                    {achievements.length} / {BADGES.length} Unlocked
                  </span>
                </div>

                <div className="space-y-3">
                  {BADGES.map((badge) => {
                    const isUnlocked = achievements.includes(badge.id);
                    const IconComponent = badge.icon;
                    return (
                      <div
                        key={badge.id}
                        className={`p-3 rounded-xl border flex items-center gap-3 transition-all duration-300 ${
                          isUnlocked
                            ? 'bg-brand-500/5 dark:bg-brand-500/5 border-brand-500/20 text-slate-800 dark:text-white font-semibold'
                            : 'bg-slate-100/30 dark:bg-white/[0.01] border-slate-200 dark:border-white/5 text-slate-400 dark:text-slate-600 opacity-60'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isUnlocked ? 'bg-brand-500/20 text-brand-500' : 'bg-slate-200 dark:bg-white/5 text-slate-400 dark:text-slate-600'
                        }`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-bold ${isUnlocked ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 dark:text-slate-600'}`}>
                              {badge.name}
                            </span>
                            {!isUnlocked && (
                              <span className="text-[8px] font-mono text-slate-400 bg-slate-200/50 dark:bg-white/5 px-1.5 py-0.5 rounded">
                                Locked
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate block mt-0.5 font-normal">{badge.desc}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Recent Activity timeline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4 p-6 rounded-3xl bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/30 dark:shadow-none dark:hover:shadow-indigo-500/20 transition-all duration-300"
              >
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Activity className="w-4 h-4 text-brand-500" />
                  Recent Activity
                </h3>

                {activityTimeline.length === 0 ? (
                  <div className="p-6 text-center space-y-2">
                    <Activity className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto animate-pulse" />
                    <p className="text-xs text-slate-500">No activity recorded yet</p>
                  </div>
                ) : (
                  <div className="relative border-l border-slate-200 dark:border-white/10 ml-3 pl-4 space-y-5 py-2">
                    {activityTimeline.slice(0, 5).map((act, i) => {
                      const meta = getActivityMeta(act.action);
                      const Icon = meta.icon;
                      return (
                        <div key={i} className="relative">
                          <div className={`absolute -left-[22px] top-1 w-3 h-3 rounded-full flex items-center justify-center ${meta.color} ${meta.bg} ring-4 ring-white dark:ring-dark-900 border border-current`} />
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block leading-tight">{act.action}</span>
                            {act.resumeTitle && (
                              <span className="text-[9px] font-semibold text-brand-600 dark:text-brand-400 bg-brand-500/5 dark:bg-white/5 px-1.5 py-0.5 rounded inline-block my-0.5">
                                {act.resumeTitle}
                              </span>
                            )}
                            <span className="text-[9px] text-slate-500 dark:text-slate-400 block font-medium">
                              {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(act.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>

            </div>
          </div>
        </main>
      </div>

      {/* Confirm Resume Deletion Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        title="Delete Resume"
        message="Are you sure you want to delete this resume? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />

      {/* LinkedIn Profile Optimizer Slider / Modal */}
      <AnimatePresence>
        {showLinkedInOptimizer && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLinkedInOptimizer(false)}
              className="absolute inset-0 bg-slate-900/60 dark:bg-[#050816]/75 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-white dark:bg-[#0b0e24] border-l border-slate-200 dark:border-white/10 h-full shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto z-10"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                    <Sparkles className="w-5 h-5 text-brand-500" />
                    LinkedIn Optimizer
                  </h2>
                  <button
                    onClick={() => setShowLinkedInOptimizer(false)}
                    className="p-1 rounded bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold text-lg"
                  >
                    &times;
                  </button>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  We analyze your resume skills and experience to generate keywords, headlines, and a bio description to boost your searchability on LinkedIn.
                </p>

                <button
                  disabled={optimizingLinkedIn}
                  onClick={handleOptimizeLinkedIn}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3 shadow-glow-brand"
                >
                  {optimizingLinkedIn ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" /> Optimizing Profile...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Optimize LinkedIn Profile
                    </>
                  )}
                </button>

                {linkedInSuggestions && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 pt-4 border-t border-slate-200 dark:border-white/5"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-brand-500 dark:text-brand-400 uppercase tracking-widest">Suggested Headline</span>
                      <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {linkedInSuggestions.headline}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-brand-500 dark:text-brand-400 uppercase tracking-widest">About Summary</span>
                      <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {linkedInSuggestions.summary}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-brand-500 dark:text-brand-400 uppercase tracking-widest">Experience Writing Tips</span>
                      <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {linkedInSuggestions.experienceSuggestions}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
              
              <div className="pt-6 text-center border-t border-slate-100 dark:border-white/5 mt-6">
                <span className="text-[10px] text-slate-400">Powered by Gemini Pro Intelligence</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Help Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        title="Student Dashboard Guide"
        subtitle="Understand the key metrics and features of HireCraft"
        sections={[
          {
            title: "ATS Score Tracker",
            description: "Applicant Tracking Systems (ATS) are software programs companies use to sort resumes. A score above 75 ensures your resume passes automated filters.",
            steps: [
              "Always include keywords from the job description.",
              "Avoid complex tables, columns, or diagrams that parsing software might struggle with."
            ]
          },
          {
            title: "AI Career Coach",
            description: "An AI-powered coach available in the top menu to assist with interview questions, offer resume feedback, and answer career queries.",
          },
          {
            title: "Portfolio URL Configuration",
            description: "Generate a custom, responsive website detailing your project sandbox work and resume entries. Set your personalized username in the Account settings.",
          }
        ]}
        tips={[
          "Keep your streak active by logging in daily to update goals.",
          "Aim for a profile completion rate of at least 80% to stand out."
        ]}
      />
    </div>
  );
}

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  if (user?.role === 'ADMIN') {
    return <AdminDashboard />;
  }
  if (user?.role === 'SUPER_ADMIN') {
    return <SuperAdminDashboard />;
  }

  return <UserDashboard />;
}
