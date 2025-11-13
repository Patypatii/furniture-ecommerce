import apiClient from '../api-client';
import { IAddress } from '@tangerine/shared';

export const userService = {
  // Address management
  addAddress: async (address: Partial<IAddress>) => {
    const response = await apiClient.post('/users/addresses', address);
    return response.data;
  },

  updateAddress: async (addressId: string, address: Partial<IAddress>) => {
    const response = await apiClient.put(`/users/addresses/${addressId}`, address);
    return response.data;
  },

  deleteAddress: async (addressId: string) => {
    const response = await apiClient.delete(`/users/addresses/${addressId}`);
    return response.data;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data.data;
  },
};




