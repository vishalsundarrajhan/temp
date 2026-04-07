import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// Pages
import LandingPage from './pages/LandingPage';
import LanguageGatePage from './pages/LanguageGatePage';
import InputPage from './pages/InputPage';
import ProcessingPage from './pages/ProcessingPage';
import ResultsPage from './pages/ResultsPage';

// Layout
import AppLayout from './components/AppLayout';
import { ToastHub, ToastProps } from './components/Toast';

const AnimatedRoutes = () => {
  const location = useLocation();
  const lang = localStorage.getItem('app_language');
  const results = sessionStorage.getItem('poverty_results');

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageWrapper><LandingPage /></PageWrapper>
        } />
        <Route path="/language-gate" element={
          <PageWrapper><LanguageGatePage /></PageWrapper>
        } />
        
        <Route element={<AppLayout />}>
          <Route path="/input" element={
            lang ? <PageWrapper><InputPage /></PageWrapper> : <Navigate to="/language-gate" />
          } />
          <Route path="/results" element={
            results ? <PageWrapper><ResultsPage /></PageWrapper> : <Navigate to="/input" />
          } />
          <Route path="/history" element={<PageWrapper><div>History Placeholder</div></PageWrapper>} />
          <Route path="/settings" element={<PageWrapper><div>Settings Placeholder</div></PageWrapper>} />
        </Route>

        <Route path="/processing" element={
          <PageWrapper><ProcessingPage /></PageWrapper>
        } />
      </Routes>
    </AnimatePresence>
  );
};

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -16 }}
    transition={{ duration: 0.22, ease: "easeInOut" }}
    style={{ width: "100%" }}
  >
    {children}
  </motion.div>
);

const App: React.FC = () => {
  const [toasts, setToasts] = useState<any[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Provide addToast via window for simplicity in this demo, or use a context
  (window as any).addToast = addToast;

  return (
    <BrowserRouter>
      <AnimatedRoutes />
      <ToastHub toasts={toasts} removeToast={removeToast} />
    </BrowserRouter>
  );
};

export default App;
