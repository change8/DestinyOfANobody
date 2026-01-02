/**
 * 四柱排盘计算器
 * @module bazi/pillar-calculator
 */

import type { Pillar, BaziOptions, Tiangan, Dizhi } from '../types';
import {
  TIANGAN,
  DIZHI,
  SIXTY_JIAZI,
  MONTH_GAN_START,
  HOUR_GAN_START
} from '../data/constants';
import {
  parseTime,
  combineDateAndTime,
  convertToTrueSolarTime,
  getDaysDifference
} from '../utils/date-utils';

/**
 * 四柱计算器类
 */
export class PillarCalculator {
  /**
   * 计算年柱
   * @param birthDate 出生日期
   * @param lichunTime 立春时间
   * @returns 年柱
   */
  calculateYearPillar(birthDate: Date, lichunTime: Date): Pillar {
    const year = birthDate.getFullYear();

    // 判断是否在立春之前
    const actualYear = birthDate < lichunTime ? year - 1 : year;

    // 公元4年为甲子年，所以减4
    const ganIndex = this.mod(actualYear - 4, 10);
    const zhiIndex = this.mod(actualYear - 4, 12);

    // 计算六十甲子索引
    const jiaziIndex = this.getJiaziIndex(ganIndex, zhiIndex);

    return {
      gan: TIANGAN[ganIndex],
      zhi: DIZHI[zhiIndex],
      ganIndex,
      zhiIndex,
      jiaziIndex
    };
  }

  /**
   * 计算月柱
   * @param birthDate 出生日期
   * @param yearGan 年干
   * @returns 月柱
   */
  calculateMonthPillar(birthDate: Date, yearGan: Tiangan): Pillar {
    // 1. 根据节气确定月支
    const monthZhi = this.getMonthZhiByJieqi(birthDate);
    const zhiIndex = DIZHI.indexOf(monthZhi);

    // 2. 根据年干计算月干（五虎遁）
    const startIndex = MONTH_GAN_START[yearGan];

    // 寅月为0，卯月为1，...
    // 寅在地支中索引为2，所以需要减2
    const monthOffset = this.mod(zhiIndex - 2, 12);
    const ganIndex = this.mod(startIndex + monthOffset, 10);

    // 计算六十甲子索引
    const jiaziIndex = this.getJiaziIndex(ganIndex, zhiIndex);

    return {
      gan: TIANGAN[ganIndex],
      zhi: monthZhi,
      ganIndex,
      zhiIndex,
      jiaziIndex
    };
  }

  /**
   * 计算日柱
   * @param date 日期
   * @returns 日柱
   */
  calculateDayPillar(date: Date): Pillar {
    // 基准日：1900年1月1日 = 甲戌日（六十甲子第10位）
    const baseDate = new Date(1900, 0, 1);
    const baseDayIndex = 10;

    // 计算天数差
    const daysDiff = getDaysDifference(baseDate, date);

    // 计算六十甲子索引
    let jiaziIndex = this.mod(baseDayIndex + daysDiff, 60);

    const ganIndex = jiaziIndex % 10;
    const zhiIndex = jiaziIndex % 12;

    return {
      gan: TIANGAN[ganIndex],
      zhi: DIZHI[zhiIndex],
      ganIndex,
      zhiIndex,
      jiaziIndex
    };
  }

  /**
   * 计算时柱
   * @param birthTime 出生时间
   * @param dayGan 日干
   * @param options 选项
   * @returns 时柱和是否算第二天
   */
  calculateHourPillar(
    birthTime: Date,
    dayGan: Tiangan,
    options: BaziOptions = {}
  ): { pillar: Pillar; isNextDay: boolean } {
    const hour = birthTime.getHours();
    const minute = birthTime.getMinutes();

    // 确定时支和是否算第二天
    let zhiIndex: number;
    let isNextDay = false;

    if (hour === 23) {
      // 夜子时（23:00-24:00）
      zhiIndex = 0; // 子时
      if (options.ziShiMethod === 'traditional' || !options.ziShiMethod) {
        isNextDay = true; // 传统方法算第二天
      }
    } else {
      // 其他时辰
      // 子(23-01) 丑(01-03) 寅(03-05) ...
      zhiIndex = Math.floor((hour + 1) / 2) % 12;
    }

    // 确定时干（五鼠遁）
    const startIndex = HOUR_GAN_START[dayGan];
    const ganIndex = this.mod(startIndex + zhiIndex, 10);

    // 计算六十甲子索引
    const jiaziIndex = this.getJiaziIndex(ganIndex, zhiIndex);

    const pillar: Pillar = {
      gan: TIANGAN[ganIndex],
      zhi: DIZHI[zhiIndex],
      ganIndex,
      zhiIndex,
      jiaziIndex
    };

    return { pillar, isNextDay };
  }

  /**
   * 根据节气确定月支
   * 注意：这里需要完整的节气数据，目前为简化版
   */
  private getMonthZhiByJieqi(date: Date): Dizhi {
    // 简化版：根据公历月份近似
    // 实际应该根据精确的节气时间判断
    const month = date.getMonth() + 1; // 1-12

    // 这是一个简化映射，实际应该查询节气表
    const monthZhiMap: Record<number, Dizhi> = {
      1: '丑', // 小寒到立春
      2: '寅', // 立春到惊蛰
      3: '卯', // 惊蛰到清明
      4: '辰', // 清明到立夏
      5: '巳', // 立夏到芒种
      6: '午', // 芒种到小暑
      7: '未', // 小暑到立秋
      8: '申', // 立秋到白露
      9: '酉', // 白露到寒露
      10: '戌', // 寒露到立冬
      11: '亥', // 立冬到大雪
      12: '子' // 大雪到小寒
    };

    return monthZhiMap[month];
  }

  /**
   * 根据天干地支索引计算六十甲子索引
   */
  private getJiaziIndex(ganIndex: number, zhiIndex: number): number {
    // 在六十甲子中查找对应的索引
    for (let i = 0; i < 60; i++) {
      if (
        SIXTY_JIAZI[i].gan === TIANGAN[ganIndex] &&
        SIXTY_JIAZI[i].zhi === DIZHI[zhiIndex]
      ) {
        return i;
      }
    }

    // 如果找不到，使用计算方法
    // 由于天干10个，地支12个，最小公倍数60
    // 可以通过中国剩余定理计算
    return this.calculateJiaziIndexByCRT(ganIndex, zhiIndex);
  }

  /**
   * 使用中国剩余定理计算六十甲子索引
   */
  private calculateJiaziIndexByCRT(ganIndex: number, zhiIndex: number): number {
    // 寻找满足以下条件的x：
    // x ≡ ganIndex (mod 10)
    // x ≡ zhiIndex (mod 12)
    // 0 ≤ x < 60

    for (let x = 0; x < 60; x++) {
      if (x % 10 === ganIndex && x % 12 === zhiIndex) {
        return x;
      }
    }

    throw new Error(`无法计算六十甲子索引：天干${ganIndex}，地支${zhiIndex}`);
  }

  /**
   * 正确的取模运算（处理负数）
   */
  private mod(n: number, m: number): number {
    return ((n % m) + m) % m;
  }

  /**
   * 处理真太阳时
   */
  applyTrueSolarTime(time: Date, options: BaziOptions): Date {
    if (options.useTrueSolarTime && options.longitude !== undefined) {
      return convertToTrueSolarTime(time, options.longitude);
    }
    return time;
  }
}

/**
 * 导出单例
 */
export const pillarCalculator = new PillarCalculator();
