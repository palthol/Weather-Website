import { Router } from 'express';
import weatherRoutes from './api/index.js';
import htmlRoutes from './htmlRoutes.js';

const router = Router();


router.use('/api', weatherRoutes);
router.use('/', htmlRoutes);

export default router;
