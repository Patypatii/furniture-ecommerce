// Environment Configuration
export const config = {
    // MongoDB Configuration
    mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb+srv://tangerine:tangerine123@cluster0.toospwh.mongodb.net/',
        dbName: process.env.DB_NAME || 'tangerine_furniture',
    },

    // ImageKit Configuration
    imagekit: {
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY || 'public_JnMVJHBZmtnq4hpm/qxCfL4dux0=',
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY || 'private_fZeUYZisMbBRE+5oOwo6tDmCwQQ=',
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/87iepx52pd',
    },

    // JWT Configuration
    jwt: {
        secret: process.env.JWT_SECRET || 'tangerine_furniture_super_secret_jwt_key_2024',
        expire: process.env.JWT_EXPIRE || '7d',
    },

    // Server Configuration
    server: {
        port: parseInt(process.env.PORT || '5000'),
        host: process.env.HOST || 'localhost',
        nodeEnv: process.env.NODE_ENV || 'development',
    },

    // URLs
    urls: {
        frontend: process.env.FRONTEND_URL || 'http://localhost:3000',
        admin: process.env.ADMIN_URL || 'http://localhost:5173',
    },

    // OpenAI Configuration
    openai: {
        apiKey: process.env.OPENAI_API_KEY || '',
    },

    // Stripe Configuration
    stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY || '',
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    },

    // Redis Configuration
    redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379',
    },

    // Email Configuration
    email: {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
    },

    // Security
    security: {
        bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10'),
        rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
        rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    },
};

export default config;
