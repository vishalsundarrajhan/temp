# 🏛️ Intergenerational Poverty Lock Predictor (IPLP) Implementation Summary

I have built the unified monorepo as requested. The project combines a robust Node.js/Express backend with a high-performance React frontend, styled with premium government aesthetics and powered by Claude AI.

## 📁 Repository Structure
```
poverty-predictor/
├── package.json          ← Root workspaces & concurrent scripts
├── .env                  ← Place your ANTHROPIC_API_KEY here
├── server/               ← Express API (Port 3001)
│   ├── index.js          ← Main server & API routes
│   └── scorer.js         ← Anthropic AI scoring engine
└── client/               ← Vite + React App (Port 3000)
    ├── vite.config.ts    ← Proxy configured /api → :3001
    └── src/
        ├── contexts/     ← Bilingual (EN/TA) & Dark Mode state
        ├── components/   ← Premium UI components (Ashoka Chakra, etc)
        └── pages/        ← High-fidelity application views
```

## ✨ Key Features Implemented
- **AI Scoring Engine**: Claude 3.5 Sonnet analyzes 5 dimensions of poverty (Economic, Education, Housing, Health, Social).
- **Premium Aesthetics**: Government-inspired theme with tricolor accents, gold rules, and smooth Framer Motion transitions.
- **Bilingual Interface**: Seamless toggling between English and Tamil across the entire app.
- **Interactive Dashboard**:
    - **Recharts**: Risk distribution bar charts and population breakdown donuts.
    - **Virtualized Table**: Handles 1,000+ households with `react-window` for buttery smooth performance.
    - **Slide-over Profiles**: Detailed risk breakdown with animated progress bars and real-time AI summary.
- **Bulk Operations**: Drag-and-drop XLSX/CSV parsing with auto-column mapping.
- **Export System**: Professional PDF reports with jsPDF (includes tricolor header and stats) + Excel/CSV data exports.
- **Rescore Logic**: Live updating of household scores via specific API endpoints.

## 🚦 Instructions to Run
1. **Set API Key**: Open `.env` and replace `your_key_here` with your Anthropic API Key.
2. **Launch**: Run the following command in the root directory:
   ```bash
   npm run dev
   ```
3. **Visit**: Open [http://localhost:3000](http://localhost:3000) in your browser.

## ✅ Verification Checklist
- [x] Monorepo structure with functional workspaces
- [x] Express backend with CORS and Anthropic integration
- [x] Vite proxy for seamless API communication
- [x] Bilingual support (English & Tamil)
- [x] Dark/Light mode persistence
- [x] PDF/Excel/CSV export functionality
- [x] Virtualized results table for performance
