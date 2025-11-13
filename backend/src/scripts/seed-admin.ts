import mongoose from 'mongoose';
import User from '../models/User';
import { config } from '../config/environment';
import { logger } from '../utils/logger';

/**
 * Seed Admin User
 * Run with: npm run seed:admin
 */

async function seedAdmin() {
    try {
        // Connect to MongoDB
        await mongoose.connect(config.mongodb.uri);
        logger.info('✅ Connected to MongoDB');

        // Admin user credentials
        const adminData = {
            email: 'admin@tangerinefurniture.co.ke',
            password: 'Admin@123456',
            firstName: 'Admin',
            lastName: 'Tangerine',
            phone: '+254758841701',
            role: 'admin',
            isEmailVerified: true,
            isActive: true,
        };

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminData.email });

        if (existingAdmin) {
            logger.info('⚠️  Admin user already exists!');
            logger.info('📧 Email: admin@tangerinefurniture.co.ke');
            logger.info('🔑 Password: Admin@123456');
            logger.info('\n💡 If you forgot the password, delete the user and run this script again.');
        } else {
            // Create admin user
            const admin = await User.create(adminData);
            logger.info('✅ Admin user created successfully!');
            logger.info('\n📋 Admin Login Credentials:');
            logger.info('='.repeat(50));
            logger.info('📧 Email:    admin@tangerinefurniture.co.ke');
            logger.info('🔑 Password: Admin@123456');
            logger.info('👤 Role:     admin');
            logger.info('='.repeat(50));
            logger.info('\n🌐 Admin Dashboard URL:');
            logger.info('   http://localhost:5173');
            logger.info('\n⚠️  IMPORTANT: Change this password after first login!');
        }

        // Also create a superadmin for testing
        const superAdminData = {
            email: 'superadmin@tangerinefurniture.co.ke',
            password: 'SuperAdmin@123456',
            firstName: 'Super',
            lastName: 'Admin',
            phone: '+254758841701',
            role: 'superadmin',
            isEmailVerified: true,
            isActive: true,
        };

        const existingSuperAdmin = await User.findOne({ email: superAdminData.email });

        if (!existingSuperAdmin) {
            await User.create(superAdminData);
            logger.info('\n✅ Super Admin user also created!');
            logger.info('📧 Email:    superadmin@tangerinefurniture.co.ke');
            logger.info('🔑 Password: SuperAdmin@123456');
        }

        logger.info('\n👋 Database connection will close now.');
        await mongoose.connection.close();
        process.exit(0);

    } catch (error: any) {
        logger.error('❌ Error seeding admin user:', error.message);
        process.exit(1);
    }
}

// Run the seed
seedAdmin();




