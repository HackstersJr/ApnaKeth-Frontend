# 🌾 ApnaKeth Frontend

**Smart Agriculture Platform - Frontend Application**

> A modern, responsive web application for farmers to visualize, manage, and monitor their agricultural lands using AI-powered insights, satellite data, and interactive mapping.

---

## 📋 Table of Contents

1. [Overview](#-overview)
2. [Tech Stack](#-tech-stack)
3. [Project Structure](#-project-structure)
4. [Getting Started](#-getting-started)
5. [Features](#-features)
6. [File Structure Explained](#-file-structure-explained)
7. [Backend Integration](#-backend-integration)
8. [Environment Variables](#-environment-variables)
9. [Development Guidelines](#-development-guidelines)
10. [Deployment](#-deployment)

---

## 🎯 Overview

ApnaKeth is an intelligent agricultural management system that helps farmers:
- **Visualize** their land plots on interactive maps
- **Monitor** crop health using NDVI satellite imagery
- **Analyze** soil conditions and weather patterns
- **Get** AI-powered recommendations for irrigation, fertilizers, and harvesting
- **Manage** multiple land parcels and crop partitions
- **Chat** with an AI assistant in Hindi/English for farming guidance

### Target Users
- Small to medium-scale farmers
- Agricultural consultants
- Farm managers
- AgriTech researchers

---

## 🛠 Tech Stack

### Core Technologies
- **React 18.3** - UI library with hooks
- **TypeScript** - Type-safe development
- **Vite 7.1** - Fast build tool and dev server
- **React Router 7.8** - Client-side routing

### UI & Styling
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **clsx** - Conditional class name utility

### State Management
- **Zustand 5.0** - Lightweight state management
- **React Query (@tanstack)** - Server state management & caching

### Mapping & Visualization
- **Leaflet 1.9** - Interactive maps
- **React Leaflet 5.0** - React bindings for Leaflet
- **Recharts 3.1** - Data visualization charts

### Special Features
- **OGL 1.0** - WebGL graphics for animated AI orb
- **Math.js 15.0** - Advanced blur calculations
- **@n8n/chat** - N8N integration for AI chat

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - Browser compatibility

---

## 📁 Project Structure

```
ApnaKeth/frontend/
│
├── public/                          # Static assets
│
├── src/                             # Source code
│   ├── components/                  # Reusable UI components
│   │   ├── AIChat.tsx              # Original voice-based AI chat (alternative)
│   │   ├── ArivStyleChat.tsx       # ⭐ Main AI chat component (active)
│   │   ├── Button.tsx              # Reusable button component
│   │   ├── Card.tsx                # Card container component
│   │   ├── GradualBlur.tsx         # Animated blur effect component
│   │   ├── Header.tsx              # App header with navigation
│   │   ├── Input.tsx               # Form input component
│   │   ├── LandDetailsModal.tsx    # Modal for editing land/partition details
│   │   ├── MapComponent.tsx        # Basic map component
│   │   ├── MiniOrb.tsx             # ⭐ Animated WebGL orb for AI button
│   │   ├── OnboardingMapComponent.tsx  # ⭐ Advanced map with drawing capabilities
│   │   ├── Orb.tsx                 # Full-size animated orb (alternative)
│   │   └── ScrollArea.tsx          # Custom scrollable area
│   │
│   ├── pages/                       # Page components (screens)
│   │   ├── OnboardingFlow.tsx      # ⭐ Main onboarding & dashboard page
│   │   ├── LandsScreen.tsx         # View all lands (future)
│   │   ├── LandDetailsScreen.tsx   # Detailed land analytics (future)
│   │   └── MapScreen.tsx           # Standalone map view (future)
│   │
│   ├── store/                       # Global state management
│   │   └── useAppStore.ts          # ⭐ Zustand store for app state
│   │
│   ├── data/                        # Mock data (replace with API calls)
│   │   ├── lands.json              # Sample land data
│   │   ├── recommendations.json    # AI recommendations
│   │   ├── soil.json               # Soil analysis data
│   │   └── weather.json            # Weather forecast data
│   │
│   ├── utils/                       # Utility functions
│   │   └── speechToText.ts         # Voice recognition utility
│   │
│   ├── App.tsx                      # ⭐ Main app component with routing
│   ├── main.tsx                     # React entry point
│   ├── index.css                    # Global styles + Tailwind imports
│   └── vite-env.d.ts               # Vite TypeScript definitions
│
├── .env.example                     # Environment variables template
├── BACKEND_INTEGRATION.md           # ⭐ Backend API documentation
├── package.json                     # Dependencies and scripts
├── tailwind.config.js               # Tailwind configuration
├── tsconfig.json                    # TypeScript configuration
├── vite.config.ts                   # Vite build configuration
└── README.md                        # This file

⭐ = Critical files for understanding the app
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ and npm/yarn
- **Git**
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/apnaketh.git
   cd apnaketh/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

### Available Scripts

```bash
npm run dev      # Start development server (Vite)
npm run build    # Build for production
npm run preview  # Preview production build locally
npm run lint     # Run ESLint for code quality
```

---

## ✨ Features

### 1. **Interactive Onboarding Flow**
- 📍 **Step 1: Location Selection** - Click map or use GPS
- 🌾 **Step 2: Land Drawing** - Draw land boundaries using polygon tool
- ✂️ **Step 3: Partitioning** - Divide lands into crop sections
- 📊 **Step 4: Dashboard** - View all data and analytics

**Implementation:** `src/pages/OnboardingFlow.tsx` + `src/components/OnboardingMapComponent.tsx`

### 2. **AI Chat Assistant** 🤖
- Bottom-centered horizontal chat bar
- Animated WebGL orb button
- Gradual blur backdrop effect
- Bilingual support (Hindi/English)
- Context-aware responses based on current page
- Navigation commands from AI responses

**Implementation:** `src/components/ArivStyleChat.tsx`

**Orb Animation:** `src/components/MiniOrb.tsx` (WebGL using OGL)

**Blur Effect:** `src/components/GradualBlur.tsx`

### 3. **Advanced Mapping** 🗺️
- OpenStreetMap tiles via Leaflet
- Draw polygons for land boundaries
- Click-to-add points, double-click to finish
- Validation for partition placement (must be inside land)
- Auto-zoom to selected land during partitioning
- Visual feedback with colored polygons
- Hover effects and popups

**Implementation:** `src/components/OnboardingMapComponent.tsx`

### 4. **Land & Partition Management**
- Create multiple lands
- Add partitions within lands
- Edit details: crop type, planting dates, irrigation, fertilizers
- Area calculation (mock - needs real geospatial calculation)
- Visual selection and highlighting

**State Management:** `src/store/useAppStore.ts`

**Details Modal:** `src/components/LandDetailsModal.tsx`

### 5. **Data Visualization** (Future)
- Crop health charts (NDVI)
- Weather forecasts
- Soil analysis graphs
- Recommendation cards

**Mock Data:** `src/data/*.json`

---

## 🔍 File Structure Explained

### 🎨 **Components** (`src/components/`)

| File | Purpose | Key Features |
|------|---------|--------------|
| `ArivStyleChat.tsx` | Main AI chat interface | N8N webhook integration, command parsing, animated UI |
| `MiniOrb.tsx` | Animated AI button | WebGL rendering, hover effects, smooth transitions |
| `GradualBlur.tsx` | Backdrop blur effect | Exponential blur curves, Bezier easing, customizable |
| `OnboardingMapComponent.tsx` | Advanced map with drawing | Polygon drawing, validation, auto-zoom, visual feedback |
| `LandDetailsModal.tsx` | Edit land/partition info | Form with crop, irrigation, dates, fertilizers |
| `Button.tsx` | Reusable button | 5 variants (primary, secondary, outline, ghost, danger) |
| `Input.tsx` | Form input field | Controlled component with error states |
| `Card.tsx` | Container component | Glassmorphic design with variants |
| `Header.tsx` | App navigation | Logo, user profile, navigation links |
| `MapComponent.tsx` | Basic map | Simple location selection (alternative to OnboardingMap) |
| `AIChat.tsx` | Voice-based chat | Alternative chat UI (currently not used) |
| `Orb.tsx` | Full-size orb | Alternative to MiniOrb (currently not used) |
| `ScrollArea.tsx` | Custom scroll | Styled scrollable container |

### 📄 **Pages** (`src/pages/`)

| File | Route | Purpose | Status |
|------|-------|---------|--------|
| `OnboardingFlow.tsx` | `/` | Main app page with onboarding + dashboard | ✅ Active |
| `LandsScreen.tsx` | `/lands` | View all lands | 🔨 Future |
| `LandDetailsScreen.tsx` | `/land-details` | Detailed analytics | 🔨 Future |
| `MapScreen.tsx` | `/map` | Standalone map | 🔨 Future |

### 🔧 **Store** (`src/store/`)

**`useAppStore.ts`** - Zustand global state:

**State:**
- `currentStep` - Onboarding step tracker
- `userLocation` - Selected GPS coordinates
- `ownedLands` - Array of land objects
- `partitions` - Array of partition objects
- `selectedLandId` / `selectedPartitionId` - Current selection
- `isDrawingLand` / `isDrawingPartition` - UI state flags

**Actions:**
- `setCurrentStep()` - Navigate onboarding
- `setUserLocation()` - Update location
- `addLand()` / `updateLand()` / `removeLand()` - Land CRUD
- `addPartition()` / `updatePartition()` / `removePartition()` - Partition CRUD
- `setSelectedLand()` / `setSelectedPartition()` - Selection management
- `setIsDrawingLand()` / `setIsDrawingPartition()` - Toggle drawing mode

**🔄 Migration to Backend:**
Replace action implementations to call APIs instead of local state updates. See `BACKEND_INTEGRATION.md`.

### 📊 **Data** (`src/data/`)

**Mock JSON files** - Replace with API calls:

- `lands.json` - Sample land data structure
- `weather.json` - Weather forecast example
- `soil.json` - Soil analysis data
- `recommendations.json` - AI recommendations

**⚠️ Important:** These are for development only. Production should fetch from backend APIs.

---

## 🔌 Backend Integration

### Current Status: **Mock Data Mode** 🟡

The frontend currently works with:
1. **Local state** (Zustand) for land/partition management
2. **Mock JSON files** for weather, soil, recommendations
3. **N8N webhook** for AI chat (partially integrated)

### What's Ready for Backend:

✅ **AI Chat**
- Endpoint: `POST https://n8n.pipfactor.com/webhook/apnaketh`
- Fallback: `POST /api/ai/chat`
- File: `src/components/ArivStyleChat.tsx` (Line 153-230)

✅ **State Structure**
- Land/partition data models defined
- CRUD actions ready in Zustand store
- Components consume from store

✅ **Environment Setup**
- `.env.example` with all variables
- Vite configured for env variables

### What Needs Backend Integration:

🔨 **Land Management APIs**
- `GET /api/lands` - Fetch all lands
- `POST /api/lands` - Create land
- `PUT /api/lands/:id` - Update land
- `DELETE /api/lands/:id` - Delete land

🔨 **Satellite Data APIs**
- `GET /api/satellite/ndvi` - NDVI crop health
- `GET /api/satellite/soil` - Soil analysis

🔨 **Weather API**
- `GET /api/weather` - Current + forecast

🔨 **Authentication**
- `POST /api/auth/login`
- `POST /api/auth/register`
- Token-based JWT auth

### 📖 Full Integration Guide

See **`BACKEND_INTEGRATION.md`** for:
- Complete API endpoint specifications
- Request/response formats
- Code examples for API integration
- Migration steps from mock to real data
- Testing guidelines

---

## 🌍 Environment Variables

### Required Variables

Create `.env` file:

```env
# N8N Webhook for AI Chat
VITE_N8N_WEBHOOK_URL=https://n8n.pipfactor.com/webhook/apnaketh

# Backend API (when available)
VITE_API_BASE_URL=http://localhost:3000/api
```

### Optional Variables

```env
# Google Maps (for advanced features)
VITE_GOOGLE_MAPS_API_KEY=your_key

# OpenWeather (for real-time weather)
VITE_OPENWEATHER_API_KEY=your_key

# Sentry (error tracking)
VITE_SENTRY_DSN=your_dsn
```

### Accessing in Code

```typescript
const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
```

---

## 🎨 Development Guidelines

### Code Style

- **TypeScript** for all files (prefer interfaces over types)
- **Functional components** with hooks (no class components)
- **Tailwind CSS** for styling (avoid inline styles except dynamic values)
- **Named exports** for components
- **PascalCase** for components, **camelCase** for functions

### Component Structure

```typescript
import React from 'react';
import { Icon } from 'lucide-react';

interface MyComponentProps {
  title: string;
  onClick?: () => void;
}

export function MyComponent({ title, onClick }: MyComponentProps) {
  return (
    <div className="p-4 bg-white rounded-lg">
      <h2>{title}</h2>
      {onClick && <button onClick={onClick}>Click</button>}
    </div>
  );
}
```

### State Management Rules

1. **Local state** (`useState`) - Component-specific UI state
2. **Zustand store** - Shared app state (lands, partitions, location)
3. **React Query** - Server state (API data, caching)

### Adding New Features

1. Create component in `src/components/`
2. Add route in `src/App.tsx` if needed
3. Update Zustand store if state is needed
4. Add to this README under "Features"
5. Document API requirements in `BACKEND_INTEGRATION.md`

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

Output: `dist/` folder

### Preview Production Build

```bash
npm run preview
```

### Environment Setup

1. **Production `.env`:**
   ```env
   VITE_N8N_WEBHOOK_URL=https://production-n8n.com/webhook/apnaketh
   VITE_API_BASE_URL=https://api.apnaketh.com/api
   ```

2. **Build with production env:**
   ```bash
   npm run build
   ```

3. **Deploy `dist/` folder to:**
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - Azure Static Web Apps
   - GitHub Pages

### Deployment Checklist

- [ ] Update `.env` with production URLs
- [ ] Test API endpoints from production domain
- [ ] Enable CORS on backend for frontend domain
- [ ] Configure CDN for static assets
- [ ] Set up SSL certificate (HTTPS)
- [ ] Add error tracking (Sentry)
- [ ] Configure analytics (Google Analytics, Mixpanel)
- [ ] Test on mobile devices
- [ ] Optimize images and assets
- [ ] Set up CI/CD pipeline (GitHub Actions)

---

## 📊 Project Status

| Feature | Status | Notes |
|---------|--------|-------|
| Onboarding Flow | ✅ Complete | All 4 steps working |
| Land Drawing | ✅ Complete | Polygon tool functional |
| Partition System | ✅ Complete | Validation included |
| AI Chat | ✅ Complete | N8N integration done |
| Animated Orb | ✅ Complete | WebGL with smooth animations |
| Gradual Blur | ✅ Complete | Multi-layer with green tint |
| Backend APIs | 🔨 In Progress | See BACKEND_INTEGRATION.md |
| NDVI Analysis | ⏳ Planned | Satellite data needed |
| Weather Integration | ⏳ Planned | Real API needed |
| Authentication | ⏳ Planned | JWT-based |
| Mobile App | ⏳ Future | React Native |

---

## 📞 Support & Contact

- **Issues**: GitHub Issues
- **Documentation**: See `BACKEND_INTEGRATION.md`
- **Team**: Team Hacksters

---

**Last Updated:** October 19, 2025  
**Version:** 1.0.0  
**Built with ❤️ for farmers and agritech innovation**
