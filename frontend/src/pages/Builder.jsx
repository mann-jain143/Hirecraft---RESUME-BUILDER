import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Download, Loader2, Sparkles, BookOpen, QrCode, History, ChevronLeft, Edit3, Eye } from 'lucide-react';
import Navbar from '../components/Navbar';
import ResumeForm from '../components/ResumeForm';
import ResumePreview from '../components/ResumePreview';
import Toast from '../components/Toast';
import PremiumAnimatedBackground from '../components/layout/PremiumAnimatedBackground';
import ProgressBar from '../components/builder/ProgressBar';
import ZoomControl from '../components/builder/ZoomControl';
import SampleResumeModal from '../components/builder/SampleResumeModal';
import QRCodeModal from '../components/builder/QRCodeModal';
import AIAssistantPanel from '../components/ai/AIAssistantPanel';
import { ResumeProvider, useResume } from '../context/ResumeContext';
import { useAutoSave } from '../hooks/useAutoSave';
import { exportResumeToPdf } from '../utils/pdfExport';
import API from '../utils/api';
import toast from 'react-hot-toast';

const BuilderContent = () => {
  const { resumeId: routeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const componentRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isLoading, setIsLoading] = useState(routeId !== 'new');
  const [zoom, setZoom] = useState(100);
  const [showSampleModal, setShowSampleModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [toastData, setToastData] = useState({ message: '', type: 'success' });
  const [activeTab, setActiveTab] = useState('edit');
  const { resumeData, resumeId, loadResume, resetResume, setResumeId, setResumeData, title } = useResume();
  const { syncStatus } = useAutoSave(resumeId, resumeData, !!resumeId);

  const showToast = (message, type = 'success') => {
    setToastData({ message, type });
    setTimeout(() => setToastData({ message: '', type: 'success' }), 3000);
  };

  // Load resume data from API, import, or reset for new
  useEffect(() => {
    if (routeId === 'new') {
      resetResume();
      const imported = sessionStorage.getItem('importedResumeData');
      if (imported || location.state?.imported) {
        try {
          const parsed = imported ? JSON.parse(imported) : null;
          if (parsed) {
            loadResume({ resumeData: parsed, title: 'Imported Resume' });
            toast.success('Imported resume loaded!');
          }
          sessionStorage.removeItem('importedResumeData');
        } catch {
          toast.error('Failed to load imported resume');
        }
      }
      setIsLoading(false);
    } else {
      const loadData = async () => {
        try {
          const { data } = await API.get(`/resumes/${routeId}`);
          loadResume(data);
        } catch (err) {
          toast.error('Failed to load resume');
          navigate('/dashboard');
        } finally {
          setIsLoading(false);
        }
      };
      loadData();
    }
  }, [routeId]);

  // Auto-download PDF if redirected from dashboard with autoDownload flag
  useEffect(() => {
    if (location.state?.autoDownload && !isLoading && componentRef.current) {
      handleDownloadPdf();
      window.history.replaceState({}, document.title);
    }
  }, [isLoading, location.state]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (resumeId) {
        await API.put(`/resumes/${resumeId}`, { resumeData });
        toast.success('Resume saved!');
      } else {
        const { data } = await API.post('/resumes', { resumeData });
        setResumeId(data._id);
        toast.success('Resume created!');
        navigate(`/builder/${data._id}`, { replace: true });
      }
    } catch (err) {
      toast.error('Failed to save resume');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!componentRef.current) return;
    setIsExporting(true);
    try {
      const filename = resumeData.personalInfo.fullName
        ? `${resumeData.personalInfo.fullName}_HireCraft_Resume`
        : 'HireCraft_Resume';
      await exportResumeToPdf(componentRef.current, filename);
      toast.success('PDF downloaded!');
    } catch (err) {
      toast.error('PDF export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const handleLoadSample = (sampleData) => {
    setResumeData(sampleData);
    toast.success('Sample resume loaded!');
    setShowSampleModal(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-brand-400 animate-spin" />
          <p className="text-gray-400">Loading resume...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <PremiumAnimatedBackground />
      <div className="relative z-10">
        <Navbar syncStatus={syncStatus} />

        {/* Builder Header */}
        <div className="pt-20 px-4 sm:px-6">
          <div className="max-w-[1600px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center justify-between gap-3 py-4"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="btn-secondary py-2 px-3 flex items-center gap-1.5 text-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <h1 className="text-lg font-semibold text-white truncate max-w-[200px]">
                  {title || 'New Resume'}
                </h1>
              </div>

              {/* Progress Bar */}
              <div className="hidden md:block flex-1 max-w-xs mx-4">
                <ProgressBar resumeData={resumeData} />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <motion.button
                  onClick={() => setShowSampleModal(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary py-2 px-3 text-sm flex items-center gap-1.5"
                  title="Load Sample Resume"
                >
                  <BookOpen className="w-4 h-4" />
                  <span className="hidden sm:inline">Samples</span>
                </motion.button>

                <motion.button
                  onClick={() => setShowAIPanel(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary py-2 px-3 text-sm flex items-center gap-1.5 border-brand-500/30"
                  title="AI Assistant"
                >
                  <Sparkles className="w-4 h-4 text-brand-400" />
                  <span className="hidden sm:inline">AI</span>
                </motion.button>

                {resumeId && (
                  <motion.button
                    onClick={() => setShowQRModal(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-secondary py-2 px-3 text-sm"
                    title="Share QR Code"
                  >
                    <QrCode className="w-4 h-4" />
                  </motion.button>
                )}

                <motion.button
                  onClick={handleSave}
                  disabled={isSaving}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary py-2 px-4 text-sm flex items-center gap-1.5"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save
                </motion.button>

                <motion.button
                  onClick={handleDownloadPdf}
                  disabled={isExporting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary py-2 px-4 text-sm flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500"
                >
                  {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  PDF
                </motion.button>
              </div>
            </motion.div>

            {/* Mobile Progress Bar */}
            <div className="md:hidden mb-3">
              <ProgressBar resumeData={resumeData} />
            </div>
          </div>
        </div>

        {/* Builder Layout */}
        <div className="px-4 sm:px-6 pb-12">
          {/* Mobile View Toggle Tabs */}
          <div className="lg:hidden flex justify-center mb-6">
            <div className="bg-slate-900/60 border border-slate-700/50 p-1 rounded-xl flex gap-1 w-full max-w-sm shadow-lg backdrop-blur-md">
              <button
                type="button"
                onClick={() => setActiveTab('edit')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'edit'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                Edit Form
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'preview'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Eye className="w-4 h-4" />
                Live Preview
              </button>
            </div>
          </div>

          <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-6 builder-layout">
            {/* Left Panel - Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`w-full lg:w-[45%] builder-form-panel ${activeTab === 'edit' ? 'block' : 'hidden lg:block'}`}
            >
              <div className="glass-card p-1 overflow-y-auto max-h-[calc(100vh-180px)] no-scrollbar rounded-2xl">
                <ResumeForm />
              </div>
            </motion.div>

            {/* Right Panel - Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`w-full lg:w-[55%] builder-preview-panel ${activeTab === 'preview' ? 'block' : 'hidden lg:block'}`}
            >
              {/* Zoom Control */}
              <div className="flex justify-end mb-3">
                <ZoomControl zoom={zoom} onZoomChange={setZoom} />
              </div>

              {/* Resume Preview */}
              <div className="glass-card p-4 overflow-auto max-h-[calc(100vh-220px)] rounded-2xl">
                <div
                  className="resume-preview-container mx-auto"
                  style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
                >
                  <div ref={componentRef} className="print-area bg-white shadow-2xl a4-ratio w-[210mm] mx-auto">
                    <ResumePreview resumeData={resumeData} />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <SampleResumeModal
        isOpen={showSampleModal}
        onClose={() => setShowSampleModal(false)}
        onLoadSample={handleLoadSample}
      />

      {resumeId && (
        <QRCodeModal
          isOpen={showQRModal}
          onClose={() => setShowQRModal(false)}
          resumeId={resumeId}
          resumeName={title || 'Resume'}
        />
      )}

      {/* AI Assistant Panel */}
      <AIAssistantPanel
        isOpen={showAIPanel}
        onClose={() => setShowAIPanel(false)}
      />

      {/* Legacy Toast */}
      <Toast message={toastData.message} type={toastData.type} onClose={() => setToastData({ message: '', type: 'success' })} />
    </div>
  );
};

const Builder = () => (
  <ResumeProvider>
    <BuilderContent />
  </ResumeProvider>
);

export default Builder;
