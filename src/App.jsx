import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import GlobalBackground from './components/GlobalBackground';

// ── Route-based Code Splitting ─────────────────────────────────
// Each page is lazy-loaded, reducing initial bundle size significantly.
const Landing = lazy(() => import('./pages/Landing'));
const WorkerRegistration = lazy(() => import('./pages/WorkerRegistration'));
const Endorse = lazy(() => import('./pages/Endorse'));
const Verify = lazy(() => import('./pages/Verify'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Explorer = lazy(() => import('./pages/Explorer'));
const WorkerProfile = lazy(() => import('./pages/WorkerProfile'));
const NotFound = lazy(() => import('./pages/NotFound'));
const DiscoverWorkers = lazy(() => import('./pages/DiscoverWorkers'));
const AdminLogs = lazy(() => import('./pages/AdminLogs'));
const About = lazy(() => import('./pages/About'));
const Mission = lazy(() => import('./pages/Mission'));
const Contact = lazy(() => import('./pages/Contact'));
const HowItWorks = lazy(() => import('./pages/HowItWorks'));

// Minimal loading fallback (no UI change — just a brief black screen)
const PageLoader = () => (
  <div className="min-h-screen bg-[#050505] flex items-center justify-center">
    <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
  </div>
);

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    // Don't scroll if there's a hash (like #how-it-works)
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);
  
  return null;
};

// Page Transition Wrapper
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
  >
    {children}
  </motion.div>
);

const App = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-[#050505]">
      <ScrollToTop />
      {/* Global Animated Background */}
      <GlobalBackground />

      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={<PageLoader />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
              <Route path="/worker" element={<PageWrapper><WorkerRegistration /></PageWrapper>} />
              <Route path="/worker-portal" element={<PageWrapper><WorkerRegistration /></PageWrapper>} />
              <Route path="/endorse" element={<PageWrapper><Endorse /></PageWrapper>} />
              <Route path="/verify" element={<PageWrapper><Verify /></PageWrapper>} />
              <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
              <Route path="/analytics" element={<PageWrapper><Analytics /></PageWrapper>} />
              <Route path="/explorer" element={<PageWrapper><Explorer /></PageWrapper>} />
              <Route path="/discover" element={<PageWrapper><DiscoverWorkers /></PageWrapper>} />
              <Route path="/profile/:address" element={<PageWrapper><WorkerProfile /></PageWrapper>} />
              
              <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
              <Route path="/mission" element={<PageWrapper><Mission /></PageWrapper>} />
              <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
              <Route path="/how-it-works" element={<PageWrapper><HowItWorks /></PageWrapper>} />

              {/* Hidden Admin Route */}
              <Route path="/admin/logs" element={<PageWrapper><AdminLogs /></PageWrapper>} />
              
              <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default App;
