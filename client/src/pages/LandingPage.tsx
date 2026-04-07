import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AshokaChakra from '../components/AshokaChakra';
import { useLanguage } from '../contexts/LanguageContext';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const containerVars = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVars = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center text-white overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#0f2347] to-[#1a3a6b]">
      {/* Tricolor Strip */}
      <div className="tricolor-strip fixed top-0 left-0 z-[100]" />

      <motion.div 
        variants={containerVars}
        initial="initial"
        animate="animate"
        className="flex flex-col items-center text-center px-6 max-w-4xl"
      >
        <motion.div variants={itemVars} className="mb-8">
          <AshokaChakra size={84} color="white" className="mb-4" />
          <div className="text-[11px] uppercase tracking-[0.3em] font-bold text-slate-400">
            {t('ministry')}
          </div>
          <div className="h-[1px] w-20 bg-[var(--gov-gold)] mx-auto mt-4" />
        </motion.div>

        <motion.h1 variants={itemVars} className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight leading-tight">
          {t('appTitle')}
        </motion.h1>

        <motion.p variants={itemVars} className="text-lg md:text-xl text-slate-300 font-medium mb-12 max-w-2xl">
          {t('appSubtitle')}
        </motion.p>

        <motion.div variants={itemVars} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full">
          {[
            { label: '1,000+ Households', sub: 'Analyzed Daily' },
            { label: '5 Risk Dimensions', sub: 'Holistic Scoring' },
            { label: '10 Welfare Schemes', sub: 'Targeted Support' }
          ].map((stat, i) => (
            <div key={i} className="p-6 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
              <div className="text-xl font-bold text-[var(--gov-saffron)]">{stat.label}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">{stat.sub}</div>
            </div>
          ))}
        </motion.div>

        <motion.button
          variants={itemVars}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/language-gate')}
          className="gov-btn-saffron px-12 py-4 text-lg"
        >
          {t('beginAnalysis')}
        </motion.button>
      </motion.div>

      <footer className="absolute bottom-8 text-[11px] text-slate-500 font-medium uppercase tracking-[0.2em] flex items-center gap-4">
        <span>Powered by AI</span>
        <span className="w-1 h-1 rounded-full bg-slate-700" />
        <span>{t('nic')}</span>
        <span className="w-1 h-1 rounded-full bg-slate-700" />
        <span>v2.0</span>
      </footer>

      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-[var(--gov-blue)] opacity-20 blur-[100px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-[var(--gov-saffron)] opacity-10 blur-[100px] rounded-full" />
    </div>
  );
};

export default LandingPage;
