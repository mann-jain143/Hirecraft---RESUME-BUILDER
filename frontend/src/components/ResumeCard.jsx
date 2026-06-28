import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MoreVertical, Pencil, Copy, Trash2, Download, FileText, Share2, ShieldCheck } from 'lucide-react';
import TemplateThumbnail from './TemplateThumbnail';
import ShareSettingsModal from './builder/ShareSettingsModal';

const ResumeCard = ({ resume, onDelete, onDuplicate }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const menuRef = useRef(null);
  
  const settings = resume.resumeData?.settings || {};
  const atsScore = settings.atsScore || 0;
  
  const updated = new Date(resume.updatedAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleEdit = () => navigate(`/builder/${resume._id}`);
  const handleDownload = () => navigate(`/builder/${resume._id}`, { state: { autoDownload: true } });

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ scale: 1.02, y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }}
        className="group relative bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 rounded-[24px] overflow-hidden shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/30 dark:shadow-none dark:hover:shadow-indigo-500/20 transition-all duration-300 flex flex-col justify-between"
      >
        <div className="p-4 cursor-pointer" onClick={handleEdit}>
          {/* Thumbnail preview */}
          <div className="relative rounded-xl overflow-hidden mb-4 border border-slate-200 dark:border-white/5 group-hover:border-brand-500/20 transition-colors">
            <TemplateThumbnail settings={settings} className="w-full h-auto aspect-[3/4] object-cover" />
            
            {/* ATS Score Overlay */}
            {atsScore > 0 && (
              <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-[#050816]/90 border border-white/10 backdrop-blur-md flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
                <span className="text-[10px] font-bold text-slate-200">{atsScore}% ATS</span>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <h3 className="font-bold text-slate-850 dark:text-slate-200 truncate font-display group-hover:text-indigo-600 dark:group-hover:text-white transition-colors">{resume.title}</h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <FileText className="w-3 h-3 text-slate-400 dark:text-slate-500" />
              Edited {updated}
            </p>
          </div>
        </div>

        {/* Hover Action Panel instead of just dropdown */}
        <div className="p-3 bg-slate-50/50 dark:bg-white/[0.02] border-t border-slate-200 dark:border-white/5 flex items-center justify-between gap-1">
          <button
            onClick={handleEdit}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition"
            title="Edit Resume"
          >
            <Pencil className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onDuplicate(resume._id)}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition"
            title="Duplicate Resume"
          >
            <Copy className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShareOpen(true)}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition"
            title="Share Settings"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleDownload}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-[#7c5cff] hover:bg-[#7c5cff]/5 transition"
            title="Download PDF"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDelete(resume._id)}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-red-500 hover:bg-red-400/5 transition"
            title="Delete Resume"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Share settings overlay */}
      <ShareSettingsModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        resumeId={resume._id}
        resumeTitle={resume.title}
      />
    </>
  );
};

export default ResumeCard;
