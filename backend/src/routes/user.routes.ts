import express from 'express';
import {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    addAddress,
    updateAddress,
    deleteAddress,
} from '../controllers/user.controller';
import { protect, requireAdminAccess, checkPermission } from '../middleware/auth.middleware';
import { Permission } from '../config/permissions';

const router = express.Router();

// Customer self-service routes (must be before admin-only routes)
router.post('/addresses', protect, addAddress);
router.put('/addresses/:addressId', protect, updateAddress);
router.delete('/addresses/:addressId', protect, deleteAddress);

// Admin-only routes
router.use(protect);
router.use(requireAdminAccess);

// Customer management routes with permission checks
router.get('/', checkPermission(Permission.VIEW_ALL_CUSTOMERS), getUsers);
router.get('/:id', checkPermission(Permission.VIEW_ALL_CUSTOMERS), getUser);
router.put('/:id', checkPermission(Permission.UPDATE_CUSTOMER_INFO), updateUser);
router.delete('/:id', checkPermission(Permission.DELETE_CUSTOMER), deleteUser);

export default router;

