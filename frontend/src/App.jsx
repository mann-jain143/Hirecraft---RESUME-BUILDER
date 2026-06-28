import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import SuperAdminRoute from './components/SuperAdminRoute';
import ScrollToTop from './components/ui/ScrollToTop';
import ScrollProgress from './components/ui/ScrollProgress';
import MobileNavigation from './components/ui/MobileNavigation';
import Footer from './components/layout/Footer';
import BackToTopButton from './components/ui/BackToTopButton';
import Chatbot from './components/ui/Chatbot';
import PageLoader from './components/ui/PageLoader';
import { Toaster } from 'react-hot-toast';

// Eagerly loaded
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Lazy loaded for performance
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Builder = lazy(() => import('./pages/Builder'));
const TemplatesPage = lazy(() => import('./pages/TemplatesPage'));
const ResumeImportPage = lazy(() => import('./pages/ResumeImportPage'));
const JobMatchPage = lazy(() => import('./pages/JobMatchPage'));
const CoverLetterPage = lazy(() => import('./pages/CoverLetterPage'));
const TrackerPage = lazy(() => import('./pages/TrackerPage'));
const GoalsPage = lazy(() => import('./pages/GoalsPage'));
const InterviewPrepPage = lazy(() => import('./pages/InterviewPrepPage'));
const CareerRoadmapPage = lazy(() => import('./pages/CareerRoadmapPage'));
const ProjectGeneratorPage = lazy(() => import('./pages/ProjectGeneratorPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'));
const RecruiterView = lazy(() => import('./pages/RecruiterView'));
const PortfolioGenerator = lazy(() => import('./pages/PortfolioGenerator'));
const JobBoard = lazy(() => import('./pages/JobBoard'));
const Community = lazy(() => import('./pages/Community'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const SuperAdminDashboard = lazy(() => import('./pages/SuperAdminDashboard'));
const ClaimInvitePage = lazy(() => import('./pages/ClaimInvitePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const PlacementPrep = lazy(() => import('./pages/PlacementPrep'));

const pageTransition = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
};

const AUTH_PATHS = new Set(['/login', '/register', '/forgot-password']);

function shouldHideChrome(pathname) {
  if (pathname === '/' || AUTH_PATHS.has(pathname)) return true;
  if (pathname.startsWith('/reset-password')) return true;
  if (pathname.startsWith('/u/') || pathname.startsWith('/shared/')) return true;
  return false;
}

function AnimatedRoutes() {
  const location = useLocation();
  const hideChrome = shouldHideChrome(location.pathname);

  return (
    <>
      <ScrollProgress />
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <a href="#main-content" className="skip-link sr-only focus:not-sr-only">Skip to main content</a>
        <main id="main-content" className="flex-grow">
          <AnimatePresence mode="wait">
            <motion.div key={location.pathname} {...pageTransition}>
              <Routes location={location}>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/u/:username" element={<Suspense fallback={<PageLoader label="Loading portfolio..." />}><PortfolioPage /></Suspense>} />
                <Route path="/shared/:linkId" element={<Suspense fallback={<PageLoader label="Loading shared resume..." />}><RecruiterView /></Suspense>} />

                {/* Protected Routes */}
                <Route path="/dashboard" element={<ProtectedRoute><Suspense fallback={<PageLoader label="Loading dashboard..." />}><Dashboard /></Suspense></ProtectedRoute>} />
                <Route path="/builder/:resumeId" element={<ProtectedRoute><Suspense fallback={<PageLoader label="Loading builder..." />}><Builder /></Suspense></ProtectedRoute>} />
                <Route path="/builder" element={<Navigate to="/builder/new" replace />} />
                <Route path="/templates" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><TemplatesPage /></Suspense></ProtectedRoute>} />
                <Route path="/import" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><ResumeImportPage /></Suspense></ProtectedRoute>} />
                <Route path="/job-match" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><JobMatchPage /></Suspense></ProtectedRoute>} />
                <Route path="/cover-letter" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><CoverLetterPage /></Suspense></ProtectedRoute>} />
                <Route path="/tracker" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><TrackerPage /></Suspense></ProtectedRoute>} />
                <Route path="/goals" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><GoalsPage /></Suspense></ProtectedRoute>} />
                <Route path="/interview-prep" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><InterviewPrepPage /></Suspense></ProtectedRoute>} />
                <Route path="/roadmap" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><CareerRoadmapPage /></Suspense></ProtectedRoute>} />
                <Route path="/projects" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><ProjectGeneratorPage /></Suspense></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><AnalyticsPage /></Suspense></ProtectedRoute>} />
                <Route path="/portfolio" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><PortfolioGenerator /></Suspense></ProtectedRoute>} />
                <Route path="/jobs" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><JobBoard /></Suspense></ProtectedRoute>} />
                <Route path="/community" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><Community /></Suspense></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><SettingsPage /></Suspense></ProtectedRoute>} />
                <Route path="/placement-prep" element={<ProtectedRoute><Suspense fallback={<PageLoader label="Loading Placement Prep..." />}><PlacementPrep /></Suspense></ProtectedRoute>} />

                <Route path="/profile" element={<ProtectedRoute><Suspense fallback={<PageLoader label="Loading profile..." />}><ProfilePage /></Suspense></ProtectedRoute>} />

                {/* Enterprise/SaaS Routes */}
                <Route path="/admin" element={<AdminRoute><Suspense fallback={<PageLoader label="Loading admin panel..." />}><AdminDashboard /></Suspense></AdminRoute>} />
                <Route path="/super-admin" element={<SuperAdminRoute><Suspense fallback={<PageLoader label="Loading Super Admin panel..." />}><SuperAdminDashboard /></Suspense></SuperAdminRoute>} />
                <Route path="/admin/invite/:token" element={<Suspense fallback={<PageLoader label="Validating invitation token..." />}><ClaimInvitePage /></Suspense>} />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
        {!hideChrome && <Footer />}
        {!hideChrome && <MobileNavigation />}
        {!hideChrome && <BackToTopButton />}
        {!hideChrome && <Chatbot />}
      </div>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ErrorBoundary>
          <Router>
            <AnimatedRoutes />
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#121212',
                  color: '#f3f4f6',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                  padding: '12px 16px',
                  fontSize: '14px',
                },
                success: { iconTheme: { primary: '#10b981', secondary: '#121212' } },
                error: { iconTheme: { primary: '#ef4444', secondary: '#121212' } },
              }}
            />
          </Router>
        </ErrorBoundary>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
