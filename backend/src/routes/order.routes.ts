import { Router } from 'express';
import { OrderController } from '../controllers/Order.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';

const router = Router();
const orderController = new OrderController();

router.post('/', authMiddleware, orderController.placeOrder);
router.get('/', authMiddleware, orderController.getMyOrders);
router.get('/all', authMiddleware, adminMiddleware, orderController.getAllOrders);

export default router;
