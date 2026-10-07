import { Router } from 'express';
import { getDashboardStats } from '../controllers/admin.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/dashboard/stats', authenticate, authorize('ADMIN', 'STAFF'), getDashboardStats);

export default router;
