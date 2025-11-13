import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

// Generate JWT Token
const generateToken = (id: string): string => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: process.env.JWT_EXPIRE || '7d',
    } as jwt.SignOptions);
};

// Generate Refresh Token
const generateRefreshToken = (id: string): string => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET as string, {
        expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d',
    } as jwt.SignOptions);
};

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, firstName, lastName, phone } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new AppError('Email already registered', 400));
        }

        // Create user
        const user = await User.create({
            email,
            password,
            firstName,
            lastName,
            phone,
        });

        // Generate tokens
        const token = generateToken((user._id as any).toString());
        const refreshToken = generateRefreshToken((user._id as any).toString());

        // Remove password from output
        const userObj = user.toObject() as any;
        delete userObj.password;

        res.status(201).json({
            success: true,
            data: {
                user: userObj,
                token,
                refreshToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return next(new AppError('Please provide email and password', 400));
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return next(new AppError('Invalid credentials', 401));
        }

        // Check if user is active
        if (!user.isActive) {
            return next(new AppError('Account is deactivated', 401));
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return next(new AppError('Invalid credentials', 401));
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate tokens
        const token = generateToken((user._id as any).toString());
        const refreshToken = generateRefreshToken((user._id as any).toString());

        // Remove password from output
        const userObj = user.toObject() as any;
        delete userObj.password;

        res.status(200).json({
            success: true,
            data: {
                user: userObj,
                token,
                refreshToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get current user
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.user!._id);

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user profile
// @route   PUT /api/v1/auth/update-profile
// @access  Private
export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { firstName, lastName, phone, avatar } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user!._id,
            { firstName, lastName, phone, avatar },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Change password
// @route   PUT /api/v1/auth/change-password
// @access  Private
export const changePassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user!._id).select('+password');
        if (!user) {
            return next(new AppError('User not found', 404));
        }

        // Check current password
        const isPasswordValid = await user.comparePassword(currentPassword);
        if (!isPasswordValid) {
            return next(new AppError('Current password is incorrect', 401));
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password updated successfully',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Refresh token
// @route   POST /api/v1/auth/refresh-token
// @access  Public
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refreshToken: token } = req.body;

        if (!token) {
            return next(new AppError('Refresh token is required', 400));
        }

        // Verify refresh token
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { id: string };

        // Check if user exists
        const user = await User.findById(decoded.id);
        if (!user || !user.isActive) {
            return next(new AppError('Invalid token', 401));
        }

        // Generate new tokens
        const newToken = generateToken((user._id as any).toString());
        const newRefreshToken = generateRefreshToken((user._id as any).toString());

        res.status(200).json({
            success: true,
            data: {
                token: newToken,
                refreshToken: newRefreshToken,
            },
        });
    } catch (error) {
        next(new AppError('Invalid or expired refresh token', 401));
    }
};

