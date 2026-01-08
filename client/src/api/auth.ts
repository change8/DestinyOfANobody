import apiClient from './client';
import type { LoginRequest, RegisterRequest, AuthResponse, User } from '../types';

export const authApi = {
  // 用户注册
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    return apiClient.post('/api/auth/register', data);
  },

  // 用户登录
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    return apiClient.post('/api/auth/login', data);
  },

  // 获取当前用户信息
  me: async (): Promise<User> => {
    return apiClient.get('/api/auth/me');
  },
};
