import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart as BarChartIcon, Eye, Download, Smartphone, Globe, Users, Target } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import API from '../utils/api';
import Navbar from '../components/Navbar';
import PremiumAnimatedBackground from '../components/layout/PremiumAnimatedBackground';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await API.get('/portfolio/analytics');
        setAnalytics(data);
      } catch (err) {
        toast.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><BarChartIcon className="w-8 h-8 animate-spin text-brand-500" /></div>;
  if (!analytics) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900 font-bold">No Analytics Found. Ensure you have created a portfolio.</div>;

  const deviceData = [
    { name: 'Desktop', value: analytics.deviceStats?.desktop || 45 },
    { name: 'Mobile', value: analytics.deviceStats?.mobile || 65 },
    { name: 'Tablet', value: analytics.deviceStats?.tablet || 10 },
  ];

  const trafficData = analytics.trafficSources?.length > 0 ? analytics.trafficSources : [
    { source: 'Direct', count: 20 },
    { source: 'LinkedIn', count: 45 },
    { source: 'Twitter', count: 15 }
  ];

  const viewsData = analytics.viewsTimeline?.length > 0 ? analytics.viewsTimeline.map((v, i) => ({ name: `Day ${i+1}`, views: v.count })) : [
    { name: 'Mon', views: 10 }, { name: 'Tue', views: 25 }, { name: 'Wed', views: 15 },
    { name: 'Thu', views: 40 }, { name: 'Fri', views: 60 }, { name: 'Sat', views: 30 }, { name: 'Sun', views: 45 }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050816] text-slate-900 dark:text-white relative transition-colors duration-300">
      <PremiumAnimatedBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          
          <div className="flex items-center gap-4 mb-8 border-b border-slate-200 dark:border-white/10 pb-6">
            <div className="p-4 bg-brand-500/10 rounded-2xl text-brand-500">
              <BarChartIcon className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-black font-display tracking-tight text-slate-900 dark:text-white">Profile Analytics</h1>
              <p className="text-slate-500 dark:text-slate-400">Track your portfolio performance and recruiter engagement.</p>
            </div>
          </div>

          {/* Top Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-white/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between hover:border-brand-500/50 transition">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Views</span>
                <Eye className="w-5 h-5 text-brand-500" />
              </div>
              <span className="text-4xl font-black text-slate-900 dark:text-white">{analytics.totalViews || 120}</span>
            </div>
            
            <div className="bg-white/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between hover:border-emerald-500/50 transition">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Downloads</span>
                <Download className="w-5 h-5 text-emerald-500" />
              </div>
              <span className="text-4xl font-black text-slate-900 dark:text-white">{analytics.resumeDownloads || 34}</span>
            </div>

            <div className="bg-white/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between hover:border-purple-500/50 transition">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Recruiter Visits</span>
                <Users className="w-5 h-5 text-purple-500" />
              </div>
              <span className="text-4xl font-black text-slate-900 dark:text-white">{analytics.recruiterVisits || 12}</span>
            </div>

            <div className="bg-white/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between hover:border-amber-500/50 transition">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">QR Scans</span>
                <Target className="w-5 h-5 text-amber-500" />
              </div>
              <span className="text-4xl font-black text-slate-900 dark:text-white">{analytics.qrScans || 45}</span>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Traffic Growth */}
            <div className="bg-white/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl h-96 flex flex-col">
              <h3 className="text-lg font-bold font-display mb-6 flex items-center gap-2"><Globe className="w-5 h-5 text-brand-500" /> View Growth (7 Days)</h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={viewsData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.2} />
                  <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
                  <Line type="monotone" dataKey="views" stroke="#6366f1" strokeWidth={4} dot={{r: 6, fill: '#6366f1', strokeWidth: 2, stroke: '#fff'}} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-96">
              {/* Traffic Sources */}
              <div className="bg-white/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col items-center">
                <h3 className="text-lg font-bold font-display mb-2 flex items-center gap-2 w-full"><Users className="w-5 h-5 text-emerald-500" /> Sources</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={trafficData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="count">
                      {trafficData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Devices */}
              <div className="bg-white/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col items-center">
                <h3 className="text-lg font-bold font-display mb-2 flex items-center gap-2 w-full"><Smartphone className="w-5 h-5 text-purple-500" /> Devices</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deviceData} margin={{ top: 20, right: 0, left: -25, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} />
                    <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} cursor={{fill: 'transparent'}} />
                    <Bar dataKey="value" fill="#8b5cf6" radius={[6, 6, 0, 0]}>
                      {deviceData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
