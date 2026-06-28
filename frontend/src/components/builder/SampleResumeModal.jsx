import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Sparkles, BookOpen, GraduationCap, Briefcase, Wrench, FolderGit2, Trophy, Award, Languages, Check } from 'lucide-react';
import { sampleResumes } from '../../constants/sampleResumes';

export default function SampleResumeModal({ isOpen, onClose, onLoadSample }) {
  const [search, setSearch] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);

  const filtered = useMemo(() => {
    if (!search.trim()) return sampleResumes;
    const q = search.toLowerCase();
    return sampleResumes.filter(
      (r) =>
        r.personalInfo.jobTitle.toLowerCase().includes(q) ||
        r.personalInfo.fullName.toLowerCase().includes(q)
    );
  }, [search]);

  // Handle index out of bounds when search changes
  const activeIdx = Math.min(selectedIdx, Math.max(0, filtered.length - 1));
  const activeSample = filtered[activeIdx];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        {/* Backdrop clickable */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative z-10 w-full max-w-5xl h-[85vh] bg-slate-900 border border-white/10 shadow-2xl rounded-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/80 shrink-0">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <div>
                <h2 className="text-lg font-bold text-white">Load Sample Resume</h2>
                <p className="text-xs text-slate-400">Select a pre-filled professional example to populate the builder.</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search bar */}
          <div className="px-6 py-3 border-b border-white/10 bg-slate-900/50 flex items-center gap-2 shrink-0">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search templates (e.g. Software, Designer, MBA)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>

          {/* Content Split Pane */}
          <div className="flex-grow flex overflow-hidden min-h-0">
            {/* Left list - Professions */}
            <div className="w-[32%] border-r border-white/10 overflow-y-auto bg-slate-950/40 p-4 space-y-2 shrink-0">
              {filtered.map((item, index) => (
                <button
                  key={item.personalInfo.jobTitle}
                  onClick={() => setSelectedIdx(index)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col gap-1 ${
                    index === activeIdx
                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                      : 'bg-white/5 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10'
                  }`}
                >
                  <span className="text-sm font-semibold truncate w-full">{item.personalInfo.jobTitle}</span>
                  <span className="text-[11px] opacity-60 truncate w-full">{item.personalInfo.fullName}</span>
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="text-center py-8 text-slate-500 text-sm">No samples match search</div>
              )}
            </div>

            {/* Right preview details */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-900/30">
              {activeSample ? (
                <div className="space-y-6">
                  {/* Persona header */}
                  <div className="flex justify-between items-start border-b border-white/5 pb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{activeSample.personalInfo.fullName}</h3>
                      <p className="text-sm text-indigo-400 font-semibold">{activeSample.personalInfo.jobTitle}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        📍 {activeSample.personalInfo.location} | 📧 {activeSample.personalInfo.email}
                      </p>
                    </div>
                    <button
                      onClick={() => onLoadSample(activeSample)}
                      className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center gap-1.5 shrink-0"
                    >
                      <Sparkles className="w-4 h-4" /> Load This Sample
                    </button>
                  </div>

                  {/* Summary */}
                  {activeSample.summary && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> Professional Summary
                      </h4>
                      <p className="text-sm text-slate-300 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5 text-justify">
                        {activeSample.summary}
                      </p>
                    </div>
                  )}

                  {/* Experience */}
                  {activeSample.experience.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-indigo-400" /> Work Experience
                      </h4>
                      <div className="space-y-3">
                        {activeSample.experience.map((exp, i) => (
                          <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-1">
                            <div className="flex justify-between items-baseline">
                              <span className="text-sm font-bold text-white">{exp.position}</span>
                              <span className="text-xs text-slate-400">{exp.startDate} - {exp.endDate}</span>
                            </div>
                            <p className="text-xs text-indigo-300 font-semibold">{exp.company}</p>
                            <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed mt-1">
                              {exp.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Projects */}
                  {activeSample.projects && activeSample.projects.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <FolderGit2 className="w-3.5 h-3.5 text-indigo-400" /> Projects
                      </h4>
                      <div className="space-y-3">
                        {activeSample.projects.map((proj, i) => (
                          <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-1">
                            <div className="flex justify-between items-baseline">
                              <span className="text-sm font-bold text-white">{proj.name}</span>
                              <span className="text-xs text-slate-400">{proj.startDate} - {proj.endDate}</span>
                            </div>
                            {proj.url && <p className="text-xs text-indigo-300 underline">{proj.url}</p>}
                            <p className="text-xs text-slate-300 leading-relaxed mt-1">{proj.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills Grid */}
                  {activeSample.skills && activeSample.skills.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <Wrench className="w-3.5 h-3.5 text-indigo-400" /> Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {activeSample.skills.map((skill) => (
                          <span key={skill} className="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {activeSample.education.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-indigo-400" /> Education
                      </h4>
                      <div className="space-y-3">
                        {activeSample.education.map((edu, i) => (
                          <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-xl flex justify-between items-center">
                            <div>
                              <p className="text-sm font-bold text-white">{edu.degree}</p>
                              <p className="text-xs text-slate-400">{edu.school}</p>
                            </div>
                            <span className="text-xs text-slate-400">{edu.startDate} - {edu.endDate}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Certifications & Achievements */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeSample.certifications && activeSample.certifications.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-indigo-400" /> Certifications
                        </h4>
                        <div className="space-y-2">
                          {activeSample.certifications.map((cert, i) => (
                            <div key={i} className="p-3 bg-white/5 border border-white/5 rounded-xl text-xs text-slate-300">
                              <span className="font-bold text-white block">{cert.name}</span>
                              <span className="opacity-75">{cert.issuer} ({cert.date})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeSample.achievements && activeSample.achievements.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                          <Trophy className="w-3.5 h-3.5 text-indigo-400" /> Achievements
                        </h4>
                        <div className="space-y-2">
                          {activeSample.achievements.map((ach, i) => (
                            <div key={i} className="p-3 bg-white/5 border border-white/5 rounded-xl text-xs text-slate-300">
                              <span className="font-bold text-white block">{ach.title}</span>
                              <span className="opacity-75">{ach.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 text-slate-500 text-sm">Select a role on the left to preview details</div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
