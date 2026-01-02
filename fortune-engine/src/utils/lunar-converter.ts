/**
 * 农历转换工具
 * 提供公历与农历之间的相互转换
 */

import { parseLunarYear, getLunarNewYear } from '../data/lunar-data';

/**
 * 农历日期信息
 */
export interface LunarDate {
  /** 农历年份 */
  year: number;
  /** 农历月份 (1-12) */
  month: number;
  /** 农历日期 (1-30) */
  day: number;
  /** 是否闰月 */
  isLeapMonth: boolean;
  /** 年份干支名称 */
  yearName: string;
  /** 月份名称 */
  monthName: string;
  /** 日期名称 */
  dayName: string;
  /** 对应的公历日期 */
  solarDate: Date;
}

/**
 * 农历月份名称
 */
const LUNAR_MONTH_NAMES = [
  '正月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '冬月', '腊月'
];

/**
 * 农历日期名称（用天干地支表示）
 */
const LUNAR_DAY_NAMES = [
  '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
];

/**
 * 天干地支
 */
const TIANGAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const DIZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

/**
 * 公历转农历
 */
export function solarToLunar(solarDate: Date): LunarDate {
  const year = solarDate.getFullYear();

  // 验证年份范围
  if (year < 1900 || year > 2100) {
    throw new Error(`年份${year}超出支持范围(1900-2100)`);
  }

  // 获取当年春节日期
  const springFestival = getLunarNewYear(year);
  const springFestivalDate = new Date(year, springFestival.month - 1, springFestival.day);

  // 判断是否在春节之前
  let lunarYear = year;
  let daysOffset = 0;

  if (solarDate < springFestivalDate) {
    // 如果在春节之前，属于上一年农历
    lunarYear = year - 1;
    const lastYearSpringFestival = getLunarNewYear(lunarYear);
    const lastYearSpringDate = new Date(lunarYear, lastYearSpringFestival.month - 1, lastYearSpringFestival.day);

    // 计算距离上一年春节的天数
    daysOffset = Math.floor((solarDate.getTime() - lastYearSpringDate.getTime()) / (24 * 60 * 60 * 1000));
  } else {
    // 计算距离当年春节的天数
    daysOffset = Math.floor((solarDate.getTime() - springFestivalDate.getTime()) / (24 * 60 * 60 * 1000));
  }

  // 根据天数偏移计算农历月份和日期
  const lunarYearInfo = parseLunarYear(lunarYear);
  let lunarMonth = 1;
  let lunarDay = 1;
  let isLeapMonth = false;
  let remainingDays = daysOffset;

  // 遍历每个月，找到对应的农历月份和日期
  for (let m = 0; m < 13; m++) {
    let monthDays: number;

    if (m < 12) {
      // 普通月
      monthDays = lunarYearInfo.monthDays[m];

      if (remainingDays < monthDays) {
        lunarMonth = m + 1;
        lunarDay = remainingDays + 1;
        break;
      }

      remainingDays -= monthDays;

      // 如果有闰月且在当前月之后
      if (lunarYearInfo.leapMonth === m + 1) {
        // 闰月
        monthDays = lunarYearInfo.leapMonthBig ? 30 : 29;

        if (remainingDays < monthDays) {
          lunarMonth = m + 1;
          lunarDay = remainingDays + 1;
          isLeapMonth = true;
          break;
        }

        remainingDays -= monthDays;
      }
    }
  }

  // 生成年份干支名称
  const ganIndex = (lunarYear - 4) % 10;
  const zhiIndex = (lunarYear - 4) % 12;
  const yearName = `${TIANGAN[ganIndex]}${DIZHI[zhiIndex]}年`;

  // 生成月份名称
  const monthName = (isLeapMonth ? '闰' : '') + LUNAR_MONTH_NAMES[lunarMonth - 1];

  // 生成日期名称
  const dayName = LUNAR_DAY_NAMES[lunarDay - 1] || `${lunarDay}日`;

  return {
    year: lunarYear,
    month: lunarMonth,
    day: lunarDay,
    isLeapMonth,
    yearName,
    monthName,
    dayName,
    solarDate
  };
}

/**
 * 农历转公历
 */
export function lunarToSolar(
  year: number,
  month: number,
  day: number,
  isLeapMonth: boolean = false
): Date {
  // 验证年份范围
  if (year < 1900 || year > 2100) {
    throw new Error(`年份${year}超出支持范围(1900-2100)`);
  }

  const lunarYearInfo = parseLunarYear(year);

  // 验证月份
  if (month < 1 || month > 12) {
    throw new Error(`月份${month}无效`);
  }

  // 如果指定闰月，验证是否存在闰月
  if (isLeapMonth && lunarYearInfo.leapMonth !== month) {
    throw new Error(`${year}年没有闰${month}月`);
  }

  // 验证日期
  const maxDay = isLeapMonth
    ? (lunarYearInfo.leapMonthBig ? 30 : 29)
    : lunarYearInfo.monthDays[month - 1];

  if (day < 1 || day > maxDay) {
    throw new Error(`日期${day}超出${month}月范围(1-${maxDay})`);
  }

  // 获取春节日期
  const springFestival = getLunarNewYear(year);
  const springFestivalDate = new Date(year, springFestival.month - 1, springFestival.day);

  // 计算从春节开始的天数偏移
  let daysOffset = day - 1;

  // 累加前面月份的天数
  for (let m = 0; m < month - 1; m++) {
    daysOffset += lunarYearInfo.monthDays[m];

    // 如果有闰月且在当前月之前
    if (lunarYearInfo.leapMonth > 0 && lunarYearInfo.leapMonth === m + 1) {
      daysOffset += lunarYearInfo.leapMonthBig ? 30 : 29;
    }
  }

  // 如果是闰月，还需要加上正常月的天数
  if (isLeapMonth) {
    daysOffset += lunarYearInfo.monthDays[month - 1];
  }

  // 计算公历日期
  const solarDate = new Date(springFestivalDate);
  solarDate.setDate(solarDate.getDate() + daysOffset);

  return solarDate;
}

/**
 * 获取农历年份的天数
 */
export function getLunarYearDays(year: number): number {
  const info = parseLunarYear(year);
  return info.totalDays;
}

/**
 * 获取农历月份的天数
 */
export function getLunarMonthDays(year: number, month: number, isLeapMonth: boolean = false): number {
  const info = parseLunarYear(year);

  if (isLeapMonth) {
    if (info.leapMonth !== month) {
      throw new Error(`${year}年没有闰${month}月`);
    }
    return info.leapMonthBig ? 30 : 29;
  }

  return info.monthDays[month - 1];
}

/**
 * 判断是否为农历闰年
 */
export function isLunarLeapYear(year: number): boolean {
  const info = parseLunarYear(year);
  return info.leapMonth > 0;
}

/**
 * 获取农历闰月月份
 * @returns 闰月月份，0表示无闰月
 */
export function getLunarLeapMonth(year: number): number {
  const info = parseLunarYear(year);
  return info.leapMonth;
}
