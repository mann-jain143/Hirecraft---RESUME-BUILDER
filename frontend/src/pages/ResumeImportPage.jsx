import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import {
  Upload,
  FileText,
  X,
  Loader2,
  CheckCircle2,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderKanban,
  ArrowLeft,
  ArrowRight,
  Trash2,
} from 'lucide-react';
import PremiumAnimatedBackground from '../components/layout/PremiumAnimatedBackground';
import Navbar from '../components/Navbar';
import API from '../utils/api';

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_TYPES = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
};

/* ── helpers ──────────────────────────────────────────────── */
const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

/* ── section preview card ─────────────────────────────────── */
const SectionCard = ({ icon: Icon, title, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="glass-card p-5"
  >
    <div className="flex items-center gap-2 mb-3">
      <Icon className="w-5 h-5 text-brand-400" />
      <h3 className="text-sm font-semibold text-white uppercase tracking-wider">{title}</h3>
    </div>
    <div className="text-gray-300 text-sm leading-relaxed space-y-1">{children}</div>
  </motion.div>
);

/* ── page ─────────────────────────────────────────────────── */
const ResumeImportPage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [parsedData, setParsedData] = useState(null);

  /* ── dropzone ──────────────────────────────────────── */
  const onDrop = useCallback(
    (acceptedFiles, rejections) => {
      if (rejections.length) {
        const err = rejections[0].errors[0];
        if (err.code === 'file-too-large') {
          toast.error('File exceeds the 5 MB limit.');
        } else if (err.code === 'file-invalid-type') {
          toast.error('Only PDF and DOCX files are accepted.');
        } else {
          toast.error(err.message);
        }
        return;
      }
      const picked = acceptedFiles[0];
      if (!picked) return;
      setFile(picked);
      setParsedData(null);
      handleParse(picked);
    },
    [],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_SIZE,
    multiple: false,
  });

  /* ── parse call ────────────────────────────────────── */
  const handleParse = async (pickedFile) => {
    setParsing(true);
    const formData = new FormData();
    formData.append('resume', pickedFile);

    try {
      const { data } = await API.post('/resume-parser/parse', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setParsedData(data);
      toast.success('Resume parsed successfully!');
    } catch (err) {
      console.error('Parse error:', err);
      toast.error(err.response?.data?.message || 'Failed to parse resume. Please try again.');
    } finally {
      setParsing(false);
    }
  };

  /* ── import to builder ─────────────────────────────── */
  const handleImport = () => {
    if (!parsedData) return;
    // Store parsed data temporarily for the builder to pick up
    sessionStorage.setItem('importedResumeData', JSON.stringify(parsedData.resumeData));
    toast.success('Resume imported! Redirecting to builder…');
    navigate('/builder/new', { state: { imported: true } });
  };

  /* ── discard ───────────────────────────────────────── */
  const handleDiscard = () => {
    setFile(null);
    setParsedData(null);
    toast('Import discarded.', { icon: '🗑️' });
  };

  return (
    <div className="min-h-screen relative font-sans">
      <PremiumAnimatedBackground />
      <div className="relative z-10">
        <Navbar />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10"
          >
            <div>
              <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-2">
                <Upload className="w-8 h-8 text-brand-400" />
                Import Resume
              </h1>
              <p className="text-gray-400">
                Upload an existing resume and we'll extract the content using AI.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 glass text-white px-5 py-2.5 rounded-xl font-medium hover:bg-white/10 transition"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </button>
          </motion.div>

          <AnimatePresence mode="wait">
            {/* ── STEP 1: Drop zone ─────────────────── */}
            {!file && !parsedData && (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  {...getRootProps()}
                  className={`glass-card flex flex-col items-center justify-center py-24 px-6 text-center cursor-pointer border-2 border-dashed transition-all duration-300 ${
                    isDragActive
                      ? 'border-brand-400 bg-brand-500/10'
                      : 'border-white/10 hover:border-brand-500/40 hover:bg-white/[0.02]'
                  }`}
                  aria-label="Drag and drop resume file or click to browse"
                >
                  <input {...getInputProps()} />

                  <motion.div
                    animate={isDragActive ? { scale: 1.15, rotate: -5 } : { scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="w-20 h-20 rounded-3xl bg-brand-500/15 flex items-center justify-center mb-6"
                  >
                    <Upload className="w-10 h-10 text-brand-400" />
                  </motion.div>

                  <h2 className="text-xl font-bold text-white mb-2">
                    {isDragActive ? 'Drop your file here' : 'Drag & drop your resume'}
                  </h2>
                  <p className="text-gray-400 mb-4">or click to browse files</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                      PDF
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                      DOCX
                    </span>
                    <span>Max 5 MB</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── STEP 2: Parsing animation ─────────── */}
            {file && parsing && (
              <motion.div
                key="parsing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-card flex flex-col items-center justify-center py-20 text-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-16 h-16 rounded-full border-4 border-brand-500/30 border-t-brand-400 mb-6"
                />
                <h2 className="text-xl font-bold text-white mb-2">Parsing Your Resume…</h2>
                <p className="text-gray-400 mb-4">
                  AI is extracting content from{' '}
                  <span className="text-brand-400 font-medium">{file.name}</span>
                </p>
                <p className="text-xs text-gray-500">{formatBytes(file.size)}</p>
              </motion.div>
            )}

            {/* ── STEP 3: Parsed preview ────────────── */}
            {file && !parsing && parsedData && (
              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Success banner */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-4 flex items-center gap-3 border-emerald-500/30"
                >
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                  <div className="flex-grow">
                    <p className="text-white font-medium">Successfully parsed!</p>
                    <p className="text-gray-400 text-sm">
                      {file.name} — {formatBytes(file.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDiscard}
                    className="text-gray-400 hover:text-red-400 transition p-1"
                    aria-label="Discard imported data"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </motion.div>

                {/* Extracted sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Personal Info */}
                  <SectionCard icon={User} title="Personal Information" delay={0.1}>
                    {parsedData.personalInfo ? (
                      <>
                        {parsedData.personalInfo.fullName && (
                          <p><span className="text-gray-500">Name:</span> {parsedData.personalInfo.fullName}</p>
                        )}
                        {parsedData.personalInfo.email && (
                          <p><span className="text-gray-500">Email:</span> {parsedData.personalInfo.email}</p>
                        )}
                        {parsedData.personalInfo.phone && (
                          <p><span className="text-gray-500">Phone:</span> {parsedData.personalInfo.phone}</p>
                        )}
                        {parsedData.personalInfo.location && (
                          <p><span className="text-gray-500">Location:</span> {parsedData.personalInfo.location}</p>
                        )}
                        {parsedData.personalInfo.jobTitle && (
                          <p><span className="text-gray-500">Title:</span> {parsedData.personalInfo.jobTitle}</p>
                        )}
                      </>
                    ) : (
                      <p className="text-gray-500 italic">No personal info extracted</p>
                    )}
                  </SectionCard>

                  {/* Skills */}
                  <SectionCard icon={Wrench} title="Skills" delay={0.2}>
                    {parsedData.skills?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {parsedData.skills.map((s, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-lg bg-brand-500/15 text-brand-400 text-xs font-medium"
                          >
                            {typeof s === 'string' ? s : s.name || s}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No skills extracted</p>
                    )}
                  </SectionCard>

                  {/* Experience */}
                  <SectionCard icon={Briefcase} title="Experience" delay={0.3}>
                    {parsedData.experience?.length ? (
                      parsedData.experience.map((exp, i) => (
                        <div key={i} className="mb-2 last:mb-0">
                          <p className="font-medium text-white">
                            {exp.position || exp.title || 'Position'}{' '}
                            <span className="text-gray-500 font-normal">at {exp.company || 'Company'}</span>
                          </p>
                          {(exp.startDate || exp.endDate) && (
                            <p className="text-xs text-gray-500">
                              {exp.startDate} — {exp.endDate || 'Present'}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">No experience extracted</p>
                    )}
                  </SectionCard>

                  {/* Education */}
                  <SectionCard icon={GraduationCap} title="Education" delay={0.4}>
                    {parsedData.education?.length ? (
                      parsedData.education.map((edu, i) => (
                        <div key={i} className="mb-2 last:mb-0">
                          <p className="font-medium text-white">{edu.degree || edu.field || 'Degree'}</p>
                          <p className="text-gray-500 text-xs">{edu.school || edu.institution || 'Institution'}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">No education extracted</p>
                    )}
                  </SectionCard>

                  {/* Projects */}
                  <SectionCard icon={FolderKanban} title="Projects" delay={0.5}>
                    {parsedData.projects?.length ? (
                      parsedData.projects.map((proj, i) => (
                        <div key={i} className="mb-2 last:mb-0">
                          <p className="font-medium text-white">{proj.name || proj.title || 'Project'}</p>
                          {proj.description && (
                            <p className="text-gray-500 text-xs line-clamp-2">{proj.description}</p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">No projects extracted</p>
                    )}
                  </SectionCard>

                  {/* Summary */}
                  <SectionCard icon={FileText} title="Summary" delay={0.6}>
                    {parsedData.summary ? (
                      <p className="line-clamp-4">{parsedData.summary}</p>
                    ) : (
                      <p className="text-gray-500 italic">No summary extracted</p>
                    )}
                  </SectionCard>
                </div>

                {/* Action buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex flex-col sm:flex-row gap-3 pt-2"
                >
                  <button
                    type="button"
                    onClick={handleImport}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-6 py-3.5 rounded-xl font-semibold shadow-lg shadow-indigo-500/25 transition transform hover:-translate-y-0.5"
                  >
                    <ArrowRight className="w-5 h-5" />
                    Import to Builder
                  </button>
                  <button
                    type="button"
                    onClick={handleDiscard}
                    className="flex items-center justify-center gap-2 glass text-gray-300 hover:text-red-400 hover:border-red-500/30 px-6 py-3.5 rounded-xl font-medium transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    Discard
                  </button>
                </motion.div>
              </motion.div>
            )}

            {/* ── STEP 2b: File loaded but not parsed yet (error fallback) */}
            {file && !parsing && !parsedData && (
              <motion.div
                key="retry"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card flex flex-col items-center justify-center py-16 text-center"
              >
                <FileText className="w-12 h-12 text-gray-500 mb-4" />
                <p className="text-white font-medium mb-1">{file.name}</p>
                <p className="text-gray-500 text-sm mb-6">{formatBytes(file.size)}</p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleParse(file)}
                    className="flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-white px-5 py-2.5 rounded-xl font-semibold transition"
                  >
                    <Loader2 className="w-4 h-4" />
                    Retry Parse
                  </button>
                  <button
                    type="button"
                    onClick={handleDiscard}
                    className="glass text-gray-300 hover:text-red-400 px-5 py-2.5 rounded-xl font-medium transition"
                  >
                    Discard
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default ResumeImportPage;
