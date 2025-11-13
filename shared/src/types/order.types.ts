import { IAddress } from './user.types';
import { ICartItem } from './cart.types';

export interface IOrder {
  _id: string;
  orderNumber: string;
  user: string;
  items: IOrderItem[];
  billing: IAddress;
  shipping: IAddress;
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  total: number;
  couponCode?: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentIntent?: string;
  trackingNumber?: string;
  notes?: string;
  adminNotes?: IAdminNote[];
  timeline: IOrderTimeline[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderItem extends ICartItem {
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded';

export type PaymentMethod =
  | 'card'
  | 'mpesa'
  | 'bank_transfer'
  | 'cash_on_delivery';

export interface IOrderTimeline {
  status: OrderStatus;
  message: string;
  timestamp: Date;
  by?: string;
}

export interface IAdminNote {
  message: string;
  timestamp: Date;
  admin: string;
}

export interface ICreateOrderData {
  items: ICartItem[];
  billing: IAddress;
  shipping: IAddress;
  paymentMethod: PaymentMethod;
  notes?: string;
}

