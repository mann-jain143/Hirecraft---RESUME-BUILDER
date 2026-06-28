import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Zap, Wand2, Shield, FileText, Users, Award, Star, ArrowRight, Sparkles, Globe, BarChart3, Check } from 'lucide-react';
import PremiumAnimatedBackground from '../components/layout/PremiumAnimatedBackground';
import HireCraftLogo from '../components/HireCraftLogo';
import QuoteWidget from '../components/ui/QuoteWidget';
import BackToTopButton from '../components/ui/BackToTopButton';

const typewriterTexts = [
  'Get Hired Faster.',
  'Stand Out from the Crowd.',
  'Let AI Write Your Story.',
];

function useTypewriter(texts, typingSpeed = 80, deletingSpeed = 40, pauseTime = 2000) {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];
    let timeout;

    if (!isDeleting && displayText === currentText) {
      timeout = setTimeout(() => setIsDeleting(true), pauseTime);
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setTextIndex((prev) => (prev + 1) % texts.length);
    } else {
      timeout = setTimeout(() => {
        setDisplayText(currentText.substring(0, isDeleting ? displayText.length - 1 : displayText.length + 1));
      }, isDeleting ? deletingSpeed : typingSpeed);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, textIndex, texts, typingSpeed, deletingSpeed, pauseTime]);

  return displayText;
}

function StatCounter({ value, suffix = '', label, icon: Icon }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = parseInt(value);
    const duration = 2000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <div className="flex items-center justify-center gap-2 mb-2">
        <Icon className="w-5 h-5 text-brand-400" />
        <span className="text-3xl md:text-4xl font-bold text-white">{count.toLocaleString()}{suffix}</span>
      </div>
      <p className="text-gray-400 text-sm">{label}</p>
    </motion.div>
  );
}

function FeatureCard({ icon: Icon, title, description, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="glass-card p-6 md:p-8 group cursor-pointer"
    >
      <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center mb-5 group-hover:bg-brand-500/30 transition-colors">
        <Icon className="w-6 h-6 text-brand-400" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}

const features = [
  { icon: Zap, title: 'Real-Time Live Preview', description: 'See your resume come alive as you type. Every change reflects instantly in the preview panel.' },
  { icon: Wand2, title: 'AI Content Generator', description: 'Let our AI write professional summaries, bullet points, and cover letters tailored to your role.' },
  { icon: Shield, title: 'ATS-Friendly Templates', description: 'All 20 templates are optimized for Applicant Tracking Systems. Your resume will pass every scan.' },
  { icon: FileText, title: '20 Premium Templates', description: 'Choose from 10 text-based and 10 photo templates. Corporate, Modern, and Creative categories.' },
  { icon: BarChart3, title: 'Job Match Analysis', description: 'Paste any job description and get instant match scoring with missing skill recommendations.' },
  { icon: Globe, title: 'Portfolio Generator', description: 'Turn your resume into a stunning personal website with one click. Download or host instantly.' },
];

const testimonials = [
  { name: 'Priya Sharma', role: 'Software Engineer at Google', quote: 'HireCraftt helped me land my dream job. The AI suggestions were spot-on!', rating: 5 },
  { name: 'Alex Chen', role: 'Product Manager at Meta', quote: 'The templates are stunning and ATS-friendly. Got 3x more callbacks after switching.', rating: 5 },
  { name: 'Sarah Johnson', role: 'Marketing Director', quote: 'The job match analyzer showed me exactly what was missing from my resume. Game changer!', rating: 5 },
];

export default function LandingPage() {
  const typedText = useTypewriter(typewriterTexts);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen relative overflow-hidden"
    >
      <PremiumAnimatedBackground />

      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-dark-900/50 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <HireCraftLogo className="w-8 h-8" showText={true} />
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#features" className="link-underline hover:text-white transition-colors py-1">Features</a>
            <a href="#templates" className="link-underline hover:text-white transition-colors py-1">Templates</a>
            <a href="#testimonials" className="link-underline hover:text-white transition-colors py-1">Reviews</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Log in</Link>
            <Link to="/register" className="px-5 py-2.5 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-400 rounded-xl shadow-glow-brand transition-all hover:scale-105 active:scale-95">
              Get Started Free
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              AI-Powered Resume Builder
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
          >
            Create{' '}
            <span className="text-gradient">{typedText}</span>
            <span className="typewriter-cursor" />
            <br />
            <span className="text-gray-400">in Minutes</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10"
          >
            Build stunning, ATS-friendly resumes with AI-powered content suggestions, 20 premium templates, and real-time preview. Land your dream job faster.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/register" className="btn-primary px-8 py-4 text-lg flex items-center gap-2 shadow-glow-brand hover:shadow-glow-brand-lg">
              Build My Resume Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#templates" className="btn-secondary px-8 py-4 text-lg">
              View Templates
            </a>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-12 flex items-center justify-center gap-6 text-sm text-gray-500"
          >
            <span className="flex items-center gap-1"><Check className="w-4 h-4 text-emerald-500" /> Free to use</span>
            <span className="flex items-center gap-1"><Check className="w-4 h-4 text-emerald-500" /> No credit card</span>
            <span className="flex items-center gap-1"><Check className="w-4 h-4 text-emerald-500" /> ATS-optimized</span>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-16 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatCounter value="50000" suffix="+" label="Resumes Created" icon={FileText} />
          <StatCounter value="12000" suffix="+" label="Jobs Landed" icon={Award} />
          <StatCounter value="20" label="Premium Templates" icon={Star} />
          <StatCounter value="15000" suffix="+" label="Happy Users" icon={Users} />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything You Need to <span className="text-gradient">Stand Out</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Packed with powerful features to help you create the perfect resume and land more interviews.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <FeatureCard key={feature.title} {...feature} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* Template Preview Section */}
      <section id="templates" className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              20 <span className="text-gradient">Premium Templates</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Choose from Corporate, Modern, and Creative designs. All templates are ATS-friendly and fully customizable.</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Classic ATS', 'Corporate Pro', 'Dual Column', 'Timeline', 'Bold Blocks', 'Executive', 'Sidebar Portrait', 'Banner Profile'].map((name, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -5, scale: 1.03 }}
                className="glass-card p-4 text-center cursor-pointer"
              >
                <div className="aspect-[210/297] bg-white/5 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full p-3 flex flex-col gap-1.5">
                    <div className="h-2 w-2/3 mx-auto rounded bg-brand-500/30" />
                    <div className="h-1.5 w-1/2 mx-auto rounded bg-white/10" />
                    <div className="h-px w-full bg-white/5 my-1" />
                    <div className="h-1 w-full rounded bg-white/5" />
                    <div className="h-1 w-5/6 rounded bg-white/5" />
                    <div className="h-1 w-4/6 rounded bg-white/5" />
                    <div className="h-px w-full bg-white/5 my-1" />
                    <div className="h-1 w-full rounded bg-white/5" />
                    <div className="h-1 w-3/4 rounded bg-white/5" />
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-300">{name}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/register" className="btn-primary px-6 py-3 inline-flex items-center gap-2">
              Explore All Templates <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Loved by <span className="text-gradient">Thousands</span>
            </h2>
            <p className="text-gray-400">See what our users have to say about HireCraftt</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">"{t.quote}"</p>
                <div>
                  <p className="font-semibold text-white text-sm">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center glass-card p-10 md:p-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Build Your Future?</h2>
          <p className="text-gray-400 mb-8">Join thousands of professionals who've landed their dream jobs with HireCraftt.</p>
          <Link to="/register" className="btn-primary px-10 py-4 text-lg inline-flex items-center gap-2">
            Get Started Free <Sparkles className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* Footer Quote */}
      <section className="relative z-10 py-8 px-6">
        <QuoteWidget variant="inline" />
      </section>

      <BackToTopButton />
    </motion.div>
  );
}