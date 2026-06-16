import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, Wand2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="glass-card p-8 group hover:border-brand-500/50 transition-all duration-300"
  >
    <div className="w-12 h-12 rounded-2xl bg-brand-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      <Icon className="w-6 h-6 text-brand-400" />
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{description}</p>
  </motion.div>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen pt-32 flex flex-col">
      <div className="max-w-7xl mx-auto px-6 flex-grow w-full">
        
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-32 mt-8">
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-5xl md:text-7xl font-extrabold text-white mb-8 leading-tight"
          >
            Create Professional Resumes in <span className="text-gradient">Minutes.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl"
          >
            HireCraft uses advanced AI to write, design, and optimize your resume so you can land your dream job faster. Stand out with startup-quality designs.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link to="/signup" className="flex items-center gap-2 px-8 py-4 bg-brand-500 hover:bg-brand-400 text-white rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-[0_0_30px_rgba(99,102,241,0.5)]">
              Build My Resume <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#templates" className="px-8 py-4 glass text-white hover:bg-white/10 rounded-2xl font-bold text-lg transition-all">
              View Templates
            </a>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          <FeatureCard 
            icon={Zap}
            title="Real-Time Live Preview"
            description="Watch your resume come to life as you type. Zero loading screens, zero waiting. What you see is what you get."
            delay={0.8}
          />
          <FeatureCard 
            icon={Wand2}
            title="AI Content Generator"
            description="Stuck on what to write? Our Gemini AI integration writes professional summaries and bullet points for you."
            delay={1.0}
          />
          <FeatureCard 
            icon={Shield}
            title="ATS-Friendly Export"
            description="Our templates are rigorously tested against Applicant Tracking Systems to ensure your resume actually gets read."
            delay={1.2}
          />
        </div>
      </div>

      {/* Footer Section */}
      <footer className="border-t border-white/10 bg-dark-900/50 backdrop-blur-md py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 opacity-80">
            <span className="text-xl font-bold tracking-tight text-white">
              Hire<span className="text-gradient">Craft</span>
            </span>
          </div>
          <p className="text-sm text-gray-500 font-medium">
            &copy; 2026 HireCraft. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}