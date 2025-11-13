import { Response, NextFunction } from 'express';
import User from '../models/User';
import { AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

// @desc    Get all admins
// @route   GET /api/v1/admin/admins
// @access  Superadmin only
export const getAdmins = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const admins = await User.find({
            role: { $in: ['admin', 'superadmin'] }
        }).select('-password');

        res.status(200).json({
            success: true,
            count: admins.length,
            data: admins,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single admin
// @route   GET /api/v1/admin/admins/:id
// @access  Superadmin only
export const getAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const admin = await User.findOne({
            _id: req.params.id,
            role: { $in: ['admin', 'superadmin'] }
        }).select('-password');

        if (!admin) {
            return next(new AppError('Admin not found', 404));
        }

        res.status(200).json({
            success: true,
            data: admin,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new admin
// @route   POST /api/v1/admin/admins
// @access  Superadmin only
export const createAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { email, password, firstName, lastName, phone, role } = req.body;

        // Validate role
        if (!['admin', 'superadmin'].includes(role)) {
            return next(new AppError('Invalid role. Must be admin or superadmin', 400));
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new AppError('Email already registered', 400));
        }

        // Create admin user
        const admin = await User.create({
            email,
            password,
            firstName,
            lastName,
            phone,
            role,
            isEmailVerified: true, // Auto-verify admin emails
        });

        // Remove password from output
        const adminObj = admin.toObject() as any;
        delete adminObj.password;

        res.status(201).json({
            success: true,
            data: adminObj,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update admin
// @route   PUT /api/v1/admin/admins/:id
// @access  Superadmin only
export const updateAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { firstName, lastName, phone, role, isActive } = req.body;

        // Prevent self-demotion or deactivation
        if (req.params.id === (req.user!._id as any).toString()) {
            if (role === 'customer' || isActive === false) {
                return next(new AppError('Cannot demote or deactivate your own account', 400));
            }
        }

        // Validate role if provided
        if (role && !['admin', 'superadmin', 'customer'].includes(role)) {
            return next(new AppError('Invalid role', 400));
        }

        const admin = await User.findByIdAndUpdate(
            req.params.id,
            { firstName, lastName, phone, role, isActive },
            { new: true, runValidators: true }
        ).select('-password');

        if (!admin) {
            return next(new AppError('Admin not found', 404));
        }

        res.status(200).json({
            success: true,
            data: admin,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete admin
// @route   DELETE /api/v1/admin/admins/:id
// @access  Superadmin only
export const deleteAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        // Prevent self-deletion
        if (req.params.id === (req.user!._id as any).toString()) {
            return next(new AppError('Cannot delete your own account', 400));
        }

        const admin = await User.findByIdAndDelete(req.params.id);

        if (!admin) {
            return next(new AppError('Admin not found', 404));
        }

        res.status(200).json({
            success: true,
            message: 'Admin deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get admin stats
// @route   GET /api/v1/admin/stats
// @access  Superadmin only
export const getAdminStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const [totalAdmins, totalSuperadmins, activeAdmins] = await Promise.all([
            User.countDocuments({ role: 'admin' }),
            User.countDocuments({ role: 'superadmin' }),
            User.countDocuments({ role: { $in: ['admin', 'superadmin'] }, isActive: true }),
        ]);

        const stats = {
            totalAdmins,
            totalSuperadmins,
            activeAdmins,
            totalAdminUsers: totalAdmins + totalSuperadmins,
        };

        res.status(200).json({
            success: true,
            data: stats,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Change admin password (Superadmin can change any admin's password)
// @route   PUT /api/v1/admin/admins/:id/password
// @access  Superadmin only
export const changeAdminPassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { newPassword } = req.body;

        if (!newPassword || newPassword.length < 8) {
            return next(new AppError('Password must be at least 8 characters', 400));
        }

        const admin = await User.findOne({
            _id: req.params.id,
            role: { $in: ['admin', 'superadmin'] }
        });

        if (!admin) {
            return next(new AppError('Admin not found', 404));
        }

        admin.password = newPassword;
        await admin.save();

        res.status(200).json({
            success: true,
            message: 'Password updated successfully',
        });
    } catch (error) {
        next(error);
    }
};

