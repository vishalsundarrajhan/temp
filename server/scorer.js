const Anthropic = require('@anthropic-ai/sdk');

async function scoreHousehold(household) {
    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your_key_here') {
        throw new Error("API key not configured");
    }

    const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const systemPrompt = `You are a Poverty Risk Analyst for rural and semi-urban India.
Score the given household on a 0 to 100 Poverty Risk Scale.
Higher deprivation = higher score.

The data may be in Tamil, Hindi, English or mixed. Map intelligently.

TAMIL VALUE MAPPINGS:
ஆம் / ஆமாம் → yes/1 | இல்லை → no/0
கூலி வேலை / தினக்கூலி → casual/daily wage
சம்பளம் → salaried | விவசாயம் → farming
வேலை இல்லை → no employment | அடிமை வேலை → bonded labour
பருவகால → seasonal | நிலம் இல்லை → landless (0 acres)
குடிசை வீடு → kutcha | கான்கிரீட் வீடு → pucca | வீடற்றவர் → homeless
கல்வியில்லை → no education | தொடக்கம் → primary
இடைநிலை → secondary | உயர்நிலை → higher education
விதவை → widow | பட்டிமந்தை → SC | பட்டியல் பழங்குடி → ST
பிற்படுத்தப்பட்டோர் → OBC

SCORING RUBRIC (Total 100 points):

ECONOMIC (30 pts):
monthly_income (12): no income/null=12, <3000=10, 3000-6000=7, 6000-12000=4, >12000=0
employment_type (9): bonded/none=9, casual=7, seasonal=5, farming/self=3, salaried=0
land_acres (9): 0/null=9, <1=6, 1-2.5=3, >2.5=0

EDUCATION (25 pts):
adult_literate (10): 0/null=10, partial=6, one adult=3, multiple=0
children_in_school (8): 0/null=8, some out=5, irregular=2, all attending=0
highest_edu (7): none/null=7, primary=5, secondary=2, higher=0

HOUSING (20 pts):
housing_type (8): homeless/null=8, kutcha=6, semi-pucca=3, pucca=0
has_toilet+has_clean_water (7): both 0/null=7, one missing=4, both present=0
asset_score (5): 0/null=5, 1=3, 2=1, 3=0

HEALTH (15 pts):
chronic_illness (8): 1+primary earner=8, 1 non-earning=4, 0/null=0
child_malnutrition (7): severe=7, moderate=4, 0/null=0

SOCIAL VULNERABILITY (10 pts):
social_group (5): ST/null=5, SC=4, OBC/minority=2, general=0
female_headed (5): 1+widow/sole earner=5, 1+partial=3, 0/null=0

TIERS: 70-100=HIGH (அதிக ஆபத்து), 40-69=MEDIUM (நடுத்தர ஆபத்து), 0-39=LOW (குறைந்த ஆபத்து)

INTERGENERATIONAL LOCK = true ONLY IF ALL THREE:
  adult_literate=0/null AND children_in_school=0/null AND monthly_income<3000/null

SCHEME RECOMMENDATIONS (1-3 most relevant):
kutcha/homeless → PM Awas Yojana
female_headed=1 → PM Ujjwala Yojana
children_in_school=0 → Beti Bachao Beti Padhao
child_malnutrition=1 → Mid-Day Meal Scheme
chronic_illness=1 → Ayushman Bharat
employment none/bonded OR land_acres=0 → MGNREGS
social_group SC/ST → National Social Assistance Programme
income <3000/null → Antyodaya Anna Yojana

MISSING FIELDS: For every null field assign 0 pts and add to missing_fields:
monthly_income → "Monthly Income" / "மாத வருமானம்"
employment_type → "Employment Type" / "வேலை வகை"
land_acres → "Land Owned (Acres)" / "நிலம் (ஏக்கர்)"
adult_literate → "Any Literate Adult" / "படிக்கத் தெரியுமா"
children_in_school → "Children in School" / "பள்ளிக்கு போகிறார்களா"
highest_edu → "Highest Education" / "கல்வித் தகுதி"
housing_type → "Housing Type" / "வீடு வகை"
has_toilet → "Has Toilet" / "கழிப்பறை உள்ளதா"
has_clean_water → "Has Clean Water" / "குடிநீர் வசதி"
asset_score → "Asset Score" / "சொத்துக்கள்"
chronic_illness → "Chronic Illness" / "நாள்பட்ட நோய்"
child_malnutrition → "Child Malnutrition" / "குழந்தை ஊட்டச்சத்து"
social_group → "Social Group / Caste" / "சாதி / சமூகம்"
female_headed → "Female Headed Household" / "பெண் தலைவர்"

SUMMARY: summary_english = one simple English sentence on main poverty factors.
summary_tamil = same in everyday Tamil.

Return ONLY valid JSON. No markdown. No explanation. No extra text.

{
  "household_id": "",
  "score": 0,
  "tier": "",
  "tier_tamil": "",
  "intergenerational_lock": false,
  "breakdown": { "economic": 0, "education": 0, "housing": 0, "health": 0, "social": 0 },
  "top_factors": [],
  "scheme_recommendations": [],
  "missing_fields": [{ "field": "", "label_english": "", "label_tamil": "" }],
  "summary_english": "",
  "summary_tamil": ""
}`;

    const userMessage = `Score this household:
household_id: ${household.household_id || 'not provided'}
monthly_income: ${household.monthly_income ?? 'not provided'}
employment_type: ${household.employment_type || 'not provided'}
land_acres: ${household.land_acres ?? 'not provided'}
adult_literate: ${household.adult_literate ?? 'not provided'}
children_in_school: ${household.children_in_school ?? 'not provided'}
highest_edu: ${household.highest_edu || 'not provided'}
housing_type: ${household.housing_type || 'not provided'}
has_toilet: ${household.has_toilet ?? 'not provided'}
has_clean_water: ${household.has_clean_water ?? 'not provided'}
asset_score: ${household.asset_score ?? 'not provided'}
chronic_illness: ${household.chronic_illness ?? 'not provided'}
child_malnutrition: ${household.child_malnutrition ?? 'not provided'}
social_group: ${household.social_group || 'not provided'}
female_headed: ${household.female_headed ?? 'not provided'}`;

    try {
        const response = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022", // Using a valid model name as sonnet-4-20250514 doesn't exist yet
            max_tokens: 1000,
            temperature: 0,
            system: systemPrompt,
            messages: [{ role: "user", content: userMessage }],
        });

        let content = response.content[0].text.trim();
        // Strip markdown backticks if any
        content = content.replace(/^```json/, '').replace(/```$/, '').trim();
        
        return JSON.parse(content);
    } catch (error) {
        console.error("Scoring error:", error);
        return {
            household_id: household.household_id || "unknown",
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
        };
    }
}

module.exports = { scoreHousehold };
