import { Router } from 'express';
import { OrderController } from '../controllers/Order.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';

const router = Router();
const orderController = new OrderController();

// POST /api/orders  — create order + get razorpay order id
router.post('/', authMiddleware, orderController.createOrder);

// POST /api/orders/verify-payment  — verify razorpay payment
router.post('/verify-payment', authMiddleware, orderController.verifyPayment);

// GET /api/orders  — user's own orders
router.get('/', authMiddleware, orderController.getMyOrders);

// GET /api/orders/all  — admin: all orders
router.get('/all', authMiddleware, adminMiddleware, orderController.getAllOrders);

export default router;
