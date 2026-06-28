import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ClipboardCopy,
  Download,
  Edit3,
  Check,
  Briefcase,
  Building2,
  ChevronDown,
  Loader2,
  FileText,
  HelpCircle,
  GraduationCap,
  Info
} from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import PremiumAnimatedBackground from '../components/layout/PremiumAnimatedBackground';
import HelpModal from '../components/ui/HelpModal';
import API from '../utils/api';

const EXPERIENCE_LEVELS = ['Entry Level', 'Mid Level', 'Senior', 'Executive'];
const TONES = ['Professional', 'Friendly', 'Executive', 'Creative'];

const SkeletonLetter = () => (
  <div className="space-y-4 animate-pulse p-10">
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className="h-4 rounded-full bg-slate-800"
        style={{ width: `${80 - i * 8}%` }}
      />
    ))}
    <div className="h-4 rounded-full bg-slate-800 w-3/4 mt-6" />
    {[...Array(4)].map((_, i) => (
      <div key={`b${i}`} className="h-4 rounded-full bg-slate-800" style={{ width: `${90 - i * 5}%` }} />
    ))}
  </div>
);

export default function CoverLetterPage() {
  const [companyName, setCompanyName] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Mid Level');
  const [tone, setTone] = useState('Professional');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [letter, setLetter] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const letterRef = useRef(null);

  const [beginnerMode, setBeginnerMode] = useState(
    localStorage.getItem('hirecraftt-beginner-mode') === 'true'
  );
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  useEffect(() => {
    const handleModeChange = (e) => {
      setBeginnerMode(e.detail);
    };
    window.addEventListener('beginner-mode-change', handleModeChange);
    return () => window.removeEventListener('beginner-mode-change', handleModeChange);
  }, []);

  const handleGenerate = async () => {
    if (!companyName.trim() || !jobRole.trim()) {
      toast.error('Please enter the Company Name and Job Title.');
      return;
    }
    setLoading(true);
    setLetter('');
    setEditMode(false);
    try {
      const { data } = await API.post('/cover-letter/generate', {
        companyName,
        jobRole,
        experienceLevel,
        tone,
        jobDescription
      });
      setLetter(data.coverLetter || '');
      toast.success('Cover letter generated successfully!');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to generate cover letter.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(letter);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy text.');
    }
  };

  const handleDownload = async () => {
    if (!letterRef.current) return;
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      html2pdf()
        .set({
          margin: [0.75, 1, 0.75, 1],
          filename: `Cover_Letter_${companyName.replace(/\s+/g, '_')}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        })
        .from(letterRef.current)
        .save();
      toast.success('Downloading PDF...');
    } catch {
      toast.error('PDF export failed.');
    }
  };

  const canGenerate = companyName.trim() && jobRole.trim() && !loading;

  return (
    <div className="min-h-screen bg-[#030014] text-white relative font-sans">
      <PremiumAnimatedBackground />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-grow">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/5">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-brand-500/10 border border-brand-500/20 text-[10px] font-bold text-brand-400 rounded-full uppercase tracking-wider mb-2">
                <Sparkles className="w-3 h-3 animate-spin" style={{ animationDuration: '6s' }} /> AI Writer
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                Generate Tailored Cover Letters
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Create an impact-driven, tailored cover letter aligning your expertise with company requirements.
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
                <span className="text-xs font-black uppercase tracking-wider">Student Guide: Writing Cover Letters</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
                A <strong>Cover Letter</strong> is a one-page document you submit with your resume. It introduces you to the employer, highlights your interest in the specific company, and expands on key projects or achievements.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
                  <span className="text-[10px] font-extrabold text-indigo-400 block uppercase">1. Job Title & Company</span>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    "Always mention the exact role and company name. This shows the recruiter that your application is custom-tailored, not generic."
                  </p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
                  <span className="text-[10px] font-extrabold text-emerald-400 block uppercase">2. Select Tone</span>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    "Choose professional for corporate roles, friendly for startups, and creative for agencies to match the company culture."
                  </p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
                  <span className="text-[10px] font-extrabold text-amber-400 block uppercase">3. Job Description Match</span>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    "Pasting the target job description helps the AI insert exact keywords, showing the recruiter you have the exact skills they require."
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Input Form Column */}
            <div className="md:col-span-5 space-y-6">
              <div className="p-6 rounded-[24px] bg-white/[0.03] border border-white/5 backdrop-blur-xl space-y-4">
                
                {/* Job Title */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-brand-400" /> Job Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Senior React Developer"
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    className="input-field py-2.5 text-sm"
                  />
                </div>

                {/* Company Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-brand-400" /> Company Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Vercel"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="input-field py-2.5 text-sm"
                  />
                </div>

                {/* Experience Level */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Experience Level</label>
                  <div className="relative">
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    <select
                      value={experienceLevel}
                      onChange={(e) => setExperienceLevel(e.target.value)}
                      className="w-full appearance-none px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 cursor-pointer"
                    >
                      {EXPERIENCE_LEVELS.map((lvl) => (
                        <option key={lvl} value={lvl} className="bg-dark-800 text-white">
                          {lvl}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Tones Selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Tone Selection</label>
                  <div className="grid grid-cols-2 gap-2">
                    {TONES.map((t) => (
                      <button
                        key={t}
                        onClick={() => setTone(t)}
                        className={`py-2 rounded-xl text-xs font-semibold transition ${
                          tone === t
                            ? 'bg-brand-500 text-white shadow-glow-brand'
                            : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Job Description */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-brand-400" /> Job Description
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Paste the target job description details here to maximize role alignment..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="input-field py-2 text-xs resize-none"
                  />
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={!canGenerate}
                  className="btn-primary w-full py-3 shadow-glow-brand flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Generate Cover Letter
                    </>
                  )}
                </button>

              </div>
            </div>

            {/* Generated Cover Letter Column */}
            <div className="md:col-span-7">
              <AnimatePresence mode="wait">
                {loading ? (
                  <div className="bg-[#0b0e24]/60 border border-white/5 backdrop-blur-xl rounded-[24px] overflow-hidden">
                    <SkeletonLetter />
                  </div>
                ) : letter ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {/* The editable text sheet */}
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
                      {editMode ? (
                        <textarea
                          value={letter}
                          onChange={(e) => setLetter(e.target.value)}
                          className="w-full min-h-[420px] p-8 sm:p-10 font-serif text-sm leading-relaxed text-gray-800 focus:outline-none resize-y"
                        />
                      ) : (
                        <div
                          ref={letterRef}
                          className="p-8 sm:p-10 font-serif text-sm leading-relaxed text-gray-800 whitespace-pre-wrap select-text text-left"
                        >
                          {letter}
                        </div>
                      )}
                    </div>

                    {/* Actions bar */}
                    <div className="flex gap-2">
                      <button
                        onClick={handleCopy}
                        className="btn-secondary py-2 px-4 text-xs flex items-center gap-1.5"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <ClipboardCopy className="w-3.5 h-3.5" />}
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                      <button
                        onClick={handleDownload}
                        className="btn-secondary py-2 px-4 text-xs flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" /> Download PDF
                      </button>
                      <button
                        onClick={() => setEditMode(!editMode)}
                        className={`py-2 px-4 text-xs font-semibold rounded-xl border flex items-center gap-1.5 transition ${
                          editMode 
                            ? 'bg-brand-500 text-white border-brand-500 shadow-glow-brand' 
                            : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
                        }`}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        {editMode ? 'Done Editing' : 'Edit text'}
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-full min-h-[400px] rounded-[24px] bg-white/[0.02] border border-dashed border-white/10 flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                        <FileText className="w-8 h-8" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 p-1 bg-brand-500 rounded-lg text-white">
                        <Sparkles className="w-3 h-3 animate-pulse" />
                      </div>
                    </div>
                    <div className="space-y-1 max-w-sm">
                      <h3 className="text-sm font-bold text-white">No Cover Letter Generated Yet</h3>
                      <p className="text-[11px] text-slate-400 leading-normal">
                        Fill in the role, target company, and job description on the left. AI will craft a personalized cover letter highlighting your strengths.
                      </p>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </main>
      </div>

      {/* Help Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        title="Cover Letter Assistant"
        subtitle="Understand how to structure cover letters that get read"
        sections={[
          {
            title: "What is a Cover Letter?",
            description: "A cover letter introduces you to employers. It connects the dots between your resume and the specific requirements of the job opening.",
            steps: [
              "Always keep it to a single page.",
              "Adopt a tone that mirrors the target company's branding.",
              "Call out 1-2 major projects that align directly with their needs."
            ]
          },
          {
            title: "ATS Keywords Matching",
            description: "Applicant Tracking Systems scan cover letters as well! Pasting the job description ensures the generator naturally implements critical buzzwords."
          }
        ]}
        tips={[
          "Address the recruiter by name if known; otherwise, use the company's team name.",
          "Keep the paragraphs short (3-4 lines maximum) for easy reading."
        ]}
      />
    </div>
  );
}
