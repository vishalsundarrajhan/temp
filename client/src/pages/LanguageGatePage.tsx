import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import AshokaChakra from '../components/AshokaChakra';

const LanguageGatePage: React.FC = () => {
  const navigate = useNavigate();
  const { lang, setLang, t } = useLanguage();

  const handleSelect = (newLang: 'en' | 'ta') => {
    setLang(newLang);
    setTimeout(() => navigate('/input'), 300);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-page)] p-6">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="gov-card p-10 max-w-2xl w-full text-center"
      >
        <AshokaChakra size={48} color="var(--gov-blue)" className="mx-auto mb-6" />
        <h2 className="text-2xl font-bold mb-2">{t('selectLang')}</h2>
        <p className="text-[var(--text-secondary)] mb-10">{t('selectLangSub')}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <LanguageCard 
            selected={lang === 'en'}
            onClick={() => handleSelect('en')}
            label={t('englishLabel')}
            sub={t('englishSub')}
            accentColor="var(--gov-saffron)"
          />
          <LanguageCard 
            selected={lang === 'ta'}
            onClick={() => handleSelect('ta')}
            label={t('tamilLabel')}
            sub={t('tamilSub')}
            accentColor="var(--gov-green)"
            isTamil
          />
        </div>
      </motion.div>
    </div>
  );
};

const LanguageCard: React.FC<{ 
  selected: boolean, 
  onClick: () => void, 
  label: string, 
  sub: string, 
  accentColor: string,
  isTamil?: boolean
}> = ({ selected, onClick, label, sub, accentColor, isTamil }) => (
  <motion.button
    whileHover={{ y: -4 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`
      relative p-8 rounded-lg border-2 text-left transition-all
      ${selected ? 'border-[var(--gov-blue)] bg-white shadow-xl ring-4 ring-[#1a3a6b]/10' : 'border-[var(--border-light)] bg-white hover:border-[var(--border-medium)]'}
    `}
  >
    <div className="absolute top-0 left-0 right-0 h-1 rounded-t-lg" style={{ background: accentColor }} />
    
    {selected && (
      <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[var(--gov-blue)] flex items-center justify-center">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
    )}

    <div className={`text-2xl font-bold mb-1 ${isTamil ? 'font-tamil' : ''}`}>{label}</div>
    <div className="text-sm text-[var(--text-secondary)]">{sub}</div>
  </motion.button>
);

export default LanguageGatePage;
