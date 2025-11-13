import express from 'express';
import {
    getProducts,
    getProduct,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getFeaturedProducts,
    getRelatedProducts,
} from '../controllers/product.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts); // Must be before /:slug to avoid conflict
router.get('/:id/related', getRelatedProducts); // Must be before /:slug to avoid conflict

// Get product by ID - Public (for cart validation)
router.get('/id/:id', getProductById);

router.get('/:slug', getProduct); // This catches product slugs

// Protected routes (Admin only)
router.post('/', protect, authorize('admin', 'superadmin'), createProduct);
router.put('/:id', protect, authorize('admin', 'superadmin'), updateProduct);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteProduct);

export default router;

