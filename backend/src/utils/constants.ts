export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

export const USER_ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
  SUPER_ADMIN: 'superadmin',
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

export const PAYMENT_METHODS = {
  CARD: 'card',
  MPESA: 'mpesa',
  BANK_TRANSFER: 'bank_transfer',
  CASH_ON_DELIVERY: 'cash_on_delivery',
};

export const CACHE_TTL = {
  ONE_MINUTE: 60,
  FIVE_MINUTES: 300,
  TEN_MINUTES: 600,
  THIRTY_MINUTES: 1800,
  ONE_HOUR: 3600,
  ONE_DAY: 86400,
  ONE_WEEK: 604800,
};

// Product Categories matching original Tangerine Furniture site
export const PRODUCT_CATEGORIES = {
  LIVING_ROOM: {
    name: 'Living Room',
    slug: 'living-room',
    subcategories: [
      { name: 'Sofas', slug: 'sofas' },
      { name: 'Coffee Tables', slug: 'coffee-tables' },
      { name: 'TV Stands', slug: 'tv-stands' },
      { name: 'Consoles & Cabinets', slug: 'consoles-cabinets' },
      { name: 'Accents', slug: 'accents' },
    ]
  },
  DINING: {
    name: 'Dining Sets',
    slug: 'dining-sets',
  },
  BEDROOM: {
    name: 'Beds',
    slug: 'beds',
  },
  COMMERCIAL: {
    name: 'Hotel & Restaurants',
    slug: 'hotel-restaurants',
  },
};

export const CURRENCY = {
  KES: 'KES',
  USD: 'USD',
  EUR: 'EUR',
};

export const EMAIL_TEMPLATES = {
  WELCOME: 'welcome',
  ORDER_CONFIRMATION: 'order-confirmation',
  ORDER_SHIPPED: 'order-shipped',
  ORDER_DELIVERED: 'order-delivered',
  PASSWORD_RESET: 'password-reset',
  EMAIL_VERIFICATION: 'email-verification',
};

export const AI_SYSTEM_PROMPT = `You are an AI assistant for MyFurniture, a premium furniture store in Kenya.
Your role is to help customers find the perfect furniture for their homes and answer questions about products.

Guidelines:
- Be friendly, professional, and helpful
- Recommend products based on customer needs and preferences
- Provide accurate information about dimensions, materials, and pricing
- Ask clarifying questions when needed
- If you don't know something, admit it and offer to connect them with a human representative
- Use Kenyan Shillings (KES) for pricing
- Be aware of delivery options within Kenya (Nairobi, Mombasa, etc.)
- Suggest complementary products when appropriate

Product Categories: Living Room, Bedroom, Dining Room, Office, Outdoor, Storage, Lighting, Decor
`;

export default {
  HTTP_STATUS,
  USER_ROLES,
  ORDER_STATUS,
  PAYMENT_STATUS,
  PAYMENT_METHODS,
  CACHE_TTL,
  PRODUCT_CATEGORIES,
  CURRENCY,
  EMAIL_TEMPLATES,
  AI_SYSTEM_PROMPT,
};

