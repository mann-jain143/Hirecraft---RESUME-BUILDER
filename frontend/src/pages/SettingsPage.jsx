import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings, Globe, Download, Shield, X, Lock, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../utils/api';
import Navbar from '../components/Navbar';
import PremiumAnimatedBackground from '../components/layout/PremiumAnimatedBackground';

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const [exporting, setExporting] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const { data } = await API.get('/users/export');
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hirecraftt-export-${new Date().toISOString().slice(0,10)}.json`;
      a.click();
      toast.success('Data exported successfully!');
    } catch (err) {
      toast.error('Export failed');
    } finally {
      setExporting(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!newPassword.trim()) return toast.error('Please enter a new password');
    if (newPassword !== confirmPassword) return toast.error('Passwords do not match');

    try {
      setUpdatingPassword(true);
      await API.put('/users/profile', { password: newPassword });
      toast.success('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
      setIsPrivacyModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('WARNING: This will permanently delete your account, your resumes, and your portfolio. This action CANNOT be undone. Are you sure you want to proceed?')) {
      return;
    }
    try {
      setDeletingAccount(true);
      await API.delete('/users/delete-account');
      toast.success('Account deleted successfully');
      localStorage.clear();
      window.location.href = '/login';
    } catch (err) {
      toast.error('Failed to delete account');
    } finally {
      setDeletingAccount(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050816] text-slate-900 dark:text-white relative transition-colors duration-300">
      <PremiumAnimatedBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow max-w-4xl w-full mx-auto px-4 pt-24 pb-8 space-y-8">
          
          <div className="flex items-center gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
            <div className="p-4 bg-slate-200 dark:bg-white/10 rounded-2xl">
              <Settings className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-black font-display tracking-tight">{t('settings')}</h1>
              <p className="text-slate-500">Manage your account preferences and data.</p>
            </div>
          </div>

          <div className="grid gap-6">
            
            {/* Language Settings */}
            <div className="bg-white/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Globe className="w-6 h-6 text-brand-500" />
                <div>
                  <h3 className="font-bold">{t('language')}</h3>
                  <p className="text-sm text-slate-500">Select your preferred platform language</p>
                </div>
              </div>
              <select 
                value={i18n.language} 
                onChange={handleLanguageChange}
                className="px-4 py-2 bg-slate-900 border border-white/10 rounded-lg outline-none font-bold text-sm text-white cursor-pointer"
              >
                <option value="en" className="bg-slate-900 text-white">English</option>
                <option value="es" className="bg-slate-900 text-white">Español</option>
                <option value="fr" className="bg-slate-900 text-white">Français</option>
                <option value="de" className="bg-slate-900 text-white">Deutsch</option>
                <option value="hi" className="bg-slate-900 text-white">हिंदी</option>
              </select>
            </div>

            {/* Export Data */}
            <div className="bg-white/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Download className="w-6 h-6 text-emerald-500" />
                <div>
                  <h3 className="font-bold">{t('export_data')}</h3>
                  <p className="text-sm text-slate-500">{t('export_desc')}</p>
                </div>
              </div>
              <button onClick={handleExport} disabled={exporting} className="btn-primary py-2 px-6">
                {exporting ? '...' : t('export_btn')}
              </button>
            </div>

            {/* Privacy */}
            <div className="bg-white/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Shield className="w-6 h-6 text-red-500" />
                <div>
                  <h3 className="font-bold">Privacy Options</h3>
                  <p className="text-sm text-slate-500">Delete account or change password</p>
                </div>
              </div>
              <button 
                onClick={() => setIsPrivacyModalOpen(true)}
                className="px-6 py-2 rounded-xl border border-slate-200 dark:border-white/10 font-bold text-sm hover:bg-slate-100 dark:hover:bg-white/5 transition cursor-pointer"
              >
                Manage
              </button>
            </div>

          </div>

          {/* Privacy Management Modal */}
          {isPrivacyModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
              <div className="bg-[#0b0f25] border border-white/10 w-full max-w-md rounded-3xl p-6 shadow-2xl relative space-y-6">
                <button 
                  onClick={() => setIsPrivacyModalOpen(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="space-y-1">
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-red-500" /> Account Privacy Console
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold">Change your password or request account termination.</p>
                </div>

                {/* Change Password Form */}
                <form onSubmit={handleChangePassword} className="space-y-4 pt-2 border-t border-white/5">
                  <h4 className="text-xs font-black uppercase text-indigo-400 tracking-wider flex items-center gap-1.5 font-sans">
                    <Lock className="w-3.5 h-3.5" /> Update Account Password
                  </h4>
                  <div className="space-y-3">
                    <input
                      type="password"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-white font-sans"
                    />
                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-white font-sans"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={updatingPassword}
                    className="w-full btn-primary py-2.5 text-xs font-bold cursor-pointer"
                  >
                    {updatingPassword ? 'Updating Password...' : 'Save New Password'}
                  </button>
                </form>

                {/* Delete Account Area */}
                <div className="pt-4 border-t border-white/5 space-y-3">
                  <h4 className="text-xs font-black uppercase text-red-500 tracking-wider flex items-center gap-1.5 font-sans">
                    <Trash2 className="w-3.5 h-3.5" /> Danger Zone
                  </h4>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                    Deleting your account deletes all resumes, applications, and settings permanently. This action is irreversible.
                  </p>
                  <button 
                    onClick={handleDeleteAccount}
                    disabled={deletingAccount}
                    className="w-full py-2.5 bg-red-600/10 border border-red-500/30 hover:bg-red-600 text-red-400 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    {deletingAccount ? 'Deleting Account...' : 'Delete My Account Permanently'}
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
