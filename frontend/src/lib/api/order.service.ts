import apiClient from '../api-client';
import { IOrder, ICreateOrderData } from '@tangerine/shared';

export const orderService = {
  createOrder: async (data: ICreateOrderData): Promise<IOrder> => {
    const response = await apiClient.post('/orders', data);
    return response.data.data;
  },

  getMyOrders: async (page = 1, limit = 10) => {
    const response = await apiClient.get('/orders', { params: { page, limit } });
    return response.data;
  },

  getOrder: async (orderId: string): Promise<IOrder> => {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data.data;
  },

  cancelOrder: async (orderId: string): Promise<IOrder> => {
    const response = await apiClient.put(`/orders/${orderId}/cancel`);
    return response.data.data;
  },
};

