import React from 'react';
import Navbar from '../components/Navbar';
import { Shield, Eye, Lock, Globe, Server, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen max-w-4xl mx-auto pt-28 pb-16 px-4 sm:px-6 lg:px-8 select-none">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-xs font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            Security & Trust
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-slate-900 dark:text-white leading-tight">
            Privacy <span className="bg-gradient-to-r from-indigo-400 to-[#ec4899] bg-clip-text text-transparent">Policy</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg mx-auto font-semibold">
            Last Updated: June 2026. Your privacy is paramount at HireCraftt. Learn how we safeguard your data.
          </p>
        </motion.div>

        {/* Content Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 p-6 sm:p-10 rounded-3xl shadow-xl space-y-8 backdrop-blur-xl"
        >
          {/* Section 1 */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-500" />
              1. Information We Collect
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">
              At HireCraftt, we collect information to provide a high-fidelity career enhancement experience. This includes:
            </p>
            <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-400 space-y-1.5 pl-2 font-medium">
              <li>Personal identifiers (name, email address, portfolio usernames).</li>
              <li>Resume and career histories that you upload or input into our AI builder.</li>
              <li>Usage diagnostics, system metrics, and cookies to customize active sessions.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#ec4899]" />
              2. How We Guard Your Data
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">
              Security is built into the foundation of HireCraftt. We enforce industry-grade safeguards:
            </p>
            <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-400 space-y-1.5 pl-2 font-medium">
              <li>All databases are protected with AES-256 encryption.</li>
              <li>API requests transit exclusively via Secure Sockets Layer (SSL/TLS).</li>
              <li>Administrative console access requires verified Super Admin privilege invites.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-500" />
              3. AI & Data Processing
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">
              To power features like ATS optimization and AI cover letters, we securely interface with AI processors. Your resume text is only processed to generate tailored feedback and is never sold to third-party data brokers.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-sky-500" />
              4. Data Retention & Deletion
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">
              You retain total ownership of your resumes and portfolios. You can permanently delete your account and all associated documents directly from your Settings panel at any time.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-amber-500" />
              5. Changes to This Policy
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">
              We may periodically refine this privacy structure to align with security advancements. Registered users will be notified of any significant policy revisions.
            </p>
          </div>
        </motion.div>
      </main>
    </>
  );
}
