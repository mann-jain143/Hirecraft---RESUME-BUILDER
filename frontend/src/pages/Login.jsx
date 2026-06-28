import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, LogIn } from 'lucide-react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { AuthContext } from '../context/AuthContext';
import PremiumAnimatedBackground from '../components/layout/PremiumAnimatedBackground';
import HireCraftLogo from '../components/HireCraftLogo';
import QuoteWidget from '../components/ui/QuoteWidget';
import toast from 'react-hot-toast';

const Linkedin = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const Github = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|org|net|edu|gov|io|co|us|uk|ca|au|de|fr|jp)$/i;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, googleLogin, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  const validateEmail = (value) => {
    if (!value) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(value)) {
      setEmailError('Please enter a valid email address (e.g., name@domain.com)');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    if (val.length > 0) {
      validateEmail(val);
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password');
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (result && result.success) {
        toast.success('Welcome back!');
        navigate('/dashboard');
      } else {
        setErrorMsg(result?.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setErrorMsg('Network error. Please make sure the server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const result = await googleLogin(credentialResponse.credential);
      if (result && result.success) {
        toast.success('Signed in with Google!');
        navigate('/dashboard');
      } else {
        setErrorMsg(result?.error || 'Google Sign In failed');
      }
    } catch (err) {
      setErrorMsg('Google login network error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-12">
      <PremiumAnimatedBackground />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -30, scale: 0.95 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-card p-8 md:p-10 bg-slate-900/60 border border-white/10 backdrop-blur-md shadow-2xl rounded-2xl">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="flex justify-center mb-8"
          >
            <HireCraftLogo className="w-10 h-10" showText={true} textClassName="text-2xl" />
          </motion.div>

          <h1 className="text-2xl font-bold text-white text-center mb-2">Welcome Back</h1>
          <p className="text-gray-400 text-center text-sm mb-8">Sign in to continue building your career</p>

          {/* Error Message */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <p className="text-red-400 text-sm">{errorMsg}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5" htmlFor="login-email">Email Address</label>
              <div className="relative">
                <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${emailError ? 'text-red-400' : 'text-gray-500'}`} />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => validateEmail(email)}
                  placeholder="you@example.com"
                  className={`input-field pl-10 ${emailError ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/50' : ''}`}
                  autoComplete="email"
                  aria-describedby={emailError ? 'email-error' : undefined}
                />
              </div>
              <AnimatePresence>
                {emailError && (
                  <motion.p
                    id="email-error"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="mt-1.5 text-xs text-red-400 flex items-center gap-1"
                  >
                    <AlertCircle className="w-3 h-3" />
                    {emailError}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-300" htmlFor="login-password">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-field pl-10 pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading || !!emailError || !email}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 text-gray-500 bg-slate-950">or continue with</span>
            </div>
          </div>

          {/* Google OAuth Button & Placeholder OAuth Buttons */}
          <div className="space-y-3">
            <div className="flex justify-center">
              <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "1234567890-example.apps.googleusercontent.com"}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => toast.error('Google Sign In failed')}
                  theme="filled_dark"
                  shape="pill"
                  width="100%"
                />
              </GoogleOAuthProvider>
            </div>

            <div className="flex gap-3">
              {/* LinkedIn Placeholder */}
              <div className="relative group/tooltip flex-1">
                <button
                  type="button"
                  disabled
                  className="w-full btn-secondary py-2.5 flex items-center justify-center gap-2 opacity-50 cursor-not-allowed text-xs text-slate-300 border border-white/5 bg-white/5 rounded-xl"
                >
                  <Linkedin className="w-4 h-4 text-[#0A66C2]" /> LinkedIn
                </button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 scale-0 group-hover/tooltip:scale-100 transition-all duration-200 z-50 pointer-events-none">
                  <div className="bg-slate-900 border border-slate-700 text-white text-xs py-1.5 px-3 rounded-lg shadow-xl whitespace-nowrap">
                    Coming Soon!
                    <div className="w-2 h-2 bg-slate-900 border-r border-b border-slate-700 rotate-45 mx-auto -mt-1" />
                  </div>
                </div>
              </div>

              {/* GitHub Placeholder */}
              <div className="relative group/tooltip flex-1">
                <button
                  type="button"
                  disabled
                  className="w-full btn-secondary py-2.5 flex items-center justify-center gap-2 opacity-50 cursor-not-allowed text-xs text-slate-300 border border-white/5 bg-white/5 rounded-xl"
                >
                  <Github className="w-4 h-4 text-white" /> GitHub
                </button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 scale-0 group-hover/tooltip:scale-100 transition-all duration-200 z-50 pointer-events-none">
                  <div className="bg-slate-900 border border-slate-700 text-white text-xs py-1.5 px-3 rounded-lg shadow-xl whitespace-nowrap">
                    Coming Soon!
                    <div className="w-2 h-2 bg-slate-900 border-r border-b border-slate-700 rotate-45 mx-auto -mt-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Create account
            </Link>
          </p>
        </div>

        {/* Quote */}
        <div className="mt-6">
          <QuoteWidget variant="footer" />
        </div>
      </motion.div>
    </div>
  );
};

export default Login;