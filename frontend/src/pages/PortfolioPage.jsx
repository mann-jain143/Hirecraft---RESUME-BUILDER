import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Globe, Download, Briefcase, GraduationCap, Code } from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon } from '../components/ui/SocialIcons';
import PageLoader from '../components/ui/PageLoader';
import { Helmet } from 'react-helmet-async';
import API from '../utils/api';

export default function PortfolioPage() {
  const { username } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPublicPortfolio = async () => {
      try {
        const { data } = await API.get(`/public/u/${username}`);
        setPortfolio(data);
      } catch (err) {
        setError('Portfolio not found or is private.');
      } finally {
        setLoading(false);
      }
    };
    fetchPublicPortfolio();
  }, [username]);

  if (loading) return <PageLoader label="Loading portfolio..." />;
  if (error || !portfolio) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#050816] text-white px-6">
      <p className="font-bold text-lg">{error}</p>
      <a href="/" className="text-brand-400 hover:text-brand-300 text-sm transition-colors">← Back to HireCraftt</a>
    </div>
  );

  const resume = portfolio.resumeId;
  const { theme, customization, socialLinks, badges } = portfolio;
  const c = customization || { accentColor: '#6366f1' };

  // Theme logic mapping
  let bgClass = "bg-slate-50 text-slate-900";
  let cardClass = "bg-white border-slate-200 shadow-xl";
  if (theme === 'dark' || theme === 'modern') {
    bgClass = "bg-[#050816] text-white";
    cardClass = "bg-white/5 border-white/10 backdrop-blur-md";
  }

  return (
    <div className={`min-h-screen ${bgClass} font-sans`}>
      <Helmet>
        <title>{resume?.personalInfo?.fullName || username} | Portfolio</title>
        <meta name="description" content={`Professional portfolio of ${resume?.personalInfo?.fullName || username}.`} />
        <meta property="og:title" content={`${resume?.personalInfo?.fullName || username} | Portfolio`} />
        <meta property="og:description" content={resume?.summary || 'View my portfolio and projects.'} />
      </Helmet>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 px-6 overflow-hidden flex flex-col items-center text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 z-0 pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at 50% 0%, ${c.accentColor}22 0%, transparent 70%)`}} />
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="z-10 max-w-4xl w-full">
          {/* Badges */}
          {badges?.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {badges.map((b, i) => (
                <span key={i} className="px-3 py-1 rounded-full text-xs font-bold border" style={{ borderColor: c.accentColor, color: c.accentColor, backgroundColor: `${c.accentColor}11` }}>
                  {b}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
            {resume?.personalInfo?.fullName || 'John Doe'}
          </h1>
          <h2 className="text-xl md:text-2xl font-medium opacity-80 mb-8" style={{ color: c.accentColor }}>
            {resume?.personalInfo?.jobTitle || 'Professional'}
          </h2>
          <p className="max-w-2xl mx-auto text-lg opacity-70 mb-10 leading-relaxed">
            {resume?.summary || 'I build digital experiences.'}
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4">
            <a href={`mailto:${resume?.personalInfo?.email}`} className="px-8 py-4 rounded-full font-bold text-white shadow-lg transition-transform hover:scale-105 flex items-center gap-2" style={{ backgroundColor: c.accentColor }}>
              <Mail className="w-5 h-5" /> Contact Me
            </a>
            <button className="px-8 py-4 rounded-full font-bold border transition-transform hover:scale-105 flex items-center gap-2" style={{ borderColor: c.accentColor, color: c.accentColor }}>
              <Download className="w-5 h-5" /> Download Resume
            </button>
          </div>

          <div className="flex justify-center items-center gap-6 mt-12">
            {socialLinks?.github && <a href={socialLinks.github} target="_blank" rel="noreferrer" className="opacity-60 hover:opacity-100 hover:scale-110 transition-all"><GithubIcon className="w-6 h-6" /></a>}
            {socialLinks?.linkedin && <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="opacity-60 hover:opacity-100 hover:scale-110 transition-all"><LinkedinIcon className="w-6 h-6" /></a>}
            {socialLinks?.twitter && <a href={socialLinks.twitter} target="_blank" rel="noreferrer" className="opacity-60 hover:opacity-100 hover:scale-110 transition-all"><TwitterIcon className="w-6 h-6" /></a>}
            {socialLinks?.website && <a href={socialLinks.website} target="_blank" rel="noreferrer" className="opacity-60 hover:opacity-100 transition"><Globe className="w-6 h-6" /></a>}
          </div>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-20 space-y-32">
        
        {/* Experience Section */}
        {resume?.experience?.length > 0 && (
          <section>
            <h3 className="text-3xl font-bold mb-12 flex items-center gap-3">
              <Briefcase className="w-8 h-8" style={{ color: c.accentColor }} /> Experience
            </h3>
            <div className="grid gap-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 dark:before:via-white/10 before:to-transparent">
              {resume.experience.map((exp, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow" style={{ backgroundColor: bgClass.includes('dark') || bgClass.includes('#050816') ? '#050816' : '#fff', borderColor: c.accentColor }}>
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.accentColor }} />
                  </div>
                  <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border ${cardClass}`}>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-xl">{exp.position}</h4>
                      <span className="text-xs font-bold px-2 py-1 rounded-md opacity-80" style={{ backgroundColor: `${c.accentColor}22`, color: c.accentColor }}>{exp.startDate} - {exp.endDate || 'Present'}</span>
                    </div>
                    <h5 className="font-semibold opacity-70 mb-4">{exp.company}</h5>
                    <p className="text-sm opacity-80 leading-relaxed whitespace-pre-line">{exp.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {resume?.skills?.length > 0 && (
          <section>
            <h3 className="text-3xl font-bold mb-12 flex items-center gap-3 justify-center text-center">
              <Code className="w-8 h-8" style={{ color: c.accentColor }} /> Core Expertise
            </h3>
            <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
              {resume.skills.map((skill, i) => (
                <motion.span key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className={`px-5 py-3 rounded-xl border font-semibold text-sm ${cardClass}`}>
                  {skill}
                </motion.span>
              ))}
            </div>
          </section>
        )}

        {/* Education Section */}
        {resume?.education?.length > 0 && (
          <section>
            <h3 className="text-3xl font-bold mb-12 flex items-center gap-3">
              <GraduationCap className="w-8 h-8" style={{ color: c.accentColor }} /> Education
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {resume.education.map((edu, i) => (
                <div key={i} className={`p-8 rounded-3xl border ${cardClass}`}>
                  <h4 className="font-bold text-xl mb-1">{edu.degree}</h4>
                  <h5 className="font-medium opacity-80 mb-4" style={{ color: c.accentColor }}>{edu.institution}</h5>
                  <p className="text-sm opacity-60 font-mono">{edu.startDate} - {edu.endDate || 'Present'}</p>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      <footer className="py-10 text-center border-t border-slate-200 dark:border-white/10 opacity-60 text-sm">
        <p>Built with <span className="font-bold">HireCraftt</span></p>
      </footer>
    </div>
  );
}
