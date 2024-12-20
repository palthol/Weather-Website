import { Router } from 'express';
import weatherRoutes from './api/weatherRoutes.js'; // Weather-specific routes
import htmlRoutes from './htmlRoutes.js'; // Frontend routes

const router = Router();

// Mount API routes
router.use('/api/weather', weatherRoutes);

// Mount HTML routes
router.use('/', htmlRoutes);

export default router;
