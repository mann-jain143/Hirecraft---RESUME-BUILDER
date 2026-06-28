import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, ArrowLeft, ShieldCheck, Loader2, AlertTriangle, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import PremiumAnimatedBackground from '../components/layout/PremiumAnimatedBackground';
import HireCraftLogo from '../components/HireCraftLogo';
import API from '../utils/api';

const getPasswordStrength = (password) => {
  if (!password) return { label: '', percent: 0, color: '' };

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
  const len = password.length;

  if (len >= 8 && hasLower && hasUpper && hasNumber && hasSpecial) {
    return { label: 'Strong', percent: 100, color: 'bg-emerald-500' };
  }

  if (len >= 6 && ((hasLower && hasUpper) || (hasLower && hasNumber) || (hasUpper && hasNumber))) {
    return { label: 'Medium', percent: 66, color: 'bg-yellow-500' };
  }

  return { label: 'Weak', percent: 33, color: 'bg-red-500' };
};

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenError, setTokenError] = useState('');

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  const passwordsMatch = confirmPassword ? password === confirmPassword : true;
  const isFormValid =
    password.length >= 6 &&
    confirmPassword.length >= 6 &&
    password === confirmPassword &&
    !isLoading;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error('Please fill in both password fields.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setTokenError('');

    try {
      await API.post('/auth/reset-password', { token, password });
      toast.success('Password reset successfully!');
      navigate('/login');
    } catch (err) {
      const message =
        err.response?.data?.message || 'Something went wrong. Please try again.';

      if (
        err.response?.status === 400 ||
        err.response?.status === 401 ||
        message.toLowerCase().includes('token') ||
        message.toLowerCase().includes('expired') ||
        message.toLowerCase().includes('invalid')
      ) {
        setTokenError(message);
      } else {
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4" role="main">
      <PremiumAnimatedBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mb-6"
        >
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-indigo-400 transition-colors group"
            aria-label="Back to login"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Sign In
          </Link>
        </motion.div>

        {/* Main card */}
        <div className="p-8 bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-700/80">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5, type: 'spring', stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <HireCraftLogo className="w-10 h-10" />
          </motion.div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Reset Password
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Create a new, strong password for your account.
            </p>
          </div>

          {/* Token error state */}
          <AnimatePresence>
            {tokenError && (
              <motion.div
                initial={{ opacity: 0, y: -5, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -5, height: 0 }}
                className="mb-6"
              >
                <div
                  className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center"
                  role="alert"
                >
                  <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                  <p className="text-red-600 dark:text-red-300 text-sm font-medium mb-3">
                    {tokenError}
                  </p>
                  <Link
                    to="/forgot-password"
                    className="inline-flex items-center gap-1.5 text-sm text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                  >
                    Request a new reset link
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* New password */}
            <div>
              <label
                htmlFor="new-password"
                className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2"
              >
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-white dark:bg-slate-800/80 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white transition-all"
                  placeholder="••••••••"
                  aria-label="New password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password strength bar */}
              <AnimatePresence>
                {password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-slate-400">Password strength</span>
                      <span
                        className={`text-xs font-semibold ${
                          strength.label === 'Strong'
                            ? 'text-emerald-500'
                            : strength.label === 'Medium'
                            ? 'text-yellow-500'
                            : 'text-red-500'
                        }`}
                      >
                        {strength.label}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${strength.percent}%` }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className={`h-full rounded-full ${strength.color}`}
                      />
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-1">
                      {[
                        { test: /.{8,}/, label: '8+ characters' },
                        { test: /[A-Z]/, label: 'Uppercase letter' },
                        { test: /[0-9]/, label: 'Number' },
                        { test: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, label: 'Special character' },
                      ].map(({ test, label }) => (
                        <div
                          key={label}
                          className={`flex items-center gap-1 text-xs ${
                            test.test(password)
                              ? 'text-emerald-500'
                              : 'text-slate-400 dark:text-slate-500'
                          }`}
                        >
                          <span
                            className={`inline-block w-1 h-1 rounded-full ${
                              test.test(password) ? 'bg-emerald-500' : 'bg-slate-400'
                            }`}
                          />
                          {label}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Confirm password */}
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <ShieldCheck
                    className={`w-5 h-5 transition-colors ${
                      confirmPassword && passwordsMatch
                        ? 'text-emerald-500'
                        : confirmPassword && !passwordsMatch
                        ? 'text-red-400'
                        : 'text-slate-400'
                    }`}
                  />
                </div>
                <input
                  id="confirm-password"
                  type={showConfirm ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-12 pr-12 py-3 bg-white dark:bg-slate-800/80 border rounded-xl focus:ring-2 outline-none text-slate-900 dark:text-white transition-all ${
                    confirmPassword && !passwordsMatch
                      ? 'border-red-400 focus:ring-red-500/30'
                      : 'border-slate-300 dark:border-slate-600 focus:ring-indigo-500'
                  }`}
                  placeholder="••••••••"
                  aria-label="Confirm password"
                  aria-describedby={!passwordsMatch ? 'confirm-error' : undefined}
                  aria-invalid={confirmPassword ? !passwordsMatch : undefined}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Mismatch error */}
              <AnimatePresence>
                {confirmPassword && !passwordsMatch && (
                  <motion.p
                    id="confirm-error"
                    initial={{ opacity: 0, y: -5, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -5, height: 0 }}
                    className="text-red-500 dark:text-red-400 text-xs mt-2 flex items-center gap-1"
                    role="alert"
                  >
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full" />
                    Passwords do not match
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Match success */}
              <AnimatePresence>
                {confirmPassword && passwordsMatch && (
                  <motion.p
                    initial={{ opacity: 0, y: -5, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -5, height: 0 }}
                    className="text-emerald-500 text-xs mt-2 flex items-center gap-1"
                  >
                    <span className="inline-block w-1 h-1 bg-emerald-500 rounded-full" />
                    Passwords match
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={!isFormValid}
              whileHover={isFormValid ? { scale: 1.01, y: -2 } : {}}
              whileTap={isFormValid ? { scale: 0.99 } : {}}
              className={`w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 ${
                !isFormValid
                  ? 'opacity-60 cursor-not-allowed'
                  : 'hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-500/40'
              }`}
              aria-label="Reset password"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Reset Password
                </>
              )}
            </motion.button>
          </form>

          {/* Forgot password link (for expired token) */}
          <p className="mt-6 text-center text-slate-500 dark:text-slate-400 text-sm">
            Link not working?{' '}
            <Link
              to="/forgot-password"
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              Request a new one
            </Link>
          </p>
        </div>

        {/* Motivational quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-8 text-center"
        >
          <p className="text-slate-400 dark:text-slate-500 text-sm italic flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400/60" />
            &ldquo;Every expert was once a beginner with a great resume.&rdquo;
            <Sparkles className="w-4 h-4 text-indigo-400/60" />
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
