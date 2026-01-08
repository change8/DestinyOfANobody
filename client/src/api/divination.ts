import apiClient from './client';
import type { BaziInput, BaziResult, MeihuaInput, MeihuaResult } from '../types';

export const divinationApi = {
  // 八字排盘
  bazi: async (data: BaziInput): Promise<BaziResult> => {
    return apiClient.post('/api/divination/bazi', data);
  },

  // 梅花易数
  meihua: async (data: MeihuaInput): Promise<MeihuaResult> => {
    return apiClient.post('/api/divination/meihua', data);
  },
};
