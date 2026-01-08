import apiClient from './client';
import type { DivinationRecord, DivinationListResponse, PaginationParams } from '../types';

export const historyApi = {
  // 获取历史记录列表
  getList: async (params?: PaginationParams): Promise<DivinationListResponse> => {
    return apiClient.get('/api/history', { params });
  },

  // 获取单条记录详情
  getDetail: async (id: number): Promise<DivinationRecord> => {
    return apiClient.get(`/api/history/${id}`);
  },

  // 删除记录
  delete: async (id: number): Promise<void> => {
    return apiClient.delete(`/api/history/${id}`);
  },

  // 收藏/取消收藏
  toggleFavorite: async (id: number): Promise<DivinationRecord> => {
    return apiClient.put(`/api/history/${id}/favorite`);
  },
};
