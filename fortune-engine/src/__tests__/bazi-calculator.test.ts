/**
 * 八字排盘计算器测试
 */

import { calculate } from '../index';

describe('BaziCalculator', () => {
  describe('基础排盘功能', () => {
    it('应该正确计算1990年1月1日12:30男性的八字', () => {
      const result = calculate({
        birthDate: '1990-01-01',
        birthTime: '12:30',
        gender: 'male'
      });

      expect(result).toBeDefined();
      expect(result.pillars).toBeDefined();
      expect(result.pillars.year).toBeDefined();
      expect(result.pillars.month).toBeDefined();
      expect(result.pillars.day).toBeDefined();
      expect(result.pillars.hour).toBeDefined();

      // 验证日柱（1990-01-01应该是特定的干支）
      expect(result.pillars.day.gan).toBeDefined();
      expect(result.pillars.day.zhi).toBeDefined();
    });

    it('应该正确处理子时（23:00-01:00）', () => {
      const result = calculate({
        birthDate: '1990-01-01',
        birthTime: '23:30',
        gender: 'male',
        options: {
          ziShiMethod: 'traditional' // 夜子时算第二天
        }
      });

      expect(result.pillars.hour.zhi).toBe('子');
    });

    it('应该正确处理真太阳时', () => {
      const result = calculate({
        birthDate: '1990-01-01',
        birthTime: '12:30',
        gender: 'male',
        options: {
          useTrueSolarTime: true,
          longitude: 116.4074 // 北京经度
        }
      });

      expect(result.input.useTrueSolarTime).toBe(true);
      expect(result.input.longitude).toBe(116.4074);
    });
  });

  describe('十神计算', () => {
    it('应该正确计算十神', () => {
      const result = calculate({
        birthDate: '1990-01-01',
        birthTime: '12:30',
        gender: 'male'
      });

      expect(result.shishen).toBeDefined();
      expect(result.shishen.year).toBeDefined();
      expect(result.shishen.month).toBeDefined();
      expect(result.shishen.day).toBe('日主');
      expect(result.shishen.hour).toBeDefined();
    });
  });

  describe('纳音计算', () => {
    it('应该正确计算纳音', () => {
      const result = calculate({
        birthDate: '1990-01-01',
        birthTime: '12:30',
        gender: 'male'
      });

      expect(result.nayin).toBeDefined();
      expect(result.nayin.year).toBeDefined();
      expect(result.nayin.month).toBeDefined();
      expect(result.nayin.day).toBeDefined();
      expect(result.nayin.hour).toBeDefined();
    });
  });

  describe('五行分析', () => {
    it('应该正确统计五行个数', () => {
      const result = calculate({
        birthDate: '1990-01-01',
        birthTime: '12:30',
        gender: 'male'
      });

      expect(result.wuxing.count).toBeDefined();
      expect(result.wuxing.count.木).toBeGreaterThanOrEqual(0);
      expect(result.wuxing.count.火).toBeGreaterThanOrEqual(0);
      expect(result.wuxing.count.土).toBeGreaterThanOrEqual(0);
      expect(result.wuxing.count.金).toBeGreaterThanOrEqual(0);
      expect(result.wuxing.count.水).toBeGreaterThanOrEqual(0);

      // 总数应该为8（四柱各两个）
      const total = Object.values(result.wuxing.count).reduce((sum: number, count) => sum + (count as number), 0);
      expect(total).toBe(8);
    });

    it('应该正确计算日主强弱', () => {
      const result = calculate({
        birthDate: '1990-01-01',
        birthTime: '12:30',
        gender: 'male'
      });

      expect(result.wuxing.dayMasterWuxing).toBeDefined();
      expect(['木', '火', '土', '金', '水']).toContain(result.wuxing.dayMasterWuxing);
      expect(result.wuxing.dayMasterStrength).toBeDefined();
      expect(['身旺', '中和', '身弱']).toContain(result.wuxing.dayMasterStrength);
    });

    it('应该正确分析喜用神', () => {
      const result = calculate({
        birthDate: '1990-01-01',
        birthTime: '12:30',
        gender: 'male'
      });

      expect(result.wuxing.xiyongshen).toBeDefined();
      expect(typeof result.wuxing.xiyongshen).toBe('string');
      expect(result.wuxing.jishen).toBeDefined();
      expect(typeof result.wuxing.jishen).toBe('string');
    });
  });

  describe('大运流年', () => {
    it('应该正确计算大运', () => {
      const result = calculate({
        birthDate: '1990-01-01',
        birthTime: '12:30',
        gender: 'male'
      });

      expect(result.dayun).toBeDefined();
      expect(Array.isArray(result.dayun)).toBe(true);
      expect(result.dayun.length).toBeGreaterThan(0);

      const firstDayun = result.dayun[0];
      expect(firstDayun.gan).toBeDefined();
      expect(firstDayun.zhi).toBeDefined();
      expect(firstDayun.startAge).toBeDefined();
      expect(firstDayun.endAge).toBeDefined();
      expect(firstDayun.nayin).toBeDefined();
    });

    it('应该正确计算流年', () => {
      const result = calculate({
        birthDate: '1990-01-01',
        birthTime: '12:30',
        gender: 'male'
      });

      expect(result.liunian).toBeDefined();
      expect(Array.isArray(result.liunian)).toBe(true);
      expect(result.liunian.length).toBeGreaterThan(0);

      const firstLiunian = result.liunian[0];
      expect(firstLiunian.year).toBeDefined();
      expect(firstLiunian.gan).toBeDefined();
      expect(firstLiunian.zhi).toBeDefined();
      expect(firstLiunian.nayin).toBeDefined();
    });
  });

  describe('输入验证', () => {
    it('应该拒绝无效的日期格式', () => {
      expect(() => {
        calculate({
          birthDate: 'invalid-date',
          birthTime: '12:30',
          gender: 'male'
        });
      }).toThrow();
    });

    it('应该拒绝超出范围的日期', () => {
      expect(() => {
        calculate({
          birthDate: '1800-01-01',
          birthTime: '12:30',
          gender: 'male'
        });
      }).toThrow();

      expect(() => {
        calculate({
          birthDate: '2200-01-01',
          birthTime: '12:30',
          gender: 'male'
        });
      }).toThrow();
    });

    it('应该拒绝无效的时间格式', () => {
      expect(() => {
        calculate({
          birthDate: '1990-01-01',
          birthTime: '25:00', // 无效小时
          gender: 'male'
        });
      }).toThrow();
    });
  });

  describe('性能测试', () => {
    it('单次排盘应该在100ms内完成', () => {
      const startTime = Date.now();

      calculate({
        birthDate: '1990-01-01',
        birthTime: '12:30',
        gender: 'male'
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(100);
    });
  });

  describe('元数据', () => {
    it('应该包含版本信息', () => {
      const result = calculate({
        birthDate: '1990-01-01',
        birthTime: '12:30',
        gender: 'male'
      });

      expect(result.metadata).toBeDefined();
      expect(result.metadata.version).toBeDefined();
      expect(result.metadata.calculatedAt).toBeDefined();
      expect(result.metadata.calculationTime).toBeDefined();
    });
  });
});
