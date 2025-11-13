import express from 'express';
import {
    getAdmins,
    getAdmin,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    getAdminStats,
    changeAdminPassword,
} from '../controllers/admin.controller';
import { protect, requireSuperAdmin } from '../middleware/auth.middleware';

const router = express.Router();

// All routes require superadmin authentication
router.use(protect);
router.use(requireSuperAdmin);

// Admin management routes
router.route('/admins')
    .get(getAdmins)
    .post(createAdmin);

router.route('/admins/:id')
    .get(getAdmin)
    .put(updateAdmin)
    .delete(deleteAdmin);

router.put('/admins/:id/password', changeAdminPassword);
router.get('/stats', getAdminStats);

export default router;

