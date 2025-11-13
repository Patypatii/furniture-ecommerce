import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyCoupon,
} from '../controllers/cart.controller';
import { optionalAuth } from '../middleware/auth.middleware';

const router = express.Router();

// All cart routes support both authenticated and guest users
router.use(optionalAuth);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update', updateCartItem);
router.delete('/remove/:productId', removeFromCart);
router.delete('/clear', clearCart);
router.post('/coupon', applyCoupon);

export default router;

