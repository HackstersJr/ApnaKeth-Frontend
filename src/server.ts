import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import aiRoutes from './routes/ai.routes';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/ai', aiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'ApnaKeth API', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'ApnaKeth - Smart AgriScout API',
    version: '1.0.0',
    description: 'AI-powered crop stress detection and intervention system',
    endpoints: {
      health: '/health',
      ai: '/api/ai/*'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🌾 ApnaKeth API server running on port ${PORT}`);
  console.log(`🚀 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Access at: http://localhost:${PORT}`);
});

export default app;
