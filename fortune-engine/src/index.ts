/**
 * Fortune Engine - 传统易经八字算命引擎
 * @packageDocumentation
 */

// 导出主计算器
export { baziCalculator, BaziCalculator } from './bazi/bazi-calculator';

// 导出类型
export * from './types';

// 导出常量
export * from './data/constants';

// 导出工具函数
export * from './utils/wuxing-utils';
export * from './utils/date-utils';

/**
 * 快捷函数：计算八字排盘
 * @example
 * ```typescript
 * import { calculate } from '@destiny/fortune-engine';
 *
 * const result = calculate({
 *   birthDate: '1990-01-01',
 *   birthTime: '12:30',
 *   gender: 'male'
 * });
 *
 * console.log(result.pillars);
 * ```
 */
export function calculate(input: import('./types').BaziInput): import('./types').BaziResult {
  return baziCalculator.calculate(input);
}

/**
 * 版本信息
 */
export const VERSION = '1.0.0';

/**
 * 支持的日期范围
 */
export const SUPPORTED_DATE_RANGE = {
  min: new Date(1900, 0, 1),
  max: new Date(2100, 11, 31)
} as const;
