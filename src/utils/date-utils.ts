/**
 * 日期工具函数
 * @module utils/date-utils
 */

import { InvalidDateError, InvalidTimeError, OutOfRangeError } from '../types';

/**
 * 验证日期是否在支持范围内（1900-2100）
 */
export function validateDateRange(date: Date): void {
  const MIN_DATE = new Date(1900, 0, 1);
  const MAX_DATE = new Date(2100, 11, 31);

  if (date < MIN_DATE || date > MAX_DATE) {
    throw new OutOfRangeError(
      `日期超出支持范围（1900-2100），当前日期：${date.toISOString()}`
    );
  }
}

/**
 * 验证时间格式 (HH:mm)
 */
export function validateTimeFormat(time: string): void {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!timeRegex.test(time)) {
    throw new InvalidTimeError(`时间格式错误，应为 HH:mm 格式，当前：${time}`);
  }
}

/**
 * 解析时间字符串为小时和分钟
 */
export function parseTime(time: string): { hour: number; minute: number } {
  validateTimeFormat(time);
  const [hour, minute] = time.split(':').map(Number);
  return { hour, minute };
}

/**
 * 计算两个日期之间的天数差
 */
export function getDaysDifference(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000;
  const time1 = date1.getTime();
  const time2 = date2.getTime();
  return Math.floor((time2 - time1) / oneDay);
}

/**
 * 判断是否为闰年
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * 获取某月的天数
 */
export function getDaysInMonth(year: number, month: number): number {
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (month === 2 && isLeapYear(year)) {
    return 29;
  }
  return daysInMonth[month - 1];
}

/**
 * 合并日期和时间
 */
export function combineDateAndTime(
  date: Date,
  hour: number,
  minute: number
): Date {
  const result = new Date(date);
  result.setHours(hour, minute, 0, 0);
  return result;
}

/**
 * 解析日期字符串或Date对象
 */
export function parseDate(input: string | Date): Date {
  if (input instanceof Date) {
    if (isNaN(input.getTime())) {
      throw new InvalidDateError('无效的Date对象');
    }
    return input;
  }

  const date = new Date(input);
  if (isNaN(date.getTime())) {
    throw new InvalidDateError(`无法解析日期：${input}`);
  }

  return date;
}

/**
 * 格式化日期为 YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 格式化时间为 HH:mm
 */
export function formatTime(date: Date): string {
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${hour}:${minute}`;
}

/**
 * 转换时区
 */
export function convertToTimezone(date: Date, timezone: number): Date {
  const localOffset = date.getTimezoneOffset(); // 本地时区偏移（分钟）
  const targetOffset = -timezone * 60; // 目标时区偏移（分钟）
  const diff = targetOffset - localOffset;
  return new Date(date.getTime() + diff * 60 * 1000);
}

/**
 * 真太阳时修正
 * @param time 平太阳时
 * @param longitude 经度（东经为正）
 * @returns 真太阳时
 */
export function convertToTrueSolarTime(time: Date, longitude: number): Date {
  // 1. 经度修正（东八区标准经度120°）
  const longitudeOffset = (longitude - 120) * 4; // 分钟

  // 2. 时差修正（简化版，实际应使用完整的时差表）
  const equationOfTime = getEquationOfTime(time);

  // 3. 总修正
  const totalOffset = longitudeOffset + equationOfTime;

  return new Date(time.getTime() + totalOffset * 60 * 1000);
}

/**
 * 获取时差修正值（简化版）
 * 实际应该使用完整的时差表或天文算法
 */
function getEquationOfTime(date: Date): number {
  // 简化算法：使用近似公式
  const dayOfYear = getDayOfYear(date);
  const B = (360 / 365) * (dayOfYear - 81);
  const BRad = (B * Math.PI) / 180;

  // 时差公式（分钟）
  const E =
    9.87 * Math.sin(2 * BRad) - 7.53 * Math.cos(BRad) - 1.5 * Math.sin(BRad);

  return E;
}

/**
 * 获取一年中的第几天
 */
function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * 克隆日期对象
 */
export function cloneDate(date: Date): Date {
  return new Date(date.getTime());
}
