import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Briefcase, ChevronRight, Check, Palette, Upload, FileText, ArrowRight, User } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../utils/api';

const CAREER_FIELDS = [
  { id: 'tech', label: 'Software Engineering', icon: Sparkles },
  { id: 'data', label: 'Data Science & Analytics', icon: Sparkles },
  { id: 'product', label: 'Product Management', icon: Sparkles },
  { id: 'design', label: 'UI/UX Design & Creative', icon: Palette },
  { id: 'marketing', label: 'Marketing & Strategy', icon: Briefcase },
  { id: 'finance', label: 'Finance & Banking', icon: Briefcase },
  { id: 'sales', label: 'Sales & Business Dev', icon: Briefcase },
];

const TEMPLATES = [
  { id: 'classic', name: 'Classic Elite', desc: 'ATS-optimized double column' },
  { id: 'modern', name: 'Modern Pro', desc: 'Sleek design with accent colors' },
  { id: 'minimal', name: 'Minimalist', desc: 'Clean, spacing-focused design' },
  { id: 'creative', name: 'Creative Aura', desc: 'Side column layout with badges' },
];

export default function Onboarding({ onComplete, userName, user }) {
  const [step, setStep] = useState(user?.careerField ? 4 : 1);
  const [careerField, setCareerField] = useState(user?.careerField || '');
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (step === 1 && !careerField) {
      toast.error('Please select your career field to continue');
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      await API.put('/users/profile', {
        careerField,
        portfolioTheme: 'modern',
      });
      toast.success("Career details saved! Now let's complete your profile.");
      onComplete(careerField);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save profile selections');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#050816]/95 flex items-center justify-center p-4 backdrop-blur-md">
      {/* Glow Orbs in background */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-[#7c5cff]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-[#4f46e5]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-xl bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl overflow-hidden">
        {/* Step indicator bar */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
            Step {step} of 4
          </span>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1.5 w-8 rounded-full transition-all duration-300 ${
                  s <= step ? 'bg-indigo-500' : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
                  Welcome, {userName || 'Friend'}! <span className="animate-bounce">👋</span>
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  Let's personalize your experience. Which career field best represents you?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[280px] overflow-y-auto pr-1 no-scrollbar">
                {CAREER_FIELDS.map((field) => {
                  const Icon = field.icon;
                  const isSelected = careerField === field.label;
                  return (
                    <button
                      key={field.id}
                      onClick={() => setCareerField(field.label)}
                      className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                        isSelected
                          ? 'bg-indigo-600/10 border-indigo-500 text-white font-bold shadow-md'
                          : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-900 text-slate-400'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold">{field.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleNext}
                  className="btn-primary flex items-center gap-1.5 py-3 px-6 shadow-glow-brand cursor-pointer"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Select a Starting Design
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  Pick a template style that fits your industry. You can swap this at any time in the builder.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TEMPLATES.map((tmpl) => {
                  const isSelected = selectedTemplate === tmpl.id;
                  return (
                    <button
                      key={tmpl.id}
                      onClick={() => setSelectedTemplate(tmpl.id)}
                      className={`p-4 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                        isSelected
                          ? 'bg-indigo-600/10 border-indigo-500 text-white font-bold shadow-md'
                          : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <span className="text-sm font-bold text-slate-200">{tmpl.name}</span>
                      <span className="text-xs text-slate-500">{tmpl.desc}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between pt-4">
                <button onClick={handleBack} className="btn-secondary py-3 px-6 cursor-pointer">
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="btn-primary flex items-center gap-1.5 py-3 px-6 shadow-glow-brand cursor-pointer"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                  Welcome to HireCraftt
                </h2>
                <p className="text-slate-400 text-xs mt-0.5">
                  Explore the 5 core modules designed to accelerate your career growth:
                </p>
              </div>

              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
                {[
                  { title: "📝 Resume Builder", desc: "Build high-converting CVs using ATS-optimized layouts & real-time guidance." },
                  { title: "🎯 ATS Scoring & Optimization", desc: "Scan and check your resumes against job descriptions to score keyword matches." },
                  { title: "🌐 Portfolio Generator", desc: "Create a custom online portfolio link matching Modern, Minimal, and Dark styles." },
                  { title: "💬 AI Career Coach", desc: "Interactive career coach for interview questions, resume bullets, and tips." },
                  { title: "💼 Job Tracker & Analytics", desc: "Track application statuses, streaks, streaks points, and analytics." }
                ].map((mod, idx) => (
                  <div key={idx} className="p-3 bg-slate-950/50 border border-slate-800/80 rounded-2xl flex flex-col gap-0.5">
                    <h4 className="text-xs font-black text-indigo-400">{mod.title}</h4>
                    <p className="text-[11px] text-slate-300 font-semibold leading-relaxed">{mod.desc}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-4">
                <button onClick={handleBack} className="btn-secondary py-3 px-6 cursor-pointer">
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="btn-primary flex items-center gap-1.5 py-3 px-6 shadow-glow-brand cursor-pointer"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
                  <User className="w-8 h-8 text-indigo-400" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {user?.careerField ? "Profile Setup Required" : "Almost Done!"}
                </h2>
                <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto font-medium">
                  {user?.careerField 
                    ? "Please complete your profile details to unlock your HireCraftt account."
                    : `Onboarding completed for ${careerField || 'your job profile'}. Let's fill out your profile details to activate your account.`}
                </p>
                
                <div className="mt-4 p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/10 text-left space-y-2.5 max-w-sm mx-auto">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">Compulsory Profile Details</span>
                  <ul className="text-xs text-slate-300 font-semibold space-y-1">
                    <li className="flex items-center gap-1.5">🟢 Full Name</li>
                    <li className="flex items-center gap-1.5">🟢 Phone Number</li>
                    <li className="flex items-center gap-1.5">🟢 Career Field / Role</li>
                    <li className="flex items-center gap-1.5">🟢 At least 1 Professional Skill</li>
                    <li className="flex items-center gap-1.5">🟢 At least 1 Education Record</li>
                  </ul>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                {!user?.careerField && (
                  <button onClick={handleBack} className="btn-secondary py-3 px-6 cursor-pointer" disabled={loading}>
                    Back
                  </button>
                )}
                <button
                  onClick={handleFinish}
                  disabled={loading}
                  className="btn-primary flex items-center gap-1.5 py-3 px-6 shadow-glow-brand cursor-pointer ml-auto"
                >
                  {loading ? 'Redirecting...' : 'Set Up Profile Now'} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
