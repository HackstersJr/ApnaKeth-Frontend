# 🚀 Quick Start Guide - Backend Developers

## 🎯 What You Need to Know

This frontend is **production-ready** and waiting for backend APIs. Everything is set up for easy integration.

---

## 📡 APIs We're Calling

### 1. AI Chat (Already Working)
```javascript
// File: src/components/ArivStyleChat.tsx (Line 153)
POST https://n8n.pipfactor.com/webhook/apnaketh

Request:
{
  "query": "User's message",
  "sessionId": "session_1234567890",
  "timestamp": "2025-10-19T00:00:00.000Z",
  "context": {
    "page": "land-selection",
    "userType": "farmer",
    "app": "apnaketh"
  }
}

Expected Response:
{
  "text": "AI response text here"
}
```

### 2. Land Management (Needs Implementation)
```javascript
// These will replace Zustand local state
// File: src/store/useAppStore.ts

GET    /api/lands              // Fetch all user lands
POST   /api/lands              // Create new land
PUT    /api/lands/:id          // Update land details
DELETE /api/lands/:id          // Delete land

// Example Land Object:
{
  "id": "land-1729308000000",
  "name": "North Field",
  "coordinates": [
    { "lat": 28.6139, "lng": 77.2090 },
    { "lat": 28.6140, "lng": 77.2095 },
    { "lat": 28.6135, "lng": 77.2096 }
  ],
  "area": 5.23,
  "crop": "Wheat",
  "cropVariety": "HD-2967",
  "plantedDate": "2025-01-15",
  "expectedHarvestDate": "2025-04-20",
  "irrigationType": "drip",
  "fertilizers": "NPK 10:26:26",
  "pesticides": "Organic spray",
  "notes": "South-facing slope"
}
```

### 3. Partition Management (Needs Implementation)
```javascript
GET    /api/partitions                    // Get all partitions
POST   /api/lands/:landId/partitions      // Create partition
PUT    /api/partitions/:id                // Update partition
DELETE /api/partitions/:id                // Delete partition

// Example Partition Object:
{
  "id": "partition-1729308100000",
  "name": "Partition 1",
  "coordinates": [
    { "lat": 28.6137, "lng": 77.2091 },
    { "lat": 28.6138, "lng": 77.2093 }
  ],
  "parentLandId": "land-1729308000000",
  "crop": "Rice",
  ...similar fields as land
}
```

### 4. Satellite Data (Future)
```javascript
GET /api/satellite/ndvi?landId=land-123&date=2025-10-19
GET /api/satellite/soil?landId=land-123

// Mock data currently in: src/data/soil.json
```

### 5. Weather (Future)
```javascript
GET /api/weather?lat=28.6139&lng=77.2090

// Mock data currently in: src/data/weather.json
```

### 6. Recommendations (Future)
```javascript
GET /api/recommendations?landId=land-123

// Mock data currently in: src/data/recommendations.json
```

---

## 🔑 Authentication (Not Yet Implemented)

When you add auth, modify:

**1. Add token to API calls**
```typescript
// Create: src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

**2. Expected Auth Endpoints**
```javascript
POST /api/auth/login
{
  "email": "farmer@example.com",
  "password": "password123"
}
→ Returns: { "token": "jwt-token", "user": {...} }

POST /api/auth/register
{
  "name": "Ram Singh",
  "email": "ram@example.com",
  "password": "password123",
  "phone": "+91-9876543210"
}
→ Returns: { "token": "jwt-token", "user": {...} }

POST /api/auth/logout
Headers: { "Authorization": "Bearer jwt-token" }
→ Returns: { "success": true }
```

---

## 🔧 How to Integrate

### Option 1: Replace Zustand Actions (Recommended)

**Current (Mock Data):**
```typescript
// src/store/useAppStore.ts
addLand: (land) => set((state) => ({ 
  ownedLands: [...state.ownedLands, land] 
}))
```

**After (Real API):**
```typescript
// src/store/useAppStore.ts
addLand: async (land) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/lands`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify(land)
    });
    const data = await response.json();
    set((state) => ({ 
      ownedLands: [...state.ownedLands, data] 
    }));
  } catch (error) {
    console.error('Failed to add land:', error);
    // Handle error (show toast, etc.)
  }
}
```

### Option 2: Use React Query (Better)

```typescript
// src/hooks/useApi.ts
import { useQuery, useMutation } from '@tanstack/react-query';

export const useLands = () => {
  return useQuery({
    queryKey: ['lands'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/lands`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      return response.json();
    }
  });
};

export const useCreateLand = () => {
  return useMutation({
    mutationFn: async (land) => {
      const response = await fetch(`${API_BASE_URL}/api/lands`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(land)
      });
      return response.json();
    }
  });
};

// Then use in components:
// const { data: lands } = useLands();
// const createLand = useCreateLand();
```

---

## 📦 Mock Data to Replace

Remove these files once APIs are ready:

```
src/data/
├── lands.json              → GET /api/lands
├── weather.json            → GET /api/weather
├── soil.json              → GET /api/satellite/soil
└── recommendations.json    → GET /api/recommendations
```

---

## 🧪 Testing Your APIs

### 1. Set Environment Variable
```bash
# .env
VITE_API_BASE_URL=http://localhost:3000/api
```

### 2. Update API Calls
Replace hardcoded URLs with:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
```

### 3. Test with Frontend
```bash
npm run dev
# Open http://localhost:5173
# Create a land → Check Network tab for API call
```

### 4. CORS Configuration
Your backend needs:
```javascript
// Express.js example
app.use(cors({
  origin: ['http://localhost:5173', 'https://your-frontend-domain.com'],
  credentials: true
}));
```

---

## ⚠️ Important Notes

1. **All coordinates are `{ lat: number, lng: number }`** format
2. **Dates are ISO 8601** strings: `"2025-10-19T00:00:00.000Z"`
3. **Area is in acres** (number with 2 decimals)
4. **Irrigation types**: `"drip" | "sprinkler" | "flood" | "rainfed" | "other"`
5. **All API responses should be JSON** with proper `Content-Type` header
6. **Use JWT tokens** for authentication (Bearer scheme)
7. **Return proper HTTP status codes**: 200, 201, 400, 401, 404, 500

---

## 🐛 Common Issues

### Issue: CORS Error
**Solution:** Add CORS headers in backend

### Issue: 401 Unauthorized
**Solution:** Check if token is being sent in `Authorization` header

### Issue: Frontend not showing data
**Solution:** 
1. Check Network tab in browser DevTools
2. Verify response format matches expected structure
3. Check console for errors

---

## 📞 Need Help?

1. **Check**: `BACKEND_INTEGRATION.md` for detailed API specs
2. **Check**: `README.md` for frontend architecture
3. **Check**: Network tab in browser DevTools
4. **Contact**: Frontend team with specific error messages

---

## ✅ Integration Checklist

For each API endpoint:
- [ ] Endpoint implemented and tested
- [ ] CORS configured for frontend domain
- [ ] Authentication/Authorization working
- [ ] Response format matches documentation
- [ ] Error handling with proper status codes
- [ ] Tested with actual frontend
- [ ] Environment variables updated
- [ ] Documentation updated

---

**Quick Reference Created:** October 19, 2025  
**For:** Backend developers integrating with ApnaKeth frontend
