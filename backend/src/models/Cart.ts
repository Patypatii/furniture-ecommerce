import mongoose, { Document, Schema } from 'mongoose';
import { ICart, ICartItem } from '@tangerine/shared';

export interface ICartDocument extends Omit<ICart, '_id'>, Document {}

const cartItemSchema = new Schema<ICartItem>({
  product: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  variant: {
    id: String,
    name: String,
    value: String,
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0,
  },
});

const cartSchema = new Schema<ICartDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    sessionId: {
      type: String,
      index: true,
    },
    items: [cartItemSchema],
    subtotal: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    tax: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    shipping: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    couponCode: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
cartSchema.index({ user: 1 }, { unique: true, sparse: true });
cartSchema.index({ sessionId: 1 }, { unique: true, sparse: true });
cartSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 7 * 24 * 60 * 60 }); // Delete after 7 days

// Calculate totals before saving
cartSchema.pre('save', function (next) {
  // Calculate subtotal
  this.subtotal = this.items.reduce((total, item) => total + item.subtotal, 0);
  
  // Calculate tax (16% VAT for Kenya)
  this.tax = this.subtotal * 0.16;
  
  // Free shipping over KES 50,000
  this.shipping = this.subtotal >= 50000 ? 0 : 1500;
  
  // Calculate total
  this.total = this.subtotal + this.tax + this.shipping - this.discount;
  
  next();
});

const Cart = mongoose.model<ICartDocument>('Cart', cartSchema);

export default Cart;

