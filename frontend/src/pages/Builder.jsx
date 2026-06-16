import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, Download, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import ResumeForm from '../components/ResumeForm';
import ResumePreview from '../components/ResumePreview';
import Toast from '../components/Toast';
import MeshBackground from '../components/layout/MeshBackground';
import { ResumeProvider, useResume } from '../context/ResumeContext';
import { useAutoSave } from '../hooks/useAutoSave';
import API from '../utils/api';
import { exportResumeToPdf } from '../utils/pdfExport';

const BuilderContent = () => {
  const { resumeId: routeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const componentRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isLoading, setIsLoading] = useState(routeId !== 'new');
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const { resumeData, resumeId, loadResume, resetResume, setResumeId } = useResume();
  const { syncStatus } = useAutoSave(resumeId, resumeData, !!resumeId);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'success' }), 4000);
  }, []);

  useEffect(() => {
    const init = async () => {
      if (routeId === 'new') {
        resetResume();
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const { data } = await API.get(`/resumes/${routeId}`);
        loadResume(data);
      } catch (error) {
        console.error('Failed to load resume:', error);
        showToast('Resume not found.', 'error');
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [routeId, loadResume, resetResume, navigate, showToast]);

  useEffect(() => {
    if (location.state?.autoDownload && !isLoading && resumeId) {
      const timer = setTimeout(async () => {
        try {
          const name = resumeData.personalInfo.fullName?.replace(/\s+/g, '_') || 'HireCraft_Resume';
          await exportResumeToPdf(componentRef.current, name);
        } catch (e) {
          console.error(e);
        }
        navigate(location.pathname, { replace: true, state: {} });
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [location.state, isLoading, resumeId, resumeData, navigate, location.pathname]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (resumeId) {
        await API.put(`/resumes/${resumeId}`, { resumeData });
        showToast('Resume saved successfully!', 'success');
      } else {
        const { data } = await API.post('/resumes', { resumeData });
        setResumeId(data._id);
        navigate(`/builder/${data._id}`, { replace: true });
        showToast('Resume created and saved!', 'success');
      }
    } catch (error) {
      showToast('Failed to save. Please log in and try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    try {
      const name = resumeData.personalInfo.fullName?.replace(/\s+/g, '_') || 'HireCraft_Resume';
      await exportResumeToPdf(componentRef.current, name);
      showToast('PDF downloaded successfully!', 'success');
    } catch (error) {
      showToast('PDF export failed. Try again.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <MeshBackground />
        <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin relative z-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans overflow-hidden relative">
      <MeshBackground />
      <Navbar syncStatus={syncStatus} />

      <main className="flex-grow flex flex-col lg:flex-row h-[calc(100vh-64px)] relative z-10">
        <div className="w-full lg:w-[45%] p-6 lg:p-8 overflow-y-auto border-r border-slate-200/50 dark:border-white/10 backdrop-blur-sm">
          <ResumeForm />
        </div>

        <div className="w-full lg:w-[55%] p-6 lg:p-8 overflow-y-auto flex flex-col items-center relative">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-0 z-10 w-full max-w-[210mm] flex justify-end gap-3 mb-4 pt-2"
          >
            <button type="button" onClick={handleSave} disabled={isSaving}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white px-5 py-2.5 rounded-lg font-semibold shadow-lg transition transform hover:-translate-y-0.5">
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {isSaving ? 'Saving...' : 'Save Progress'}
            </button>
            <button type="button" onClick={handleDownloadPdf} disabled={isExporting}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white px-5 py-2.5 rounded-lg font-semibold shadow-lg transition transform hover:-translate-y-0.5">
              {isExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              {isExporting ? 'Exporting...' : 'Download PDF'}
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            ref={componentRef}
            className="w-full max-w-[210mm] print-area"
          >
            <ResumePreview resumeData={resumeData} />
          </motion.div>
        </div>
      </main>

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
    </div>
  );
};

const Builder = () => (
  <ResumeProvider>
    <BuilderContent />
  </ResumeProvider>
);

export default Builder;
