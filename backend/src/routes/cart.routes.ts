import { Router } from 'express';
import { CartController } from '../controllers/Cart.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const cartController = new CartController();

// GET /api/cart
router.get('/', authMiddleware, cartController.getCart);

// POST /api/cart/add
router.post('/add', authMiddleware, cartController.addToCart);

// DELETE /api/cart/remove/:productId
router.delete('/remove/:productId', authMiddleware, cartController.removeFromCart);

// PATCH /api/cart/quantity/:productId
router.patch('/quantity/:productId', authMiddleware, cartController.updateQuantity);

export default router;
