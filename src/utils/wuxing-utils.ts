/**
 * 五行工具函数
 * @module utils/wuxing-utils
 */

import type { Wuxing, Tiangan } from '../types';
import { WUXING_SHENG, WUXING_KE, GAN_WUXING, GAN_YINYANG } from '../data/constants';

/**
 * 判断五行A是否生五行B
 */
export function wuxingSheng(from: Wuxing, to: Wuxing): boolean {
  return WUXING_SHENG[from] === to;
}

/**
 * 判断五行A是否克五行B
 */
export function wuxingKe(from: Wuxing, to: Wuxing): boolean {
  return WUXING_KE[from] === to;
}

/**
 * 获取生某五行的五行
 */
export function getShengWuxing(wuxing: Wuxing): Wuxing {
  // 找到哪个五行生这个五行
  for (const [key, value] of Object.entries(WUXING_SHENG)) {
    if (value === wuxing) {
      return key as Wuxing;
    }
  }
  throw new Error(`无法找到生${wuxing}的五行`);
}

/**
 * 获取克某五行的五行
 */
export function getKeWuxing(wuxing: Wuxing): Wuxing {
  // 找到哪个五行克这个五行
  for (const [key, value] of Object.entries(WUXING_KE)) {
    if (value === wuxing) {
      return key as Wuxing;
    }
  }
  throw new Error(`无法找到克${wuxing}的五行`);
}

/**
 * 计算十神
 * @param dayGan 日主天干
 * @param otherGan 其他天干
 * @returns 十神名称
 */
export function calculateShiShen(dayGan: Tiangan, otherGan: Tiangan): string {
  // 日主自己永远是"日主"
  if (dayGan === otherGan) {
    return '日主';
  }

  const dayWuxing = GAN_WUXING[dayGan];
  const otherWuxing = GAN_WUXING[otherGan];
  const sameYinYang = GAN_YINYANG[dayGan] === GAN_YINYANG[otherGan];

  // 同五行
  if (dayWuxing === otherWuxing) {
    return sameYinYang ? '比肩' : '劫财';
  }

  // 我生
  if (wuxingSheng(dayWuxing, otherWuxing)) {
    return sameYinYang ? '食神' : '伤官';
  }

  // 我克
  if (wuxingKe(dayWuxing, otherWuxing)) {
    return sameYinYang ? '偏财' : '正财';
  }

  // 克我
  if (wuxingKe(otherWuxing, dayWuxing)) {
    return sameYinYang ? '七杀' : '正官';
  }

  // 生我
  if (wuxingSheng(otherWuxing, dayWuxing)) {
    return sameYinYang ? '偏印' : '正印';
  }

  throw new Error(`无法确定${dayGan}与${otherGan}的十神关系`);
}
