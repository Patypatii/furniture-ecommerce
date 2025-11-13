import mongoose, { Document, Schema } from 'mongoose';
import { IProduct } from '@tangerine/shared';

export interface IProductDocument extends Omit<IProduct, '_id'>, Document {}

const productSchema = new Schema<IProductDocument>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    shortDescription: String,
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    salePrice: {
      type: Number,
      min: 0,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true,
    },
    subcategory: String,
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String, default: '' },
        isPrimary: { type: Boolean, default: false },
        order: { type: Number, default: 0 },
        thumbnail: String,
        medium: String,
        large: String,
      },
    ],
    model3D: {
      glbUrl: String,
      usdzUrl: String,
      thumbnailUrl: String,
      size: Number,
    },
    variants: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        type: {
          type: String,
          enum: ['color', 'size', 'material', 'finish'],
          required: true,
        },
        value: { type: String, required: true },
        priceModifier: { type: Number, default: 0 },
        images: [String],
        sku: String,
        inStock: { type: Boolean, default: true },
      },
    ],
    specifications: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    dimensions: {
      length: { type: Number, required: true },
      width: { type: Number, required: true },
      height: { type: Number, required: true },
      weight: { type: Number, required: true },
      unit: {
        type: String,
        enum: ['cm', 'inch'],
        default: 'cm',
      },
      weightUnit: {
        type: String,
        enum: ['kg', 'lb'],
        default: 'kg',
      },
    },
    materials: [String],
    colors: [String],
    inStock: {
      type: Boolean,
      default: true,
      index: true,
    },
    stockQuantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    tags: [String],
    seoTitle: String,
    seoDescription: String,
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ price: 1, rating: -1 });
productSchema.index({ category: 1, inStock: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ slug: 1 }, { unique: true });

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function () {
  if (this.salePrice && this.salePrice < this.price) {
    return Math.round(((this.price - this.salePrice) / this.price) * 100);
  }
  return 0;
});

// Check if product is low stock
productSchema.virtual('isLowStock').get(function () {
  return this.inStock && this.stockQuantity <= this.lowStockThreshold;
});

const Product = mongoose.model<IProductDocument>('Product', productSchema);

export default Product;

