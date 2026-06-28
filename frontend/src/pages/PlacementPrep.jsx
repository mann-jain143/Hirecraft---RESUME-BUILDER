import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award, BookOpen, Zap, Target, Star, Bookmark, ChevronLeft, ChevronRight,
  RefreshCw, Play, Check, X, Flame, Trophy, Coins, TrendingUp, Sparkles,
  Clock, Compass, HelpCircle, Info, BookmarkCheck, BarChart3, Users,
  CheckCircle2, AlertTriangle, ArrowRight, RotateCw
} from 'lucide-react';
import Navbar from '../components/Navbar';
import PremiumAnimatedBackground from '../components/layout/PremiumAnimatedBackground';
import API from '../utils/api';
import toast from 'react-hot-toast';

// Confetti particle component using Framer Motion
const Confetti = () => {
  const particles = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    x: Math.random() * window.innerWidth - window.innerWidth / 2,
    y: -50,
    size: Math.random() * 8 + 6,
    color: ['#ff007f', '#00f0ff', '#ffeb3b', '#4caf50', '#9c27b0'][Math.floor(Math.random() * 5)],
    rotation: Math.random() * 360,
    delay: Math.random() * 0.4,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: -20, opacity: 1, rotate: 0 }}
          animate={{
            x: p.x,
            y: window.innerHeight + 50,
            opacity: 0,
            rotate: p.rotation + 360,
          }}
          transition={{
            duration: 1.5 + Math.random() * 1.5,
            delay: p.delay,
            ease: 'easeOut',
          }}
          className="absolute"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            left: '50%',
            top: '0%',
          }}
        />
      ))}
    </div>
  );
};

const APTITUDE_CATEGORIES = [
  'Quantitative Aptitude', 'Logical Reasoning', 'Data Interpretation',
  'Data Sufficiency', 'Number Systems', 'Percentages', 'Profit & Loss',
  'Time & Work', 'Time, Speed & Distance', 'Ratio & Proportion', 'Probability',
  'Permutation & Combination', 'Geometry', 'Mensuration', 'Algebra',
  'Pipes & Cisterns', 'Simple Interest', 'Compound Interest', 'Averages',
  'Mixtures & Allegations', 'Ages', 'Clocks', 'Calendars', 'Blood Relations',
  'Coding-Decoding', 'Seating Arrangement', 'Puzzle Solving', 'Direction Sense',
  'Series', 'Analogy', 'Classification'
];

const VERBAL_CATEGORIES = [
  'Reading Comprehension', 'Grammar', 'Error Detection', 'Sentence Correction',
  'Fill in the Blanks', 'Synonyms', 'Antonyms', 'Vocabulary Builder',
  'Idioms & Phrases', 'One Word Substitution', 'Active & Passive Voice',
  'Direct & Indirect Speech', 'Para Jumbles', 'Sentence Arrangement',
  'Cloze Test', 'Critical Reasoning', 'Verbal Analogies', 'Word Usage'
];

const COMPANIES = [
  { name: 'TCS', desc: 'Focuses heavily on numerical aptitude & logical series.' },
  { name: 'Infosys', desc: 'Focuses on critical thinking & puzzle solving.' },
  { name: 'Wipro', desc: 'Standard quantitative & grammar tests.' },
  { name: 'Accenture', desc: 'High emphasis on verbal proficiency & critical reasoning.' },
  { name: 'Capgemini', desc: 'Focuses on game-based logic & data representation.' },
  { name: 'Cognizant', desc: 'Mixed general aptitude & error analysis.' },
  { name: 'Tech Mahindra', desc: 'Technical & quantitative fundamentals.' },
  { name: 'Deloitte', desc: 'Data interpretation & advanced logical cases.' },
  { name: 'Amazon', desc: 'Complex problem-solving & algorithmic logic.' },
  { name: 'Google', desc: 'Highly conceptual logical & brain puzzles.' },
  { name: 'Microsoft', desc: 'Advanced analytics & analytical logic.' }
];

export default function PlacementPrep() {
  const [activeTab, setActiveTab] = useState('hub'); // hub | daily | bookmarks | leaderboard | history
  const [module, setModule] = useState('Aptitude'); // Aptitude | Verbal
  const [category, setCategory] = useState(APTITUDE_CATEGORIES[0]);
  const [difficulty, setDifficulty] = useState('Medium');
  const [questionCount, setQuestionCount] = useState(10);
  const [company, setCompany] = useState('');
  const [practiceMode, setPracticeMode] = useState('Quick Practice');

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { questionIdx: selectedOption }
  const [showConfetti, setShowConfetti] = useState(false);
  const [shakeCard, setShakeCard] = useState(false);
  const [score, setScore] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false); // 3D Card flip state

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0);
  const [timerIntervalId, setTimerIntervalId] = useState(null);

  // Statistics, Bookmarks & Leaderboards
  const [stats, setStats] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarkNotes, setBookmarkNotes] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [historyList, setHistoryList] = useState([]);

  // Daily Challenge state
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [dailyCompleted, setDailyCompleted] = useState(false);

  // Post quiz summary state
  const [showSummary, setShowSummary] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [badgeUnlocked, setBadgeUnlocked] = useState('');

  // Fetch bookmarks, stats, and leaderboard
  useEffect(() => {
    fetchStats();
    fetchBookmarks();
    fetchLeaderboard();
    fetchHistory();
    fetchDailyChallenge();
  }, []);

  useEffect(() => {
    // Reset category selection when module changes
    if (module === 'Aptitude') {
      setCategory(APTITUDE_CATEGORIES[0]);
    } else {
      setCategory(VERBAL_CATEGORIES[0]);
    }
  }, [module]);

  const fetchStats = async () => {
    try {
      const { data } = await API.get('/placement-prep/stats');
      if (data.status === 'success') setStats(data.data);
    } catch {
      console.warn('Failed to fetch stats');
    }
  };

  const fetchBookmarks = async () => {
    try {
      const { data } = await API.get('/placement-prep/bookmarks');
      if (data.status === 'success') setBookmarks(data.data);
    } catch {
      console.warn('Failed to fetch bookmarks');
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const { data } = await API.get('/placement-prep/leaderboard');
      if (data.status === 'success') setLeaderboard(data.data);
    } catch {
      console.warn('Failed to fetch leaderboard');
    }
  };

  const fetchHistory = async () => {
    try {
      const { data } = await API.get('/users/activity'); // Reuse generic activity log
      // Filter activities containing placement
      const placementActivities = (data || []).filter(act => 
        act.action?.toLowerCase().includes('placement') || 
        act.action?.toLowerCase().includes('aptitude') || 
        act.action?.toLowerCase().includes('verbal')
      );
      setHistoryList(placementActivities);
    } catch {
      console.warn('Failed to fetch activity history');
    }
  };

  const fetchDailyChallenge = async () => {
    try {
      const { data } = await API.get('/placement-prep/daily-challenge');
      if (data.status === 'success') {
        setDailyChallenge(data.data);
        setDailyCompleted(data.data.completedToday);
      }
    } catch {
      console.warn('Failed to fetch daily challenge');
    }
  };

  // Timer logic helper
  const startTimer = (seconds) => {
    if (timerIntervalId) clearInterval(timerIntervalId);
    setTimeRemaining(seconds);
    setTimerActive(true);
    setTimeTaken(0);

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerActive(false);
          // auto skip or trigger next on timeout
          return 0;
        }
        return prev - 1;
      });
      setTimeTaken((prev) => prev + 1);
    }, 1000);
    setTimerIntervalId(interval);
  };

  const stopTimer = () => {
    if (timerIntervalId) clearInterval(timerIntervalId);
    setTimerActive(false);
  };

  // Generate placement questions
  const handleGenerate = async () => {
    setLoading(true);
    setQuestions([]);
    setShowSummary(false);
    setSelectedAnswers({});
    setCurrentIdx(0);
    setScore(0);
    setIsFlipped(false);

    try {
      const { data } = await API.post('/placement-prep/generate', {
        category: module,
        subcategory: category,
        difficulty,
        count: questionCount,
        company,
        mode: practiceMode
      });

      if (data.status === 'success') {
        setQuestions(data.data);
        toast.success(`Generated ${data.data.length} Placement Questions!`);

        // Start timer if in Timed Test mode
        if (practiceMode === 'Timed Test') {
          startTimer(questionCount * 60); // 1 minute per question
        } else {
          // General count-up timer
          setTimeTaken(0);
          setTimerActive(true);
          const interval = setInterval(() => {
            setTimeTaken(prev => prev + 1);
          }, 1000);
          setTimerIntervalId(interval);
        }
      }
    } catch {
      toast.error('Failed to generate questions. Gemini is busy, please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Select Option Answer Action
  const handleSelectOption = (option) => {
    if (selectedAnswers[currentIdx]) return; // already answered

    const correctAns = questions[currentIdx].correctAnswer;
    const isCorrect = option.trim() === correctAns.trim();

    setSelectedAnswers({ ...selectedAnswers, [currentIdx]: option });

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
      toast.success(
        ['Excellent!', 'Correct Answer!', 'Great Job!', 'Brilliant!'][
          Math.floor(Math.random() * 4)
        ]
      );
    } else {
      setShakeCard(true);
      setTimeout(() => setShakeCard(false), 500);
      // Flip the card automatically to show the explanation
      setTimeout(() => setIsFlipped(true), 800);
      toast.error('Incorrect Answer. Review the explanation.');
    }
  };

  // Skip Question
  const handleSkip = () => {
    setSelectedAnswers({ ...selectedAnswers, [currentIdx]: 'Skipped' });
    handleNext();
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setIsFlipped(false);
    } else {
      handleFinishQuiz();
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
      setIsFlipped(false);
    }
  };

  // Finish session
  const handleFinishQuiz = async () => {
    stopTimer();
    setLoading(true);

    try {
      const { data } = await API.post('/placement-prep/save-result', {
        category: module,
        subcategory: category,
        score,
        totalQuestions: questions.length,
        timeTaken,
        company,
        mode: practiceMode,
      });

      if (data.status === 'success') {
        setXpEarned(data.data.xpEarned);
        setCoinsEarned(data.data.coinsEarned);
        if (data.data.unlockedBadges.length > 0) {
          setBadgeUnlocked(data.data.unlockedBadges[0]);
        }
        setShowSummary(true);
        fetchStats(); // update scoreboard details
        fetchLeaderboard();
        fetchHistory();
        toast.success('Practice session saved successfully!');
      }
    } catch {
      toast.error('Failed to save quiz results.');
    } finally {
      setLoading(false);
    }
  };

  // Bookmarking question toggle
  const handleToggleBookmark = async (q) => {
    try {
      const { data } = await API.post('/placement-prep/bookmark', {
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || '',
        shortcut: q.shortcut || '',
        formula: q.formula || '',
        category: module,
        subcategory: q.topic || category,
        difficulty: q.difficulty || difficulty,
        notes: bookmarkNotes,
        isDifficult: true,
      });

      if (data.status === 'success') {
        fetchBookmarks();
        toast.success(data.isBookmarked ? 'Question bookmarked!' : 'Question removed from bookmarks.');
      }
    } catch {
      toast.error('Failed to bookmark question.');
    }
  };

  // Start Daily Challenge
  const handleStartDailyChallenge = () => {
    if (!dailyChallenge) return;
    setShowConfetti(false);
    setShowSummary(false);
    setSelectedAnswers({});
    setCurrentIdx(0);
    setScore(0);
    setIsFlipped(false);

    // Merge daily aptitude & verbal questions into a single quiz set of 20 questions
    const dailySet = [...dailyChallenge.aptitude, ...dailyChallenge.verbal];
    setQuestions(dailySet);
    
    // Start standard quiz timer
    setTimeTaken(0);
    setTimerActive(true);
    const interval = setInterval(() => {
      setTimeTaken(prev => prev + 1);
    }, 1000);
    setTimerIntervalId(interval);
  };

  // Submit completion of Daily Challenge
  const handleCompleteDailyChallenge = async () => {
    try {
      const { data } = await API.post('/placement-prep/daily-challenge/complete');
      if (data.status === 'success') {
        setXpEarned(data.data.xpAwarded);
        setCoinsEarned(data.data.coinsAwarded);
        setDailyCompleted(true);
        setShowConfetti(true);
        fetchStats();
        toast.success('Congratulations! Daily Challenge bonus claimed.');
      }
    } catch {
      toast.error('Failed to claim daily challenge reward.');
    }
  };

  const isBookmarked = (qText) => {
    return bookmarks.some(b => b.questionText === qText);
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-main relative transition-colors duration-300">
      <PremiumAnimatedBackground />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        {showConfetti && <Confetti />}

        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/5">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                🎯 Placement Preparation Hub
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Aptitude Practice, Verbal Ability modules, and Daily Streak tracker powered by Gemini AI.
              </p>
            </div>
            
            {/* XP and Coins HUD */}
            {stats && (
              <div className="flex items-center gap-4 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 py-2 rounded-2xl">
                <div className="flex items-center gap-1.5" title="XP (Experience Points)">
                  <Trophy className="w-4 h-4 text-indigo-500" />
                  <span className="text-xs font-black">{stats.xp} XP</span>
                </div>
                <div className="flex items-center gap-1.5" title="Earned Coins">
                  <Coins className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-black">{stats.coins} Coins</span>
                </div>
                <div className="flex items-center gap-1.5" title="Daily Streak">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-xs font-black">{stats.dailyStreak} Days</span>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 dark:border-white/5 overflow-x-auto no-scrollbar gap-6">
            {[
              { id: 'hub', label: 'Practice Hub', icon: Compass },
              { id: 'daily', label: 'Daily Challenge', icon: Flame },
              { id: 'bookmarks', label: 'Bookmarked Questions', icon: Bookmark },
              { id: 'leaderboard', label: 'Leaderboard', icon: Users },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setQuestions([]);
                    setShowSummary(false);
                  }}
                  className={`flex items-center gap-2 py-3 px-1 border-b-2 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                    active
                      ? 'border-indigo-500 text-indigo-500 dark:text-indigo-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Practice Hub Tab */}
          {activeTab === 'hub' && questions.length === 0 && !showSummary && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Form config panel */}
              <div className="lg:col-span-2 space-y-6">
                <div className="glass-panel p-6 space-y-5">
                  <h2 className="text-lg font-black font-display text-white">Setup Practice Session</h2>
                  
                  {/* Module Toggle */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-900/60 p-1 border border-white/5 rounded-xl">
                    {['Aptitude', 'Verbal'].map((mod) => (
                      <button
                        key={mod}
                        onClick={() => setModule(mod)}
                        className={`py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                          module === mod ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {mod === 'Aptitude' ? '🔢 Aptitude Practice' : '🗣 Verbal Ability'}
                      </button>
                    ))}
                  </div>

                  {/* Subcategory List */}
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-400">Select Category</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1 no-scrollbar border border-white/5 rounded-xl p-2 bg-white/5">
                      {(module === 'Aptitude' ? APTITUDE_CATEGORIES : VERBAL_CATEGORIES).map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setCategory(cat)}
                          className={`py-2 px-3 rounded-lg text-left text-xs font-semibold truncate border transition cursor-pointer ${
                            category === cat
                              ? 'bg-indigo-500/10 border-indigo-500/35 text-indigo-400 font-bold'
                              : 'bg-transparent border-transparent text-slate-400 hover:text-slate-100 hover:bg-white/5'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Difficulty */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-400">Difficulty</label>
                      <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      >
                        {['Easy', 'Medium', 'Hard'].map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>

                    {/* Question quantity */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-400">Number of Questions</label>
                      <select
                        value={questionCount}
                        onChange={(e) => setQuestionCount(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      >
                        {[10, 20, 30, 50].map(q => (
                          <option key={q} value={q}>{q} Questions</option>
                        ))}
                      </select>
                    </div>

                    {/* Practice mode */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-400">Practice Mode</label>
                      <select
                        value={practiceMode}
                        onChange={(e) => setPracticeMode(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      >
                        {['Quick Practice', 'Timed Test', 'Mock Test', 'Adaptive AI Mode'].map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Company selection */}
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-400">Target Company Pattern (Optional)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <button
                        onClick={() => setCompany('')}
                        className={`py-2 px-3 rounded-lg text-center text-xs font-semibold border transition cursor-pointer ${
                          !company
                            ? 'bg-indigo-500/10 border-indigo-500/35 text-indigo-400 font-bold'
                            : 'bg-transparent border-transparent text-slate-400 hover:text-slate-100 hover:bg-white/5'
                        }`}
                      >
                        General Pattern
                      </button>
                      {COMPANIES.slice(0, 7).map((c) => (
                        <button
                          key={c.name}
                          onClick={() => setCompany(c.name)}
                          className={`py-2 px-3 rounded-lg text-center text-xs font-semibold border transition cursor-pointer ${
                            company === c.name
                              ? 'bg-indigo-500/10 border-indigo-500/35 text-indigo-400 font-bold'
                              : 'bg-transparent border-transparent text-slate-400 hover:text-slate-100 hover:bg-white/5'
                          }`}
                        >
                          {c.name} Pattern
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="w-full btn-primary py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer font-black text-sm"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Generating Questions with Gemini AI...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Generate Questions
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Sidebar stats/guidelines */}
              <div className="space-y-6">
                {stats && (
                  <div className="glass-panel p-5 space-y-4">
                    <h3 className="text-sm font-bold font-display text-white border-b border-white/5 pb-2">Preparation Status</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <span className="text-[10px] text-slate-400 block font-bold uppercase">Questions Solved</span>
                        <span className="text-xl font-extrabold block mt-1">{stats.questionsSolved}</span>
                      </div>
                      <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <span className="text-[10px] text-slate-400 block font-bold uppercase">Accuracy</span>
                        <span className="text-xl font-extrabold block mt-1">{stats.accuracyRate}%</span>
                      </div>
                      <div className="p-3 bg-white/5 rounded-xl border border-white/5 col-span-2">
                        <span className="text-[10px] text-slate-400 block font-bold uppercase">Strongest Category</span>
                        <span className="text-xs font-bold block mt-1 text-indigo-400 truncate">{stats.strongestCategory}</span>
                      </div>
                    </div>
                    <div className="pt-2">
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span>Placement Readiness</span>
                        <span>{stats.placementReadiness}%</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#6366F1] to-[#ec4899]" style={{ width: `${stats.placementReadiness}%` }} />
                      </div>
                    </div>
                  </div>
                )}
                <div className="glass-panel p-5 space-y-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-amber-500" />
                    How it works
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Choose Aptitude (Quant, Logic, Puzzles) or Verbal (English, Reading) and let Gemini AI generate custom sets. Select Timed Test for a countdown timer, or Company-wise to adapt difficulty to corporate patterns. Earn Coins & XP, build streaks, and verify solutions with shortcuts!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Flashcard Quiz View */}
          {questions.length > 0 && !showSummary && (
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Scoreboard / Progress info */}
              <div className="flex justify-between items-center bg-slate-900/60 p-4 border border-white/5 rounded-2xl">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded bg-indigo-500/20 text-indigo-300">
                      {questions[currentIdx].difficulty || difficulty}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      Question {currentIdx + 1} of {questions.length}
                    </span>
                  </div>
                  <div className="w-44 bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
                  </div>
                </div>

                {/* Accuracy HUD */}
                <div className="flex gap-4">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase font-black block">Score</span>
                    <span className="text-sm font-bold text-emerald-400">{score} Correct</span>
                  </div>
                  {timerActive && (
                    <div className="text-right border-l border-white/10 pl-4">
                      <span className="text-[10px] text-slate-500 uppercase font-black block">Time Left</span>
                      <span className="text-sm font-bold text-amber-400">{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 3D animated question flashcard */}
              <div className="perspective-1000 w-full min-h-[380px]">
                <div
                  className={`relative w-full min-h-[380px] duration-700 preserve-3d transform-style transition-transform ${
                    isFlipped ? 'rotate-y-180' : ''
                  } ${shakeCard ? 'animate-shake' : ''}`}
                >
                  {/* Card Front Side */}
                  <div className="absolute inset-0 backface-hidden w-full h-full glass-panel p-8 flex flex-col justify-between overflow-y-auto no-scrollbar">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">
                          Topic: {questions[currentIdx].topic || category}
                        </h2>
                        <button
                          onClick={() => handleToggleBookmark(questions[currentIdx])}
                          className={`p-1.5 rounded-lg border transition cursor-pointer ${
                            isBookmarked(questions[currentIdx].questionText)
                              ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400'
                              : 'border-white/5 text-slate-400 hover:text-white'
                          }`}
                          title="Bookmark Question"
                        >
                          <Bookmark className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <p className="text-base font-bold text-white leading-relaxed">
                        {questions[currentIdx].questionText}
                      </p>
                    </div>

                    {/* Options list */}
                    <div className="space-y-3 pt-6">
                      {questions[currentIdx].options.map((option, idx) => {
                        const selected = selectedAnswers[currentIdx];
                        const correctAns = questions[currentIdx].correctAnswer;
                        const isCorrectOption = option.trim() === correctAns.trim();
                        const isUserSelection = selected === option;

                        let optionStyle = 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20';
                        if (selected) {
                          if (isCorrectOption) {
                            optionStyle = 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 font-bold';
                          } else if (isUserSelection) {
                            optionStyle = 'bg-red-500/20 border-red-500/40 text-red-400 font-bold';
                          } else {
                            optionStyle = 'bg-white/5 border-white/5 text-slate-500 opacity-60';
                          }
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => handleSelectOption(option)}
                            disabled={!!selected}
                            className={`w-full py-3 px-4 rounded-xl border text-left text-xs font-semibold transition cursor-pointer flex items-center justify-between gap-3 ${optionStyle}`}
                          >
                            <span>{option}</span>
                            {selected && isCorrectOption && <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                            {selected && isUserSelection && !isCorrectOption && <X className="w-4 h-4 text-red-400 flex-shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Flip hint */}
                    {selectedAnswers[currentIdx] && (
                      <div className="flex justify-center pt-4">
                        <button
                          onClick={() => setIsFlipped(true)}
                          className="flex items-center gap-1.5 text-[10px] uppercase font-black tracking-widest text-indigo-400 hover:text-indigo-300 cursor-pointer"
                        >
                          <RotateCw className="w-3.5 h-3.5" /> View Solution Explanation
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Card Back Side (Explanation) */}
                  <div className="absolute inset-0 rotate-y-180 backface-hidden w-full h-full glass-panel p-8 flex flex-col justify-between overflow-y-auto no-scrollbar border-l-4 border-indigo-500">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Detailed AI Explanation</span>
                        <button
                          onClick={() => setIsFlipped(false)}
                          className="text-[10px] uppercase font-black text-slate-400 hover:text-white cursor-pointer"
                        >
                          Show Question
                        </button>
                      </div>

                      <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                        <div>
                          <span className="font-extrabold text-white block">Explanation:</span>
                          <p>{questions[currentIdx].explanation}</p>
                        </div>

                        {questions[currentIdx].shortcut && (
                          <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                            <span className="font-extrabold text-indigo-400 flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5" /> Shortcut Trick:
                            </span>
                            <p className="mt-1">{questions[currentIdx].shortcut}</p>
                          </div>
                        )}

                        {questions[currentIdx].formula && (
                          <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                            <span className="font-extrabold text-emerald-400">Formula Used:</span>
                            <p className="mt-1 font-mono">{questions[currentIdx].formula}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => setIsFlipped(false)}
                      className="w-full mt-4 py-2 border border-white/10 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer"
                    >
                      Flip back to question
                    </button>
                  </div>
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="flex justify-between gap-4">
                <button
                  onClick={handlePrev}
                  disabled={currentIdx === 0}
                  className="px-4 py-2.5 border border-white/10 rounded-xl text-xs font-bold text-slate-400 hover:text-white disabled:opacity-30 flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>

                <div className="flex gap-2">
                  {!selectedAnswers[currentIdx] && (
                    <button
                      onClick={handleSkip}
                      className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
                    >
                      Skip
                    </button>
                  )}
                  {currentIdx === questions.length - 1 ? (
                    <button
                      onClick={handleFinishQuiz}
                      className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl text-xs font-black uppercase text-white cursor-pointer"
                    >
                      Finish Test
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white flex items-center gap-1 cursor-pointer"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Post Quiz Summary Panel */}
          {showSummary && (
            <div className="max-w-3xl mx-auto space-y-6">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-panel p-8 text-center space-y-6 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#10b981]/5 rounded-full blur-[60px]" />
                <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto">
                  <Trophy className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-black font-display text-white">Practice Session Summary</h2>
                  <p className="text-xs text-slate-400">Excellent job completing your placement practice paper.</p>
                </div>

                {/* Score numbers */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Accuracy</span>
                    <span className="text-2xl font-black block text-indigo-400 mt-1">
                      {Math.round((score / questions.length) * 100)}%
                    </span>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Score</span>
                    <span className="text-2xl font-black block text-emerald-400 mt-1">
                      {score} / {questions.length}
                    </span>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">XP Awarded</span>
                    <span className="text-2xl font-black block text-amber-500 mt-1">+{xpEarned} XP</span>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Coins Won</span>
                    <span className="text-2xl font-black block text-yellow-500 mt-1">+{coinsEarned} Coins</span>
                  </div>
                </div>

                {badgeUnlocked && (
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-3 justify-center">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <span className="text-xs font-bold text-amber-400">Badge Unlocked: {badgeUnlocked}!</span>
                  </div>
                )}

                {/* Performance feedback */}
                <div className="bg-slate-900/60 p-5 border border-white/5 rounded-2xl text-left space-y-3">
                  <h4 className="text-xs font-black uppercase text-indigo-400">AI Learning Assistant Feedback</h4>
                  <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                    <p>
                      <strong>Performance Rating:</strong> {score >= questions.length * 0.8 ? '⭐⭐⭐⭐⭐ High Placement Readiness!' : score >= questions.length * 0.5 ? '⭐⭐⭐⭐ Moderate Readiness.' : '⭐⭐ Need improvement.'}
                    </p>
                    <p>
                      <strong>Strengths:</strong> Demonstrates rapid processing of subcategory elements with clear conceptual alignment.
                    </p>
                    <p>
                      <strong>Recommended Focus:</strong> Revise key shortcuts, test speed, and retry incorrect items in this category to secure accuracy levels above 80%.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => {
                      setQuestions([]);
                      setShowSummary(false);
                    }}
                    className="flex-1 btn-secondary py-3 rounded-xl font-bold text-xs cursor-pointer"
                  >
                    Back to Hub
                  </button>
                  <button
                    onClick={handleGenerate}
                    className="flex-1 btn-primary py-3 rounded-xl font-black text-xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className="w-4 h-4" /> Practice Next Questions
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* Daily Challenge Tab */}
          {activeTab === 'daily' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="glass-panel p-8 text-center space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-orange-500/5 rounded-full blur-[60px]" />
                <div className="w-16 h-16 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-full flex items-center justify-center mx-auto">
                  <Flame className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-black font-display text-white">Daily Challenge</h2>
                  <p className="text-xs text-slate-400">Generate 10 Aptitude + 10 Verbal Questions every day. Build streaks & earn extra rewards!</p>
                </div>

                {dailyChallenge ? (
                  <div className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                        <span className="text-[10px] text-slate-500 uppercase font-black block">Aptitude</span>
                        <span className="text-base font-bold text-slate-200 mt-1 block">10 Questions</span>
                      </div>
                      <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                        <span className="text-[10px] text-slate-500 uppercase font-black block">Verbal</span>
                        <span className="text-base font-bold text-slate-200 mt-1 block">10 Questions</span>
                      </div>
                    </div>

                    {dailyCompleted ? (
                      <div className="space-y-4">
                        <div className="p-4 bg-emerald-500/15 border border-emerald-500/20 rounded-2xl text-emerald-400 text-xs font-bold">
                          🎉 You have completed today's daily challenge! Reward (+100 XP, +50 Coins) has been claimed.
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={handleStartDailyChallenge}
                        className="w-full btn-primary py-3 rounded-xl font-black text-xs cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Play className="w-4 h-4" /> Start Daily Challenge
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="py-8 flex flex-col items-center gap-3">
                    <RefreshCw className="w-8 h-8 text-slate-500 animate-spin" />
                    <p className="text-xs text-slate-500">Fetching daily challenge...</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bookmarked Questions Tab */}
          {activeTab === 'bookmarks' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold font-display text-white">Bookmarked Questions for Review</h2>

              {bookmarks.length === 0 ? (
                <div className="glass-panel p-8 text-center text-slate-500 text-xs font-bold">
                  No bookmarked questions yet. Click the bookmark icon during practice to add questions here.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bookmarks.map((b) => (
                    <div key={b._id} className="glass-panel p-5 space-y-4 flex flex-col justify-between border-l-4 border-indigo-500">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase text-indigo-400 tracking-wider">
                          <span>{b.subcategory}</span>
                          <span className="px-2 py-0.5 rounded bg-white/5">{b.difficulty}</span>
                        </div>
                        <p className="text-xs font-bold text-white leading-relaxed">{b.questionText}</p>
                      </div>

                      <div className="space-y-2 border-t border-white/5 pt-3 text-[11px] text-slate-400">
                        <div>
                          <strong className="text-white">Correct Answer:</strong> {b.correctAnswer}
                        </div>
                        {b.explanation && (
                          <div>
                            <strong className="text-white">Explanation:</strong> {b.explanation}
                          </div>
                        )}
                        {b.notes && (
                          <div className="p-2 bg-yellow-500/5 border border-yellow-500/10 rounded-lg text-yellow-500/80">
                            <strong>My Note:</strong> {b.notes}
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => handleToggleBookmark(b)}
                          className="text-[10px] uppercase font-black text-red-400 hover:text-red-300 transition cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Leaderboard Tab */}
          {activeTab === 'leaderboard' && (
            <div className="max-w-lg mx-auto space-y-4">
              <h2 className="text-lg font-bold font-display text-white text-center">🏆 Global Placement Prep Leaderboard</h2>
              <div className="glass-panel p-4 divide-y divide-white/5">
                {leaderboard.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs font-bold">No leaderboard data.</div>
                ) : (
                  leaderboard.map((u, i) => (
                    <div key={u._id} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <span className={`w-6 text-center font-extrabold text-xs ${i === 0 ? 'text-yellow-400 text-sm' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-amber-600' : 'text-slate-500'}`}>
                          {i + 1}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-extrabold flex items-center justify-center text-xs overflow-hidden border border-white/10 select-none">
                          {u.profilePicture ? (
                            <img src={u.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            u.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <span className="text-xs font-bold text-slate-200">{u.name}</span>
                      </div>
                      <span className="text-xs font-black text-indigo-400">{u.xp || 0} XP</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
