import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FixedSizeList as List } from 'react-window';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';
import AshokaChakra from '../components/AshokaChakra';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { QRCodeSVG } from 'qrcode.react';

const ResultsPage: React.FC = () => {
  const { t, lang } = useLanguage();
  const [data, setData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHH, setSelectedHH] = useState<any>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem('poverty_results');
    if (saved) setData(JSON.parse(saved));
  }, []);

  const filteredResults = useMemo(() => {
    if (!data) return [];
    return data.results.filter((h: any) => 
      h.household_id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const lockCases = useMemo(() => 
    filteredResults.filter((h: any) => h.intergenerational_lock).slice(0, 3)
  , [filteredResults]);

  const chartData = useMemo(() => {
    if (!data) return [];
    return data.results.slice(0, 20).map((h: any) => ({
      name: h.household_id,
      score: h.score,
      tier: h.tier
    }));
  }, [data]);

  const pieData = useMemo(() => {
    if (!data) return [];
    return [
      { name: t('highFull'), value: data.high_risk_count, color: '#e53e3e' },
      { name: t('medFull'), value: data.medium_risk_count, color: '#d69e2e' },
      { name: t('lowFull'), value: data.low_risk_count, color: '#38a169' }
    ];
  }, [data, t]);

  if (!data) return null;

  const exportPDF = () => {
    setIsExporting(true);
    const doc = new jsPDF() as any;
    
    // Header
    doc.setFillColor(247, 127, 0); doc.rect(0, 0, 210, 2, 'F');
    doc.setFillColor(255, 255, 255); doc.rect(0, 2, 210, 2, 'F');
    doc.setFillColor(19, 136, 8); doc.rect(0, 4, 210, 2, 'F');

    doc.setFontSize(10); doc.setTextColor(26, 58, 107);
    doc.text(t('ministry').toUpperCase(), 105, 15, { align: 'center' });
    doc.setFontSize(14); doc.setFont("helvetica", "bold");
    doc.text(t('appTitle'), 105, 25, { align: 'center' });
    
    doc.setDrawColor(201, 168, 76); doc.line(20, 30, 190, 30);

    // Stats
    doc.setFontSize(12); doc.setTextColor(0);
    doc.text(`${t('villageName')}: ${data.village_name}`, 20, 45);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 190, 45, { align: 'right' });

    doc.autoTable({
      startY: 55,
      head: [[t('rank'), t('name'), t('score'), t('tier'), t('lock')]],
      body: data.results.map((r: any, i: number) => [
        i + 1, r.household_id, r.score, r.tier, r.intergenerational_lock ? 'YES' : 'NO'
      ]),
      headStyles: { fillColor: [26, 58, 107] },
      didParseCell: (dataCell: any) => {
        if (dataCell.row.section === 'body' && dataCell.column.index === 3) {
          if (dataCell.cell.raw === 'HIGH') dataCell.cell.styles.textColor = [127, 0, 0];
        }
      }
    });

    doc.save(`poverty_report_${data.village_name}.pdf`);
    setIsExporting(false);
    (window as any).addToast(t('pdfDownloaded'), 'success');
  };

  const Row = ({ index, style }: any) => {
    const hh = filteredResults[index];
    const tierColor = hh.tier === 'HIGH' ? 'var(--risk-high)' : hh.tier === 'MEDIUM' ? 'var(--risk-medium)' : 'var(--risk-low)';
    
    return (
      <div style={style} className="border-b border-[var(--border-light)] hover:bg-slate-50 transition-colors flex items-center px-4">
        <div className="w-12 text-center font-bold text-slate-400">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0 pr-4">
          <div className="font-bold truncate">{hh.household_id}</div>
          <div className="text-[11px] text-[var(--text-muted)] truncate italic">
            {lang === 'ta' ? hh.summary_tamil : hh.summary_english}
          </div>
        </div>
        <div className="w-20 text-center font-black text-lg" style={{ color: tierColor }}>
          {hh.score}
        </div>
        <div className="w-24 px-2">
          <span className={hh.tier === 'HIGH' ? 'gov-badge-high' : hh.tier === 'MEDIUM' ? 'gov-badge-medium' : 'gov-badge-low'}>
            {hh.tier}
          </span>
        </div>
        <div className="w-16 text-center">
          {hh.intergenerational_lock && <span className="gov-badge-lock">LOCK</span>}
        </div>
        <div className="w-32 flex gap-2 justify-end">
          <button 
            onClick={() => setSelectedHH(hh)}
            className="gov-btn-outline py-1 px-3 text-[11px]"
          >
            {t('viewProfile')}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[var(--bg-page)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[var(--gov-blue)] text-white text-[10px] font-bold px-1.5 py-0.5 rounded tracking-widest uppercase">
              {data.village_name}
            </span>
            <span className="text-[11px] font-medium text-[var(--text-muted)]">{new Date().toLocaleDateString()}</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">{t('results')}</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={exportPDF} disabled={isExporting} className="gov-btn-outline flex items-center gap-2 px-4 py-2 text-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            {isExporting ? t('generating') : 'PDF'}
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard label={t('totalH')} value={data.total_households} color="var(--gov-blue)" />
        <MetricCard label={t('highR')} value={data.high_risk_count} color="var(--risk-high)" />
        <MetricCard label={t('medR')} value={data.medium_risk_count} color="var(--risk-medium)" />
        <MetricCard label={t('lockC')} value={data.intergenerational_lock_count} color="var(--risk-lock)" />
      </div>

      {/* Critical Locks */}
      {data.intergenerational_lock_count > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <h2 className="font-bold tracking-tight uppercase text-xs text-red-600">{t('criticalTitle')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {lockCases.map((h: any) => (
              <div key={h.household_id} className="gov-card p-4 border-l-4 border-l-red-600">
                <div className="flex justify-between mb-2">
                  <span className="font-bold truncate pr-2">{h.household_id}</span>
                  <span className="text-red-600 font-black">{h.score}</span>
                </div>
                <div className="text-[11px] text-slate-500 mb-4 line-clamp-2">
                  {lang === 'ta' ? h.summary_tamil : h.summary_english}
                </div>
                <button 
                  onClick={() => setSelectedHH(h)}
                  className="text-[11px] font-bold text-[var(--gov-blue)] uppercase hover:underline"
                >
                  {t('viewProfile')} →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="gov-card p-6 h-[360px]">
          <h3 className="text-xs font-bold uppercase text-slate-400 mb-6">Risk Distribution Overview</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
              <XAxis dataKey="name" hide />
              <YAxis fontSize={11} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)' }}
              />
              <Bar dataKey="score">
                {chartData.map((entry: any, i: number) => (
                  <Cell key={i} fill={entry.tier === 'HIGH' ? '#e53e3e' : entry.tier === 'MEDIUM' ? '#d69e2e' : '#38a169'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="gov-card p-6 h-[360px] flex flex-col">
          <h3 className="text-xs font-bold uppercase text-slate-400 mb-6">Population Breakdown</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="gov-card flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-[var(--border-light)] flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-2.5 text-slate-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input 
              type="text" 
              placeholder={t('searchPH')} 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 h-10 text-sm"
            />
          </div>
          <div className="flex items-center text-xs font-bold text-slate-400 uppercase letter-spacing-widest">
            {t('showing')} {filteredResults.length} {t('of')} {data.total_households}
          </div>
        </div>

        <div className="flex bg-[var(--gov-blue)] text-white font-bold text-[10px] uppercase tracking-wider py-3 px-4 sticky top-0 z-10">
          <div className="w-12 text-center">{t('rank')}</div>
          <div className="flex-1">{t('name')} & {t('summaryEn')}</div>
          <div className="w-20 text-center">{t('score')}</div>
          <div className="w-24 px-2">{t('tier')}</div>
          <div className="w-16 text-center">{t('lock')}</div>
          <div className="w-32"></div>
        </div>

        <div className="flex-1">
          <List
            height={500}
            itemCount={filteredResults.length}
            itemSize={76}
            width="100%"
          >
            {Row}
          </List>
        </div>
      </div>

      {/* Slide-over Profile */}
      <AnimatePresence>
        {selectedHH && (
          <ProfilePanel 
            hh={selectedHH} 
            onClose={() => setSelectedHH(null)} 
            t={t} 
            lang={lang}
            updateResults={(updatedHH: any) => {
              const newData = { ...data };
              const idx = newData.results.findIndex((r: any) => r.household_id === updatedHH.household_id);
              if (idx !== -1) {
                newData.results[idx] = updatedHH;
                sessionStorage.setItem('poverty_results', JSON.stringify(newData));
                setData(newData);
                setSelectedHH(updatedHH);
              }
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const MetricCard = ({ label, value, color }: any) => (
  <div className="gov-card p-5" style={{ borderBottom: `4px solid ${color}` }}>
    <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">{label}</div>
    <div className="text-2xl font-black" style={{ color }}>{value}</div>
  </div>
);

const ProfilePanel = ({ hh, onClose, t, lang, updateResults }: any) => {
  const [isRescoring, setIsRescoring] = useState(false);
  const economicWidth = (hh.breakdown.economic / 30) * 100;
  const educationWidth = (hh.breakdown.education / 25) * 100;
  const housingWidth = (hh.breakdown.housing / 20) * 100;
  const healthWidth = (hh.breakdown.health / 15) * 100;
  const socialWidth = (hh.breakdown.social / 10) * 100;

  const handleRescore = async () => {
    setIsRescoring(true);
    try {
      const r = await fetch('/api/rescore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hh)
      });
      const updated = await r.json();
      updateResults(updated);
      (window as any).addToast(t('rescoredSuccess'), 'success');
    } catch (e) {
      (window as any).addToast(t('apiError'), 'error');
    } finally {
      setIsRescoring(false);
    }
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
      />
      <motion.div 
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 h-full w-full max-w-[480px] bg-[var(--bg-card)] shadow-2xl z-[101] overflow-y-auto flex flex-col"
      >
        <div className="sticky top-0 bg-[var(--bg-card)] p-6 border-b border-[var(--border-light)] flex justify-between items-center z-10">
          <div>
            <div className="flex gap-2 mb-2">
              <span className={hh.tier === 'HIGH' ? 'gov-badge-high' : 'gov-badge-low'}>{hh.tier}</span>
              {hh.intergenerational_lock && <span className="gov-badge-lock">{t('lockLabel')}</span>}
            </div>
            <h2 className="text-xl font-black">{hh.household_id}</h2>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black text-[var(--gov-blue)]">{hh.score}</div>
            <button onClick={onClose} className="text-slate-400 hover:text-black mt-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          <section>
            <h3 className="section-title text-sm mb-4">{t('breakdown')}</h3>
            <div className="space-y-4">
              <ProgressBar label={t('economic')} score={hh.breakdown.economic} total={30} width={economicWidth} color="#3b82f6" />
              <ProgressBar label={t('education')} score={hh.breakdown.education} total={25} width={educationWidth} color="#8b5cf6" />
              <ProgressBar label={t('housing')} score={hh.breakdown.housing} total={20} width={housingWidth} color="#f59e0b" />
              <ProgressBar label={t('health')} score={hh.breakdown.health} total={15} width={healthWidth} color="#ef4444" />
              <ProgressBar label={t('social')} score={hh.breakdown.social} total={10} width={socialWidth} color="#10b981" />
            </div>
          </section>

          <section className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl">
             <h3 className="section-title text-sm mb-4">AI Analysis</h3>
             <div className="border-l-4 border-[var(--gov-blue)] pl-4 italic text-sm text-[var(--text-secondary)] space-y-2">
               <p>{hh.summary_english}</p>
               <p className="font-tamil">{hh.summary_tamil}</p>
             </div>
          </section>

          <section>
            <h3 className="section-title text-sm mb-4">{t('schemes')}</h3>
            <div className="space-y-3">
              {hh.scheme_recommendations.map((s: string, i: number) => (
                <div key={i} className="p-3 border border-blue-100 bg-blue-50/50 rounded-lg flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-sm font-bold text-blue-900">{s}</span>
                </div>
              ))}
            </div>
          </section>

          <button 
            disabled={isRescoring}
            onClick={handleRescore}
            className="gov-btn-saffron w-full py-4 flex items-center justify-center gap-2"
          >
            {isRescoring ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
            {t('rescore')}
          </button>
        </div>
      </motion.div>
    </>
  );
};

const ProgressBar = ({ label, score, total, width, color }: any) => (
  <div>
    <div className="flex justify-between text-[11px] font-bold uppercase mb-1.5 text-slate-500">
      <span>{label}</span>
      <span>{score} / {total}</span>
    </div>
    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${width}%` }}
        className="h-full"
        style={{ backgroundColor: color }}
      />
    </div>
  </div>
);

export default ResultsPage;
