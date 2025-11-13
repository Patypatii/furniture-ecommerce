import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

// @desc    Get all users (Admin only)
// @route   GET /api/v1/users
// @access  Private/Admin
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { role, search, page = 1, limit = 50 } = req.query;

        // Build query
        const query: any = {};

        if (role) {
            query.role = role;
        }

        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        // Execute query
        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))
            .lean();

        const total = await User.countDocuments(query);

        res.status(200).json({
            success: true,
            count: users.length,
            total,
            data: users,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single user
// @route   GET /api/v1/users/:id
// @access  Private/Admin
export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return next(new AppError('User not found', 404));
        }

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        }).select('-password');

        if (!user) {
            return next(new AppError('User not found', 404));
        }

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return next(new AppError('User not found', 404));
        }

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Add address to user profile
// @route   POST /api/v1/users/addresses
// @access  Private
export const addAddress = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.user!._id);

        if (!user) {
            return next(new AppError('User not found', 404));
        }

        // If set as default, remove default from others
        if (req.body.isDefault) {
            user.addresses.forEach(addr => {
                addr.isDefault = false;
            });
        }

        // Let MongoDB auto-generate _id (as ObjectId)
        user.addresses.push(req.body);
        await user.save();

        res.status(200).json({
            success: true,
            data: user.addresses,
            message: 'Address added successfully',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update address
// @route   PUT /api/v1/users/addresses/:addressId
// @access  Private
export const updateAddress = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.user!._id);

        if (!user) {
            return next(new AppError('User not found', 404));
        }

        const addressIndex = user.addresses.findIndex(addr => addr._id?.toString() === req.params.addressId);

        if (addressIndex === -1) {
            return next(new AppError('Address not found', 404));
        }

        // If set as default, remove default from others
        if (req.body.isDefault) {
            user.addresses.forEach((addr, idx) => {
                if (idx !== addressIndex) {
                    addr.isDefault = false;
                }
            });
        }

        // Update the address fields
        Object.assign(user.addresses[addressIndex], req.body);

        await user.save();

        res.status(200).json({
            success: true,
            data: user.addresses,
            message: 'Address updated successfully',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete address
// @route   DELETE /api/v1/users/addresses/:addressId
// @access  Private
export const deleteAddress = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.user!._id);

        if (!user) {
            return next(new AppError('User not found', 404));
        }

        user.addresses = user.addresses.filter(addr => addr._id?.toString() !== req.params.addressId);
        await user.save();

        res.status(200).json({
            success: true,
            data: user.addresses,
            message: 'Address deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

