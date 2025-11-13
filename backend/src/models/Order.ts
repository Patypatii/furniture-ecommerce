import mongoose, { Document, Schema } from 'mongoose';
import { IOrder, IOrderItem, IOrderTimeline, OrderStatus, PaymentStatus, PaymentMethod } from '@tangerine/shared';

export interface IOrderDocument extends Omit<IOrder, '_id'>, Document { }

const orderItemSchema = new Schema<IOrderItem>({
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
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
    },
});

const timelineSchema = new Schema<IOrderTimeline>({
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    by: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
});

const adminNoteSchema = new Schema({
    message: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

const orderSchema = new Schema<IOrderDocument>(
    {
        orderNumber: {
            type: String,
            required: false, // Auto-generated in pre-save hook
            unique: true,
        },
        user: {
            type: Schema.Types.ObjectId as any,
            ref: 'User',
            required: true,
        },
        items: [orderItemSchema],
        billing: {
            type: {
                type: String,
                enum: ['billing', 'shipping'],
                default: 'billing',
            },
            isDefault: Boolean,
            fullName: { type: String, required: true },
            phone: { type: String, required: true },
            addressLine1: { type: String, required: true },
            addressLine2: String,
            city: { type: String, required: true },
            state: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, default: 'Kenya' },
            coordinates: {
                lat: Number,
                lng: Number,
            },
        },
        shipping: {
            type: {
                type: String,
                enum: ['billing', 'shipping'],
                default: 'shipping',
            },
            isDefault: Boolean,
            fullName: { type: String, required: true },
            phone: { type: String, required: true },
            addressLine1: { type: String, required: true },
            addressLine2: String,
            city: { type: String, required: true },
            state: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, default: 'Kenya' },
            coordinates: {
                lat: Number,
                lng: Number,
            },
        },
        subtotal: {
            type: Number,
            required: true,
            min: 0,
        },
        tax: {
            type: Number,
            required: true,
            min: 0,
        },
        shippingCost: {
            type: Number,
            required: true,
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
            min: 0,
        },
        couponCode: String,
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
            default: 'pending',
            index: true,
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
            default: 'pending',
            index: true,
        },
        paymentMethod: {
            type: String,
            enum: ['card', 'mpesa', 'bank_transfer', 'cash_on_delivery'],
            required: true,
        },
        paymentIntent: String,
        trackingNumber: String,
        notes: String,
        adminNotes: [adminNoteSchema],
        timeline: [timelineSchema],
    },
    {
        timestamps: true,
    }
);

// Generate order number before saving
orderSchema.pre('save', async function (next) {
    const doc = this as any;
    if (this.isNew && !doc.orderNumber) {
        const count = await mongoose.model('Order').countDocuments();
        doc.orderNumber = `TF-${Date.now()}-${String(count + 1).padStart(5, '0')}`;

        // Add initial timeline entry
        doc.timeline.push({
            status: 'pending',
            message: 'Order created',
            timestamp: new Date(),
        } as IOrderTimeline);
    }
    next();
});

// Indexes
orderSchema.index({ orderNumber: 1 }, { unique: true });
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });

const Order = mongoose.model<IOrderDocument>('Order', orderSchema);

export default Order;

