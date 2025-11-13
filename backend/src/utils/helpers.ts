import { Response } from 'express';
import { HTTP_STATUS } from './constants';
import { IApiResponse } from '@tangerine/shared';

/**
 * Send success response
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = HTTP_STATUS.OK
): Response => {
  const response: IApiResponse<T> = {
    success: true,
    data,
    message,
  };
  return res.status(statusCode).json(response);
};

/**
 * Send error response
 */
export const sendError = (
  res: Response,
  error: string,
  statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  errors?: any[]
): Response => {
  const response: IApiResponse = {
    success: false,
    error,
    errors,
  };
  return res.status(statusCode).json(response);
};

/**
 * Generate order number
 */
export const generateOrderNumber = (): string => {
  const prefix = 'TF';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
};

/**
 * Calculate pagination
 */
export const calculatePagination = (
  page: number = 1,
  limit: number = 20,
  total: number
) => {
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext,
    hasPrev,
  };
};

/**
 * Sleep utility
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Calculate cart totals
 */
export const calculateCartTotals = (items: any[], taxRate: number = 0.16) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * taxRate;
  const shipping = subtotal > 10000 ? 0 : 500; // Free shipping over 10,000 KES
  const total = subtotal + tax + shipping;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    shipping: Math.round(shipping * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
};

/**
 * Calculate shipping cost based on location
 */
export const calculateShipping = (city: string, weight: number): number => {
  const baseRates: Record<string, number> = {
    'Nairobi': 300,
    'Mombasa': 800,
    'Kisumu': 1000,
    'Nakuru': 600,
    'Eldoret': 900,
  };

  const baseRate = baseRates[city] || 1200;
  const weightFactor = Math.ceil(weight / 10) * 100; // 100 KES per 10kg
  
  return baseRate + weightFactor;
};

/**
 * Sanitize user data (remove sensitive fields)
 */
export const sanitizeUser = (user: any) => {
  const { password, __v, ...sanitized } = user.toObject ? user.toObject() : user;
  return sanitized;
};

/**
 * Generate SKU
 */
export const generateSKU = (category: string, name: string): string => {
  const categoryCode = category.substring(0, 3).toUpperCase();
  const nameCode = name.replace(/\s+/g, '-').substring(0, 8).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  
  return `${categoryCode}-${nameCode}-${random}`;
};

/**
 * Parse sort query
 */
export const parseSortQuery = (sort?: string): Record<string, 1 | -1> => {
  const sortMap: Record<string, Record<string, 1 | -1>> = {
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
    'name-asc': { name: 1 },
    'name-desc': { name: -1 },
    'newest': { createdAt: -1 },
    'oldest': { createdAt: 1 },
    'popular': { reviewCount: -1, rating: -1 },
    'rating': { rating: -1 },
  };

  return sortMap[sort || 'newest'] || { createdAt: -1 };
};

export default {
  sendSuccess,
  sendError,
  generateOrderNumber,
  calculatePagination,
  sleep,
  calculateCartTotals,
  calculateShipping,
  sanitizeUser,
  generateSKU,
  parseSortQuery,
};

