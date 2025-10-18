import { Router } from 'express';
import AIController from '../controllers/ai.controller';

const router = Router();
const aiController = new AIController();

// Main AI chat endpoint
router.post('/chat', aiController.processAIRequest);

// Specific service endpoints
router.post('/crop/analyze', aiController.analyzeCrop);
router.post('/weather/forecast', aiController.getWeatherForecast);
router.post('/soil/analyze', aiController.analyzeSoil);
router.post('/interventions', aiController.getInterventions);

// Get available services
router.get('/services', aiController.getServices);

export default router;
