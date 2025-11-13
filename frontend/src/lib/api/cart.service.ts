import apiClient from '../api-client';
import { ICart, IAddToCartData, IUpdateCartItemData } from '@tangerine/shared';

export const cartService = {
  getCart: async (): Promise<ICart> => {
    const response = await apiClient.get('/cart');
    return response.data.data;
  },

  addToCart: async (data: IAddToCartData): Promise<ICart> => {
    const response = await apiClient.post('/cart/add', data);
    return response.data.data;
  },

  updateCartItem: async (data: IUpdateCartItemData): Promise<ICart> => {
    const response = await apiClient.put('/cart/update', data);
    return response.data.data;
  },

  removeFromCart: async (productId: string): Promise<ICart> => {
    const response = await apiClient.delete(`/cart/remove/${productId}`);
    return response.data.data;
  },

  clearCart: async (): Promise<ICart> => {
    const response = await apiClient.delete('/cart/clear');
    return response.data.data;
  },

  applyCoupon: async (code: string): Promise<ICart> => {
    const response = await apiClient.post('/cart/coupon', { code });
    return response.data.data;
  },
};

