import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Copy, Calendar, Lock, Unlock, Eye, Download, Users, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';
import API from '../../utils/api';

export default function ShareSettingsModal({ isOpen, onClose, resumeId, resumeTitle }) {
  const [isShared, setIsShared] = useState(false);
  const [password, setPassword] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [shareId, setShareId] = useState('');
  
  // Analytics
  const [views, setViews] = useState(0);
  const [downloads, setDownloads] = useState(0);
  const [uniqueVisitors, setUniqueVisitors] = useState(0);

  const [loading, setLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const shareUrl = `${window.location.origin}/shared/${shareId || resumeId}`;

  // Fetch current share configurations
  useEffect(() => {
    if (isOpen && resumeId) {
      const fetchShareSettings = async () => {
        try {
          const { data } = await API.get(`/resumes/${resumeId}`);
          if (data.sharing) {
            setIsShared(data.sharing.isShared || false);
            setPassword(data.sharing.password || '');
            setShareId(data.sharing.shareId || '');
            setViews(data.sharing.views || 0);
            setDownloads(data.sharing.downloads || 0);
            setUniqueVisitors(data.sharing.uniqueVisitors?.length || 0);
            if (data.sharing.expiresAt) {
              setExpiresAt(new Date(data.sharing.expiresAt).toISOString().split('T')[0]);
            } else {
              setExpiresAt('');
            }
          }
        } catch (err) {
          console.error(err);
          toast.error('Failed to load sharing settings');
        }
      };
      fetchShareSettings();
    }
  }, [isOpen, resumeId]);

  // Save configurations
  const handleSave = async () => {
    setLoading(true);
    try {
      const { data } = await API.put(`/resumes/${resumeId}/share-settings`, {
        isShared,
        password,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      });
      setIsShared(data.isShared);
      setPassword(data.password || '');
      setShareId(data.shareId || '');
      if (data.expiresAt) {
        setExpiresAt(new Date(data.expiresAt).toISOString().split('T')[0]);
      } else {
        setExpiresAt('');
      }
      toast.success('Sharing configurations updated!');
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save share settings');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Public sharing link copied to clipboard!');
    } catch {
      toast.error('Failed to copy share link');
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
            className="relative w-full max-w-lg bg-[#0b0e24]/90 border border-brand-500/20 shadow-glow-brand rounded-3xl overflow-hidden backdrop-blur-2xl p-6 sm:p-8"
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
                  <Share2 className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-display text-white">Share Resume Settings</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Resume: {resumeTitle}</p>
                </div>
              </div>

              {/* Share Toggle */}
              <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl">
                <div className="space-y-0.5">
                  <span className="text-sm font-bold text-slate-200 block">Public Link Sharing</span>
                  <span className="text-xs text-slate-400 block">Make this resume accessible via public URL</span>
                </div>
                <button
                  onClick={() => setIsShared(!isShared)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    isShared ? 'bg-brand-500' : 'bg-slate-800'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      isShared ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {isShared && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4"
                >
                  {/* Share Link Row */}
                  <div className="flex items-center gap-2 p-3 bg-white/5 border border-white/5 rounded-xl">
                    <span className="text-xs text-slate-300 truncate flex-1">{shareUrl}</span>
                    <button
                      onClick={handleCopy}
                      className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-brand-500 hover:text-white transition"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowQR(!showQR)}
                      className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-brand-500 hover:text-white transition"
                      title="Show QR Code"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>
                  </div>

                  {/* QR Code section */}
                  {showQR && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 bg-white rounded-2xl w-fit mx-auto"
                    >
                      <QRCodeSVG value={shareUrl} size={150} fgColor="#050816" bgColor="#ffffff" />
                    </motion.div>
                  )}

                  {/* Analytics Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-center">
                      <Eye className="w-4 h-4 text-brand-400 mx-auto mb-1" />
                      <span className="text-[10px] text-slate-500 font-bold block">VIEWS</span>
                      <span className="text-lg font-bold text-slate-200 block">{views}</span>
                    </div>
                    <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-center">
                      <Download className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                      <span className="text-[10px] text-slate-500 font-bold block">DOWNLOADS</span>
                      <span className="text-lg font-bold text-slate-200 block">{downloads}</span>
                    </div>
                    <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-center">
                      <Users className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
                      <span className="text-[10px] text-slate-500 font-bold block">VISITORS</span>
                      <span className="text-lg font-bold text-slate-200 block">{uniqueVisitors}</span>
                    </div>
                  </div>

                  {/* Password protection and Expiry */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-brand-400" /> Password Lock
                      </label>
                      <input
                        type="password"
                        placeholder="Leave blank for none"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field py-2 text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-brand-400" /> Expiry Date
                      </label>
                      <input
                        type="date"
                        value={expiresAt}
                        onChange={(e) => setExpiresAt(e.target.value)}
                        className="input-field py-2 text-xs text-white bg-slate-900/60"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 pt-4 border-t border-white/5">
                <button
                  onClick={onClose}
                  className="btn-secondary flex-1 py-2 text-sm"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="btn-primary flex-1 py-2 text-sm shadow-glow-brand"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
