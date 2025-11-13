import { Router } from 'express';
import multer from 'multer';
import { uploadImage } from '../controllers/upload.controller';
import { protect, requireAdminAccess } from '../middleware/auth.middleware';

const router = Router();

// Configure multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept only image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    },
});

/**
 * @route   POST /api/v1/upload/image
 * @desc    Upload an image to ImageKit
 * @access  Admin only
 */
router.post('/image', protect, requireAdminAccess, upload.single('image'), uploadImage);

export default router;

