import { Router } from 'express';
import {
  createOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
} from '../controllers/order.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { orderLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

router.post('/', orderLimiter, createOrder); // Allow guest orders
router.get('/my/orders', authenticate, getMyOrders);
router.get('/:id', getOrderById); // Allow guest order lookup by order number
router.get('/', authenticate, authorize('ADMIN', 'STAFF'), getAllOrders);
router.patch('/:id/status', authenticate, authorize('ADMIN', 'STAFF'), updateOrderStatus);

export default router;
