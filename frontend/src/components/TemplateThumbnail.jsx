import React from 'react';
import { getTheme } from '../constants/resumeTheme';
import { getTemplateMeta } from '../constants/templates';

const TemplateThumbnail = ({ settings, className = '' }) => {
  const theme = getTheme(settings?.color);
  const meta = getTemplateMeta(settings?.template);
  const isPhoto = meta?.hasPhoto;

  return (
    <div className={`relative bg-white rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 ${className}`}>
      <div className="aspect-[210/297] p-3 flex flex-col">
        {isPhoto ? (
          <div className="flex gap-2 mb-2">
            <div className={`w-6 h-6 rounded-full shrink-0 ${theme.bg}`} />
            <div className="flex-1 space-y-1">
              <div className="h-2 bg-slate-200 rounded w-3/4" />
              <div className={`h-1.5 rounded w-1/2 ${theme.bg} opacity-60`} />
            </div>
          </div>
        ) : (
          <div className="text-center mb-2">
            <div className="h-2 bg-slate-300 rounded w-2/3 mx-auto mb-1" />
            <div className={`h-1.5 rounded w-1/3 mx-auto ${theme.bg} opacity-60`} />
          </div>
        )}
        <div className={`h-0.5 w-full mb-2 ${theme.bg} opacity-40`} />
        <div className="space-y-1.5 flex-1">
          <div className="h-1 bg-slate-200 rounded w-full" />
          <div className="h-1 bg-slate-200 rounded w-5/6" />
          <div className="h-1 bg-slate-200 rounded w-4/6" />
          <div className={`h-1 rounded w-1/3 mt-2 ${theme.bg} opacity-50`} />
          <div className="h-1 bg-slate-100 rounded w-full" />
          <div className="h-1 bg-slate-100 rounded w-full" />
        </div>
      </div>
      <div className={`absolute bottom-0 left-0 right-0 h-1 ${theme.bg}`} />
    </div>
  );
};

export default TemplateThumbnail;
