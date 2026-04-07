import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { useLanguage } from '../contexts/LanguageContext';

const InputPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [villageName, setVillageName] = useState('');
  const [manualQueue, setManualQueue] = useState<any[]>([]);
  const [bulkData, setBulkData] = useState<any[]>([]);
  const [fileInfo, setFileInfo] = useState<any>(null);

  // Manual Form State
  const [formData, setFormData] = useState({
    household_id: '',
    monthly_income: '',
    employment_type: 'none',
    land_acres: '0',
    adult_literate: false,
    children_in_school: false,
    highest_edu: 'none',
    housing_type: 'kutcha',
    has_toilet: false,
    has_clean_water: false,
    asset_score: 0,
    chronic_illness: false,
    child_malnutrition: false,
    social_group: 'general',
    female_headed: false
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const bstr = e.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      setBulkData(data);
      setFileInfo({ name: file.name, count: data.length });
      (window as any).addToast(t('uploadSuccess'), 'success');
    };
    reader.readAsBinaryString(file);
  }, [t]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'], 'text/csv': ['.csv'] } 
  });

  const handleManualAdd = () => {
    if (!formData.household_id) return (window as any).addToast(t('fieldsMissing'), 'error');
    setManualQueue([...manualQueue, { ...formData }]);
    setFormData({ ...formData, household_id: '' });
  };

  const startAnalysis = (households: any[]) => {
    if (!villageName) return (window as any).addToast(t('fieldsMissing'), 'error');
    sessionStorage.setItem('pending_analysis', JSON.stringify({ village_name: villageName, households }));
    navigate('/processing');
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('newAnalysis')}</h1>
        <p className="text-[var(--text-secondary)]">{t('appSubtitle')}</p>
      </div>

      <div className="gov-card p-6 mb-8">
        <label className="text-sm font-bold uppercase tracking-wider mb-2">{t('villageName')}</label>
        <input 
          type="text" 
          value={villageName} 
          onChange={(e) => setVillageName(e.target.value)}
          placeholder={t('villageNamePH')}
          className="text-lg font-bold"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bulk Upload */}
        <div className="space-y-6">
          <div className="gov-card p-6">
            <div className="section-header">
              <span className="section-number">01</span>
              <h2 className="section-title">{t('uploadTitle')}</h2>
            </div>
            
            <div 
              {...getRootProps()} 
              className={`
                mt-4 border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer
                ${isDragActive ? 'border-[var(--gov-blue)] bg-[var(--gov-blue-light)]/5' : 'border-[var(--border-medium)] hover:border-[var(--gov-blue)]'}
              `}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--gov-blue)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-50">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <p className="font-semibold text-sm mb-1">{t('uploadTitle')}</p>
                <p className="text-xs text-[var(--text-muted)]">{t('uploadSub')}</p>
              </div>
            </div>

            {fileInfo && (
              <div className="mt-4 p-4 bg-[var(--risk-low-bg)] rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold uppercase text-[var(--risk-low)]">{fileInfo.name}</div>
                  <div className="text-[11px] text-[var(--text-muted)]">{fileInfo.count} {t('detected')}</div>
                </div>
                <button 
                  onClick={() => startAnalysis(bulkData)}
                  className="gov-btn-saffron py-2 px-6 text-sm"
                >
                  {t('confirmAnalyse')}
                </button>
              </div>
            )}
          </div>

          {bulkData.length > 0 && (
            <div className="gov-card p-6">
              <h3 className="font-bold mb-4">{t('previewTitle')}</h3>
              <div className="overflow-x-auto">
                <table className="gov-table">
                  <thead>
                    <tr>
                      {Object.keys(bulkData[0]).slice(0, 5).map(k => <th key={k}>{k}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {bulkData.slice(0, 5).map((row, i) => (
                      <tr key={i}>
                        {Object.values(row).slice(0, 5).map((v: any, j) => <td key={j}>{String(v)}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Manual Entry */}
        <div className="space-y-6">
          <div className="gov-card p-6">
            <div className="section-header">
              <span className="section-number">02</span>
              <h2 className="section-title">{t('manualTitle')}</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div>
                <label>{t('householdName')}</label>
                <input 
                  type="text" 
                  value={formData.household_id} 
                  onChange={e => setFormData({...formData, household_id: e.target.value})}
                />
              </div>
              <div>
                <label>{t('economic')} (₹)</label>
                <input 
                  type="number" 
                  value={formData.monthly_income}
                  onChange={e => setFormData({...formData, monthly_income: e.target.value})}
                />
              </div>
              <div>
                <label>{t('education')} (Highest)</label>
                <select 
                  value={formData.highest_edu}
                  onChange={e => setFormData({...formData, highest_edu: e.target.value})}
                >
                  <option value="none">None / illiterate</option>
                  <option value="primary">Primary School</option>
                  <option value="secondary">Secondary School</option>
                  <option value="higher">Higher / College</option>
                </select>
              </div>
              <div>
                <label>{t('housing')}</label>
                <select 
                  value={formData.housing_type}
                  onChange={e => setFormData({...formData, housing_type: e.target.value})}
                >
                  <option value="homeless">Homeless</option>
                  <option value="kutcha">Kutcha (Slum/Hut)</option>
                  <option value="semi-pucca">Semi-Pucca</option>
                  <option value="pucca">Pucca (Concrete)</option>
                </select>
              </div>
              
              <div className="sm:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4 py-4">
                <Toggle label="Literate?" value={formData.adult_literate} onChange={v => setFormData({...formData, adult_literate: v})} />
                <Toggle label="In School?" value={formData.children_in_school} onChange={v => setFormData({...formData, children_in_school: v})} />
                <Toggle label="Toilet?" value={formData.has_toilet} onChange={v => setFormData({...formData, has_toilet: v})} />
                <Toggle label="Water?" value={formData.has_clean_water} onChange={v => setFormData({...formData, has_clean_water: v})} />
              </div>

              <div className="sm:col-span-2">
                <button 
                  onClick={handleManualAdd}
                  className="gov-btn-outline w-full py-3"
                >
                  {t('addQueue')}
                </button>
              </div>
            </div>
          </div>

          {manualQueue.length > 0 && (
            <div className="gov-card p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">{t('queue')} ({manualQueue.length})</h3>
                <button 
                  onClick={() => startAnalysis(manualQueue)}
                  className="gov-btn-saffron text-sm py-2"
                >
                  {t('analyseAll')}
                </button>
              </div>
              <div className="space-y-2">
                {manualQueue.map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-slate-50 border border-slate-200 rounded text-sm">
                    <span className="font-semibold">{item.household_id}</span>
                    <button 
                      onClick={() => setManualQueue(manualQueue.filter((_, idx) => idx !== i))}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Toggle: React.FC<{ label: string, value: boolean, onChange: (v: boolean) => void }> = ({ label, value, onChange }) => (
  <div className="flex flex-col gap-2">
    <span className="text-[11px] font-bold uppercase text-slate-500">{label}</span>
    <button 
      onClick={() => onChange(!value)}
      className={`
        relative w-10 h-5 rounded-full transition-colors
        ${value ? 'bg-[var(--gov-blue)]' : 'bg-slate-300'}
      `}
    >
      <div className={`
        absolute top-1 w-3 h-3 bg-white rounded-full transition-all
        ${value ? 'left-6' : 'left-1'}
      `} />
    </button>
  </div>
);

export default InputPage;
