import { Request, Response } from 'express';
import { uploadImage as uploadToImageKit } from '../config/imagekit';
import { logger } from '../utils/logger';

/**
 * Upload image to ImageKit
 * @route POST /api/v1/upload/image
 * @access Admin only
 */
export const uploadImage = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({
                success: false,
                error: 'No image file provided',
            });
            return;
        }

        // Convert buffer to base64 string for ImageKit
        const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        
        // Generate filename
        const timestamp = Date.now();
        const originalName = req.file.originalname.replace(/\s+/g, '-').toLowerCase();
        const fileName = `${timestamp}-${originalName}`;

        // Determine folder from query param or default to 'products'
        const folder = (req.query.folder as string) || 'products';

        // Upload to ImageKit
        const result = await uploadToImageKit(fileBase64, fileName, folder);

        logger.info(`Image uploaded successfully: ${fileName}`);

        res.status(200).json({
            success: true,
            data: {
                url: result.url,
                fileId: result.fileId,
                fileName: fileName,
            },
            message: 'Image uploaded successfully',
        });
    } catch (error: any) {
        logger.error('Image upload error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to upload image',
        });
    }
};




