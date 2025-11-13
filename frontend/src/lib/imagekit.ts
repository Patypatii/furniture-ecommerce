// ImageKit configuration for frontend
export const imagekitConfig = {
    publicKey: 'public_JnMVJHBZmtnq4hpm/qxCfL4dux0=',
    urlEndpoint: 'https://ik.imagekit.io/87iepx52pd',
};

/**
 * Generate optimized image URL from ImageKit
 */
export function getImageKitUrl(
    imagePath: string,
    width?: number,
    height?: number,
    quality: number = 80
): string {
    const baseUrl = `${imagekitConfig.urlEndpoint}/tr`;

    let transformations = '';

    if (width || height) {
        const params = [];
        if (width) params.push(`w-${width}`);
        if (height) params.push(`h-${height}`);
        params.push('c-maintain_ratio');
        params.push(`q-${quality}`);

        transformations = `:${params.join(',')}`;
    }

    return `${baseUrl}${transformations}/${imagePath}`;
}

/**
 * Get hero background image URL
 */
export function getHeroBackgroundUrl(): string {
    return getImageKitUrl('/tangerine/hero/hero-bg.jpg', 1920, 1080);
}

/**
 * Get category image URL
 */
export function getCategoryImageUrl(categorySlug: string): string {
    const categoryImages: { [key: string]: string } = {
        'living-room': '/tangerine/categories/living-room-category-scaled-qkja4tj10g8b6d9boyucdr5m2rg0w40p5781kag3xw.jpg',
        'bedroom': '/tangerine/categories/bedroom-categories-scaled-qkr2tbqbg6jcbtwfh720uf14f5mfhb7fduyloae9kk.jpg',
        'dining': '/tangerine/categories/dining-category-scaled-qkjbggyhh3glqq1kg2cha89u6ykw3q6u11t6e9smic.jpg',
        'office': '/tangerine/categories/bedroom-categories-scaled-qkr2tbqbg6jcbtwfh720uf14f5mfhb7fduyloae9kk.jpg', // Fallback to bedroom
        'outdoor': '/tangerine/categories/living-room-category-scaled-qkja4tj10g8b6d9boyucdr5m2rg0w40p5781kag3xw.jpg', // Fallback to living-room
        'storage': '/tangerine/categories/dining-category-scaled-qkjbggyhh3glqq1kg2cha89u6ykw3q6u11t6e9smic.jpg', // Fallback to dining
    };

    const imagePath = categoryImages[categorySlug] || categoryImages['living-room'];
    return getImageKitUrl(imagePath, 800, 600);
}

/**
 * Get product image URL
 */
export function getProductImageUrl(imagePath: string, size: 'thumbnail' | 'medium' | 'large' = 'medium'): string {
    const sizes = {
        thumbnail: { width: 300, height: 300 },
        medium: { width: 600, height: 600 },
        large: { width: 1200, height: 1200 },
    };

    const { width, height } = sizes[size];
    return getImageKitUrl(imagePath, width, height);
}

/**
 * Get icon URL
 */
export function getIconUrl(iconPath: string, size: number = 64): string {
    return getImageKitUrl(iconPath, size, size);
}

/**
 * Get placeholder image URL using ImageKit
 */
export function getPlaceholderUrl(width: number = 400, height: number = 400): string {
    // Use ImageKit's placeholder or one of the existing category images
    return getImageKitUrl(IMAGE_PATHS.CATEGORIES.LIVING_ROOM, width, height);
}

// Predefined image paths for easy access (updated with actual uploaded paths)
export const IMAGE_PATHS = {
    HERO_BG: '/tangerine/categories/living-room-category-scaled-qkja4tj10g8b6d9boyucdr5m2rg0w40p5781kag3xw.jpg', // Using living room as hero fallback
    CATEGORIES: {
        LIVING_ROOM: '/tangerine/categories/living-room-category-scaled-qkja4tj10g8b6d9boyucdr5m2rg0w40p5781kag3xw.jpg',
        BEDROOM: '/tangerine/categories/bedroom-categories-scaled-qkr2tbqbg6jcbtwfh720uf14f5mfhb7fduyloae9kk.jpg',
        DINING: '/tangerine/categories/dining-category-scaled-qkjbggyhh3glqq1kg2cha89u6ykw3q6u11t6e9smic.jpg',
        OFFICE: '/tangerine/categories/bedroom-categories-scaled-qkr2tbqbg6jcbtwfh720uf14f5mfhb7fduyloae9kk.jpg', // Using bedroom as fallback
        OUTDOOR: '/tangerine/categories/living-room-category-scaled-qkja4tj10g8b6d9boyucdr5m2rg0w40p5781kag3xw.jpg', // Using living room as fallback
        STORAGE: '/tangerine/categories/dining-category-scaled-qkjbggyhh3glqq1kg2cha89u6ykw3q6u11t6e9smic.jpg', // Using dining as fallback
    },
    PRODUCTS: {
        SOFA: '/tangerine/products/sofa-qwbznzez6ecafcz2i0khdxjgm8oaxfhbaowvi3qo0y.png',
        BED: '/tangerine/products/bed-2.webp',
        COFFEE_TABLE: '/tangerine/additional/coffee-hero.webp',
        DINING_TABLE: '/tangerine/additional/dining-2.webp',
    },
    ICONS: {
        FAST_DELIVERY: '/tangerine/icons/fast-delivery-qwbzfe62pwkybng9nsw83lkt6h0jl0dmg6a4m2h6w2.png',
        ECO_FRIENDLY: '/tangerine/icons/trees_2633719-qwc1ydxmbj588pa1bmv1z4y7eaipq6m6mjta3dk6jm.png',
    },
};
