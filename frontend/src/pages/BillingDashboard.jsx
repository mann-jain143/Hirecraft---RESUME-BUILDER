import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle, Zap, Shield, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../utils/api';
import Navbar from '../components/Navbar';
import PremiumAnimatedBackground from '../components/layout/PremiumAnimatedBackground';

const PLANS = [
  { id: 'free', name: 'Free', price: '$0', features: ['3 Resumes', 'Basic AI Templates', 'Standard Support'] },
  { id: 'pro', name: 'Pro', price: '$15', features: ['Unlimited Resumes', 'Advanced AI Writer', 'Portfolio Generator', 'Priority Support'] },
  { id: 'premium', name: 'Premium', price: '$29', features: ['All Pro Features', 'Recruiter Analytics', 'Custom QR Codes', 'Dedicated Career Coach'] }
];

export default function BillingDashboard() {
  const [subscription, setSubscription] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subRes, invRes] = await Promise.all([
        API.get('/subscriptions/me'),
        API.get('/subscriptions/invoices')
      ]);
      setSubscription(subRes.data);
      setInvoices(invRes.data);
    } catch (err) {
      toast.error('Failed to load billing details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planId) => {
    if (planId === 'free' || planId === subscription?.plan) return;
    try {
      setUpgrading(true);
      await API.post('/subscriptions/checkout', { plan: planId });
      toast.success(`Successfully upgraded to ${planId.toUpperCase()}!`);
      fetchData(); // Refresh UI
    } catch (err) {
      toast.error('Upgrade failed');
    } finally {
      setUpgrading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><RefreshCw className="w-8 h-8 animate-spin text-brand-500" /></div>;

  const currentPlan = subscription?.plan || 'free';
  const aiUsed = subscription?.aiCredits?.used || 0;
  const aiLimit = subscription?.aiCredits?.limit || 50;
  const usagePercentage = Math.min((aiUsed / aiLimit) * 100, 100);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050816] text-slate-900 dark:text-white relative transition-colors duration-300">
      <PremiumAnimatedBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
          
          <div className="flex items-center gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
            <div className="p-4 bg-brand-500/10 rounded-2xl text-brand-500">
              <CreditCard className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-black font-display tracking-tight">Billing & Plans</h1>
              <p className="text-slate-500">Manage your subscription, AI credits, and invoices.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Current Plan & Usage */}
            <div className="lg:col-span-1 space-y-8">
              
              <div className="bg-white/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Shield className="w-24 h-24" />
                 </div>
                 <h3 className="text-lg font-bold text-slate-500 uppercase tracking-widest mb-2">Current Plan</h3>
                 <div className="text-4xl font-black text-brand-500 capitalize mb-4">{currentPlan}</div>
                 <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                   {subscription?.status === 'active' ? `Renews on ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}` : 'No active billing cycle'}
                 </p>
                 <button className="btn-primary w-full py-3" disabled={currentPlan === 'premium'} onClick={() => document.getElementById('pricing-plans').scrollIntoView({behavior:'smooth'})}>
                   {currentPlan === 'premium' ? 'Highest Tier' : 'Upgrade Plan'}
                 </button>
              </div>

              <div className="bg-white/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl">
                 <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5 text-[#7c5cff]" /> AI Credits Usage</h3>
                 <div className="flex justify-between text-sm font-bold mb-2">
                   <span>{aiUsed} Used</span>
                   <span>{aiLimit > 100000 ? 'Unlimited' : `${aiLimit} Limit`}</span>
                 </div>
                 <div className="w-full bg-slate-200 dark:bg-white/10 rounded-full h-3 mb-2 overflow-hidden">
                   <div className="bg-gradient-to-r from-brand-500 to-[#7c5cff] h-3 rounded-full transition-all duration-1000" style={{ width: `${usagePercentage}%` }}></div>
                 </div>
                 {usagePercentage > 80 && <p className="text-xs text-amber-500 flex items-center gap-1 mt-2"><AlertCircle className="w-3 h-3" /> You are running low on credits.</p>}
              </div>

            </div>

            {/* Right Column: Pricing Plans & Invoices */}
            <div className="lg:col-span-2 space-y-10">
              
              {/* Pricing Cards */}
              <div id="pricing-plans" className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PLANS.map(plan => (
                  <div key={plan.id} className={`p-6 rounded-3xl border transition-all ${currentPlan === plan.id ? 'bg-brand-500/5 border-brand-500 shadow-[0_0_20px_rgba(99,102,241,0.2)]' : 'bg-white/70 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 hover:border-brand-500/50'}`}>
                    <h3 className="text-xl font-bold font-display capitalize mb-2">{plan.name}</h3>
                    <div className="text-3xl font-black mb-6">{plan.price}<span className="text-sm text-slate-500 font-medium">/mo</span></div>
                    <ul className="space-y-3 mb-8 min-h-[140px]">
                      {plan.features.map((f, i) => (
                        <li key={i} className="text-sm font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                    <button 
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={currentPlan === plan.id || upgrading || (currentPlan === 'premium' && plan.id !== 'premium')}
                      className={`w-full py-3 rounded-xl font-bold text-sm transition ${currentPlan === plan.id ? 'bg-slate-200 dark:bg-white/10 text-slate-500 cursor-not-allowed' : 'btn-primary'}`}
                    >
                      {currentPlan === plan.id ? 'Current Plan' : upgrading ? 'Processing...' : 'Upgrade'}
                    </button>
                  </div>
                ))}
              </div>

              {/* Invoice History */}
              <div>
                <h3 className="text-xl font-bold font-display mb-4">Payment History</h3>
                <div className="bg-white/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl">
                  {invoices.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">No payment history available.</div>
                  ) : (
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-100 dark:bg-white/5 font-bold uppercase text-xs text-slate-500">
                        <tr>
                          <th className="px-6 py-4">Date</th>
                          <th className="px-6 py-4">Amount</th>
                          <th className="px-6 py-4">Plan</th>
                          <th className="px-6 py-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                        {invoices.map(inv => (
                          <tr key={inv._id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                            <td className="px-6 py-4">{new Date(inv.createdAt).toLocaleDateString()}</td>
                            <td className="px-6 py-4 font-bold">${inv.amount / 100}</td>
                            <td className="px-6 py-4 capitalize font-semibold text-brand-500">{inv.planTier}</td>
                            <td className="px-6 py-4"><span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-md text-xs font-bold">{inv.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
