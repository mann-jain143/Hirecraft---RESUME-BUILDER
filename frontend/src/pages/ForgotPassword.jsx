import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, Send, Loader2, CheckCircle2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import PremiumAnimatedBackground from '../components/layout/PremiumAnimatedBackground';
import HireCraftLogo from '../components/HireCraftLogo';
import API from '../utils/api';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|org|net|edu|gov|io|co|us|uk|ca|au|de|fr|jp)$/i;

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateEmail = (value) => {
    if (!value) {
      setEmailError('');
      return false;
    }
    if (!EMAIL_REGEX.test(value)) {
      setEmailError('Please enter a valid email address (e.g. user@example.com)');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (value.length > 3) {
      validateEmail(value);
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      return;
    }

    setIsLoading(true);

    try {
      await API.post('/auth/forgot-password', { email });
      setIsSuccess(true);
    } catch (err) {
      const message =
        err.response?.data?.message || 'Something went wrong. Please try again later.';
      toast.error(message);
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
        {/* Back to login link */}
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

          <AnimatePresence mode="wait">
            {!isSuccess ? (
              /* ===== Request Form State ===== */
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    Forgot Password?
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                    No worries! Enter your email and we&apos;ll send you
                    <br />a link to reset your password.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div>
                    <label
                      htmlFor="forgot-email"
                      className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail
                          className={`w-5 h-5 transition-colors ${
                            emailError
                              ? 'text-red-400'
                              : email && !emailError
                              ? 'text-indigo-400'
                              : 'text-slate-400'
                          }`}
                        />
                      </div>
                      <input
                        id="forgot-email"
                        type="email"
                        required
                        value={email}
                        onChange={handleEmailChange}
                        onBlur={() => validateEmail(email)}
                        className={`w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800/80 border rounded-xl focus:ring-2 outline-none text-slate-900 dark:text-white transition-all ${
                          emailError
                            ? 'border-red-400 focus:ring-red-500/30'
                            : 'border-slate-300 dark:border-slate-600 focus:ring-indigo-500'
                        }`}
                        placeholder="you@example.com"
                        aria-label="Email address"
                        aria-describedby={emailError ? 'email-error' : undefined}
                        aria-invalid={!!emailError}
                      />
                    </div>

                    {/* Email error message */}
                    <AnimatePresence>
                      {emailError && (
                        <motion.p
                          id="email-error"
                          initial={{ opacity: 0, y: -5, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: 'auto' }}
                          exit={{ opacity: 0, y: -5, height: 0 }}
                          className="text-red-500 dark:text-red-400 text-xs mt-2 flex items-center gap-1"
                          role="alert"
                        >
                          <span className="inline-block w-1 h-1 bg-red-500 rounded-full" />
                          {emailError}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Submit button */}
                  <motion.button
                    type="submit"
                    disabled={isLoading || !!emailError || !email}
                    whileHover={!isLoading && !emailError && email ? { scale: 1.01, y: -2 } : {}}
                    whileTap={!isLoading && !emailError && email ? { scale: 0.99 } : {}}
                    className={`w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 ${
                      isLoading || emailError || !email
                        ? 'opacity-60 cursor-not-allowed'
                        : 'hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-500/40'
                    }`}
                    aria-label="Send reset link"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending Link...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Reset Link
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            ) : (
              /* ===== Success State ===== */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
                className="text-center py-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 15 }}
                  className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-5"
                >
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </motion.div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  Check Your Email
                </h3>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-emerald-600 dark:text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-3 mb-6 leading-relaxed"
                >
                  If an account exists with that email, we&apos;ve sent a reset link.
                </motion.p>

                <p className="text-slate-400 text-xs mb-6">
                  Didn&apos;t get the email? Check your spam folder or try again.
                </p>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      setIsSuccess(false);
                      setEmail('');
                    }}
                    className="w-full py-3 bg-white dark:bg-slate-800/60 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    aria-label="Try with a different email"
                  >
                    Try Another Email
                  </button>
                  <Link
                    to="/login"
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-violet-500 transition-all text-center block"
                    aria-label="Return to login"
                  >
                    Return to Sign In
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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

export default ForgotPassword;
