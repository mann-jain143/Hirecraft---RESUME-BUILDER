import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, Mic, Play, CheckCircle, StopCircle, RefreshCw, Star, XCircle, Code, 
  Briefcase, Users, Sparkles, HelpCircle, GraduationCap, Info, Timer, Search 
} from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../utils/api';
import Navbar from '../components/Navbar';
import PremiumAnimatedBackground from '../components/layout/PremiumAnimatedBackground';
import HelpModal from '../components/ui/HelpModal';
import Typewriter from '../components/ui/Typewriter';

const ROLES = ['Software Engineer', 'Java Developer', 'React Developer', 'Full Stack Developer', 'Data Analyst', 'UI/UX Designer', 'DevOps Engineer'];

export default function InterviewPrepPage() {
  const [role, setRole] = useState('Software Engineer');
  const [loading, setLoading] = useState(false);
  const [batches, setBatches] = useState([]);
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);
  const questions = batches[currentBatchIndex] || [];
  const [resumeData, setResumeData] = useState(null);
  const [difficulty, setDifficulty] = useState('Medium');

  const [isMockActive, setIsMockActive] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState(null);

  const [timeLeft, setTimeLeft] = useState(90);
  const [beginnerMode, setBeginnerMode] = useState(
    localStorage.getItem('hirecraft-beginner-mode') === 'true'
  );
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognitionInstance, setRecognitionInstance] = useState(null);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Voice recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        toast.success('Voice recognition started. Speak your answer now...');
      };

      recognition.onerror = (e) => {
        console.error('Speech recognition error:', e);
        setIsListening(false);
        if (e.error === 'not-allowed') {
          toast.error('Microphone access denied. Please grant permission in browser settings.');
        } else {
          toast.error('Voice recognition failed. Please try again.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        setAnswer((prev) => (prev ? prev + ' ' + transcript : transcript));
      };

      recognition.start();
      setRecognitionInstance(recognition);
    } catch (err) {
      console.error('Speech recognition failed to initialize:', err);
      toast.error('Speech recognition failed to initialize');
    }
  };

  const stopListening = () => {
    if (recognitionInstance) {
      recognitionInstance.stop();
      setIsListening(false);
      toast.success('Voice listening paused.');
    }
  };

  useEffect(() => {
    const handleModeChange = (e) => {
      setBeginnerMode(e.detail);
    };
    window.addEventListener('beginner-mode-change', handleModeChange);
    return () => window.removeEventListener('beginner-mode-change', handleModeChange);
  }, []);

  useEffect(() => {
    const loadResume = async () => {
      try {
        const { data } = await API.get('/resumes');
        const list = Array.isArray(data) ? data : data?.resumes || [];
        if (list.length > 0) {
          const r = list[0];
          setResumeData({ ...r.resumeData, _id: r._id, personalInfo: { ...r.resumeData?.personalInfo, jobTitle: r.resumeData?.personalInfo?.jobTitle || role } });
        }
      } catch {
        // Use role-based fallback
      }
    };
    loadResume();
  }, []);

  const buildPayload = () => ({
    resumeData: resumeData || {
      personalInfo: { jobTitle: role, fullName: 'Candidate' },
      skills: ['Communication', 'Problem Solving', 'Teamwork'],
    },
    jobDescription: `Senior ${role} position requiring strong technical and behavioral skills.`,
    difficulty,
    role,
  });

  const generateQuestions = async (isNewSession = false) => {
    try {
      setLoading(true);
      
      let previousQuestions = [];
      if (!isNewSession) {
        previousQuestions = batches.flatMap(batch => batch.map(q => q.question));
      }

      const payload = {
        resumeData: resumeData || {
          personalInfo: { jobTitle: role, fullName: 'Candidate' },
          skills: ['Communication', 'Problem Solving', 'Teamwork'],
        },
        jobDescription: `Senior ${role} position requiring strong technical and behavioral skills.`,
        difficulty,
        role,
        previousQuestions,
      };

      const { data } = await API.post('/ai/interview-questions', payload);
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('No questions returned');
      }

      if (isNewSession) {
        setBatches([data]);
        setCurrentBatchIndex(0);
      } else {
        setBatches(prev => [...prev, data]);
        setCurrentBatchIndex(batches.length);
      }
      toast.success(`Generated ${data.length} interview questions!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate questions. Check AI key & login.');
    } finally {
      setLoading(false);
    }
  };

  // Timer logic: 90 seconds per question countdown
  useEffect(() => {
    if (!isMockActive || evaluation || evaluating) return;
    if (timeLeft <= 0) {
      toast.error('Time is up! Submitting whatever response you have.');
      submitAnswer();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isMockActive, evaluation, evaluating]);

  const startMock = async () => {
    if (questions.length === 0) {
      await generateQuestions(true);
    }
    setTimeLeft(90);
    setIsMockActive(true);
  };

  const submitAnswer = async () => {
    if (!answer.trim() && timeLeft > 0) return toast.error('Please enter an answer or wait for the timer to expire');
    try {
      setEvaluating(true);
      const { data } = await API.post('/ai/mock', {
        question: questions[currentQIndex].question,
        answer: answer || 'No response provided within time limit.',
        role,
      });
      setEvaluation(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to evaluate answer');
    } finally {
      setEvaluating(false);
    }
  };

  const nextQuestion = () => {
    if (recognitionInstance) {
      try { recognitionInstance.stop(); } catch (err) {}
    }
    setIsListening(false);
    setAnswer('');
    setEvaluation(null);
    setTimeLeft(90);
    setCurrentQIndex((prev) => Math.min(prev + 1, questions.length - 1));
  };

  const endMock = () => {
    if (recognitionInstance) {
      try { recognitionInstance.stop(); } catch (err) {}
    }
    setIsListening(false);
    setIsMockActive(false);
    setAnswer('');
    setEvaluation(null);
    setTimeLeft(90);
    setCurrentQIndex(0);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'HR': return <Users className="w-5 h-5 text-purple-400" />;
      case 'Technical': return <Briefcase className="w-5 h-5 text-blue-400" />;
      case 'Behavioral': return <Star className="w-5 h-5 text-amber-400" />;
      case 'Coding': return <Code className="w-5 h-5 text-emerald-400" />;
      default: return <Bot className="w-5 h-5 text-brand-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050816] text-slate-900 dark:text-white relative transition-colors duration-300 overflow-hidden">
      <PremiumAnimatedBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-grow max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8 space-y-8">
          
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/5">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-brand-500/10 border border-brand-500/20 text-[10px] font-bold text-brand-400 rounded-full uppercase tracking-wider mb-2">
                <Bot className="w-3 h-3 text-brand-400" /> AI simulator
              </div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                AI Interview Simulator
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {resumeData ? 'Answer questions customized specifically to your resume skills.' : 'Select a target role to generate AI interview questions.'}
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
                <span className="text-xs font-black uppercase tracking-wider">Student Guide: Mock Interviews</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl font-medium">
                Welcome to the Mock Interview Simulator! Use this simulator to practice answering typical HR, Technical, and Behavioral questions before real recruiters interview you.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-3 bg-white/40 dark:bg-white/5 rounded-xl border border-white/10 space-y-1">
                  <span className="text-[10px] font-extrabold text-indigo-400 block uppercase">1. HR Questions</span>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                    "These focus on your communication, interest in the company, career goals, and cultural fit. Answer clearly and confidently."
                  </p>
                </div>
                <div className="p-3 bg-white/40 dark:bg-white/5 rounded-xl border border-white/10 space-y-1">
                  <span className="text-[10px] font-extrabold text-emerald-400 block uppercase">2. Technical Questions</span>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                    "These test your core engineering knowledge, coding skills, and stack architecture details. Focus on scalable solutions."
                  </p>
                </div>
                <div className="p-3 bg-white/40 dark:bg-white/5 rounded-xl border border-white/10 space-y-1">
                  <span className="text-[10px] font-extrabold text-amber-400 block uppercase">3. Behavioral Questions</span>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                    "These test situational handling (conflict, failure, deadlines). Structure these using the STAR method (Situation, Task, Action, Result)."
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {!isMockActive ? (
              <motion.div key="prep" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="space-y-8">

                 <motion.div
                  className="hc-3d-card rounded-3xl p-8 max-w-3xl mx-auto space-y-6"
                >
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-widest mb-3">Select Target Role</label>
                    <div className="flex flex-wrap gap-2.5 mb-4">
                      {ROLES.map((r) => (
                        <motion.button
                          key={r}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setRole(r)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                            role === r
                              ? 'bg-brand-500 text-white border-brand-500 shadow-glow-brand'
                              : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:border-brand-500/40'
                          }`}
                        >
                          {r}
                        </motion.button>
                      ))}
                    </div>

                    {/* Custom search or role input bar */}
                    <div className="relative max-w-md">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                      <input
                        type="text"
                        placeholder="Search or type custom role (e.g. MBA, Marketing Specialist, HR Manager)..."
                        value={ROLES.includes(role) ? '' : role}
                        onChange={(e) => setRole(e.target.value || 'Software Engineer')}
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-brand-500 text-white transition-all font-sans"
                      />
                    </div>
                    {!ROLES.includes(role) && role.trim() !== '' && (
                      <div className="mt-2.5 flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Custom Role Active:</span>
                        <span className="text-xs px-2.5 py-1 bg-amber-500/25 border border-amber-500/50 text-amber-300 font-bold rounded-lg uppercase tracking-wider">
                          🎯 {role}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-widest mb-3">Select Difficulty Level</label>
                    <div className="flex gap-3">
                      {['Easy', 'Medium', 'Hard'].map((diff) => (
                        <button
                          key={diff}
                          type="button"
                          onClick={() => setDifficulty(diff)}
                          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                            difficulty === diff
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-glow-brand'
                              : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-300 hover:border-indigo-500/40'
                          }`}
                        >
                          {diff === 'Easy' ? '✓ Easy' : diff === 'Medium' ? '✓ Medium' : '✓ Hard'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-200 dark:border-white/10 flex flex-wrap justify-end gap-4">
                     <button onClick={() => generateQuestions(true)} disabled={loading} className="btn-secondary py-3 px-6 flex items-center gap-2 cursor-pointer">
                      {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                      Generate 10 Questions
                    </button>
                    <button onClick={startMock} disabled={loading} className="btn-primary py-3 px-8 flex items-center gap-2 shadow-glow-brand cursor-pointer">
                      <Play className="w-5 h-5" /> Start Mock Simulator
                    </button>
                  </div>
                </motion.div>

                {questions.length > 0 ? (
                  <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                      <h3 className="col-span-full text-xl font-bold font-display px-2 text-slate-900 dark:text-white">
                        Generated Prep Set (Batch {currentBatchIndex + 1})
                      </h3>
                      {questions.map((q, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.08 }}
                          className="hc-3d-card p-6 rounded-2xl cursor-pointer"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest bg-brand-500/15 text-brand-400">
                              {q.category}
                            </span>
                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-white/10 px-2 py-1 rounded-md">
                              {q.difficulty}
                            </span>
                          </div>
                          <h4 className="text-slate-900 dark:text-white font-bold mb-3">{q.question}</h4>
                          <div className="bg-slate-50 dark:bg-dark-900/80 rounded-xl p-4 border border-slate-100 dark:border-white/5">
                            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" /> {q.tips}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* Batch Navigation & Regeneration Controls (Issue 2) */}
                    <div className="flex flex-col items-center gap-6 mt-10 p-6 bg-white/40 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-3xl backdrop-blur-xl max-w-3xl mx-auto hc-3d-card">
                      <div className="flex flex-wrap items-center justify-center gap-6">
                        <button
                          onClick={() => setCurrentBatchIndex(prev => Math.max(0, prev - 1))}
                          disabled={currentBatchIndex === 0}
                          className="px-4 py-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-50 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer border border-slate-200 dark:border-white/5"
                        >
                          Previous Batch
                        </button>
                        
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Showing Questions {currentBatchIndex * 10 + 1}–{currentBatchIndex * 10 + questions.length}
                        </span>
                        
                        <button
                          onClick={() => setCurrentBatchIndex(prev => Math.min(batches.length - 1, prev + 1))}
                          disabled={currentBatchIndex === batches.length - 1}
                          className="px-4 py-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-50 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer border border-slate-200 dark:border-white/5"
                        >
                          Next Batch
                        </button>
                      </div>

                      <button
                        onClick={() => generateQuestions(false)}
                        disabled={loading}
                        className="btn-primary py-3 px-8 flex items-center gap-2 shadow-glow-brand cursor-pointer text-xs font-bold"
                      >
                        {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        [ Generate Next 10 Questions ]
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="rounded-3xl border border-dashed border-slate-200 dark:border-white/10 p-10 flex flex-col items-center justify-center text-center max-w-3xl mx-auto bg-white/30 dark:bg-white/[0.01] space-y-3 mt-12 hc-3d-card">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                      <Bot className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">No Interview Questions Generated</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-normal">
                        Select a target role and choose your difficulty level above, then click "Generate 10 Questions" to start your practice session.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div key="mock" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto h-[80vh] flex flex-col">
                <div className="flex justify-between items-center bg-white/10 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                    <span className="font-bold text-slate-900 dark:text-white">Mock Interview Live</span>
                  </div>
                  <div className="flex items-center gap-4">
                    {!evaluation && !evaluating && (
                      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition ${
                        timeLeft <= 15 
                          ? 'bg-red-500/10 border-red-500/30 text-red-400 animate-pulse' 
                          : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                      }`}>
                        <Timer className="w-3.5 h-3.5" />
                        <span>{timeLeft}s remaining</span>
                      </div>
                    )}
                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-300">Q {currentQIndex + 1}/{questions.length}</span>
                    <button onClick={endMock} className="text-red-400 hover:text-red-300 transition flex items-center gap-1 text-sm font-bold cursor-pointer">
                      <StopCircle className="w-4 h-4" /> End
                    </button>
                  </div>
                </div>

                <div className="flex-grow bg-white/80 dark:bg-dark-800/80 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-3xl p-8 flex flex-col shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-slate-100 dark:bg-white/5">
                    <motion.div className="h-full bg-gradient-to-r from-brand-500 to-cyan-400" animate={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }} />
                  </div>

                  <div className="flex items-start gap-4 mb-8">
                    <div className="p-3 bg-brand-500/10 rounded-2xl">{getCategoryIcon(questions[currentQIndex]?.category)}</div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">{questions[currentQIndex]?.question}</h2>
                      <p className="text-sm text-brand-400 font-semibold">{questions[currentQIndex]?.category} • {questions[currentQIndex]?.difficulty}</p>
                    </div>
                  </div>

                  <div className="flex-grow flex flex-col gap-4 overflow-y-auto no-scrollbar">
                    {!evaluation ? (
                      <>
                        <div className="flex items-center justify-between bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <Mic className={`w-4 h-4 ${isListening ? 'text-red-500 animate-pulse' : 'text-indigo-400'}`} />
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                              {isListening ? '🎙️ Voice listening active. Speak clearly into your mic...' : 'Speech-to-Text Transcription'}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={isListening ? stopListening : startListening}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase transition cursor-pointer border ${
                              isListening
                                ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white'
                                : 'bg-indigo-600 border-indigo-500 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                            }`}
                          >
                            {isListening ? '🛑 Stop Recording' : '🎙️ Start Speaking'}
                          </button>
                        </div>
                        <textarea
                          value={answer}
                          onChange={(e) => setAnswer(e.target.value)}
                          placeholder="Type your answer here... Or click 'Start Speaking' to transcribe your voice answer."
                          className="flex-grow w-full bg-slate-50 dark:bg-[#0a0f25] border border-slate-200 dark:border-white/10 rounded-2xl p-6 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-brand-500 resize-none font-medium min-h-[150px]"
                        />
                        <button onClick={submitAnswer} disabled={evaluating || !answer} className="btn-primary w-full py-4 text-lg font-bold flex justify-center items-center gap-2 cursor-pointer">
                          {evaluating ? <RefreshCw className="w-6 h-6 animate-spin" /> : <CheckCircle className="w-6 h-6" />}
                          {evaluating ? 'Analyzing Answer...' : 'Submit Answer'}
                        </button>
                      </>
                    ) : (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-grow flex flex-col">
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          <div className="col-span-1 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                            <div className={`text-5xl font-black mb-2 ${evaluation.score >= 8 ? 'text-emerald-400' : evaluation.score >= 5 ? 'text-amber-400' : 'text-red-400'}`}>
                              {evaluation.score}/10
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-300">AI Score</span>
                          </div>
                          <div className="col-span-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 text-left">
                            <h4 className="font-bold text-slate-900 dark:text-white mb-2">Feedback</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-200"><Typewriter text={evaluation.feedback} speed={15} /></p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 flex-grow mb-6 text-left">
                          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5">
                            <h4 className="font-bold text-emerald-400 mb-3 flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Strengths</h4>
                            <ul className="space-y-2">
                              {(evaluation.strengths || []).map((s, i) => <li key={i} className="text-sm text-slate-600 dark:text-slate-200 flex items-start gap-2"><span className="text-emerald-400 mt-1">•</span>{s}</li>)}
                            </ul>
                          </div>
                          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5">
                            <h4 className="font-bold text-red-400 mb-3 flex items-center gap-2"><XCircle className="w-4 h-4" /> Improve</h4>
                            <ul className="space-y-2">
                              {(evaluation.weaknesses || []).map((w, i) => <li key={i} className="text-sm text-slate-600 dark:text-slate-200 flex items-start gap-2"><span className="text-red-400 mt-1">•</span>{w}</li>)}
                            </ul>
                          </div>
                        </div>

                        {/* Exemplar Reference Answer */}
                        {questions[currentQIndex]?.answer && (
                          <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-5 mb-6 text-left">
                            <h4 className="font-bold text-indigo-400 mb-2 flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-indigo-400" /> Exemplar Reference Answer
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                              {questions[currentQIndex].answer}
                            </p>
                          </div>
                        )}

                        {currentQIndex < questions.length - 1 ? (
                          <button onClick={nextQuestion} className="btn-primary w-full py-4 text-lg font-bold cursor-pointer">Next Question</button>
                        ) : (
                          <button onClick={endMock} className="btn-primary bg-emerald-500 hover:bg-emerald-600 w-full py-4 text-lg font-bold cursor-pointer">Finish Interview</button>
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Help Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        title="AI Interview Coach Guide"
        subtitle="Learn how to ace your HR, Technical, and Behavioral rounds"
        sections={[
          {
            title: "Mock Simulator Practice",
            description: "The simulator takes you through a 10-question live mock interview customized to your target role. You have a 90-second countdown timer for each response.",
            steps: [
              "Read the question carefully and structure your response.",
              "If the timer runs out, your current response is automatically submitted.",
              "Submit to see an AI-generated score, strengths, and areas to improve."
            ]
          },
          {
            title: "The STAR Response Method",
            description: "For behavioral questions (e.g. 'Tell me about a time you failed'), always structure your response using the STAR model:",
            steps: [
              "Situation: Describe the context or problem you faced.",
              "Task: Explain what your responsibility was.",
              "Action: Detail the exact steps you took to address the problem.",
              "Result: Share the final outcome, ideally with measurable metrics."
            ]
          }
        ]}
        tips={[
          "Compare your response with the provided 'Exemplar Reference Answer' under feedback to see how a senior engineer would respond.",
          "Select 'Easy' to practice basic definitions, and transition to 'Hard' for complex system design and behavioral syncs."
        ]}
      />
    </div>
  );
}
