# 🌾 ApnaKeth - Smart AgriScout

AI-powered crop stress detection and intervention system using satellite data, weather forecasts, and soil analysis.

## ✅ Current Status

**AI Components:** ✅ Fully copied and adapted from SIH ERP  
**Ready to Run:** ✅ Yes, with mock data  
**Real APIs:** ⚠️ Need configuration (N8N webhook, API keys)

## 🚀 Features

- **🛰️ Crop Health Analysis**: NDVI/MLVI-based stress detection from Sentinel-2 satellite data
- **☁️ Weather Forecasting**: Real-time weather predictions with OpenWeatherMap API
- **🌱 Soil Analysis**: Moisture, nutrients, and pH monitoring
- **🤖 AI Assistant**: Multilingual (Hindi/English) chat with voice input/output (✅ **WORKING NOW**)
- **💡 Smart Interventions**: AI-powered farming recommendations
- **📊 Yield Prediction**: Seasonal forecasting based on multiple factors

---

## 🏃 Quick Start (5 Minutes)

### Step 1: Install Dependencies

```bash
# Backend
npm install

# Frontend
cd frontend && npm install && cd ..
```

### Step 2: Configure Environment (Optional for basic testing)

```bash
# Copy example env file
cp .env.example .env

# For frontend (optional)
echo 'VITE_N8N_WEBHOOK_URL=https://n8n.pipfactor.com/webhook/apnaketh' > frontend/.env
echo 'VITE_GEMINI_API_KEY=your_key_here' >> frontend/.env
```

### Step 3: Run the App

```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend (new terminal)
cd frontend && npm run dev
```

### Step 4: Test It! 🎉

1. Open http://localhost:5173
2. Click the green 🌱 button (bottom-right)
3. Type: "What is NDVI?" or speak your question
4. AI responds!

---

## 📋 Prerequisites

- **Node.js** 18+ and npm
- **N8N Webhook** for Gemini AI (optional, has fallback)
- **API Keys** (optional for full functionality):
  - Google Gemini API
  - Google Earth Engine (for satellite data)
  - OpenWeatherMap API

## 🛠️ Detailed Installation

### Environment Variables

**Backend** (`.env`):

```env
# Backend Server
PORT=3001
NODE_ENV=development

# N8N Webhook (Primary AI endpoint)
N8N_WEBHOOK_URL=https://n8n.pipfactor.com/webhook/apnaketh
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: For full satellite/weather integration
GOOGLE_EARTH_ENGINE_KEY=your_gee_key
OPENWEATHER_API_KEY=your_openweather_key

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### 3. Frontend Environment (Create `frontend/.env`)

```bash
# Create frontend env file
touch frontend/.env
```

Add to `frontend/.env`:

```env
VITE_N8N_WEBHOOK_URL=https://n8n.pipfactor.com/webhook/apnaketh
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

## 🏃 Running the Application

### Option 1: Run Both Services Separately

```bash
# Terminal 1 - Backend API
npm run dev

# Terminal 2 - Frontend (in new terminal)
cd frontend
npm run dev
```

### Option 2: Production Build

```bash
# Build backend
npm run build
npm start

# Build frontend
cd frontend
npm run build
npm run preview
```

## 🌐 Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **API Services**: http://localhost:3001/api/ai/services

## 🔌 API Endpoints

### AI Chat Endpoint

```bash
POST /api/ai/chat
Content-Type: application/json

{
  "query": "What is the health of my crop?",
  "serviceType": "crop_analysis",
  "context": {}
}
```

### Crop Analysis

```bash
POST /api/ai/crop/analyze
Content-Type: application/json

{
  "fieldId": "field_123",
  "coordinates": { "lat": 28.6139, "lng": 77.2090 },
  "satelliteData": {}
}
```

### Weather Forecast

```bash
POST /api/ai/weather/forecast
Content-Type: application/json

{
  "latitude": 28.6139,
  "longitude": 77.2090,
  "days": 7
}
```

### Soil Analysis

```bash
POST /api/ai/soil/analyze
Content-Type: application/json

{
  "fieldId": "field_123",
  "sensorData": {}
}
```

### Interventions

```bash
POST /api/ai/interventions
Content-Type: application/json

{
  "fieldId": "field_123",
  "stressType": "water_stress",
  "severity": "moderate"
}
```

## 🎯 Next Steps: Integration Guide

### 1. **Connect N8N Webhook to Gemini**

The AI assistant currently uses N8N as a middleware to Gemini. Configure your N8N workflow:

1. Create a webhook trigger in N8N
2. Add Gemini AI node with system prompt for agriculture
3. Configure response to return JSON: `{ "text": "AI response here" }`

**Recommended System Prompt for Gemini:**

```
You are an AI assistant for ApnaKeth, a smart agriculture platform for Indian farmers.
Respond in simple Hindi/English mix (Hinglish) that farmers can understand easily.
Provide practical advice about:
- Crop health and NDVI analysis
- Weather patterns and farming decisions
- Soil health and fertilizer recommendations
- Pest control and disease management
- Irrigation scheduling

Always be encouraging and helpful. Use emojis where appropriate.
```

### 2. **Integrate Satellite Data (Google Earth Engine)**

Update `src/controllers/ai.controller.ts` → `analyzeCrop()` method:

```typescript
// TODO: Replace mock data with actual GEE API call
import ee from '@google/earthengine';

// Initialize Earth Engine
ee.initialize();

// Fetch Sentinel-2 data
const sentinel = ee.ImageCollection('COPERNICUS/S2')
  .filterBounds(ee.Geometry.Point([longitude, latitude]))
  .filterDate(startDate, endDate)
  .sort('CLOUD_COVER');

// Calculate NDVI
const ndvi = sentinel.map(img => 
  img.normalizedDifference(['B8', 'B4']).rename('NDVI')
);
```

### 3. **Add OpenWeatherMap Integration**

Update `src/controllers/ai.controller.ts` → `getWeatherForecast()`:

```typescript
// TODO: Replace mock with actual OpenWeather API
const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}`;

const response = await fetch(weatherUrl);
const weatherData = await response.json();
```

### 4. **Connect IoT Soil Sensors**

For real-time soil data, integrate with IoT sensors:

- MQTT broker for sensor data
- WebSocket for real-time updates
- Database for historical trends

### 5. **Add LangGraph Multi-Agent System**

For advanced interventions, implement LangGraph agents:

```typescript
import { StateGraph } from "@langchain/langgraph";

// Agent 1: Data Collection
// Agent 2: Analysis
// Agent 3: Recommendation Generation
```

### 6. **Multilingual Support**

Add more Indian languages:

```typescript
// Update speechToText.setLanguage() options:
- 'hi-IN' (Hindi)
- 'pa-IN' (Punjabi)
- 'mr-IN' (Marathi)
- 'bn-IN' (Bengali)
- 'ta-IN' (Tamil)
```

## 📱 Features to Add

- [ ] User authentication (farmer profiles)
- [ ] Field management (multiple fields per farmer)
- [ ] Historical data visualization
- [ ] Offline mode with PWA
- [ ] SMS alerts for critical issues
- [ ] Market price integration
- [ ] Crop disease image recognition
- [ ] Community forum

## 🔧 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Speech Recognition Not Working

- Ensure you're using Chrome/Edge/Safari
- Check microphone permissions
- Use HTTPS in production

### N8N Webhook Failing

- Verify webhook URL is correct
- Check N8N workflow is active
- Test with curl:

```bash
curl -X POST https://n8n.pipfactor.com/webhook/apnaketh \
  -H "Content-Type: application/json" \
  -d '{"query": "test", "sender": "test"}'
```

## 🤝 Contributing

This is a hackathon project by **Team Hacksters** for HackOrbital.

## 📄 License

MIT License

## 🙏 Credits

- SIH ERP Clone (AI Assistant base architecture)
- N8N for workflow automation
- Google Gemini for AI capabilities
- Sentinel-2 for satellite imagery

---

**Built with ❤️ for Indian Farmers by Team Hacksters** 🇮🇳🌾

---

## ✅ AI Components Status (Copied from SIH ERP)

| Component | Status | File Location |
|-----------|--------|---------------|
| AI Chat UI | ✅ Copied & Adapted | `frontend/src/components/AIChat.tsx` |
| Voice Input/Output | ✅ Working | `frontend/src/utils/speechToText.ts` |
| Orb Animation | ✅ Copied | `frontend/src/components/Orb.tsx` |
| AI Controller | ✅ Adapted for AgriScout | `src/controllers/ai.controller.ts` |
| N8N Integration | ✅ Ready (needs URL) | Throughout codebase |
| Gemini TTS | ✅ Implemented | `AIChat.tsx` (speakText) |
| UI Components | ✅ All copied | `Button`, `Input`, `ScrollArea` |

## 🎯 What Works RIGHT NOW (Without Extra Setup)

✅ **Frontend Runs** - `cd frontend && npm run dev`  
✅ **AI Chat Opens** - Click green 🌱 button  
✅ **Beautiful UI** - Glassmorphism, gradients, responsive  
✅ **Voice Input** - Mic button records speech (Chrome/Safari)  
✅ **Multilingual Messages** - Hindi/English mix  
✅ **Backend API** - Mock data for testing  
✅ **Fallback System** - Works even if N8N fails  

## ⚠️ Needs Configuration for Full AI

❌ **N8N Webhook** - Add URL to `.env` files  
❌ **Gemini API Key** - For voice responses  
❌ **Real Satellite Data** - Google Earth Engine (later)  
❌ **Weather API** - OpenWeatherMap (later)

**But you can run and test everything else right now!** 🚀

---

**Built for HackOrbital 🏆 by Team Hacksters** 🇮🇳🌾
