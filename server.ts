import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini Client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper with model fallback for high-demand spikes
async function generateWithModelFallback(params: {
  contents: any;
  config?: any;
}) {
  const models = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
  let lastError: any = null;

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: params.contents,
        config: params.config,
      });
      if (response && response.text) {
        return response;
      }
    } catch (err: any) {
      console.warn(`Model ${model} unavailable or overloaded, trying next:`, err?.message || err);
      lastError = err;
      await new Promise((resolve) => setTimeout(resolve, 800));
    }
  }

  throw lastError || new Error('AI service temporarily busy. Please try again.');
}

// Helper to sanitize and parse JSON response
function cleanAndParseJSON(rawText: string) {
  let cleaned = rawText.trim();
  // Strip Markdown code block if present
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/```\s*$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/```\s*$/, '');
  }
  return JSON.parse(cleaned.trim());
}

// Generate Itinerary Endpoint
app.post('/api/itinerary/generate', async (req, res) => {
  try {
    const params = req.body;
    const {
      destination,
      durationDays = 3,
      startDate = '',
      budgetLevel = 'moderate',
      approxBudget = '',
      currency = 'USD',
      travelParty = 'solo',
      interests = [],
      pace = 'balanced',
      dietaryRestrictions = [],
      customPreferences = '',
    } = params;

    if (!destination || typeof destination !== 'string') {
      return res.status(400).json({ error: 'Destination is required.' });
    }

    const duration = Math.min(Math.max(Number(durationDays) || 3, 1), 14);

    const prompt = `You are a world-renowned master travel concierge, local guide, and logistics expert.
Create an extraordinarily detailed, realistic, and personalized ${duration}-day travel itinerary for:
- Destination: ${destination}
- Duration: ${duration} days${startDate ? ` (Starting on ${startDate})` : ''}
- Budget Tier: ${budgetLevel} (Approx target budget: ${approxBudget ? approxBudget + ' ' + currency : 'realistic for this tier in ' + currency})
- Currency: ${currency}
- Travel Party: ${travelParty}
- Interests & Passions: ${interests.length > 0 ? interests.join(', ') : 'Must-see highlights, local cuisine, culture, hidden spots'}
- Travel Pace: ${pace} (e.g. relaxed: 1-2 major things with breathing room; balanced: 2-3 activities + dinner; packed: full days)
- Dietary Restrictions: ${dietaryRestrictions.length > 0 ? dietaryRestrictions.join(', ') : 'None specified'}
- Additional Preferences / Notes: ${customPreferences || 'None'}

CRITICAL REQUIREMENTS:
1. Provide accurate real-world coordinates (latitude & longitude) for the destination center and for EVERY activity venue so they can be plotted on an interactive map.
2. Group each day into morning, afternoon, and evening activities with realistic timing, authentic local food recommendations (including specific signature dishes & spots), duration, estimated cost in ${currency}, and insider tips.
3. Include smart budget breakdown with percentage & amounts matching the ${budgetLevel} tier and currency (${currency}).
4. Include essential packing checklist categorized (Clothing, Essentials, Tech, Destination Gear).
5. Include practical local tips (transit cards, cultural etiquette, common scams/safety tips, hidden gems).
6. Ensure the flow of activities within each day is geographically logical (no crisscrossing across the entire city back and forth).

Return ONLY valid JSON matching this exact structure:
{
  "id": "itinerary_${Date.now()}",
  "createdAt": "${new Date().toISOString()}",
  "destination": {
    "name": "${destination}",
    "country": "Country Name",
    "tagline": "Inspiring one-line tagline for the trip",
    "heroSummary": "2-3 sentences evoking the spirit, beauty, and texture of this trip.",
    "bestTimeToVisit": "Best months / season details",
    "localCurrency": "Local currency name and code",
    "language": "Primary languages spoken",
    "emergencyNumber": "Local emergency phone number (police/ambulance)",
    "centerCoordinates": {
      "lat": 0.0000,
      "lng": 0.0000
    }
  },
  "requestParameters": {
    "destination": "${destination}",
    "durationDays": ${duration},
    "startDate": "${startDate}",
    "budgetLevel": "${budgetLevel}",
    "approxBudget": "${approxBudget}",
    "currency": "${currency}",
    "travelParty": "${travelParty}",
    "interests": ${JSON.stringify(interests)},
    "pace": "${pace}",
    "dietaryRestrictions": ${JSON.stringify(dietaryRestrictions)},
    "customPreferences": "${customPreferences}"
  },
  "overviewNarrative": "A thoughtful 2-paragraph overview explaining why this itinerary was sculpted this way for this traveler.",
  "budgetBreakdown": {
    "totalEstimatedCost": "e.g. $1,450",
    "perPersonPerDay": "e.g. $145/day",
    "categories": [
      { "category": "Accommodation", "amount": "$600", "percentage": 40, "details": "Boutique hotels / cozy airbnbs" },
      { "category": "Dining & Drinks", "amount": "$400", "percentage": 28, "details": "Local bistros, markets, and special dinners" },
      { "category": "Activities & Admissions", "amount": "$250", "percentage": 17, "details": "Museum passes, tours, entries" },
      { "category": "Local Transportation", "amount": "$100", "percentage": 7, "details": "Metro passes, regional trains, occasional taxi" },
      { "category": "Buffer & Miscellaneous", "amount": "$100", "percentage": 8, "details": "Souvenirs, emergencies, tips" }
    ],
    "moneySavingTips": [
      "Tip 1 on saving money locally",
      "Tip 2",
      "Tip 3"
    ]
  },
  "weatherAndClothing": {
    "expectedWeather": "Summary of typical weather during this travel period",
    "temperatureRange": "e.g. 18°C - 26°C (64°F - 79°F)",
    "packingChecklist": [
      {
        "categoryName": "Clothing & Footwear",
        "items": ["Comfortable walking shoes", "Light breathable layers", "Evening casual wear", "Rain shell or compact umbrella"]
      },
      {
        "categoryName": "Travel Essentials",
        "items": ["Passport & digital backup", "Universal power adapter", "Local currency cash", "Refillable insulated water bottle"]
      },
      {
        "categoryName": "Destination Specific",
        "items": ["Modest temple/church attire", "Daypack with anti-theft zipper", "Electrolyte packets"]
      }
    ]
  },
  "localTips": {
    "culturalEtiquette": ["Key cultural norm 1", "Tipping policy", "Greeting customs"],
    "localTransitAdvice": ["Best transit pass to buy", "App to download for trains/buses", "Taxi advice"],
    "safetyAndScams": ["Neighborhoods or scams to watch for", "General safety tip"],
    "hiddenGemsAdvice": ["A spot most tourists miss", "Best sunset or viewpoint"]
  },
  "days": [
    {
      "dayNumber": 1,
      "title": "Day 1 Title",
      "theme": "Historic Heart & First Flavors",
      "dateStr": "Day 1",
      "transitSummary": "Walkable district navigation with short metro hops.",
      "dayHighlights": ["Highlight 1", "Highlight 2"],
      "activities": [
        {
          "id": "d1_act1",
          "timeSlot": "morning",
          "time": "09:00 AM",
          "title": "Iconic Landmark / Activity",
          "description": "Vivid description with rich local atmosphere and historical context.",
          "category": "sightseeing",
          "locationName": "Precise Spot Name",
          "address": "Approx neighborhood or street address",
          "coordinates": { "lat": 0.0000, "lng": 0.0000 },
          "estimatedCost": "Free / $15",
          "duration": "2.5 hours",
          "travelTip": "Arrive early to beat tour groups; photograph from the eastern terrace.",
          "foodRecommendation": {
            "dish": "Morning pastry or specialty breakfast",
            "venueName": "Recommended Cafe Name",
            "notes": "Renowned for its fresh roast and quiet courtyard."
          }
        },
        {
          "id": "d1_act2",
          "timeSlot": "afternoon",
          "time": "01:30 PM",
          "title": "Afternoon Exploration / Cultural Immersion",
          "description": "Engaging description of the afternoon journey.",
          "category": "culture",
          "locationName": "Spot Name",
          "address": "Neighborhood address",
          "coordinates": { "lat": 0.0000, "lng": 0.0000 },
          "estimatedCost": "$20",
          "duration": "3 hours",
          "travelTip": "Book ahead online or use mobile ticket to skip the queue.",
          "foodRecommendation": {
            "dish": "Signature local lunch dish",
            "venueName": "Local Eatery Name",
            "notes": "Authentic, favored by locals for authentic preparation."
          }
        },
        {
          "id": "d1_act3",
          "timeSlot": "evening",
          "time": "07:00 PM",
          "title": "Golden Hour & Night Atmosphere",
          "description": "Atmospheric evening experience, sunset vista, and night walk.",
          "category": "food",
          "locationName": "Evening District or Venue",
          "address": "Neighborhood",
          "coordinates": { "lat": 0.0000, "lng": 0.0000 },
          "estimatedCost": "$35",
          "duration": "2.5 hours",
          "travelTip": "Reservation recommended for outdoor terrace seating.",
          "foodRecommendation": {
            "dish": "Chef's signature dinner dish",
            "venueName": "Charming Trattoria / Bistro / Izakaya",
            "notes": "Pair with local regional beverage."
          }
        }
      ]
    }
  ],
  "alternativeActivities": [
    {
      "title": "Alternative Activity Name",
      "category": "nature",
      "description": "What this entails and why it's great.",
      "whyConsider": "Ideal if it rains or if you want fewer crowds."
    },
    {
      "title": "Second Alternative",
      "category": "culture",
      "description": "Unique culinary or artisan workshop.",
      "whyConsider": "Hands-on experience for food lovers."
    }
  ]
}

Ensure all ${duration} days are completely filled out with realistic, authentic details.`;

    const response = await generateWithModelFallback({
      contents: prompt,
      config: {
        systemInstruction:
          'You are an expert luxury travel concierge, local insider, and geographer. You produce meticulously researched, practical, and inspiring travel itineraries in valid JSON. Never hallucinate invalid coordinates; use accurate real-world latitude and longitude for cities and landmarks.',
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const text = response.text || '';
    if (!text) {
      throw new Error('No content returned from AI');
    }

    const data = cleanAndParseJSON(text);
    return res.json(data);
  } catch (error: any) {
    console.error('Error generating itinerary:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate itinerary. Please try again.',
    });
  }
});

// Tweak a specific day endpoint
app.post('/api/itinerary/tweak-day', async (req, res) => {
  try {
    const { destination, dayNumber, currentDay, instruction, currency = 'USD' } = req.body;

    if (!currentDay || !instruction) {
      return res.status(400).json({ error: 'currentDay and instruction are required.' });
    }

    const prompt = `You are a travel concierge adjusting Day ${dayNumber} of an itinerary for ${destination}.
Current Day Plan:
${JSON.stringify(currentDay, null, 2)}

User's requested modification:
"${instruction}"

Please update Day ${dayNumber} while maintaining realistic travel flow, accurate geographical coordinates, and currency in ${currency}.
Return ONLY valid JSON matching the DayItinerary structure:
{
  "dayNumber": ${dayNumber},
  "title": "Updated Title",
  "theme": "Updated Theme",
  "dateStr": "${currentDay.dateStr || `Day ${dayNumber}`}",
  "transitSummary": "Updated transit advice",
  "dayHighlights": ["Highlight 1", "Highlight 2"],
  "activities": [
    {
      "id": "act_${Date.now()}_1",
      "timeSlot": "morning",
      "time": "09:00 AM",
      "title": "...",
      "description": "...",
      "category": "sightseeing",
      "locationName": "...",
      "address": "...",
      "coordinates": { "lat": 0.0, "lng": 0.0 },
      "estimatedCost": "...",
      "duration": "...",
      "travelTip": "...",
      "foodRecommendation": {
        "dish": "...",
        "venueName": "...",
        "notes": "..."
      }
    }
  ]
}`;

    const response = await generateWithModelFallback({
      contents: prompt,
      config: {
        systemInstruction: 'You are an expert travel concierge. Return only the requested Day JSON object.',
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const data = cleanAndParseJSON(response.text || '');
    return res.json(data);
  } catch (error: any) {
    console.error('Error tweaking day:', error);
    return res.status(500).json({
      error: error.message || 'Failed to update day. Please try again.',
    });
  }
});

// Travel Concierge Q&A endpoint
app.post('/api/itinerary/ask', async (req, res) => {
  try {
    const { question, destination, contextSummary } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required.' });
    }

    const prompt = `You are a personalized local travel assistant for ${destination || 'the traveler'}.
Trip context: ${contextSummary || 'A custom curated travel itinerary.'}

Traveler Question: "${question}"

Provide a concise, warm, actionable, and insider response (2-3 paragraphs max) with specific spots, advice, transit tips, or etiquette.`;

    const response = await generateWithModelFallback({
      contents: prompt,
      config: {
        systemInstruction: 'You are an intelligent, warm local travel concierge. Be direct, practical, and inspiring.',
        temperature: 0.7,
      },
    });

    return res.json({ answer: response.text });
  } catch (error: any) {
    console.error('Error in concierge ask:', error);
    return res.status(500).json({
      error: error.message || 'Failed to answer question.',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Voyager AI server running on port ${PORT}`);
  });
}

startServer();
