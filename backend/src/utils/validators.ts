import { body, param, query, ValidationChain } from 'express-validator';

/**
 * Auth validators
 */
export const registerValidator = (): ValidationChain[] => [
  body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and number'),
  body('firstName').trim().isLength({ min: 2 }).withMessage('First name is required'),
  body('lastName').trim().isLength({ min: 2 }).withMessage('Last name is required'),
  body('phone').optional().isMobilePhone('any').withMessage('Invalid phone number'),
];

export const loginValidator = (): ValidationChain[] => [
  body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];

/**
 * Product validators
 */
export const createProductValidator = (): ValidationChain[] => [
  body('name').trim().isLength({ min: 3, max: 200 }).withMessage('Product name is required'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('sku').trim().notEmpty().withMessage('SKU is required'),
  body('stockQuantity').isInt({ min: 0 }).withMessage('Valid stock quantity is required'),
];

export const updateProductValidator = (): ValidationChain[] => [
  param('id').isMongoId().withMessage('Invalid product ID'),
  body('name').optional().trim().isLength({ min: 3, max: 200 }),
  body('description').optional().trim().isLength({ min: 10 }),
  body('price').optional().isFloat({ min: 0 }),
  body('stockQuantity').optional().isInt({ min: 0 }),
];

/**
 * Cart validators
 */
export const addToCartValidator = (): ValidationChain[] => [
  body('productId').isMongoId().withMessage('Invalid product ID'),
  body('quantity').isInt({ min: 1, max: 100 }).withMessage('Quantity must be between 1 and 100'),
  body('variantId').optional().isString(),
];

/**
 * Order validators
 */
export const createOrderValidator = (): ValidationChain[] => [
  body('items').isArray({ min: 1 }).withMessage('Order must have at least one item'),
  body('items.*.product').isMongoId().withMessage('Invalid product ID'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Invalid quantity'),
  body('billing').isObject().withMessage('Billing address is required'),
  body('billing.fullName').trim().notEmpty().withMessage('Full name is required'),
  body('billing.phone').isMobilePhone('any').withMessage('Valid phone is required'),
  body('billing.addressLine1').trim().notEmpty().withMessage('Address is required'),
  body('billing.city').trim().notEmpty().withMessage('City is required'),
  body('shipping').isObject().withMessage('Shipping address is required'),
  body('paymentMethod').isIn(['card', 'mpesa', 'bank_transfer', 'cash_on_delivery']),
];

/**
 * Review validators
 */
export const createReviewValidator = (): ValidationChain[] => [
  body('productId').isMongoId().withMessage('Invalid product ID'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title is required'),
  body('comment').trim().isLength({ min: 10, max: 1000 }).withMessage('Comment is required'),
];

/**
 * Query validators
 */
export const paginationValidator = (): ValidationChain[] => [
  query('page').optional().isInt({ min: 1 }).withMessage('Invalid page number'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
];

export const productFilterValidator = (): ValidationChain[] => [
  ...paginationValidator(),
  query('category').optional().isString(),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('inStock').optional().isBoolean(),
  query('sort').optional().isIn(['price-asc', 'price-desc', 'name-asc', 'name-desc', 'newest', 'popular']),
];

export default {
  registerValidator,
  loginValidator,
  createProductValidator,
  updateProductValidator,
  addToCartValidator,
  createOrderValidator,
  createReviewValidator,
  paginationValidator,
  productFilterValidator,
};

