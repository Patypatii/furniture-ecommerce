import express from 'express';
import {
    createOrder,
    getMyOrders,
    getOrder,
    cancelOrder,
    getAllOrders,
    updateOrderStatus,
    updatePaymentStatus,
    addAdminNote,
} from '../controllers/order.controller';
import { protect, requireAdminAccess, checkPermission } from '../middleware/auth.middleware';
import { Permission } from '../config/permissions';

const router = express.Router();

// Customer routes
router.post('/', protect, createOrder);
router.get('/', protect, getMyOrders);
router.get('/:id', protect, getOrder);
router.put('/:id/cancel', protect, checkPermission(Permission.CANCEL_ORDER), cancelOrder);

// Admin routes
router.get('/all/orders', protect, requireAdminAccess, checkPermission(Permission.VIEW_ALL_ORDERS), getAllOrders);
router.put('/:id/status', protect, requireAdminAccess, checkPermission(Permission.UPDATE_ORDER_STATUS), updateOrderStatus);
router.put('/:id/payment', protect, requireAdminAccess, checkPermission(Permission.PROCESS_REFUNDS), updatePaymentStatus);
router.post('/:id/notes', protect, requireAdminAccess, addAdminNote);

export default router;

