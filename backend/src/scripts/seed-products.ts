import mongoose from 'mongoose';
import Product from '../models/Product';
import Category from '../models/Category';
import { config } from '../config/environment';
import { logger } from '../utils/logger';

/**
 * Seed Products from Original Tangerine Furniture Site
 * Based on actual data from tangerinefurniture.co.ke clone
 * Run with: npm run seed:products
 */

async function seedProducts() {
    try {
        // Connect to MongoDB
        await mongoose.connect(config.mongodb.uri);
        logger.info('✅ Connected to MongoDB');

        // Get categories
        const livingRoomCategory = await Category.findOne({ slug: 'living-room' });
        const sofasCategory = await Category.findOne({ slug: 'sofas' });
        const coffeeTablesCategory = await Category.findOne({ slug: 'coffee-tables' });
        const tvStandsCategory = await Category.findOne({ slug: 'tv-stands' });
        const bedsCategory = await Category.findOne({ slug: 'beds' });
        const diningCategory = await Category.findOne({ slug: 'dining-sets' });
        const hotelCategory = await Category.findOne({ slug: 'hotel-restaurants' });

        if (!livingRoomCategory) {
            logger.error('❌ Categories not found. Run seed:categories first!');
            process.exit(1);
        }

        // Clear existing products (optional - comment out in production)
        await Product.deleteMany({});
        logger.info('🗑️ Cleared existing products');

        // Products from original Tangerine Furniture site
        const productsToSeed = [
            // SOFAS
            {
                name: 'Modern 3-Seater Fabric Sofa',
                slug: 'modern-3-seater-fabric-sofa',
                description: 'Comfortable and stylish 3-seater fabric sofa perfect for modern living rooms. Features high-density foam cushions and durable fabric upholstery.',
                shortDescription: 'Modern 3-seater sofa with premium fabric and comfortable seating',
                price: 45000,
                salePrice: 42000,
                sku: 'SOF-3S-MOD-001',
                category: sofasCategory?._id || livingRoomCategory._id,
                subcategory: 'Sofas',
                images: [
                    {
                        url: 'https://ik.imagekit.io/87iepx52pd/tangerine/products/sofa-qwbznzez6ecafcz2i0khdxjgm8oaxfhbaowvi3qo0y.png',
                        alt: 'Modern 3-Seater Fabric Sofa',
                        isPrimary: true,
                        order: 1,
                    },
                ],
                specifications: [
                    { label: 'Seating Capacity', value: '3 people' },
                    { label: 'Material', value: 'Premium Fabric' },
                    { label: 'Frame', value: 'Solid Wood' },
                    { label: 'Cushion', value: 'High-density foam' },
                ],
                dimensions: {
                    length: 210,
                    width: 90,
                    height: 85,
                    weight: 45,
                    unit: 'cm',
                    weightUnit: 'kg',
                },
                materials: ['Fabric', 'Wood', 'Foam'],
                colors: ['Grey', 'Beige', 'Navy Blue'],
                inStock: true,
                stockQuantity: 15,
                lowStockThreshold: 3,
                featured: true,
                tags: ['sofa', 'living room', 'modern', '3-seater', 'fabric'],
                rating: 4.5,
                reviewCount: 28,
            },

            {
                name: 'Premium Leather L-Shape Sofa',
                slug: 'premium-leather-l-shape-sofa',
                description: 'Luxurious L-shape leather sofa with reversible chaise. Perfect for spacious living rooms. Comes with 2 matching ottomans.',
                shortDescription: 'Premium leather L-shape sofa with ottomans',
                price: 95000,
                salePrice: 85000,
                sku: 'SOF-LS-LEATH-001',
                category: sofasCategory?._id || livingRoomCategory._id,
                subcategory: 'Sofas',
                images: [
                    {
                        url: 'https://ik.imagekit.io/87iepx52pd/tangerine/products/sofa-qwbznzez6ecafcz2i0khdxjgm8oaxfhbaowvi3qo0y.png',
                        alt: 'Premium Leather L-Shape Sofa',
                        isPrimary: true,
                        order: 1,
                    },
                ],
                specifications: [
                    { label: 'Type', value: 'L-Shape' },
                    { label: 'Material', value: 'Genuine Leather' },
                    { label: 'Frame', value: 'Hardwood' },
                    { label: 'Features', value: 'Reversible chaise, 2 ottomans' },
                ],
                dimensions: {
                    length: 280,
                    width: 180,
                    height: 90,
                    weight: 85,
                    unit: 'cm',
                    weightUnit: 'kg',
                },
                materials: ['Leather', 'Hardwood', 'Foam'],
                colors: ['Brown', 'Black', 'Tan'],
                inStock: true,
                stockQuantity: 8,
                lowStockThreshold: 2,
                featured: true,
                tags: ['sofa', 'living room', 'l-shape', 'leather', 'premium'],
                rating: 4.8,
                reviewCount: 45,
            },

            {
                name: 'Classic 2-Seater Compact Sofa',
                slug: 'classic-2-seater-compact-sofa',
                description: 'Perfect for small apartments and offices. Compact design without compromising comfort. Durable fabric and easy to maintain.',
                shortDescription: 'Compact 2-seater sofa ideal for small spaces',
                price: 32000,
                sku: 'SOF-2S-COMP-001',
                category: sofasCategory?._id || livingRoomCategory._id,
                subcategory: 'Sofas',
                images: [
                    {
                        url: 'https://ik.imagekit.io/87iepx52pd/tangerine/products/sofa-qwbznzez6ecafcz2i0khdxjgm8oaxfhbaowvi3qo0y.png',
                        alt: 'Classic 2-Seater Compact Sofa',
                        isPrimary: true,
                        order: 1,
                    },
                ],
                specifications: [
                    { label: 'Seating Capacity', value: '2 people' },
                    { label: 'Material', value: 'Fabric' },
                    { label: 'Frame', value: 'Pine Wood' },
                    { label: 'Best For', value: 'Small spaces, apartments' },
                ],
                dimensions: {
                    length: 150,
                    width: 80,
                    height: 82,
                    weight: 28,
                    unit: 'cm',
                    weightUnit: 'kg',
                },
                materials: ['Fabric', 'Pine Wood', 'Foam'],
                colors: ['Grey', 'Cream', 'Dark Blue'],
                inStock: true,
                stockQuantity: 20,
                lowStockThreshold: 5,
                featured: false,
                tags: ['sofa', '2-seater', 'compact', 'small space'],
                rating: 4.3,
                reviewCount: 18,
            },

            // BEDS
            {
                name: 'King Size Upholstered Bed with Storage',
                slug: 'king-size-upholstered-bed-storage',
                description: 'Luxurious king-size bed with tufted headboard and built-in storage drawers. Perfect for master bedrooms.',
                shortDescription: 'King bed with elegant upholstery and storage',
                price: 75000,
                salePrice: 68000,
                sku: 'BED-KING-UPH-001',
                category: bedsCategory?._id || livingRoomCategory._id,
                subcategory: 'Beds',
                images: [
                    {
                        url: 'https://ik.imagekit.io/87iepx52pd/tangerine/products/bed-2.webp',
                        alt: 'King Size Upholstered Bed',
                        isPrimary: true,
                        order: 1,
                    },
                ],
                specifications: [
                    { label: 'Size', value: 'King Size (6x6 feet)' },
                    { label: 'Headboard', value: 'Tufted upholstery' },
                    { label: 'Storage', value: '4 drawers' },
                    { label: 'Frame', value: 'Solid wood' },
                ],
                dimensions: {
                    length: 200,
                    width: 180,
                    height: 120,
                    weight: 65,
                    unit: 'cm',
                    weightUnit: 'kg',
                },
                materials: ['Wood', 'Fabric', 'Foam'],
                colors: ['Grey', 'Beige', 'Navy'],
                inStock: true,
                stockQuantity: 12,
                lowStockThreshold: 3,
                featured: true,
                tags: ['bed', 'bedroom', 'king size', 'storage', 'upholstered'],
                rating: 4.7,
                reviewCount: 35,
            },

            {
                name: 'Queen Size Platform Bed',
                slug: 'queen-size-platform-bed',
                description: 'Modern platform bed with clean lines. Low-profile design perfect for contemporary bedrooms.',
                shortDescription: 'Modern queen platform bed',
                price: 52000,
                sku: 'BED-QUEEN-PLAT-001',
                category: bedsCategory?._id || livingRoomCategory._id,
                subcategory: 'Beds',
                images: [
                    {
                        url: 'https://ik.imagekit.io/87iepx52pd/tangerine/products/bed-2.webp',
                        alt: 'Queen Size Platform Bed',
                        isPrimary: true,
                        order: 1,
                    },
                ],
                specifications: [
                    { label: 'Size', value: 'Queen Size (5x6 feet)' },
                    { label: 'Style', value: 'Platform/Low profile' },
                    { label: 'Frame', value: 'Solid wood' },
                ],
                dimensions: {
                    length: 190,
                    width: 150,
                    height: 100,
                    weight: 45,
                    unit: 'cm',
                    weightUnit: 'kg',
                },
                materials: ['Wood'],
                colors: ['Walnut', 'Oak', 'White'],
                inStock: true,
                stockQuantity: 18,
                lowStockThreshold: 4,
                featured: false,
                tags: ['bed', 'bedroom', 'queen size', 'platform', 'modern'],
                rating: 4.4,
                reviewCount: 22,
            },

            // COFFEE TABLES
            {
                name: 'Modern Glass Top Coffee Table',
                slug: 'modern-glass-top-coffee-table',
                description: 'Elegant coffee table with tempered glass top and wooden base. Perfect centerpiece for your living room.',
                shortDescription: 'Glass top coffee table with wood base',
                price: 18000,
                salePrice: 16500,
                sku: 'COF-GLASS-MOD-001',
                category: coffeeTablesCategory?._id || livingRoomCategory._id,
                subcategory: 'Coffee Tables',
                images: [
                    {
                        url: 'https://ik.imagekit.io/87iepx52pd/tangerine/additional/coffee-hero.webp',
                        alt: 'Modern Glass Top Coffee Table',
                        isPrimary: true,
                        order: 1,
                    },
                ],
                specifications: [
                    { label: 'Top Material', value: 'Tempered Glass' },
                    { label: 'Base', value: 'Solid Wood' },
                    { label: 'Shape', value: 'Rectangular' },
                ],
                dimensions: {
                    length: 120,
                    width: 60,
                    height: 45,
                    weight: 22,
                    unit: 'cm',
                    weightUnit: 'kg',
                },
                materials: ['Glass', 'Wood'],
                colors: ['Clear Glass/Walnut', 'Clear Glass/Oak'],
                inStock: true,
                stockQuantity: 25,
                lowStockThreshold: 5,
                featured: true,
                tags: ['coffee table', 'living room', 'glass', 'modern'],
                rating: 4.6,
                reviewCount: 31,
            },

            // DINING SETS
            {
                name: '6-Seater Dining Set with Cushioned Chairs',
                slug: '6-seater-dining-set-cushioned-chairs',
                description: 'Complete dining set with rectangular table and 6 cushioned chairs. Perfect for family meals and gatherings.',
                shortDescription: '6-seater dining set with comfortable cushioned chairs',
                price: 85000,
                salePrice: 78000,
                sku: 'DIN-6S-CUSH-001',
                category: diningCategory?._id || livingRoomCategory._id,
                subcategory: 'Dining Sets',
                images: [
                    {
                        url: 'https://ik.imagekit.io/87iepx52pd/tangerine/additional/dining-2.webp',
                        alt: '6-Seater Dining Set',
                        isPrimary: true,
                        order: 1,
                    },
                ],
                specifications: [
                    { label: 'Seating', value: '6 people' },
                    { label: 'Table Material', value: 'Solid Wood' },
                    { label: 'Chairs', value: 'Cushioned seats' },
                    { label: 'Finish', value: 'Lacquered' },
                ],
                dimensions: {
                    length: 180,
                    width: 90,
                    height: 75,
                    weight: 95,
                    unit: 'cm',
                    weightUnit: 'kg',
                },
                materials: ['Solid Wood', 'Fabric Cushions'],
                colors: ['Walnut', 'Dark Brown', 'Natural Oak'],
                inStock: true,
                stockQuantity: 10,
                lowStockThreshold: 2,
                featured: true,
                tags: ['dining set', 'dining room', '6-seater', 'family'],
                rating: 4.7,
                reviewCount: 42,
            },

            {
                name: '4-Seater Round Dining Table',
                slug: '4-seater-round-dining-table',
                description: 'Compact round dining table perfect for apartments. Includes 4 modern chairs with comfortable seating.',
                shortDescription: 'Round dining set for 4',
                price: 58000,
                sku: 'DIN-4S-RND-001',
                category: diningCategory?._id || livingRoomCategory._id,
                subcategory: 'Dining Sets',
                images: [
                    {
                        url: 'https://ik.imagekit.io/87iepx52pd/tangerine/additional/dining-2.webp',
                        alt: '4-Seater Round Dining Table',
                        isPrimary: true,
                        order: 1,
                    },
                ],
                specifications: [
                    { label: 'Seating', value: '4 people' },
                    { label: 'Shape', value: 'Round' },
                    { label: 'Material', value: 'Wood' },
                ],
                dimensions: {
                    length: 110,
                    width: 110,
                    height: 75,
                    weight: 55,
                    unit: 'cm',
                    weightUnit: 'kg',
                },
                materials: ['Solid Wood'],
                colors: ['Walnut', 'Natural'],
                inStock: true,
                stockQuantity: 14,
                lowStockThreshold: 3,
                featured: false,
                tags: ['dining set', 'round table', '4-seater', 'compact'],
                rating: 4.5,
                reviewCount: 25,
            },

            // TV STANDS
            {
                name: 'Modern TV Stand with Storage',
                slug: 'modern-tv-stand-storage',
                description: 'Contemporary TV stand with ample storage for media devices. Features cable management and adjustable shelves.',
                shortDescription: 'Modern TV stand with storage compartments',
                price: 28000,
                salePrice: 25000,
                sku: 'TVS-MOD-STO-001',
                category: tvStandsCategory?._id || livingRoomCategory._id,
                subcategory: 'TV Stands',
                images: [
                    {
                        url: 'https://ik.imagekit.io/87iepx52pd/tangerine/categories/living-room-category-scaled-qkja4tj10g8b6d9boyucdr5m2rg0w40p5781kag3xw.jpg',
                        alt: 'Modern TV Stand',
                        isPrimary: true,
                        order: 1,
                    },
                ],
                specifications: [
                    { label: 'TV Size', value: 'Up to 65 inches' },
                    { label: 'Storage', value: '2 doors, 2 shelves' },
                    { label: 'Material', value: 'MDF with wood veneer' },
                    { label: 'Cable Management', value: 'Yes' },
                ],
                dimensions: {
                    length: 160,
                    width: 40,
                    height: 55,
                    weight: 35,
                    unit: 'cm',
                    weightUnit: 'kg',
                },
                materials: ['MDF', 'Wood Veneer'],
                colors: ['Walnut', 'White', 'Black'],
                inStock: true,
                stockQuantity: 22,
                lowStockThreshold: 5,
                featured: false,
                tags: ['tv stand', 'living room', 'storage', 'modern'],
                rating: 4.4,
                reviewCount: 19,
            },

            // HOTEL & RESTAURANT FURNITURE
            {
                name: 'Commercial Dining Set - Restaurant Grade',
                slug: 'commercial-dining-set-restaurant-grade',
                description: 'Heavy-duty dining set designed for hotels and restaurants. Extra durable construction for high-traffic environments.',
                shortDescription: 'Commercial grade dining furniture',
                price: 120000,
                sku: 'HTL-DIN-COM-001',
                category: hotelCategory?._id || livingRoomCategory._id,
                subcategory: 'Hotel & Restaurants',
                images: [
                    {
                        url: 'https://ik.imagekit.io/87iepx52pd/tangerine/additional/dining-2.webp',
                        alt: 'Commercial Dining Set',
                        isPrimary: true,
                        order: 1,
                    },
                ],
                specifications: [
                    { label: 'Type', value: 'Commercial grade' },
                    { label: 'Set Includes', value: 'Table + 8 chairs' },
                    { label: 'Material', value: 'Hardwood' },
                    { label: 'Durability', value: 'High-traffic rated' },
                ],
                dimensions: {
                    length: 200,
                    width: 100,
                    height: 76,
                    weight: 120,
                    unit: 'cm',
                    weightUnit: 'kg',
                },
                materials: ['Hardwood', 'Commercial Fabric'],
                colors: ['Dark Brown', 'Black'],
                inStock: true,
                stockQuantity: 5,
                lowStockThreshold: 2,
                featured: false,
                tags: ['commercial', 'hotel', 'restaurant', 'dining', 'bulk'],
                rating: 4.9,
                reviewCount: 12,
            },
        ];

        // Insert products
        const createdProducts = await Product.insertMany(productsToSeed);
        logger.info(`✅ Successfully seeded ${createdProducts.length} products!`);

        // Display summary
        logger.info('\n📊 Product Summary:');
        const categoryCounts: any = {};
        for (const product of createdProducts) {
            const cat = product.subcategory || 'Uncategorized';
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        }

        for (const [category, count] of Object.entries(categoryCounts)) {
            logger.info(`   - ${category}: ${count} products`);
        }

        logger.info('\n💰 Price Range:');
        const prices = createdProducts.map(p => p.salePrice || p.price);
        logger.info(`   - Lowest: KES ${Math.min(...prices).toLocaleString()}`);
        logger.info(`   - Highest: KES ${Math.max(...prices).toLocaleString()}`);
        logger.info(`   - Average: KES ${Math.round(prices.reduce((a, b) => a + b, 0) / prices.length).toLocaleString()}`);

    } catch (error: any) {
        logger.error('❌ Error seeding products:', error.message);
        throw error;
    } finally {
        await mongoose.connection.close();
        logger.info('\n👋 Database connection closed');
    }
}

// Run the script
seedProducts()
    .then(() => {
        logger.info('\n🎉 Product seeding completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        logger.error('Fatal error:', error);
        process.exit(1);
    });

