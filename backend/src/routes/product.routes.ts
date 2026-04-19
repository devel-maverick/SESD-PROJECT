import { Router } from 'express';
import { ProductController } from '../controllers/Product.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';

const router = Router();
const productController = new ProductController();

// GET /api/products?search=&category=
router.get('/', productController.getAll);

// GET /api/products/:id
router.get('/:id', productController.getById);

// POST /api/products  (Admin only)
router.post('/', authMiddleware, adminMiddleware, productController.create);

// PUT /api/products/:id  (Admin only)
router.put('/:id', authMiddleware, adminMiddleware, productController.update);

// DELETE /api/products/:id  (Admin only)
router.delete('/:id', authMiddleware, adminMiddleware, productController.delete);

export default router;
