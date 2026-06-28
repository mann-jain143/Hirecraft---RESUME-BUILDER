import React from 'react';
import { useResume } from '../context/ResumeContext';
import { ACCENT_COLORS, colorPickerClasses } from '../constants/resumeTheme';
import SectionReorder from './builder/SectionReorder';

const DesignControls = () => {
  const { resumeData, updateSettings } = useResume();
  const { settings } = resumeData;
  const dividerOpacity = settings.dividerOpacity !== undefined ? Number(settings.dividerOpacity) : 50;

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl mb-6 backdrop-blur-md">
      <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 pb-2">
        Resume Styling & Layout
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side: Typography, Accent Color, Divider Opacity */}
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Typography</label>
            <div className="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
              {['sans', 'serif', 'mono'].map((font) => (
                <button
                  key={font}
                  type="button"
                  onClick={() => updateSettings('font', font)}
                  className={`flex-1 py-1.5 rounded-md text-sm capitalize font-medium transition ${
                    settings.font === font
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {font}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Accent Color</label>
            <div className="flex flex-wrap gap-2">
              {ACCENT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => updateSettings('color', color)}
                  title={color}
                  className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                    settings.color === color ? 'border-white dark:border-slate-900 scale-110 ring-2 ring-indigo-500/50' : 'border-transparent'
                  } ${colorPickerClasses[color]}`}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Divider Line Opacity</label>
              <span className="text-xs font-semibold text-indigo-500 dark:text-indigo-400">{dividerOpacity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={dividerOpacity}
              onChange={(e) => updateSettings('dividerOpacity', Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
        </div>

        {/* Right Side: Section Reordering */}
        <div className="border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-700 pt-6 lg:pt-0 lg:pl-8">
          <SectionReorder />
        </div>
      </div>
    </div>
  );
};

export default DesignControls;
