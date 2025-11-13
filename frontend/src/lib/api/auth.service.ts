import apiClient from '../api-client';
import { IAuthResponse, ILoginCredentials, IRegisterData } from '@tangerine/shared';

export const authService = {
  register: async (data: IRegisterData): Promise<IAuthResponse> => {
    const response = await apiClient.post<{ success: boolean; data: IAuthResponse }>(
      '/auth/register',
      data
    );
    return response.data.data;
  },

  login: async (credentials: ILoginCredentials): Promise<IAuthResponse> => {
    const response = await apiClient.post<{ success: boolean; data: IAuthResponse }>(
      '/auth/login',
      credentials
    );
    return response.data.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data.data;
  },

  updateProfile: async (data: any) => {
    const response = await apiClient.put('/auth/update-profile', data);
    return response.data.data;
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    const response = await apiClient.put('/auth/change-password', data);
    return response.data;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await apiClient.post('/auth/refresh-token', { refreshToken });
    return response.data.data;
  },
};

