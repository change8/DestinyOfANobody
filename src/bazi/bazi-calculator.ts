/**
 * 八字排盘主计算器
 * @module bazi/bazi-calculator
 */

import type {
  BaziInput,
  BaziResult,
  BaziOptions,
  Pillars,
  ShiShenAnalysis,
  NayinAnalysis,
  CangganAnalysis,
  WuxingAnalysis,
  WuxingCount,
  WuxingStrength,
  Dayun,
  Liunian
} from '../types';
import {
  parseDate,
  parseTime,
  formatDate,
  validateDateRange,
  combineDateAndTime
} from '../utils/date-utils';
import { calculateShiShen } from '../utils/wuxing-utils';
import { solarToLunar } from '../utils/lunar-converter';
import { getLichunTime as getSolarTermLichun } from '../data/solar-terms';
import { pillarCalculator } from './pillar-calculator';
import {
  NAYIN,
  CANGGAN,
  GAN_WUXING,
  ZHI_WUXING,
  SIXTY_JIAZI
} from '../data/constants';

/**
 * 八字排盘计算器
 */
export class BaziCalculator {
  /**
   * 计算八字排盘
   */
  calculate(input: BaziInput): BaziResult {
    const startTime = Date.now();

    // 1. 解析和验证输入
    const birthDate = parseDate(input.birthDate);
    validateDateRange(birthDate);
    const { hour, minute } = parseTime(input.birthTime);

    // 2. 合并日期和时间
    let birthDateTime = combineDateAndTime(birthDate, hour, minute);

    // 3. 默认选项
    const options: Required<BaziOptions> = {
      timezone: input.options?.timezone ?? 8,
      useTrueSolarTime: input.options?.useTrueSolarTime ?? false,
      longitude: input.options?.longitude ?? 120, // 默认东经120度（中国标准）
      ziShiMethod: input.options?.ziShiMethod ?? 'traditional'
    };

    // 4. 真太阳时修正
    if (options.useTrueSolarTime && options.longitude !== undefined) {
      birthDateTime = pillarCalculator.applyTrueSolarTime(birthDateTime, options);
    }

    // 5. 计算四柱
    const pillars = this.calculatePillars(birthDateTime, options);

    // 6. 计算十神
    const shishen = this.calculateShiShen(pillars);

    // 7. 计算纳音
    const nayin = this.calculateNayin(pillars);

    // 8. 计算藏干
    const canggan = this.calculateCanggan(pillars);

    // 9. 计算五行
    const wuxing = this.calculateWuxing(pillars);

    // 10. 计算大运
    const dayun = this.calculateDayun(pillars, birthDate, input.gender);

    // 11. 计算流年
    const liunian = this.calculateLiunian(birthDate.getFullYear());

    // 12. 农历信息（简化版）
    const lunar = this.calculateLunar(birthDate);

    // 13. 构建结果
    const calculationTime = Date.now() - startTime;

    const result: BaziResult = {
      input: {
        birthDate: formatDate(birthDate),
        birthTime: input.birthTime,
        gender: input.gender,
        name: input.name,
        timezone: options.timezone,
        useTrueSolarTime: options.useTrueSolarTime,
        longitude: options.longitude,
        ziShiMethod: options.ziShiMethod
      },
      lunar,
      pillars,
      shishen,
      nayin,
      canggan,
      wuxing,
      dayun,
      liunian,
      metadata: {
        version: '1.0.0',
        calculatedAt: new Date().toISOString(),
        calculationTime
      }
    };

    return result;
  }

  /**
   * 计算四柱
   */
  private calculatePillars(birthDateTime: Date, options: BaziOptions): Pillars {
    // 获取立春时间（简化版，实际应查表）
    const lichunTime = this.getLichunTime(birthDateTime.getFullYear());

    // 计算年柱
    const yearPillar = pillarCalculator.calculateYearPillar(birthDateTime, lichunTime);

    // 计算月柱
    const monthPillar = pillarCalculator.calculateMonthPillar(
      birthDateTime,
      yearPillar.gan
    );

    // 计算日柱
    let dayPillar = pillarCalculator.calculateDayPillar(birthDateTime);

    // 计算时柱
    const { pillar: hourPillar, isNextDay } = pillarCalculator.calculateHourPillar(
      birthDateTime,
      dayPillar.gan,
      options
    );

    // 如果子时算第二天，需要重新计算日柱
    if (isNextDay) {
      const nextDay = new Date(birthDateTime);
      nextDay.setDate(nextDay.getDate() + 1);
      dayPillar = pillarCalculator.calculateDayPillar(nextDay);
    }

    return {
      year: yearPillar,
      month: monthPillar,
      day: dayPillar,
      hour: hourPillar
    };
  }

  /**
   * 计算十神
   */
  private calculateShiShen(pillars: Pillars): ShiShenAnalysis {
    const dayGan = pillars.day.gan;

    return {
      year: calculateShiShen(dayGan, pillars.year.gan) as any,
      month: calculateShiShen(dayGan, pillars.month.gan) as any,
      day: '日主',
      hour: calculateShiShen(dayGan, pillars.hour.gan) as any
    };
  }

  /**
   * 计算纳音
   */
  private calculateNayin(pillars: Pillars): NayinAnalysis {
    return {
      year: NAYIN[`${pillars.year.gan}${pillars.year.zhi}`] || '未知',
      month: NAYIN[`${pillars.month.gan}${pillars.month.zhi}`] || '未知',
      day: NAYIN[`${pillars.day.gan}${pillars.day.zhi}`] || '未知',
      hour: NAYIN[`${pillars.hour.gan}${pillars.hour.zhi}`] || '未知'
    };
  }

  /**
   * 计算藏干
   */
  private calculateCanggan(pillars: Pillars): CangganAnalysis {
    return {
      year: CANGGAN[pillars.year.zhi] || [],
      month: CANGGAN[pillars.month.zhi] || [],
      day: CANGGAN[pillars.day.zhi] || [],
      hour: CANGGAN[pillars.hour.zhi] || []
    };
  }

  /**
   * 计算五行分析
   */
  private calculateWuxing(pillars: Pillars): WuxingAnalysis {
    const count: WuxingCount = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
    const strength: WuxingStrength = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };

    // 统计天干
    [pillars.year.gan, pillars.month.gan, pillars.day.gan, pillars.hour.gan].forEach(
      (gan) => {
        const wuxing = GAN_WUXING[gan];
        count[wuxing]++;
        strength[wuxing] += 10; // 天干基础分10
      }
    );

    // 统计地支
    [pillars.year.zhi, pillars.month.zhi, pillars.day.zhi, pillars.hour.zhi].forEach(
      (zhi) => {
        const wuxing = ZHI_WUXING[zhi];
        count[wuxing]++;
        strength[wuxing] += 12; // 地支基础分12
      }
    );

    // 月令加权（简化版）
    const monthWuxing = ZHI_WUXING[pillars.month.zhi];
    strength[monthWuxing] *= 1.5;

    // 归一化为百分比
    const total = Object.values(strength).reduce((sum, val) => sum + val, 0);
    const normalizedStrength: WuxingStrength = {
      木: Math.round((strength.木 / total) * 100),
      火: Math.round((strength.火 / total) * 100),
      土: Math.round((strength.土 / total) * 100),
      金: Math.round((strength.金 / total) * 100),
      水: Math.round((strength.水 / total) * 100)
    };

    // 判断日主强弱（简化版）
    const dayMasterWuxing = GAN_WUXING[pillars.day.gan];
    const dayMasterStrengthValue = normalizedStrength[dayMasterWuxing];

    let dayMasterStrength: '身旺' | '中和' | '身弱';
    if (dayMasterStrengthValue >= 30) {
      dayMasterStrength = '身旺';
    } else if (dayMasterStrengthValue >= 15) {
      dayMasterStrength = '中和';
    } else {
      dayMasterStrength = '身弱';
    }

    // 喜用神（简化版）
    let xiyongshen: string;
    let jishen: string;
    if (dayMasterStrength === '身旺') {
      // 身旺喜克泄耗
      xiyongshen = '官杀、食伤、财星';
      jishen = '印星、比劫';
    } else {
      // 身弱喜生扶
      xiyongshen = '印星、比劫';
      jishen = '官杀、食伤、财星';
    }

    return {
      count,
      strength: normalizedStrength,
      dayMasterWuxing,
      dayMasterStrength,
      xiyongshen,
      jishen
    };
  }

  /**
   * 计算大运（简化版）
   */
  private calculateDayun(pillars: Pillars, _birthDate: Date, gender: string): Dayun[] {
    const dayunList: Dayun[] = [];

    // 判断顺逆（简化版）
    const yangGan = ['甲', '丙', '戊', '庚', '壬'].includes(pillars.year.gan);
    const isShun = (gender === 'male' && yangGan) || (gender === 'female' && !yangGan);

    // 起运年龄（简化为3岁，TODO: 使用birthDate精确计算）
    const startAge = 3;

    // 排8步大运
    let currentIndex = pillars.month.jiaziIndex || 0;

    for (let i = 0; i < 8; i++) {
      if (isShun) {
        currentIndex = (currentIndex + 1) % 60;
      } else {
        currentIndex = (currentIndex - 1 + 60) % 60;
      }

      const jiazi = SIXTY_JIAZI[currentIndex];
      dayunList.push({
        gan: jiazi.gan,
        zhi: jiazi.zhi,
        startAge: startAge + i * 10,
        endAge: startAge + (i + 1) * 10 - 1,
        nayin: NAYIN[`${jiazi.gan}${jiazi.zhi}`]
      });
    }

    return dayunList;
  }

  /**
   * 计算流年（简化版）
   */
  private calculateLiunian(_birthYear: number): Liunian[] {
    const currentYear = new Date().getFullYear();
    const liunianList: Liunian[] = [];
    // TODO: 可以基于birthYear计算从出生到现在的所有流年

    // 计算近10年
    for (let i = 0; i < 10; i++) {
      const year = currentYear + i;
      const yearIndex = (year - 4) % 60;
      const jiazi = SIXTY_JIAZI[yearIndex < 0 ? yearIndex + 60 : yearIndex];

      liunianList.push({
        year,
        gan: jiazi.gan,
        zhi: jiazi.zhi,
        nayin: NAYIN[`${jiazi.gan}${jiazi.zhi}`] || '未知'
      });
    }

    return liunianList;
  }

  /**
   * 计算农历
   */
  private calculateLunar(date: Date) {
    try {
      const lunarDate = solarToLunar(date);
      return {
        year: lunarDate.year,
        month: lunarDate.month,
        day: lunarDate.day,
        leapMonth: lunarDate.isLeapMonth,
        yearName: lunarDate.yearName,
        monthName: lunarDate.monthName,
        dayName: lunarDate.dayName
      };
    } catch (error) {
      // 如果农历转换失败（可能超出范围），返回简化的近似值
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();

      return {
        year,
        month,
        day,
        leapMonth: false,
        yearName: `${year}年`,
        monthName: `${month}月`,
        dayName: `${day}日`
      };
    }
  }

  /**
   * 获取立春时间
   */
  private getLichunTime(year: number): Date {
    try {
      return getSolarTermLichun(year);
    } catch (error) {
      // 如果获取失败，返回近似值（2月4日）
      return new Date(year, 1, 4, 0, 0, 0);
    }
  }
}

/**
 * 导出单例
 */
export const baziCalculator = new BaziCalculator();
