# 🏛️ Intergenerational Poverty Lock Predictor (IPLP) v2.0

A premium, AI-powered monorepo for social welfare assessment in India.

## 🚀 Quick Start

1. **Set API Key**: 
   Open `.env` in the root directory and replace `your_key_here` with your actual Anthropic API Key.
   ```
   ANTHROPIC_API_KEY=sk-ant-api03-...
   ```

2. **Install & Start**:
   If you haven't already, run:
   ```bash
   npm install
   npm run dev
   ```

3. **Access**:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend: [http://localhost:3001](http://localhost:3001)

## 📁 Structure

- `server/`: Express API with Claude AI scoring engine.
- `client/`: React + Vite + TypeScript frontend with premium government styling.

## 🛠 Tech Stack

- **AI**: Anthropic Claude 3.5 Sonnet
- **Backend**: Node.js, Express
- **Frontend**: React 18, Framer Motion, Recharts, Tailwind-free Vanilla CSS
- **Data**: XLSX, jsPDF, CSV exports

## 🇮🇳 Features

- **Bilingual**: Full support for English and Tamil.
- **Micro-animations**: Smooth transitions and Ashoka Chakra loading states.
- **Risk Assessment**: 5 dimensions (Economic, Education, Housing, Health, Social).
- **Proactive Policy**: Identifies "Locked" households for priority support.

---
*Created for the National Informatics Centre | Ministry of Social Justice & Empowerment*
