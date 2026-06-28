import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Check, XCircle, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import API from '../../utils/api';
import toast from 'react-hot-toast';

export default function AiImproveModal({ isOpen, onClose, originalText, fieldName = 'content', onAccept }) {
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && originalText?.trim()) {
      const getImprovement = async () => {
        setLoading(true);
        setError('');
        setSuggestion('');
        try {
          const { data } = await API.post('/ai/improve', {
            text: originalText,
            fieldName,
          });
          setSuggestion(data.suggestion || '');
        } catch (err) {
          console.error(err);
          setError('Failed to fetch AI suggestion. Try again.');
        } finally {
          setLoading(false);
        }
      };
      getImprovement();
    }
  }, [isOpen, originalText, fieldName]);

  const handleAccept = () => {
    if (suggestion) {
      onAccept(suggestion);
      toast.success('AI suggestion applied!');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#050816]/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-2xl bg-[#0b0e24]/90 border border-brand-500/20 shadow-glow-brand rounded-3xl overflow-hidden backdrop-blur-2xl p-6 sm:p-8"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center border border-brand-500/20">
                  <Sparkles className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-display text-white">Improve with AI</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Optimizing grammar, action verbs, and ATS keywords</p>
                </div>
              </div>

              {/* Grid content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Original content panel */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Original Text</span>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-slate-300 text-xs min-h-[150px] max-h-[220px] overflow-y-auto leading-relaxed">
                    {originalText || 'No content provided'}
                  </div>
                </div>

                {/* AI suggestion panel */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest block flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> AI Suggestion
                  </span>
                  <div className="p-4 rounded-2xl bg-brand-500/5 border border-brand-500/15 text-slate-200 text-xs min-h-[150px] max-h-[220px] overflow-y-auto leading-relaxed relative flex items-center justify-center">
                    {loading ? (
                      <div className="text-center space-y-2">
                        <Loader2 className="w-6 h-6 text-brand-400 animate-spin mx-auto" />
                        <span className="text-[10px] text-slate-400 block">Polishing with Gemini AI...</span>
                      </div>
                    ) : error ? (
                      <div className="text-center space-y-2 text-red-400">
                        <AlertCircle className="w-6 h-6 mx-auto" />
                        <span className="text-xs block">{error}</span>
                      </div>
                    ) : (
                      suggestion || 'Waiting for polish...'
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-4 border-t border-white/5">
                <button
                  onClick={onClose}
                  className="btn-secondary flex-1 py-2.5 text-xs flex items-center justify-center gap-1.5"
                  disabled={loading}
                >
                  <XCircle className="w-4 h-4 text-slate-400" />
                  Reject & Close
                </button>
                <button
                  onClick={handleAccept}
                  disabled={loading || !suggestion}
                  className="btn-primary flex-1 py-2.5 text-xs flex items-center justify-center gap-1.5 shadow-glow-brand"
                >
                  <Check className="w-4 h-4" />
                  Accept & Apply Suggestion
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
