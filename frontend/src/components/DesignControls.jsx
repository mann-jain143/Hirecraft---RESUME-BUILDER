import React from 'react';
import { useResume } from '../context/ResumeContext';
import { ACCENT_COLORS, colorPickerClasses } from '../constants/resumeTheme';

const DesignControls = () => {
  const { resumeData, updateSettings } = useResume();
  const { settings } = resumeData;

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl mb-6">
      <div className="flex flex-wrap gap-8 items-start justify-between">
        <div>
          <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Typography</label>
          <div className="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
            {['sans', 'serif', 'mono'].map((font) => (
              <button
                key={font}
                type="button"
                onClick={() => updateSettings('font', font)}
                className={`px-4 py-1.5 rounded-md text-sm capitalize transition ${
                  settings.font === font ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {font}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Accent Color</label>
          <div className="flex flex-wrap gap-2 max-w-[220px]">
            {ACCENT_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => updateSettings('color', color)}
                title={color}
                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                  settings.color === color ? 'border-white scale-110 ring-2 ring-white/30' : 'border-transparent'
                } ${colorPickerClasses[color]}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignControls;
