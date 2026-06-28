import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  ArrowLeft,
  X,
  Camera,
  Sparkles,
  LayoutGrid,
  Search,
} from 'lucide-react';
import PremiumAnimatedBackground from '../components/layout/PremiumAnimatedBackground';
import Navbar from '../components/Navbar';
import TemplateRenderer from '../components/templates/TemplateRenderer';
import { TEMPLATE_LIST } from '../constants/templates';
import { getSampleForTemplate } from '../constants/sampleResumes';

/* ── colour map for category badges ─────────────────────────────── */
const CATEGORY_COLORS = {
  'ATS Friendly': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Modern': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'Creative': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  'Professional': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  'Executive': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
};

const CATEGORIES = ['All', 'ATS Friendly', 'Modern', 'Professional', 'Creative', 'Executive'];

/* ── stagger variants ───────────────────────────────────────────── */
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};
const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 24 } },
};

/* ── animated card wrapper with inView ──────────────────────────── */
const TemplateCard = ({ template, onSelect }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const sampleData = useMemo(() => getSampleForTemplate(template.id), [template.id]);

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(template)}
      className="group cursor-pointer glass-card overflow-hidden transition-shadow hover:shadow-brand-500/15 hover:shadow-2xl"
      role="button"
      tabIndex={0}
      aria-label={`Preview ${template.name} template`}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(template)}
    >
      {/* Mini preview */}
      <div className="relative w-full aspect-[210/297] bg-white overflow-hidden">
        <div
          className="absolute top-0 left-0 origin-top-left pointer-events-none"
          style={{
            width: '794px',           /* A4 approx px */
            height: '1123px',
            transform: 'scale(0.3)',
            transformOrigin: 'top left',
          }}
        >
          <TemplateRenderer resumeData={sampleData} />
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <span className="text-sm font-semibold text-white bg-brand-500/80 backdrop-blur px-4 py-1.5 rounded-full flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5" /> Preview
          </span>
        </div>
      </div>

      {/* Info row */}
      <div className="p-4 space-y-2">
        <h3 className="text-white font-semibold truncate">{template.name}</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${
              CATEGORY_COLORS[template.category] || 'bg-gray-500/20 text-gray-300 border-gray-500/30'
            }`}
          >
            {template.category}
          </span>
          {template.hasPhoto && (
            <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full border bg-amber-500/20 text-amber-300 border-amber-500/30 flex items-center gap-1">
              <Camera className="w-3 h-3" /> Photo
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400 line-clamp-1">{template.description}</p>
      </div>
    </motion.div>
  );
};

/* ── preview modal ──────────────────────────────────────────────── */
import { sampleResumes, getSampleByProfession } from '../constants/sampleResumes';

const PreviewModal = ({ template, onClose }) => {
  const navigate = useNavigate();
  const [selectedProfession, setSelectedProfession] = useState('Software Engineer');

  const sampleData = useMemo(() => {
    const rawSample = getSampleByProfession(selectedProfession) || sampleResumes[0];
    const copy = JSON.parse(JSON.stringify(rawSample));
    copy.settings.template = template.id;
    return copy;
  }, [template.id, selectedProfession]);

  const handleUse = () => {
    navigate('/builder/new', { state: { template: template.id } });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${template.name} template preview`}
    >
      <motion.div
        initial={{ scale: 0.95, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 30 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col glass-card bg-slate-900 border border-white/10 shadow-2xl rounded-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 border-b border-white/10 bg-slate-950/80">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              {template.name}
              <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {template.category}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">{template.description}</p>
          </div>

          {/* Profession Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Preview Example:</span>
            <select
              value={selectedProfession}
              onChange={(e) => setSelectedProfession(e.target.value)}
              className="bg-white/5 border border-white/10 text-white text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {sampleResumes.map((r) => (
                <option key={r.personalInfo.jobTitle} value={r.personalInfo.jobTitle} className="bg-slate-900">
                  {r.personalInfo.jobTitle}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:relative sm:top-0 sm:right-0 p-2 rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Close preview"
          >
            <X className="w-5 h-5 text-slate-400 hover:text-white" />
          </button>
        </div>

        {/* Scrollable preview */}
        <div className="flex-1 overflow-auto p-6 bg-slate-950/50 flex justify-center">
          <div className="w-full max-w-[210mm] aspect-[210/297] bg-white shadow-2xl overflow-hidden rounded-md border border-slate-200">
            <TemplateRenderer resumeData={sampleData} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-white/10 bg-slate-950/80">
          <span className="text-xs text-slate-400 italic">
            💡 Demonstrating standard layout formatting, proper ATS spacing, and section ordering.
          </span>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleUse}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Use This Template
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ── page ────────────────────────────────────────────────────────── */
const TemplatesPage = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = TEMPLATE_LIST;
    if (activeCategory !== 'All') list = list.filter((t) => t.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeCategory, search]);

  return (
    <div className="min-h-screen relative font-sans">
      <PremiumAnimatedBackground />

      <div className="relative z-10">
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Back link */}
          <motion.button
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-8 transition-colors"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </motion.button>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-brand-400 font-medium mb-4">
              <LayoutGrid className="w-4 h-4" />
              {TEMPLATE_LIST.length} Professional Templates
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              <span className="text-gradient">Resume Templates</span>
            </h1>
            <p className="mt-3 text-slate-400 max-w-xl mx-auto">
              Choose from our curated collection of ATS-optimized, professionally designed resume templates.
            </p>
          </motion.div>

          {/* Search + filter */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row items-center gap-4 mb-8"
          >
            {/* Search */}
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search templates…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition"
                aria-label="Search templates"
              />
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? 'bg-brand-500 text-white shadow-[0_0_16px_rgba(99,102,241,0.35)]'
                      : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/10'
                  }`}
                  aria-pressed={activeCategory === cat}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filtered.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={setSelectedTemplate}
              />
            ))}
          </motion.div>

          {filtered.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-slate-500 py-20"
            >
              No templates match your search. Try a different query.
            </motion.p>
          )}
        </main>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedTemplate && (
          <PreviewModal
            template={selectedTemplate}
            onClose={() => setSelectedTemplate(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TemplatesPage;
