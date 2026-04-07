const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: '../.env' });
const { scoreHousehold } = require('./scorer');

const app = express();
const port = 3001;

// Middlewares
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Handle preflight
app.options('*', cors());

if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your_key_here') {
    console.warn("WARNING: ANTHROPIC_API_KEY not set");
}

// Routes
app.get('/api/health', (req, res) => {
    res.json({ status: "ok" });
});

app.post('/api/analyse', async (req, res) => {
    try {
        const { village_name, households } = req.body;

        if (!households || !Array.isArray(households)) {
            return res.status(400).json({ error: "Invalid request body" });
        }

        if (households.length === 0) {
            return res.status(400).json({ error: "No households provided" });
        }

        const results = [];
        let high_risk_count = 0;
        let medium_risk_count = 0;
        let low_risk_count = 0;
        let intergenerational_lock_count = 0;

        for (const household of households) {
            try {
                const scored = await scoreHousehold(household);
                results.push(scored);
                
                // Count tiers
                if (scored.tier === 'HIGH') high_risk_count++;
                else if (scored.tier === 'MEDIUM') medium_risk_count++;
                else low_risk_count++;

                if (scored.intergenerational_lock) intergenerational_lock_count++;
                
                console.log(`Scored household_id: ${scored.household_id}`);
            } catch (err) {
                console.error(`Error scoring household ${household.household_id}:`, err);
                // Fallback for individual household failure
                const id = household.household_id || 'unknown';
                results.push({
                    household_id: id,
                    score: 0, 
                    tier: "LOW", 
                    tier_tamil: "குறைந்த ஆபத்து",
                    intergenerational_lock: false,
                    breakdown: { economic:0, education:0, housing:0, health:0, social:0 },
                    top_factors: ["Scoring failed — please retry"],
                    scheme_recommendations: [], 
                    missing_fields: [],
                    summary_english: "Could not score this household. Please retry.",
                    summary_tamil: "இந்த குடும்பத்தை மதிப்பீடு செய்ய முடியவில்லை. மீண்டும் முயற்சிக்கவும்."
                });
                low_risk_count++;
            }
        }

        // Sort by score descending
        results.sort((a, b) => b.score - a.score);

        res.json({
            village_name: village_name || "Unknown Village",
            total_households: households.length,
            high_risk_count,
            medium_risk_count,
            low_risk_count,
            intergenerational_lock_count,
            results
        });
    } catch (error) {
        console.error("Batch analysis error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post('/api/rescore', async (req, res) => {
    try {
        if (!req.body || !req.body.household_id) {
            return res.status(400).json({ error: "Invalid request body" });
        }

        const scored = await scoreHousehold(req.body);
        res.json(scored);
    } catch (error) {
        console.error("Rescore error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(port, () => {
    console.log(`Backend ready on port ${port}`);
});
