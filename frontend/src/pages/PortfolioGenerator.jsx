import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Save, ExternalLink, Link as LinkIcon, RefreshCw, Smartphone, Monitor, HelpCircle, GraduationCap, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import Navbar from '../components/Navbar';
import PremiumAnimatedBackground from '../components/layout/PremiumAnimatedBackground';
import HelpModal from '../components/ui/HelpModal';
import { QRCodeSVG } from 'qrcode.react';

const THEMES = [
  { id: 'modern', name: 'Modern Developer' },
  { id: 'minimal', name: 'Minimal Professional' },
  { id: 'dark', name: 'Dark Futuristic' },
  { id: 'creative', name: 'Creative Designer' }
];

export default function PortfolioGenerator() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [portfolio, setPortfolio] = useState({
    username: '',
    theme: 'modern',
    isPublic: true,
    socialLinks: { github: '', linkedin: '', twitter: '', website: '' }
  });
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  
  // Preview State
  const [previewMode, setPreviewMode] = useState('desktop'); // desktop or mobile

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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [portRes, resRes] = await Promise.all([
        API.get('/portfolio'),
        API.get('/resumes')
      ]);
      setPortfolio(portRes.data);
      if (portRes.data.resumeId) {
        setSelectedResumeId(portRes.data.resumeId._id || portRes.data.resumeId);
      }
      setResumes(resRes.data);
    } catch (err) {
      toast.error('Failed to load portfolio settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await API.put('/portfolio', {
        ...portfolio,
        resumeId: selectedResumeId
      });
      toast.success('Portfolio Updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><RefreshCw className="w-8 h-8 animate-spin text-brand-500" /></div>;

  const publicUrl = `${window.location.origin}/u/${portfolio.username}`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050816] text-slate-900 dark:text-white relative transition-colors duration-300">
      <PremiumAnimatedBackground />
      <div className="relative z-10 flex flex-col h-screen">
        <Navbar />
        
        <main className="flex-grow flex overflow-hidden">
          
          {/* LEFT PANEL: Controls */}
          <div className="w-full lg:w-1/3 border-r border-slate-200 dark:border-white/10 bg-white/50 dark:bg-[#0b0e24]/50 backdrop-blur-md overflow-y-auto p-6 space-y-8 flex flex-col">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-2xl font-black font-display flex items-center gap-2">
                  <Globe className="w-6 h-6 text-indigo-500" /> Portfolio Builder
                </h2>
                <button
                  onClick={() => setIsHelpOpen(true)}
                  className="p-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  title="What is this?"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Help</span>
                </button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Configure your public presence and professional website.</p>
            </div>

            {/* Beginner Mode Helper Cards */}
            {beginnerMode && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl space-y-2 relative overflow-hidden"
              >
                <div className="flex items-center gap-2 text-amber-500">
                  <Info className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-wider">Student Guide: Portfolio Website</span>
                </div>
                <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  Your portfolio is a professional, online page (e.g. <code>hirecraftt.com/u/your-name</code>) that hosts your active resume and contact links. Recruiters can view this directly to assess your projects, skills, and credentials.
                </p>
              </motion.div>
            )}

            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Public URL (Username)</label>
              <div className="flex bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden">
                <span className="px-3 py-3 text-sm text-slate-400 border-r border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20">hirecraftt.com/u/</span>
                <input 
                  type="text" 
                  value={portfolio.username} 
                  onChange={e => setPortfolio({...portfolio, username: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})}
                  className="flex-grow bg-transparent px-3 py-2 outline-none text-sm font-semibold"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Select Resume Source</label>
              <select 
                value={selectedResumeId}
                onChange={e => setSelectedResumeId(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl font-medium focus:outline-none"
              >
                <option value="">Select a Resume...</option>
                {resumes.map(r => (
                  <option key={r._id} value={r._id}>{r.title || r.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Theme Style</label>
              <div className="grid grid-cols-2 gap-3">
                {THEMES.map(t => (
                  <button 
                    key={t.id}
                    onClick={() => setPortfolio({...portfolio, theme: t.id})}
                    className={`p-3 border rounded-xl text-sm font-bold transition-all ${
                      portfolio.theme === t.id ? 'border-brand-500 bg-brand-500/10 text-brand-500' : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-brand-500/30'
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Social Links</label>
              <input type="text" placeholder="LinkedIn URL" value={portfolio.socialLinks.linkedin} onChange={e => setPortfolio({...portfolio, socialLinks: {...portfolio.socialLinks, linkedin: e.target.value}})} className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl font-medium focus:outline-none text-sm mb-2" />
              <input type="text" placeholder="GitHub URL" value={portfolio.socialLinks.github} onChange={e => setPortfolio({...portfolio, socialLinks: {...portfolio.socialLinks, github: e.target.value}})} className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl font-medium focus:outline-none text-sm mb-2" />
              <input type="text" placeholder="Personal Website" value={portfolio.socialLinks.website} onChange={e => setPortfolio({...portfolio, socialLinks: {...portfolio.socialLinks, website: e.target.value}})} className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl font-medium focus:outline-none text-sm" />
            </div>

            <div className="mt-auto pt-6 border-t border-slate-200 dark:border-white/10 flex flex-col gap-3">
              <button onClick={handleSave} disabled={saving} className="btn-primary w-full py-4 text-base flex justify-center gap-2 shadow-glow-brand">
                {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Save Portfolio
              </button>
              
              <div className="flex gap-2">
                <a href={publicUrl} target="_blank" rel="noreferrer" className="flex-1 py-3 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition">
                  <ExternalLink className="w-4 h-4" /> Open
                </a>
                <button onClick={() => { navigator.clipboard.writeText(publicUrl); toast.success('Link copied!'); }} className="flex-1 py-3 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition">
                  <LinkIcon className="w-4 h-4" /> Copy
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Live Preview & QR */}
          <div className="hidden lg:flex w-2/3 bg-slate-200/50 dark:bg-black/30 items-center justify-center p-8 relative flex-col">
            
            <div className="absolute top-6 right-6 flex items-center gap-4 bg-white/80 dark:bg-white/10 p-2 rounded-xl backdrop-blur-md">
              <button onClick={() => setPreviewMode('desktop')} className={`p-2 rounded-lg transition ${previewMode === 'desktop' ? 'bg-white dark:bg-[#7c5cff] shadow-sm' : 'text-slate-500'}`}><Monitor className="w-5 h-5" /></button>
              <button onClick={() => setPreviewMode('mobile')} className={`p-2 rounded-lg transition ${previewMode === 'mobile' ? 'bg-white dark:bg-[#7c5cff] shadow-sm' : 'text-slate-500'}`}><Smartphone className="w-5 h-5" /></button>
            </div>

            <div className={`transition-all duration-500 flex flex-col items-center ${previewMode === 'desktop' ? 'w-full max-w-4xl h-[70vh]' : 'w-[375px] h-[812px]'}`}>
              {/* Fake Browser Chrome */}
              <div className="w-full bg-slate-800 rounded-t-2xl p-3 flex items-center gap-2">
                <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500" /><div className="w-3 h-3 rounded-full bg-amber-500" /><div className="w-3 h-3 rounded-full bg-emerald-500" /></div>
                <div className="mx-auto px-4 py-1 bg-slate-900 rounded-md text-[10px] text-slate-400 font-mono w-1/2 text-center overflow-hidden text-ellipsis whitespace-nowrap">
                  hirecraftt.com/u/{portfolio.username}
                </div>
              </div>
              <div className="w-full flex-grow bg-white dark:bg-[#050816] rounded-b-2xl border-x border-b border-slate-300 dark:border-white/10 overflow-hidden shadow-2xl flex flex-col items-center justify-center p-8 text-center relative">
                 <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-indigo-600/10 z-0" />
                 <div className="z-10 bg-white/80 dark:bg-black/50 p-6 rounded-2xl backdrop-blur-sm border border-slate-200 dark:border-white/10">
                   <h3 className="text-xl font-bold mb-2">Live Preview Available at URL</h3>
                   <p className="text-sm text-slate-500 mb-6">Your selected resume and theme are rendered dynamically at the public URL.</p>
                   <div className="inline-block p-4 bg-white rounded-2xl shadow-lg">
                      <QRCodeSVG value={publicUrl} size={150} level={"H"} />
                   </div>
                   <p className="text-xs text-slate-400 mt-4">Scan to view on mobile</p>
                 </div>
              </div>
            </div>

          </div>

        </main>
      </div>

      {/* Help Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        title="Portfolio Builder Guide"
        subtitle="Learn how to launch your personal portfolio website"
        sections={[
          {
            title: "What is a Professional Portfolio?",
            description: "Your digital portfolio is your personal website hosting your active resumes, project credentials, and bio description. It is a live reflection of your career history.",
            steps: [
              "Customize your username (e.g. hirecraftt.com/u/john-doe).",
              "Select a matching resume source to fetch work details automatically.",
              "Pick a style theme matching your professional branding."
            ]
          },
          {
            title: "Theme Styles",
            description: "Choose between Modern Developer (sleek tech grid), Minimal Professional (executive black and white), Dark Futuristic (Aurora glass glow), or Creative Designer (asymmetrical layouts)."
          }
        ]}
        tips={[
          "Share the generated public URL in your LinkedIn bio and email signature.",
          "Use the QR Code generator to let recruiters instantly pull up your site on their mobile devices during live networking events."
        ]}
      />
    </div>
  );
}
