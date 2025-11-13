import apiClient from '../api-client';
import { ICategory } from '@tangerine/shared';

export const categoryService = {
  getCategories: async (): Promise<ICategory[]> => {
    const response = await apiClient.get('/categories');
    return response.data.data;
  },

  getCategory: async (slug: string): Promise<ICategory> => {
    const response = await apiClient.get(`/categories/${slug}`);
    return response.data.data;
  },
};

