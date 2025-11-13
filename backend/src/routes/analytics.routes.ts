import express from 'express';
import {
    getDashboardStats,
    getSalesData,
    getTopProducts,
    getRecentOrders,
} from '../controllers/analytics.controller';
import { protect, requireAdminAccess, checkPermission } from '../middleware/auth.middleware';
import { Permission } from '../config/permissions';

const router = express.Router();

// All routes require admin authentication
router.use(protect);
router.use(requireAdminAccess);

router.get('/dashboard', checkPermission(Permission.VIEW_ANALYTICS), getDashboardStats);
router.get('/sales', checkPermission(Permission.VIEW_SALES_REPORTS), getSalesData);
router.get('/top-products', checkPermission(Permission.VIEW_ANALYTICS), getTopProducts);
router.get('/recent-orders', checkPermission(Permission.VIEW_ALL_ORDERS), getRecentOrders);

export default router;

