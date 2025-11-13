import ImageKit from 'imagekit';
import { logger } from '../utils/logger';
import { config } from './environment';

// Initialize ImageKit
const imagekit = new ImageKit({
    publicKey: config.imagekit.publicKey,
    privateKey: config.imagekit.privateKey,
    urlEndpoint: config.imagekit.urlEndpoint,
});

// Verify configuration
const isConfigured = !!(
    config.imagekit.publicKey &&
    config.imagekit.privateKey &&
    config.imagekit.urlEndpoint
);

if (isConfigured) {
    logger.info('✅ ImageKit configured successfully');
} else {
    logger.warn('⚠️ ImageKit not configured. Image uploads will be disabled.');
}

/**
 * Upload image to ImageKit
 */
export const uploadImage = async (
    file: string | Buffer,
    fileName: string,
    folder: string = 'products'
): Promise<{ url: string; fileId: string }> => {
    try {
        const result = await imagekit.upload({
            file: file as string,
            fileName: fileName,
            folder: `/tangerine/${folder}`,
            useUniqueFileName: true
        });

        return {
            url: result.url,
            fileId: result.fileId,
        };
    } catch (error) {
        logger.error('ImageKit upload error:', error);
        throw new Error('Failed to upload image');
    }
};

/**
 * Upload 3D model to ImageKit
 */
export const upload3DModel = async (
    file: string,
    fileName: string,
    folder: string = '3d-models'
): Promise<{ url: string; fileId: string }> => {
    try {
        const result = await imagekit.upload({
            file: file,
            fileName: fileName,
            folder: `/tangerine/${folder}`,
            useUniqueFileName: true,
        });

        return {
            url: result.url,
            fileId: result.fileId,
        };
    } catch (error) {
        logger.error('ImageKit 3D model upload error:', error);
        throw new Error('Failed to upload 3D model');
    }
};

/**
 * Delete file from ImageKit
 */
export const deleteFile = async (fileId: string): Promise<boolean> => {
    try {
        await imagekit.deleteFile(fileId);
        return true;
    } catch (error) {
        logger.error('ImageKit delete error:', error);
        return false;
    }
};

/**
 * Generate optimized image URL
 */
export const getOptimizedImageUrl = (
    filePath: string,
    width: number = 800,
    height: number = 800,
    quality: number = 80
): string => {
    return imagekit.url({
        path: filePath,
        transformation: [{
            width,
            height,
            cropMode: 'maintain_ratio',
            quality
        }]
    });
};

/**
 * Get image details
 */
export const getImageDetails = async (fileId: string) => {
    try {
        return await imagekit.getFileDetails(fileId);
    } catch (error) {
        logger.error('ImageKit get details error:', error);
        throw new Error('Failed to get image details');
    }
};

/**
 * Get ImageKit URL with transformations
 */
export const getImageKitUrl = (
    imagePath: string,
    width?: number,
    height?: number,
    quality: number = 80
): string => {
    const baseUrl = `${config.imagekit.urlEndpoint}/tr`;

    let transformations = '';

    if (width || height) {
        const params = [];
        if (width) params.push(`w-${width}`);
        if (height) params.push(`h-${height}`);
        params.push('c-maintain_ratio');
        params.push(`q-${quality}`);

        transformations = `:${params.join(',')}`;
    }

    return `${baseUrl}${transformations}${imagePath}`;
};

/**
 * Get category image URL
 */
export const getCategoryImageUrl = (categorySlug: string): string => {
    const categoryImages: any = {
        'living-room': '/tangerine/categories/living-room-category-scaled-qkja4tj10g8b6d9boyucdr5m2rg0w40p5781kag3xw.jpg',
        'bedroom': '/tangerine/categories/bedroom-categories-scaled-qkr2tbqbg6jcbtwfh720uf14f5mfhb7fduyloae9kk.jpg',
        'dining': '/tangerine/categories/dining-category-scaled-qkjbggyhh3glqq1kg2cha89u6ykw3q6u11t6e9smic.jpg',
        'office': '/tangerine/categories/office.jpg',
        'outdoor': '/tangerine/categories/outdoor.jpg',
        'storage': '/tangerine/categories/storage.jpg',
    };

    const imagePath = categoryImages[categorySlug] || categoryImages['living-room'];
    return getImageKitUrl(imagePath, 800, 600);
};

export default imagekit;

