import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ta';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    appTitle: "Intergenerational Poverty Lock Predictor",
    appSubtitle: "AI-Powered Socio-Economic Vulnerability Assessment",
    ministry: "Ministry of Social Justice & Empowerment",
    govIndia: "Government of India",
    nic: "National Informatics Centre",
    beginAnalysis: "Begin Analysis",
    selectLang: "Select Language",
    selectLangSub: "Choose your preferred language to continue",
    englishLabel: "English",
    tamilLabel: "தமிழ்",
    englishSub: "Professional Interface",
    tamilSub: "தமிழ் இடைமுகம்",
    home: "Home",
    newAnalysis: "New Analysis",
    results: "Results",
    history: "History",
    settings: "Settings",
    villageName: "Village/Locality Name",
    villageNamePH: "Enter name (e.g., Thenpatti)",
    uploadTitle: "Bulk Analysis (XLSX / CSV)",
    uploadSub: "Drag and drop or click to upload village survey data",
    previewTitle: "Data Preview",
    detected: "households detected",
    mapColumns: "Map Columns",
    confirmAnalyse: "Confirm & Start Analysis",
    manualTitle: "Manual Individual Entry",
    manualSub: "Add single households to the assessment queue",
    householdName: "Household ID / Name",
    addQueue: "Add to Queue",
    analyseAll: "Analyse All Households",
    queue: "Assessment Queue",
    processingTitle: "Processing Household Data",
    processingSub: "Claude AI is analyzing multi-dimensional poverty factors...",
    processingComplete: "Analysis Complete",
    scoringHousehold: "Scoring household",
    of: "of",
    criticalTitle: "Critical Intergenerational Lock Cases",
    criticalSub: "Households requiring immediate policy intervention",
    totalH: "Total Households",
    highR: "High Risk",
    medR: "Medium Risk",
    lockC: "Lock Cases",
    searchPH: "Search by ID or name...",
    showing: "Showing",
    rank: "Rank",
    name: "Household ID",
    score: "Score",
    tier: "Risk Tier",
    lock: "Lock",
    factors: "Key Factors",
    actions: "Actions",
    viewProfile: "View Profile",
    profileTitle: "Household Profile",
    breakdown: "Risk Breakdown",
    fieldData: "Field Data",
    missingData: "Missing Information",
    fillMissing: "Fill & Rescore",
    rescore: "Update Analysis",
    schemes: "Recommended Welfare Schemes",
    summaryEn: "English Summary",
    summaryTa: "Tamil Summary",
    dlPDF: "Download PDF Report",
    dlXLS: "Download Excel",
    dlCSV: "Download CSV",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    noData: "No data available",
    startNew: "Start New Analysis",
    notProvided: "Not provided",
    yes: "Yes",
    no: "No",
    economic: "Economic",
    education: "Education",
    housing: "Housing",
    health: "Health",
    social: "Social Vulnerability",
    highFull: "High Risk",
    medFull: "Medium Risk",
    lowFull: "Low Risk",
    lockLabel: "Lock Detected",
    scoreFailed: "Scoring failed",
    retry: "Retry",
    tryAgain: "Try Again",
    uploadSuccess: "File uploaded successfully",
    analysisComplete: "Analysis completed successfully",
    pdfDownloaded: "PDF report downloaded",
    excelDownloaded: "Excel file downloaded",
    csvDownloaded: "CSV file downloaded",
    rescoredSuccess: "Household rescored successfully",
    apiError: "Server communication error",
    fieldsMissing: "Please fill all required fields",
    viewFullProfile: "View Full Profile",
    backToInput: "Back to Input",
    generating: "Generating..."
  },
  ta: {
    appTitle: "தலைமுறை ஏழ்மை பூட்டு கணிப்பான்",
    appSubtitle: "AI-அடிப்படையிலான சமூக-பொருளாதார பாதிப்பு மதிப்பீடு",
    ministry: "சமூக நீதி மற்றும் அதிகாரமளித்தல் அமைச்சகம்",
    govIndia: "இந்திய அரசு",
    nic: "தேசிய தகவலியல் மையம்",
    beginAnalysis: "ஆரம்பிக்கவும்",
    selectLang: "மொழியைத் தேர்ந்தெடுக்கவும்",
    selectLangSub: "தொடர உங்களுக்கு விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்",
    englishLabel: "English",
    tamilLabel: "தமிழ்",
    englishSub: "ஆங்கில இடைமுகம்",
    tamilSub: "தமிழ் இடைமுகம்",
    home: "முகப்பு",
    newAnalysis: "புதிய பகுப்பாய்வு",
    results: "முடிவுகள்",
    history: "வரலாறு",
    settings: "அமைப்புகள்",
    villageName: "கிராமம்/பகுதி பெயர்",
    villageNamePH: "பெயரை உள்ளிடவும் (எ.கா. தென்பட்டி)",
    uploadTitle: "மொத்த பகுப்பாய்வு (XLSX / CSV)",
    uploadSub: "கிராம ஆய்வு தரவை பதிவேற்ற இங்கே இழுத்து விடவும் அல்லது கிளிக் செய்யவும்",
    previewTitle: "தரவு முன்னோட்டம்",
    detected: "குடும்பங்கள் கண்டறியப்பட்டன",
    mapColumns: "நெடுவரிசைகளை இணைக்கவும்",
    confirmAnalyse: "உறுதிப்படுத்தி பகுப்பாய்வைத் தொடங்கவும்",
    manualTitle: "தனிநபர் பதிவு",
    manualSub: "மதிப்பீட்டு வரிசையில் தனித்தனி குடும்பங்களைச் சேர்க்கவும்",
    householdName: "குடும்ப ஐடி / பெயர்",
    addQueue: "வரிசையில் சேர்",
    analyseAll: "அனைத்து குடும்பங்களையும் பகுப்பாய்வு செய்",
    queue: "மதிப்பீட்டு வரிசை",
    processingTitle: "குடும்பத் தரவை செயலாக்குகிறது",
    processingSub: "Claude AI பல பரிமாண ஏழ்மை காரணிகளை ஆய்வு செய்கிறது...",
    processingComplete: "பகுப்பாய்வு முடிந்தது",
    scoringHousehold: "மதிப்பீடு செய்கிறது",
    of: "/",
    criticalTitle: "முக்கிய தலைமுறை ஏழ்மை பூட்டு வழக்குகள்",
    criticalSub: "உடனடி கொள்கை தலையீடு தேவைப்படும் குடும்பங்கள்",
    totalH: "மொத்த குடும்பங்கள்",
    highR: "அதிக ஆபத்து",
    medR: "நடுத்தர ஆபத்து",
    lockC: "பூட்டு வழக்குகள்",
    searchPH: "ஐடி அல்லது பெயர் மூலம் தேடவும்...",
    showing: "காண்பிக்கப்படுகிறது",
    rank: "வரிசை",
    name: "குடும்ப ஐடி",
    score: "மதிப்பெண்",
    tier: "ஆபத்து நிலை",
    lock: "பூட்டு",
    factors: "முக்கிய காரணிகள்",
    actions: "நடவடிக்கைகள்",
    viewProfile: "விவரத்தைக் காண்க",
    profileTitle: "குடும்ப விவரம்",
    breakdown: "ஆபத்து விவரம்",
    fieldData: "களத் தரவு",
    missingData: "விடுபட்ட தகவல்கள்",
    fillMissing: "பூர்த்தி செய்து மீண்டும் மதிப்பீடு செய்",
    rescore: "பகுப்பாய்வைப் புதுப்பிக்கவும்",
    schemes: "பரிந்துரைக்கப்பட்ட நலத்திட்டங்கள்",
    summaryEn: "ஆங்கில சுருக்கம்",
    summaryTa: "தமிழ் சுருக்கம்",
    dlPDF: "PDF அறிக்கையை பதிவிறக்கவும்",
    dlXLS: "Excel தரவைப் பதிவிறக்கவும்",
    dlCSV: "CSV தரவைப் பதிவிறக்கவும்",
    darkMode: "இருண்ட பயன்முறை",
    lightMode: "ஒளி பயன்முறை",
    noData: "தரவு இல்லை",
    startNew: "புதிய பகுப்பாய்வைத் தொடங்கவும்",
    notProvided: "வழங்கப்படவில்லை",
    yes: "ஆம்",
    no: "இல்லை",
    economic: "பொருளாதாரம்",
    education: "கல்வி",
    housing: "இருப்பிடம்",
    health: "சுகாதாரம்",
    social: "சமூக பாதிப்பு",
    highFull: "அதிக ஆபத்து",
    medFull: "நடுத்தர ஆபத்து",
    lowFull: "குறைந்த ஆபத்து",
    lockLabel: "பூட்டு கண்டறியப்பட்டது",
    scoreFailed: "மதிப்பீடு தோல்வியுற்றது",
    retry: "மீண்டும் முயற்சி செய்",
    tryAgain: "மீண்டும் முயற்சிக்கவும்",
    uploadSuccess: "கோப்பு வெற்றிகரமாக பதிவேற்றப்பட்டது",
    analysisComplete: "பகுப்பாய்வு வெற்றிகரமாக முடிந்தது",
    pdfDownloaded: "PDF அறிக்கை பதிவிறக்கப்பட்டது",
    excelDownloaded: "Excel கோப்பு பதிவிறக்கப்பட்டது",
    csvDownloaded: "CSV கோப்பு பதிவிறக்கப்பட்டது",
    rescoredSuccess: "குடும்பம் வெற்றிகரமாக மீண்டும் மதிப்பீடு செய்யப்பட்டது",
    apiError: "சர்வர் தொடர்பு பிழை",
    fieldsMissing: "தேவையான அனைத்து புலங்களையும் நிரப்பவும்",
    viewFullProfile: "முழு விவரத்தைக் காண்க",
    backToInput: "திரும்பிச் செல்ல",
    generating: "உருவாக்குகிறது..."
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(
    (localStorage.getItem('app_language') as Language) || 'en'
  );

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('app_language', newLang);
  };

  const t = (key: string) => translations[lang][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
