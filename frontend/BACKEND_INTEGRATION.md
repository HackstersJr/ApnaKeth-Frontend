# Backend Integration Documentation

## Overview
This document outlines all the backend integration points required for ApnaKeth frontend.

---

## 🔌 API Endpoints Needed

### 1. AI Chat API

**Primary Endpoint (N8N Webhook):**
```
POST https://n8n.pipfactor.com/webhook/apnaketh
```

**Request Body:**
```json
{
  "query": "string - User's question",
  "sessionId": "string - Unique session identifier",
  "timestamp": "ISO 8601 timestamp",
  "context": {
    "page": "string - Current page type",
    "userType": "farmer",
    "app": "apnaketh"
  }
}
```

**Expected Response:**
```json
{
  "text": "string - AI response text",
  "commands": [
    {
      "type": "navigate | info",
      "route": "string - Route to navigate",
      "message": "string - Info message"
    }
  ]
}
```

**Fallback Endpoint (Local Backend):**
```
POST /api/ai/chat
```

**Used in:** `src/components/ArivStyleChat.tsx` (Line 153-230)

---

### 2. Land Management APIs (Future)

#### Get All Lands
```
GET /api/lands
Authorization: Bearer <token>
```

**Response:**
```json
{
  "lands": [
    {
      "id": "string",
      "name": "string",
      "coordinates": [{ "lat": number, "lng": number }],
      "area": number,
      "crop": "string",
      "cropVariety": "string",
      "plantedDate": "ISO 8601",
      "expectedHarvestDate": "ISO 8601",
      "irrigationType": "drip | sprinkler | flood | rainfed | other",
      "fertilizers": "string",
      "pesticides": "string",
      "notes": "string"
    }
  ]
}
```

#### Create Land
```
POST /api/lands
Authorization: Bearer <token>
```

**Request Body:** Same as land object above

#### Update Land
```
PUT /api/lands/:landId
Authorization: Bearer <token>
```

#### Delete Land
```
DELETE /api/lands/:landId
Authorization: Bearer <token>
```

**Integration Point:** 
- State: `src/store/useAppStore.ts`
- Components: `src/pages/OnboardingFlow.tsx`, `src/pages/LandsScreen.tsx`

---

### 3. Partition Management APIs (Future)

#### Get Partitions for Land
```
GET /api/lands/:landId/partitions
Authorization: Bearer <token>
```

#### Create Partition
```
POST /api/lands/:landId/partitions
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "id": "string",
  "name": "string",
  "coordinates": [{ "lat": number, "lng": number }],
  "parentLandId": "string",
  "crop": "string",
  ...similar fields as land
}
```

**Integration Point:**
- State: `src/store/useAppStore.ts`
- Components: `src/pages/OnboardingFlow.tsx`

---

### 4. Satellite Data APIs (Future)

#### Get NDVI Data
```
GET /api/satellite/ndvi?landId=<landId>&date=<YYYY-MM-DD>
Authorization: Bearer <token>
```

**Response:**
```json
{
  "landId": "string",
  "date": "ISO 8601",
  "ndviValue": number,
  "healthStatus": "healthy | stressed | critical",
  "imageUrl": "string - URL to NDVI visualization"
}
```

#### Get Soil Data
```
GET /api/satellite/soil?landId=<landId>
Authorization: Bearer <token>
```

**Response:**
```json
{
  "landId": "string",
  "soilType": "string",
  "moisture": number,
  "nutrients": {
    "nitrogen": number,
    "phosphorus": number,
    "potassium": number
  },
  "pH": number
}
```

**Integration Point:**
- Page: `src/pages/LandDetailsScreen.tsx`
- Mock Data: `src/data/soil.json`

---

### 5. Weather API (Future)

```
GET /api/weather?lat=<latitude>&lng=<longitude>
Authorization: Bearer <token>
```

**Response:**
```json
{
  "current": {
    "temperature": number,
    "humidity": number,
    "condition": "sunny | cloudy | rainy | stormy",
    "windSpeed": number
  },
  "forecast": [
    {
      "date": "ISO 8601",
      "tempMax": number,
      "tempMin": number,
      "rainfall": number,
      "condition": "string"
    }
  ]
}
```

**Integration Point:**
- Page: `src/pages/LandDetailsScreen.tsx`, `src/pages/OnboardingFlow.tsx`
- Mock Data: `src/data/weather.json`

---

### 6. Recommendations API (Future)

```
GET /api/recommendations?landId=<landId>
Authorization: Bearer <token>
```

**Response:**
```json
{
  "recommendations": [
    {
      "id": "string",
      "type": "irrigation | fertilizer | pest_control | harvest",
      "priority": "high | medium | low",
      "title": "string",
      "description": "string",
      "actionDate": "ISO 8601",
      "isCompleted": boolean
    }
  ]
}
```

**Integration Point:**
- Page: `src/pages/LandDetailsScreen.tsx`
- Mock Data: `src/data/recommendations.json`

---

## 🔐 Authentication (Future)

### Login
```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "JWT token",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "phone": "string"
  }
}
```

### Register
```
POST /api/auth/register
```

### Logout
```
POST /api/auth/logout
Authorization: Bearer <token>
```

**Integration Point:** Create `src/contexts/AuthContext.tsx` for auth state management

---

## 📁 Where to Add API Integration Code

### Option 1: Create API Service Layer (Recommended)

Create `src/services/api.ts`:
```typescript
// API service for all backend calls
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const landAPI = {
  getAll: () => api.get('/lands'),
  create: (data: any) => api.post('/lands', data),
  update: (id: string, data: any) => api.put(`/lands/${id}`, data),
  delete: (id: string) => api.delete(`/lands/${id}`),
};

export const weatherAPI = {
  getCurrent: (lat: number, lng: number) => api.get(`/weather?lat=${lat}&lng=${lng}`),
};

// Add more API groups...
```

### Option 2: Use React Query (Recommended)

Create `src/hooks/useApi.ts`:
```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { landAPI } from '../services/api';

export const useLands = () => {
  return useQuery({
    queryKey: ['lands'],
    queryFn: () => landAPI.getAll(),
  });
};

export const useCreateLand = () => {
  return useMutation({
    mutationFn: (data: any) => landAPI.create(data),
  });
};
```

**Then update Zustand store** (`src/store/useAppStore.ts`) to fetch from API instead of local state.

---

## 🔄 Migration Steps (Mock → Real API)

### Step 1: Replace Mock Data in Zustand Store

**Current:** `src/store/useAppStore.ts` stores data locally
**After:** Call API in actions, sync with backend

```typescript
// Before
addLand: (land) => set((state) => ({ 
  ownedLands: [...state.ownedLands, land] 
}))

// After
addLand: async (land) => {
  const response = await landAPI.create(land);
  set((state) => ({ 
    ownedLands: [...state.ownedLands, response.data] 
  }));
}
```

### Step 2: Fetch Data on App Load

Update `src/App.tsx` or create a data provider:
```typescript
useEffect(() => {
  const fetchUserLands = async () => {
    const response = await landAPI.getAll();
    setOwnedLands(response.data.lands);
  };
  
  if (isAuthenticated) {
    fetchUserLands();
  }
}, [isAuthenticated]);
```

### Step 3: Replace Mock JSON Files

Remove:
- `src/data/lands.json`
- `src/data/weather.json`
- `src/data/soil.json`
- `src/data/recommendations.json`

Replace with API calls in components.

---

## 🌍 Environment Variables

Copy `.env.example` to `.env` and fill in:

```env
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance/webhook/apnaketh
VITE_API_BASE_URL=https://your-backend-api.com/api
```

---

## 🧪 Testing API Integration

### 1. Test AI Chat
- Open browser console
- Click on AI orb
- Type a message
- Check Network tab for webhook call

### 2. Test Land Management
- Create a land in UI
- Check if POST request is sent
- Verify data is saved in backend
- Refresh page to see if data persists

### 3. Error Handling
- Disconnect internet
- Try creating a land
- Should show error message
- Data should be queued for retry (implement offline support)

---

## 📦 Recommended Packages

Already installed:
- `@tanstack/react-query` - Data fetching & caching
- `zustand` - State management

To add:
```bash
npm install axios          # HTTP client
npm install react-toastify # Toast notifications
npm install swr            # Alternative to react-query
```

---

## 🚀 Deployment Checklist

- [ ] Update `VITE_API_BASE_URL` in production `.env`
- [ ] Update `VITE_N8N_WEBHOOK_URL` for production
- [ ] Add CORS configuration in backend for frontend domain
- [ ] Test all API endpoints with production URLs
- [ ] Implement error boundaries for API failures
- [ ] Add loading states for all async operations
- [ ] Add retry logic for failed requests
- [ ] Implement token refresh mechanism

---

## 📞 Support

For backend integration questions, contact the backend team with:
1. The specific API endpoint needed
2. Expected request/response format from this document
3. The frontend component that will consume it
