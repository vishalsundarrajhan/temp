import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import AshokaChakra from '../components/AshokaChakra';

const ProcessingPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const dataStr = sessionStorage.getItem('pending_analysis');
    if (!dataStr) {
      navigate('/input');
      return;
    }

    const { village_name, households } = JSON.parse(dataStr);
    let isMounted = true;

    const start = Date.now();
    
    fetch('/api/analyse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ village_name, households })
    })
    .then(r => r.json())
    .then(data => {
      if (data.error) throw new Error(data.error);
      
      const elapsed = Date.now() - start;
      const delay = Math.max(0, 5000 - elapsed);
      
      setTimeout(() => {
        if (!isMounted) return;
        sessionStorage.setItem('poverty_results', JSON.stringify(data));
        setStatus('success');
        setTimeout(() => navigate('/results'), 1000);
      }, delay);
    })
    .catch(err => {
      console.error(err);
      if (isMounted) setStatus('error');
    });

    const interval = setInterval(() => {
      setProgress(p => (p < 95 ? p + (95 - p) * 0.1 : p));
    }, 200);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [navigate]);

  return (
    <div className="fixed inset-0 bg-[#0f2347] z-[200] flex flex-col items-center justify-center text-white text-center">
      <div className="tricolor-strip fixed top-0 left-0" />
      
      <div className="relative mb-12">
        <AshokaChakra 
          size={120} 
          color="white" 
          className="animate-[spin_3s_linear_infinite]"
        />
        {status === 'success' && (
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
          </motion.div>
        )}
      </div>

      <h2 className="text-3xl font-bold mb-4">
        {status === 'error' ? t('apiError') : t('processingTitle')}
      </h2>
      <p className="text-slate-400 text-lg mb-12 max-w-md mx-auto">
        {status === 'error' ? t('tryAgain') : t('processingSub')}
      </p>

      {status !== 'error' && (
        <div className="w-64">
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden relative">
            <motion.div 
              className="h-full bg-[var(--gov-saffron)] shadow-[0_0_10px_rgba(247,127,0,0.5)]"
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[slide-bar_2s_infinite]" style={{ width: '40%' }} />
          </div>
          <div className="mt-4 text-[11px] font-bold uppercase tracking-widest text-slate-500 flex justify-between">
            <span>{t('nic')} CLAUDE AI</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
      )}

      {status === 'error' && (
        <button 
          onClick={() => navigate('/input')}
          className="gov-btn-saffron px-8 py-3"
        >
          {t('backToInput')}
        </button>
      )}
    </div>
  );
};

export default ProcessingPage;
