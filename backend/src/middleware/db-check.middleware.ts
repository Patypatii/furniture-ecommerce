import { Request, Response, NextFunction } from 'express';
import { isDatabaseConnected } from '../config/database';
import { logger } from '../utils/logger';

/**
 * Middleware to check database connection before processing request
 * Returns 503 if database is not connected
 */
export const requireDatabase = (req: Request, res: Response, next: NextFunction) => {
    if (!isDatabaseConnected()) {
        logger.warn(`⚠️ Database unavailable - Request blocked: ${req.method} ${req.path}`);
        return res.status(503).json({
            success: false,
            error: 'Database temporarily unavailable. Please try again in a few moments.',
            message: 'We are experiencing connectivity issues. Please refresh the page or try again later.',
        });
    }
    next();
};

/**
 * Wrap async route handlers with database check and error handling
 */
export const withDatabase = (handler: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Check database connection first
        if (!isDatabaseConnected()) {
            logger.warn(`⚠️ Database unavailable - Request blocked: ${req.method} ${req.path}`);
            return res.status(503).json({
                success: false,
                error: 'Database temporarily unavailable',
                message: 'Please try again in a few moments.',
            });
        }

        // Execute handler
        try {
            await handler(req, res, next);
        } catch (error) {
            next(error);
        }
    };
};




