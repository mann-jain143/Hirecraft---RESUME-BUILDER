import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Camera, FileText } from 'lucide-react';
import { TEMPLATE_LIST } from '../constants/templates';
import { useResume } from '../context/ResumeContext';

const TemplateSelector = () => {
  const { resumeData, updateSettings } = useResume();
  const scrollRef = useRef(null);
  const activeTemplate = resumeData.settings.template;

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction * 280, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 shadow-xl mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Resume Template</label>
          <p className="text-sm text-slate-500 mt-0.5">{TEMPLATE_LIST.length} layouts — switch instantly</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => scroll(-1)} className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => scroll(1)} className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin snap-x snap-mandatory">
        {TEMPLATE_LIST.map((template) => {
          const isActive = activeTemplate === template.id;
          return (
            <motion.button
              key={template.id}
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => updateSettings('template', template.id)}
              className={`snap-start shrink-0 w-[140px] p-3 rounded-xl border-2 text-left transition-all ${
                isActive
                  ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/20'
                  : 'border-slate-700 bg-slate-900/50 hover:border-slate-500'
              }`}
            >
              <div className={`h-20 rounded-lg mb-2 flex items-center justify-center ${
                isActive ? 'bg-indigo-500/20' : 'bg-slate-800'
              }`}>
                {template.hasPhoto ? (
                  <Camera className={`w-6 h-6 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                ) : (
                  <FileText className={`w-6 h-6 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                )}
              </div>
              <p className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-slate-300'}`}>{template.name}</p>
              <p className="text-[10px] text-slate-500 truncate mt-0.5">{template.category}</p>
              {template.hasPhoto && (
                <span className="inline-block mt-1 text-[9px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-400">Photo</span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default TemplateSelector;
