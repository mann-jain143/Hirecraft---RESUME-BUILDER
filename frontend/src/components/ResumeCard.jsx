import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MoreVertical, Pencil, Copy, Trash2, Download, FileText } from 'lucide-react';
import TemplateThumbnail from './TemplateThumbnail';
import API from '../utils/api';

const ResumeCard = ({ resume, onDelete, onDuplicate }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const settings = resume.resumeData?.settings || {};
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
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative bg-white/80 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-700/80 rounded-2xl overflow-hidden hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10"
    >
      <div className="p-4 cursor-pointer" onClick={handleEdit}>
        <TemplateThumbnail settings={settings} className="mb-4 shadow-md group-hover:scale-[1.02] transition-transform duration-300" />
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-900 dark:text-white truncate">{resume.title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
              <FileText className="w-3 h-3" />
              Edited {updated}
            </p>
          </div>
        </div>
      </div>

      <div className="absolute top-3 right-3" ref={menuRef}>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
          className="p-2 rounded-lg bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-600 text-slate-500 hover:text-slate-900 dark:hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute right-0 mt-1 w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl shadow-2xl py-1 z-20"
          >
            {[
              { icon: Pencil, label: 'Edit', action: handleEdit },
              { icon: Copy, label: 'Duplicate', action: () => { setMenuOpen(false); onDuplicate(resume._id); } },
              { icon: Download, label: 'Download PDF', action: () => { setMenuOpen(false); handleDownload(); } },
              { icon: Trash2, label: 'Delete', action: () => { setMenuOpen(false); onDelete(resume._id); }, danger: true },
            ].map(({ icon: Icon, label, action, danger }) => (
              <button
                key={label}
                type="button"
                onClick={(e) => { e.stopPropagation(); action(); }}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition ${
                  danger
                    ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ResumeCard;
