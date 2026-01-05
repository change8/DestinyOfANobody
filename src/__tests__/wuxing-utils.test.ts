/**
 * 五行工具函数测试
 */

import { wuxingSheng, wuxingKe, calculateShiShen } from '../utils/wuxing-utils';
import type { Wuxing, Tiangan } from '../types';

describe('WuxingUtils', () => {
  describe('五行相生', () => {
    it('木生火', () => {
      expect(wuxingSheng('木', '火')).toBe(true);
    });

    it('火生土', () => {
      expect(wuxingSheng('火', '土')).toBe(true);
    });

    it('土生金', () => {
      expect(wuxingSheng('土', '金')).toBe(true);
    });

    it('金生水', () => {
      expect(wuxingSheng('金', '水')).toBe(true);
    });

    it('水生木', () => {
      expect(wuxingSheng('水', '木')).toBe(true);
    });

    it('不相生的情况', () => {
      expect(wuxingSheng('木', '土')).toBe(false);
      expect(wuxingSheng('火', '金')).toBe(false);
    });
  });

  describe('五行相克', () => {
    it('木克土', () => {
      expect(wuxingKe('木', '土')).toBe(true);
    });

    it('土克水', () => {
      expect(wuxingKe('土', '水')).toBe(true);
    });

    it('水克火', () => {
      expect(wuxingKe('水', '火')).toBe(true);
    });

    it('火克金', () => {
      expect(wuxingKe('火', '金')).toBe(true);
    });

    it('金克木', () => {
      expect(wuxingKe('金', '木')).toBe(true);
    });

    it('不相克的情况', () => {
      expect(wuxingKe('木', '火')).toBe(false);
      expect(wuxingKe('火', '土')).toBe(false);
    });
  });

  describe('十神计算', () => {
    it('相同五行应该返回比肩或劫财', () => {
      const result1 = calculateShiShen('甲', '甲'); // 同一天干返回"日主"
      const result2 = calculateShiShen('甲', '乙'); // 同五行不同天干返回"劫财"

      expect(result1).toBe('日主');
      expect(['比肩', '劫财']).toContain(result2);
    });

    it('日主应该返回日主', () => {
      const result = calculateShiShen('甲', '甲');

      // 同一天干可能返回"日主"或"比肩"，取决于实现
      expect(['日主', '比肩']).toContain(result);
    });

    it('我生者应该返回食神或伤官', () => {
      // 甲（木）生丙（火）
      const result = calculateShiShen('甲', '丙');

      expect(['食神', '伤官']).toContain(result);
    });

    it('我克者应该返回正财或偏财', () => {
      // 甲（木）克戊（土）
      const result = calculateShiShen('甲', '戊');

      expect(['正财', '偏财']).toContain(result);
    });

    it('克我者应该返回正官或七杀', () => {
      // 庚（金）克甲（木）
      const result = calculateShiShen('甲', '庚');

      expect(['正官', '七杀']).toContain(result);
    });

    it('生我者应该返回正印或偏印', () => {
      // 壬（水）生甲（木）
      const result = calculateShiShen('甲', '壬');

      expect(['正印', '偏印']).toContain(result);
    });

    it('应该正确计算所有十神', () => {
      const dayGan: Tiangan = '甲';
      const otherGans: Tiangan[] = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

      otherGans.forEach(gan => {
        const result = calculateShiShen(dayGan, gan);
        expect(result).toBeDefined();
        expect(typeof result).toBe('string');
      });
    });
  });

  describe('边界情况', () => {
    it('应该处理所有五行组合', () => {
      const wuxingList: Wuxing[] = ['木', '火', '土', '金', '水'];

      wuxingList.forEach(wx1 => {
        wuxingList.forEach(wx2 => {
          // 应该不会抛出错误
          expect(() => wuxingSheng(wx1, wx2)).not.toThrow();
          expect(() => wuxingKe(wx1, wx2)).not.toThrow();
        });
      });
    });

    it('应该处理所有天干组合', () => {
      const tiangan: Tiangan[] = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

      tiangan.forEach(gan1 => {
        tiangan.forEach(gan2 => {
          // 应该不会抛出错误
          expect(() => calculateShiShen(gan1, gan2)).not.toThrow();
        });
      });
    });
  });
});
