import apiClient from '../api-client';
import { IProduct, IProductFilter } from '@tangerine/shared';

export const productService = {
  getProducts: async (filters?: IProductFilter) => {
    const response = await apiClient.get('/products', { params: filters });
    return response.data;
  },

  getProduct: async (slug: string): Promise<IProduct> => {
    const response = await apiClient.get(`/products/${slug}`);
    return response.data.data;
  },

  getFeaturedProducts: async (limit = 8) => {
    const response = await apiClient.get('/products/featured', { params: { limit } });
    return response.data.data;
  },

  getRelatedProducts: async (productId: string) => {
    const response = await apiClient.get(`/products/${productId}/related`);
    return response.data.data;
  },

  searchProducts: async (query: string) => {
    const response = await apiClient.get('/products', { params: { search: query } });
    return response.data;
  },
};

