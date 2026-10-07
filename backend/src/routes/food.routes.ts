import { Router } from 'express';
import {
  getFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood
} from '../controllers/food.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getFoods);
router.get('/:id', getFoodById);
router.post('/', authenticate, authorize('ADMIN'), createFood);
router.put('/:id', authenticate, authorize('ADMIN'), updateFood);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteFood);

export default router;
