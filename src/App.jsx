import React from 'react';
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
import WorkerProfile from './pages/WorkerProfile';
import NotFound from './pages/NotFound';
import DiscoverWorkers from './pages/DiscoverWorkers';

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
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
            <Route path="/worker" element={<PageWrapper><WorkerRegistration /></PageWrapper>} />
            <Route path="/endorse" element={<PageWrapper><Endorse /></PageWrapper>} />
            <Route path="/verify" element={<PageWrapper><Verify /></PageWrapper>} />
            <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
            <Route path="/discover" element={<PageWrapper><DiscoverWorkers /></PageWrapper>} />
            <Route path="/profile/:address" element={<PageWrapper><WorkerProfile /></PageWrapper>} />
            <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};

export default App;
