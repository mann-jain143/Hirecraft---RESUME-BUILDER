import { useEffect, useRef, useState, useCallback } from 'react';
import API from '../utils/api';

export const useAutoSave = (resumeId, resumeData, enabled = true) => {
  const [syncStatus, setSyncStatus] = useState('idle');
  const timerRef = useRef(null);
  const isFirstRender = useRef(true);
  const lastSavedRef = useRef(null);

  const save = useCallback(async () => {
    if (!resumeId || !enabled) return;
    setSyncStatus('syncing');
    try {
      await API.put(`/resumes/${resumeId}`, { resumeData });
      lastSavedRef.current = JSON.stringify(resumeData);
      setSyncStatus('saved');
      setTimeout(() => setSyncStatus('idle'), 2000);
    } catch (error) {
      console.error('Auto-save failed:', error);
      setSyncStatus('error');
    }
  }, [resumeId, resumeData, enabled]);

  useEffect(() => {
    if (!resumeId || !enabled) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      lastSavedRef.current = JSON.stringify(resumeData);
      return;
    }

    const serialized = JSON.stringify(resumeData);
    if (serialized === lastSavedRef.current) return;

    clearTimeout(timerRef.current);
    setSyncStatus('pending');
    timerRef.current = setTimeout(save, 3000);

    return () => clearTimeout(timerRef.current);
  }, [resumeData, resumeId, enabled, save]);

  return { syncStatus, saveNow: save };
};
