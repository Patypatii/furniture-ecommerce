import mongoose from 'mongoose';
import Category from '../models/Category';
import { config } from '../config/environment';
import { logger } from '../utils/logger';
import { PRODUCT_CATEGORIES } from '../utils/constants';

/**
 * Seed Categories Script
 * Run with: npx ts-node src/scripts/seed-categories.ts
 */

async function seedCategories() {
    try {
        // Connect to MongoDB
        await mongoose.connect(config.mongodb.uri);
        logger.info('✅ Connected to MongoDB');

        // Clear existing categories (optional - comment out in production)
        await Category.deleteMany({});
        logger.info('🗑️ Cleared existing categories');

        const categoriesToSeed = [];

        // Living Room (parent category)
        const livingRoom = await Category.create({
            name: PRODUCT_CATEGORIES.LIVING_ROOM.name,
            slug: PRODUCT_CATEGORIES.LIVING_ROOM.slug,
            description: 'Transform your living space with our curated collection of sofas, coffee tables, and more',
            image: 'https://ik.imagekit.io/87iepx52pd/tangerine/categories/living-room-category-scaled-qkja4tj10g8b6d9boyucdr5m2rg0w40p5781kag3xw.jpg',
            order: 1,
            isActive: true,
        });
        categoriesToSeed.push(livingRoom);
        logger.info(`✓ Created: ${livingRoom.name}`);

        // Living Room subcategories
        for (const [index, sub] of PRODUCT_CATEGORIES.LIVING_ROOM.subcategories.entries()) {
            const subcat = await Category.create({
                name: sub.name,
                slug: sub.slug,
                parent: livingRoom._id,
                order: index + 1,
                isActive: true,
            });
            categoriesToSeed.push(subcat);
            logger.info(`  ✓ Created subcategory: ${subcat.name}`);
        }

        // Dining Sets
        const dining = await Category.create({
            name: PRODUCT_CATEGORIES.DINING.name,
            slug: PRODUCT_CATEGORIES.DINING.slug,
            description: 'Elegant dining sets that bring family and friends together',
            image: 'https://ik.imagekit.io/87iepx52pd/tangerine/categories/dining-category-scaled-qkjbggyhh3glqq1kg2cha89u6ykw3q6u11t6e9smic.jpg',
            order: 2,
            isActive: true,
        });
        categoriesToSeed.push(dining);
        logger.info(`✓ Created: ${dining.name}`);

        // Beds
        const beds = await Category.create({
            name: PRODUCT_CATEGORIES.BEDROOM.name,
            slug: PRODUCT_CATEGORIES.BEDROOM.slug,
            description: 'Quality beds crafted for a restful and luxurious sleep experience',
            image: 'https://ik.imagekit.io/87iepx52pd/tangerine/categories/bedroom-categories-scaled-qkr2tbqbg6jcbtwfh720uf14f5mfhb7fduyloae9kk.jpg',
            order: 3,
            isActive: true,
        });
        categoriesToSeed.push(beds);
        logger.info(`✓ Created: ${beds.name}`);

        // Hotel & Restaurants
        const commercial = await Category.create({
            name: PRODUCT_CATEGORIES.COMMERCIAL.name,
            slug: PRODUCT_CATEGORIES.COMMERCIAL.slug,
            description: 'Professional furniture solutions for hotels, restaurants, and commercial spaces',
            order: 4,
            isActive: true,
        });
        categoriesToSeed.push(commercial);
        logger.info(`✓ Created: ${commercial.name}`);

        logger.info(`\n🎉 Successfully seeded ${categoriesToSeed.length} categories!`);

        // Display summary
        const parentCategories = await Category.find({ parent: null });
        logger.info(`\n📊 Summary:`);
        logger.info(`   - Parent categories: ${parentCategories.length}`);

        for (const parent of parentCategories) {
            const subcats = await Category.find({ parent: parent._id });
            logger.info(`   - ${parent.name}: ${subcats.length} subcategories`);
        }

    } catch (error: any) {
        logger.error('❌ Error seeding categories:', error.message);
        throw error;
    } finally {
        await mongoose.connection.close();
        logger.info('\n👋 Database connection closed');
    }
}

// Run the script
seedCategories()
    .then(() => {
        process.exit(0);
    })
    .catch((error) => {
        logger.error('Fatal error:', error);
        process.exit(1);
    });

