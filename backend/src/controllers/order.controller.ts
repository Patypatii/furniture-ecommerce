import { Request, Response, NextFunction } from 'express';
import Order from '../models/Order';
import Cart from '../models/Cart';
import Product from '../models/Product';
import { AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';
import { PaymentMethod } from '@tangerine/shared';

// @desc    Create order from cart
// @route   POST /api/v1/orders
// @access  Private
export const createOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { items: requestItems, billing, shipping, paymentMethod, notes } = req.body;

    console.log('📦 Create Order Request from user:', req.user?._id);
    console.log('📦 Items in request:', requestItems?.length || 0);

    // Get user's cart from database
    let cart = await Cart.findOne({ user: req.user!._id });

    // If cart is empty or doesn't exist, but request has items, sync them first
    if ((!cart || cart.items.length === 0) && requestItems && requestItems.length > 0) {
      console.log('🔄 Cart empty in database but request has items. Syncing...');

      // Create cart if doesn't exist
      if (!cart) {
        cart = await Cart.create({
          user: req.user!._id,
          items: [],
        });
      }

      // Add items from request to cart
      for (const reqItem of requestItems) {
        const product = await Product.findById(reqItem.product);
        if (!product) {
          console.warn(`⚠️ Skipping invalid product: ${reqItem.product}`);
          continue;
        }

        cart.items.push({
          product: product._id as string,
          name: product.name,
          slug: product.slug,
          image: product.images?.[0]?.url || '',
          price: product.salePrice || product.price,
          quantity: reqItem.quantity,
          subtotal: (product.salePrice || product.price) * reqItem.quantity,
        });
      }

      await cart.save();
      console.log(`✅ Synced ${cart.items.length} items to database cart`);
    }

    if (!cart || cart.items.length === 0) {
      return next(new AppError('Cart is empty. Please add items to your cart before placing an order.', 400));
    }

    console.log(`🛒 Found cart with ${cart.items.length} items`);

    // Verify stock availability and get full product details
    const orderItems = [];
    for (const item of cart.items) {
      console.log(`🔍 Checking product: ${item.product}`);
      const product = await Product.findById(item.product);

      if (!product) {
        console.error(`❌ Product not found: ${item.product} (${item.name})`);
        return next(new AppError(`Product "${item.name}" not found in database. Please refresh your cart.`, 404));
      }

      if (!product.inStock || product.stockQuantity < item.quantity) {
        return next(new AppError(`${product.name} is out of stock (Available: ${product.stockQuantity}, Requested: ${item.quantity})`, 400));
      }

      console.log(`✅ Product verified: ${product.name}`);

      orderItems.push({
        product: item.product,
        name: product.name,
        slug: product.slug,
        price: item.price,
        quantity: item.quantity,
        image: product.images?.[0]?.url || item.image || '',
        subtotal: item.price * item.quantity,
        status: 'pending',
      });
    }

    // Create order
    const order = await Order.create({
      user: req.user!._id,
      items: orderItems,
      billing,
      shipping,
      subtotal: cart.subtotal,
      tax: cart.tax,
      shippingCost: cart.shipping,
      discount: cart.discount,
      total: cart.total,
      couponCode: cart.couponCode,
      paymentMethod,
      notes,
    });

    console.log(`✅ Order created: ${order.orderNumber}`);

    // Update product stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stockQuantity: -item.quantity },
      });
    }

    // Clear user's cart
    cart.items = [];
    await cart.save();
    console.log('🗑️ Cart cleared');

    console.log(`✅ Order ${order.orderNumber} created successfully for user ${req.user!._id}`);

    // TODO: Send email notification to customer
    // await sendOrderConfirmationEmail(req.user!.email, order);

    res.status(201).json({
      success: true,
      data: order,
      message: 'Order placed successfully! Track your order in the Orders section.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user orders
// @route   GET /api/v1/orders
// @access  Private
export const getMyOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const orders = await Order.find({ user: req.user!._id })
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Order.countDocuments({ user: req.user!._id });

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/v1/orders/:id
// @access  Private
export const getOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user!._id,
    });

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   PUT /api/v1/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user!._id,
    });

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
      return next(new AppError('Cannot cancel order at this stage', 400));
    }

    order.status = 'cancelled';
    order.timeline.push({
      status: 'cancelled',
      message: 'Order cancelled by customer',
      timestamp: new Date(),
    });

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stockQuantity: item.quantity },
      });
    }

    await order.save();

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/v1/orders/all
// @access  Private/Admin
export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 20, status, paymentStatus } = req.query;

    const query: any = {};
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const skip = (Number(page) - 1) * Number(limit);

    const orders = await Order.find(query)
      .populate('user', 'firstName lastName email')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/v1/orders/:id/status
// @access  Private/Admin
export const addAdminNote = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { message } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    if (!order.adminNotes) {
      order.adminNotes = [];
    }

    order.adminNotes.push({
      message,
      timestamp: new Date(),
      admin: req.user!._id as any,
    });

    await order.save();

    // TODO: Send email notification to customer

    res.status(200).json({
      success: true,
      data: order,
      message: 'Admin note added successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, message } = req.body;

    const order = await Order.findById(req.params.id).populate('user', 'email firstName lastName');

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    order.status = status;
    order.timeline.push({
      status,
      message: message || `Order status updated to ${status}`,
      timestamp: new Date(),
    });

    await order.save();

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update payment status (Admin)
// @route   PUT /api/v1/orders/:id/payment
// @access  Private/Admin
export const updatePaymentStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { paymentStatus, paymentIntent } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    order.paymentStatus = paymentStatus;
    if (paymentIntent) order.paymentIntent = paymentIntent;

    order.timeline.push({
      status: order.status,
      message: `Payment status updated to ${paymentStatus}`,
      timestamp: new Date(),
    });

    await order.save();

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

