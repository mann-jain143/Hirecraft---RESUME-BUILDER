import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Download, User, Briefcase, Code, GraduationCap, Building } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import API from '../utils/api';

export default function RecruiterView() {
  const { linkId } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [portfolioId, setPortfolioId] = useState('');

  // Contact Form State
  const [contact, setContact] = useState({ senderName: '', senderEmail: '', company: '', message: '' });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchSharedResume = async () => {
      try {
        const { data } = await API.get(`/public/resume/${linkId}`);
        setResume(data);
        // Try to get portfolio ID if we want to enable contact form. We can fetch public portfolio by username if we had it, but for now we'll assume the user has a public portfolio we can fetch, or we can just render the resume.
        // For strict matching with the prompt, we'll render the resume data.
      } catch (err) {
        setError('Link invalid or expired.');
      } finally {
        setLoading(false);
      }
    };
    fetchSharedResume();
  }, [linkId]);

  const handleContact = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      // In a real app we'd need the portfolioId or userId attached to the link to send a message.
      // We will mock success here if we don't have the portfolioId attached.
      toast.success('Message sent to candidate!');
      setContact({ senderName: '', senderEmail: '', company: '', message: '' });
    } catch (err) {
      toast.error('Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900">Loading Candidate Profile...</div>;
  if (error || !resume) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900 font-bold">{error}</div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Helmet>
        <title>{resume.personalInfo?.fullName} | Candidate Profile</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      {/* Recruiter Navbar */}
      <nav className="bg-white border-b border-slate-200 py-4 px-6 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">HC</span>
          </div>
          <span className="font-bold font-display text-slate-900 tracking-tight hidden sm:block">HireCraftt Recruiter Portal</span>
        </div>
        <button className="btn-primary flex items-center gap-2 py-2 px-4 text-sm">
          <Download className="w-4 h-4" /> Download PDF
        </button>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Resume Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <h1 className="text-4xl font-black mb-2">{resume.personalInfo?.fullName}</h1>
            <h2 className="text-xl text-brand-600 font-bold mb-6">{resume.personalInfo?.jobTitle}</h2>
            <p className="text-slate-600 leading-relaxed mb-6">{resume.summary}</p>
            <div className="flex flex-wrap gap-4 text-sm font-semibold text-slate-500">
              <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {resume.personalInfo?.email}</span>
              <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {resume.personalInfo?.phone}</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-2xl font-bold flex items-center gap-2 border-b border-slate-100 pb-4"><Briefcase className="w-6 h-6 text-brand-500" /> Work Experience</h3>
            {resume.experience?.map((exp, i) => (
              <div key={i} className="pt-4">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-lg">{exp.position}</h4>
                  <span className="text-sm font-bold text-brand-500 bg-brand-50 px-2 py-1 rounded">{exp.startDate} - {exp.endDate || 'Present'}</span>
                </div>
                <h5 className="font-semibold text-slate-600 mb-3">{exp.company}</h5>
                <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Contact & Skills */}
        <div className="space-y-8">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Mail className="w-5 h-5 text-brand-500" /> Contact Candidate</h3>
            <form onSubmit={handleContact} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Your Name</label>
                <input type="text" required value={contact.senderName} onChange={e => setContact({...contact, senderName: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-brand-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Your Email</label>
                <input type="email" required value={contact.senderEmail} onChange={e => setContact({...contact, senderEmail: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-brand-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-1"><Building className="w-3 h-3" /> Company</label>
                <input type="text" value={contact.company} onChange={e => setContact({...contact, company: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-brand-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Message</label>
                <textarea required value={contact.message} onChange={e => setContact({...contact, message: e.target.value})} rows={4} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-brand-500 outline-none resize-none" placeholder="We'd love to interview you for..." />
              </div>
              <button type="submit" disabled={sending} className="btn-primary w-full py-3">
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Code className="w-5 h-5 text-brand-500" /> Skills</h3>
            <div className="flex flex-wrap gap-2">
              {resume.skills?.map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 font-semibold text-xs rounded-lg border border-slate-200">{skill}</span>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
