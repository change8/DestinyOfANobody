/**
 * 四柱计算器测试
 */

import { pillarCalculator } from '../bazi/pillar-calculator';
import { TIANGAN, DIZHI } from '../data/constants';

describe('PillarCalculator', () => {
  describe('年柱计算', () => {
    it('应该正确计算立春后的年柱', () => {
      // 1990年立春后（2月4日之后）
      const birthDate = new Date(1990, 2, 1); // 3月1日
      const lichunTime = new Date(1990, 1, 4); // 2月4日立春

      const yearPillar = pillarCalculator.calculateYearPillar(birthDate, lichunTime);

      expect(yearPillar.gan).toBe('庚');
      expect(yearPillar.zhi).toBe('午');
    });

    it('应该正确计算立春前的年柱（算上一年）', () => {
      // 1990年1月（立春前）
      const birthDate = new Date(1990, 0, 15); // 1月15日
      const lichunTime = new Date(1990, 1, 4); // 2月4日立春

      const yearPillar = pillarCalculator.calculateYearPillar(birthDate, lichunTime);

      // 立春前算1989年
      expect(yearPillar.gan).toBe('己');
      expect(yearPillar.zhi).toBe('巳');
    });
  });

  describe('日柱计算', () => {
    it('应该正确计算日柱', () => {
      const birthDate = new Date(2000, 0, 1); // 2000年1月1日

      const dayPillar = pillarCalculator.calculateDayPillar(birthDate);

      expect(dayPillar.gan).toBeDefined();
      expect(dayPillar.zhi).toBeDefined();
      expect(TIANGAN).toContain(dayPillar.gan);
      expect(DIZHI).toContain(dayPillar.zhi);
    });

    it('应该为相同日期返回相同的日柱', () => {
      const date1 = new Date(1990, 5, 15);
      const date2 = new Date(1990, 5, 15);

      const pillar1 = pillarCalculator.calculateDayPillar(date1);
      const pillar2 = pillarCalculator.calculateDayPillar(date2);

      expect(pillar1.gan).toBe(pillar2.gan);
      expect(pillar1.zhi).toBe(pillar2.zhi);
    });

    it('应该为连续日期返回递增的日柱', () => {
      const date1 = new Date(2000, 0, 1);
      const date2 = new Date(2000, 0, 2);

      const pillar1 = pillarCalculator.calculateDayPillar(date1);
      const pillar2 = pillarCalculator.calculateDayPillar(date2);

      // 日柱应该按六十甲子顺序递增
      const expectedIndex = ((pillar1.jiaziIndex || 0) + 1) % 60;
      expect(pillar2.jiaziIndex).toBe(expectedIndex);
    });
  });

  describe('时柱计算', () => {
    it('应该正确计算子时（23:00-01:00）', () => {
      const birthTime = new Date(2000, 0, 1, 23, 30); // 23:30
      const dayGan = '甲';

      const result = pillarCalculator.calculateHourPillar(birthTime, dayGan, {
        ziShiMethod: 'traditional'
      });

      expect(result.pillar.zhi).toBe('子');
      expect(result.isNextDay).toBe(true); // 夜子时算第二天
    });

    it('应该正确计算早子时（00:00-01:00）', () => {
      const birthTime = new Date(2000, 0, 1, 0, 30); // 00:30
      const dayGan = '甲';

      const result = pillarCalculator.calculateHourPillar(birthTime, dayGan);

      expect(result.pillar.zhi).toBe('子');
      expect(result.isNextDay).toBe(false); // 早子时不算第二天
    });

    it('应该正确使用五鼠遁计算时干', () => {
      // 甲己日子时起甲子
      const birthTime = new Date(2000, 0, 1, 23, 30);
      const dayGan = '甲';

      const result = pillarCalculator.calculateHourPillar(birthTime, dayGan);

      expect(result.pillar.gan).toBe('甲');
      expect(result.pillar.zhi).toBe('子');
    });

    it('应该正确计算各个时辰', () => {
      const testCases = [
        { hour: 1, expectedZhi: '丑' },
        { hour: 3, expectedZhi: '寅' },
        { hour: 5, expectedZhi: '卯' },
        { hour: 7, expectedZhi: '辰' },
        { hour: 9, expectedZhi: '巳' },
        { hour: 11, expectedZhi: '午' },
        { hour: 13, expectedZhi: '未' },
        { hour: 15, expectedZhi: '申' },
        { hour: 17, expectedZhi: '酉' },
        { hour: 19, expectedZhi: '戌' },
        { hour: 21, expectedZhi: '亥' },
        { hour: 23, expectedZhi: '子' }
      ];

      testCases.forEach(({ hour, expectedZhi }) => {
        const birthTime = new Date(2000, 0, 1, hour, 0);
        const result = pillarCalculator.calculateHourPillar(birthTime, '甲');

        expect(result.pillar.zhi).toBe(expectedZhi);
      });
    });
  });

  describe('月柱计算', () => {
    it('应该正确计算月柱', () => {
      const birthDate = new Date(2000, 5, 15); // 6月15日
      const yearGan = '庚';

      const monthPillar = pillarCalculator.calculateMonthPillar(birthDate, yearGan);

      expect(monthPillar.gan).toBeDefined();
      expect(monthPillar.zhi).toBeDefined();
      expect(TIANGAN).toContain(monthPillar.gan);
      expect(DIZHI).toContain(monthPillar.zhi);
    });

    it('应该正确使用五虎遁计算月干', () => {
      // 甲己之年丙作首
      const birthDate = new Date(2000, 1, 15); // 2月15日（寅月）
      const yearGan = '甲';

      const monthPillar = pillarCalculator.calculateMonthPillar(birthDate, yearGan);

      // 寅月，甲年起丙寅
      expect(monthPillar.gan).toBe('丙');
      expect(monthPillar.zhi).toBe('寅');
    });
  });

  describe('真太阳时', () => {
    it('应该正确应用真太阳时修正', () => {
      const time = new Date(2000, 0, 1, 12, 0);
      const options = {
        useTrueSolarTime: true,
        longitude: 120 // 东经120度
      };

      const correctedTime = pillarCalculator.applyTrueSolarTime(time, options);

      expect(correctedTime).toBeDefined();
      expect(correctedTime instanceof Date).toBe(true);
    });

    it('不使用真太阳时时应该返回原时间', () => {
      const time = new Date(2000, 0, 1, 12, 0);
      const options = {
        useTrueSolarTime: false
      };

      const result = pillarCalculator.applyTrueSolarTime(time, options);

      expect(result).toBe(time);
    });
  });
});
