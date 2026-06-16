import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import MeshBackground from '../components/layout/MeshBackground';
import HireCraftLogo from '../components/HireCraftLogo';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const result = await login(email, password);
    if (result.success) navigate('/dashboard');
    else setErrorMsg(result.error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4">
      <MeshBackground />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md p-8 bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-700/80"
      >
        <div className="flex justify-center mb-6">
          <HireCraftLogo className="w-10 h-10" />
        </div>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back</h2>
          <p className="text-slate-500 dark:text-slate-400">Sign in to continue building your future.</p>
        </div>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300 p-3 rounded-lg mb-6 text-center text-sm">{errorMsg}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-slate-800/80 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
              placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-slate-800/80 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
              placeholder="••••••••" />
          </div>
          <button type="submit"
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition transform hover:-translate-y-0.5">
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-slate-500 dark:text-slate-400 text-sm">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Create one</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
