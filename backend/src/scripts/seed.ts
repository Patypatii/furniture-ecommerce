import dotenv from 'dotenv';
import connectDatabase from '../config/database';
import Category from '../models/Category';
import Product from '../models/Product';
import User from '../models/User';
import { logger } from '../utils/logger';
import { getImageKitUrl, getCategoryImageUrl } from '../config/imagekit';

dotenv.config();

const categories = [
  {
    name: 'Living Room',
    slug: 'living-room',
    description: 'Sofas, coffee tables, and entertainment units',
    image: getCategoryImageUrl('living-room'),
    order: 1,
    isActive: true,
  },
  {
    name: 'Bedroom',
    slug: 'bedroom',
    description: 'Beds, wardrobes, and nightstands',
    image: getCategoryImageUrl('bedroom'),
    order: 2,
    isActive: true,
  },
  {
    name: 'Dining',
    slug: 'dining',
    description: 'Dining tables, chairs, and cabinets',
    image: getCategoryImageUrl('dining'),
    order: 3,
    isActive: true,
  },
  {
    name: 'Office',
    slug: 'office',
    description: 'Desks, office chairs, and storage',
    image: getCategoryImageUrl('office'),
    order: 4,
    isActive: true,
  },
  {
    name: 'Outdoor',
    slug: 'outdoor',
    description: 'Patio furniture and garden decor',
    image: getCategoryImageUrl('outdoor'),
    order: 5,
    isActive: true,
  },
  {
    name: 'Storage',
    slug: 'storage',
    description: 'Shelves, cabinets, and organizers',
    image: getCategoryImageUrl('storage'),
    order: 6,
    isActive: true,
  },
];

const getProductsData = (categoryIds: any) => [
  // Living Room Products
  {
    name: 'Modern L-Shaped Sofa',
    slug: 'modern-l-shaped-sofa',
    description: 'Luxurious L-shaped sofa with premium fabric upholstery. Perfect for modern living rooms with its sleek design and comfortable seating.',
    shortDescription: 'Luxurious L-shaped sofa with premium fabric',
    price: 125000,
    salePrice: 99000,
    sku: 'TF-SOF-001',
    category: categoryIds['living-room'],
    images: [
      {
        url: getImageKitUrl('/tangerine/products/sofa-qwbznzez6ecafcz2i0khdxjgm8oaxfhbaowvi3qo0y.png', 800, 600),
        alt: 'Modern L-Shaped Sofa',
        isPrimary: true,
        order: 0,
      },
    ],
    specifications: [
      { label: 'Material', value: 'Premium Fabric' },
      { label: 'Frame', value: 'Solid Wood' },
      { label: 'Seating Capacity', value: '6 persons' },
      { label: 'Warranty', value: '5 years' },
    ],
    dimensions: {
      length: 280,
      width: 180,
      height: 85,
      weight: 95,
      unit: 'cm',
      weightUnit: 'kg',
    },
    materials: ['Fabric', 'Wood'],
    colors: ['Gray', 'Beige', 'Navy Blue'],
    inStock: true,
    stockQuantity: 12,
    featured: true,
    tags: ['sofa', 'living room', 'modern', 'l-shaped'],
    rating: 4.8,
    reviewCount: 24,
  },
  {
    name: 'Coffee Table with Storage',
    slug: 'coffee-table-with-storage',
    description: 'Modern coffee table with hidden storage compartments. Features a sleek glass top and wooden frame.',
    shortDescription: 'Modern coffee table with hidden storage',
    price: 28500,
    sku: 'TF-COF-001',
    category: categoryIds['living-room'],
    images: [
      {
        url: getImageKitUrl('/tangerine/additional/coffee-hero.webp', 800, 600),
        alt: 'Coffee Table',
        isPrimary: true,
        order: 0,
      },
    ],
    specifications: [
      { label: 'Material', value: 'Wood & Glass' },
      { label: 'Storage', value: 'Yes' },
      { label: 'Finish', value: 'Walnut' },
    ],
    dimensions: {
      length: 120,
      width: 60,
      height: 45,
      weight: 25,
      unit: 'cm',
      weightUnit: 'kg',
    },
    materials: ['Wood', 'Glass'],
    colors: ['Walnut', 'Oak'],
    inStock: true,
    stockQuantity: 18,
    featured: true,
    tags: ['coffee table', 'living room', 'storage'],
    rating: 4.6,
    reviewCount: 15,
  },
  
  // Bedroom Products
  {
    name: 'King Size Platform Bed',
    slug: 'king-size-platform-bed',
    description: 'Elegant king size platform bed with upholstered headboard. Features solid wood construction and modern design.',
    shortDescription: 'King size platform bed with upholstered headboard',
    price: 85000,
    salePrice: 72000,
    sku: 'TF-BED-001',
    category: categoryIds['bedroom'],
    images: [
      {
        url: getImageKitUrl('/tangerine/products/bed-2.webp', 800, 600),
        alt: 'King Size Platform Bed',
        isPrimary: true,
        order: 0,
      },
    ],
    specifications: [
      { label: 'Size', value: 'King (180x200cm)' },
      { label: 'Material', value: 'Solid Wood' },
      { label: 'Headboard', value: 'Upholstered' },
      { label: 'Warranty', value: '10 years' },
    ],
    dimensions: {
      length: 215,
      width: 195,
      height: 120,
      weight: 75,
      unit: 'cm',
      weightUnit: 'kg',
    },
    materials: ['Wood', 'Fabric'],
    colors: ['Brown', 'Gray', 'White'],
    inStock: true,
    stockQuantity: 8,
    featured: true,
    tags: ['bed', 'bedroom', 'king size', 'platform'],
    rating: 4.9,
    reviewCount: 32,
  },

  // Dining Products
  {
    name: '6-Seater Dining Table Set',
    slug: '6-seater-dining-table-set',
    description: 'Complete dining set with table and 6 chairs. Made from solid wood with elegant finish.',
    shortDescription: 'Complete dining set with table and 6 chairs',
    price: 95000,
    sku: 'TF-DIN-001',
    category: categoryIds['dining'],
    images: [
      {
        url: getImageKitUrl('/tangerine/additional/dining-2.webp', 800, 600),
        alt: '6-Seater Dining Table Set',
        isPrimary: true,
        order: 0,
      },
    ],
    specifications: [
      { label: 'Seating', value: '6 persons' },
      { label: 'Material', value: 'Solid Wood' },
      { label: 'Finish', value: 'Mahogany' },
      { label: 'Chairs Included', value: 'Yes' },
    ],
    dimensions: {
      length: 180,
      width: 90,
      height: 75,
      weight: 85,
      unit: 'cm',
      weightUnit: 'kg',
    },
    materials: ['Wood'],
    colors: ['Mahogany', 'Oak', 'Walnut'],
    inStock: true,
    stockQuantity: 6,
    featured: true,
    tags: ['dining table', 'dining set', 'chairs'],
    rating: 4.7,
    reviewCount: 18,
  },
];

const seedDatabase = async () => {
  try {
    await connectDatabase();

    logger.info('🗑️  Clearing database...');
    await Category.deleteMany({});
    await Product.deleteMany({});

    logger.info('📦 Creating categories...');
    const createdCategories = await Category.insertMany(categories);
    
    const categoryIds: any = {};
    createdCategories.forEach((cat) => {
      categoryIds[cat.slug] = cat._id;
    });

    logger.info('📦 Creating products...');
    const productsData = getProductsData(categoryIds);
    await Product.insertMany(productsData);

    logger.info('✅ Database seeded successfully!');
    logger.info(`  - Categories: ${createdCategories.length}`);
    logger.info(`  - Products: ${productsData.length}`);

    // Create admin user if not exists
    const adminExists = await User.findOne({ email: 'admin@tangerine.co.ke' });
    if (!adminExists) {
      await User.create({
        email: 'admin@tangerine.co.ke',
        password: 'admin123456',
        firstName: 'Admin',
        lastName: 'User',
        role: 'superadmin',
        isEmailVerified: true,
        isActive: true,
      });
      logger.info('✅ Admin user created (admin@tangerine.co.ke / admin123456)');
    }

    process.exit(0);
  } catch (error) {
    logger.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

