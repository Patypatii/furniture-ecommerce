import { Request, Response, NextFunction } from 'express';
import Cart from '../models/Cart';
import Product from '../models/Product';
import { AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

// @desc    Get user cart
// @route   GET /api/v1/cart
// @access  Private
export const getCart = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let cart = await Cart.findOne({
      $or: [
        { user: req.user?._id },
        { sessionId: req.headers['x-session-id'] }
      ]
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.user?._id,
        sessionId: req.headers['x-session-id'],
        items: [],
      });
    }

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/v1/cart/add
// @access  Public
export const addToCart = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { productId, quantity = 1, variantId } = req.body;

    // Get product details
    const product = await Product.findById(productId);
    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    if (!product.inStock || product.stockQuantity < quantity) {
      return next(new AppError('Product out of stock', 400));
    }

    // Find or create cart
    let cart = await Cart.findOne({
      $or: [
        { user: req.user?._id },
        { sessionId: req.headers['x-session-id'] }
      ]
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.user?._id,
        sessionId: req.headers['x-session-id'],
        items: [],
      });
    }

    // Check if item already in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product === productId && (!variantId || item.variant?.id === variantId)
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].subtotal = 
        cart.items[existingItemIndex].quantity * cart.items[existingItemIndex].price;
    } else {
      // Add new item
      const price = product.salePrice || product.price;
      const variant = variantId 
        ? product.variants?.find(v => v.id === variantId)
        : undefined;

      cart.items.push({
        product: productId,
        name: product.name,
        slug: product.slug,
        image: product.images[0]?.url || '',
        price: variant ? price + variant.priceModifier : price,
        quantity,
        variant: variant ? {
          id: variant.id,
          name: variant.name,
          value: variant.value,
        } : undefined,
        subtotal: (variant ? price + variant.priceModifier : price) * quantity,
      });
    }

    await cart.save();

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/v1/cart/update
// @access  Public
export const updateCartItem = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({
      $or: [
        { user: req.user?._id },
        { sessionId: req.headers['x-session-id'] }
      ]
    });

    if (!cart) {
      return next(new AppError('Cart not found', 404));
    }

    const itemIndex = cart.items.findIndex(item => item.product === productId);

    if (itemIndex === -1) {
      return next(new AppError('Item not found in cart', 404));
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].subtotal = cart.items[itemIndex].price * quantity;
    }

    await cart.save();

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/v1/cart/remove/:productId
// @access  Public
export const removeFromCart = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({
      $or: [
        { user: req.user?._id },
        { sessionId: req.headers['x-session-id'] }
      ]
    });

    if (!cart) {
      return next(new AppError('Cart not found', 404));
    }

    cart.items = cart.items.filter(item => item.product !== productId);
    await cart.save();

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear cart
// @route   DELETE /api/v1/cart/clear
// @access  Public
export const clearCart = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const cart = await Cart.findOne({
      $or: [
        { user: req.user?._id },
        { sessionId: req.headers['x-session-id'] }
      ]
    });

    if (!cart) {
      return next(new AppError('Cart not found', 404));
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Apply coupon code
// @route   POST /api/v1/cart/coupon
// @access  Public
export const applyCoupon = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { code } = req.body;

    const cart = await Cart.findOne({
      $or: [
        { user: req.user?._id },
        { sessionId: req.headers['x-session-id'] }
      ]
    });

    if (!cart) {
      return next(new AppError('Cart not found', 404));
    }

    // TODO: Validate coupon code against Coupon model
    // For now, apply a fixed discount
    if (code === 'WELCOME10') {
      cart.discount = cart.subtotal * 0.1;
      cart.couponCode = code;
    } else {
      return next(new AppError('Invalid coupon code', 400));
    }

    await cart.save();

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

