import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import WorkerRegistration from './pages/WorkerRegistration';
import Endorse from './pages/Endorse';
import Verify from './pages/Verify';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Explorer from './pages/Explorer';
import WorkerProfile from './pages/WorkerProfile';
import NotFound from './pages/NotFound';
import DiscoverWorkers from './pages/DiscoverWorkers';
import AdminLogs from './pages/AdminLogs';
import About from './pages/About';
import Mission from './pages/Mission';
import Contact from './pages/Contact';
import HowItWorks from './pages/HowItWorks';
import GlobalBackground from './components/GlobalBackground';

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
      </main>
      <Footer />
    </div>
  );
};

export default App;
