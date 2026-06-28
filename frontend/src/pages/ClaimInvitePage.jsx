import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';
import { ShieldCheck, Loader2, AlertCircle, ArrowRight } from 'lucide-react';

export default function ClaimInvitePage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { user, refreshProfile } = useContext(AuthContext);
  
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [claimedRole, setClaimedRole] = useState('');

  useEffect(() => {
    const claim = async () => {
      try {
        setLoading(true);
        const { data } = await API.post('/auth/claim-invite', { token });
        setClaimedRole(data.user.role);
        
        // Refresh local AuthContext profile
        await refreshProfile();
        
        setSuccess(true);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to claim invitation. The link may be invalid, expired, or already used.');
      } finally {
        setLoading(false);
      }
    };

    if (user && token) {
      claim();
    } else {
      setLoading(false);
    }
  }, [user, token, refreshProfile]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-950 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl text-center"
        >
          <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Invitation Found</h2>
          <p className="text-slate-400 mb-6">
            To claim your promotional role, please log in or create an account first.
          </p>
          <div className="flex flex-col gap-3">
            <Link 
              to={`/login?redirect=/admin/invite/${token}`}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition flex items-center justify-center gap-2"
            >
              Log In to Claim <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              to={`/register?redirect=/admin/invite/${token}`}
              className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-medium rounded-xl transition"
            >
              Sign Up
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-950 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl text-center"
      >
        {loading && (
          <div className="py-8">
            <Loader2 className="w-12 h-12 text-indigo-400 animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-1">Verifying Token</h3>
            <p className="text-slate-400">Updating your platform privileges...</p>
          </div>
        )}

        {!loading && success && (
          <div>
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Access Granted!</h2>
            <p className="text-slate-400 mb-6">
              Congratulations! Your account has been upgraded to <span className="text-emerald-400 font-semibold uppercase">{claimedRole}</span> privileges.
            </p>
            <button
              onClick={() => navigate(claimedRole === 'SUPER_ADMIN' ? '/super-admin' : '/dashboard')}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl transition flex items-center justify-center gap-2"
            >
              Go to Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {!loading && error && (
          <div>
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Invitation Error</h2>
            <p className="text-red-200/80 mb-6 text-sm">
              {error}
            </p>
            <Link
              to="/dashboard"
              className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-medium rounded-xl transition flex items-center justify-center gap-2"
            >
              Return to Dashboard
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
