/**
 * 梅花易数 - 起卦模块
 */

import { BA_GUA_BY_INDEX, type BaGua } from './bagua-data';
import { getGuaName } from './liushisi-gua';

/**
 * 卦象结果
 */
export interface GuaResult {
  // 基本信息
  upperGua: BaGua;        // 上卦（外卦）
  lowerGua: BaGua;        // 下卦（内卦）
  changingLine: number;   // 动爻（1-6）
  mainGuaName: string;    // 主卦名

  // 变卦信息
  changeGua?: {
    upperGua: BaGua;
    lowerGua: BaGua;
    guaName: string;
  };

  // 起卦方法
  method: string;

  // 原始数据
  rawData: {
    upperNumber: number;
    lowerNumber: number;
    totalNumber: number;
  };
}

/**
 * 根据数字获取八卦
 */
function getGuaByNumber(num: number): BaGua {
  // 处理负数和0的情况
  let absNum = Math.abs(num);
  if (absNum === 0) absNum = 8;  // 0视为8

  const index = ((absNum - 1) % 8) + 1;  // 确保在1-8范围内
  return BA_GUA_BY_INDEX[index];
}

/**
 * 计算动爻
 */
function getChangingLine(num: number): number {
  const line = ((num - 1) % 6) + 1;  // 确保在1-6范围内
  return line;
}

/**
 * 获取变卦
 */
function getChangeGua(upperGua: BaGua, lowerGua: BaGua, changingLine: number): { upperGua: BaGua; lowerGua: BaGua } {
  // 这里简化处理，实际应该根据动爻位置改变对应的爻
  // 1-3爻在下卦，4-6爻在上卦

  // 八卦的索引
  const guaToIndex: Record<BaGua, number> = {
    '乾': 1, '兑': 2, '离': 3, '震': 4,
    '巽': 5, '坎': 6, '艮': 7, '坤': 8
  };

  let newUpperIndex = guaToIndex[upperGua];
  let newLowerIndex = guaToIndex[lowerGua];

  if (changingLine <= 3) {
    // 动爻在下卦，下卦变化
    newLowerIndex = (newLowerIndex % 8) + 1;
  } else {
    // 动爻在上卦，上卦变化
    newUpperIndex = (newUpperIndex % 8) + 1;
  }

  return {
    upperGua: BA_GUA_BY_INDEX[newUpperIndex],
    lowerGua: BA_GUA_BY_INDEX[newLowerIndex]
  };
}

/**
 * 数字起卦
 * @param num1 第一个数字（用于上卦）
 * @param num2 第二个数字（用于下卦，可选）
 * @param num3 第三个数字（用于动爻，可选）
 */
export function qiguaByNumber(num1: number, num2?: number, num3?: number): GuaResult {
  const upperNumber = num1;
  const lowerNumber = num2 || num1;
  const totalNumber = num3 || (num1 + (num2 || 0));

  const upperGua = getGuaByNumber(upperNumber);
  const lowerGua = getGuaByNumber(lowerNumber);
  const changingLine = getChangingLine(totalNumber);
  const mainGuaName = getGuaName(upperGua, lowerGua);

  const changeGuaResult = getChangeGua(upperGua, lowerGua, changingLine);

  return {
    upperGua,
    lowerGua,
    changingLine,
    mainGuaName,
    changeGua: {
      upperGua: changeGuaResult.upperGua,
      lowerGua: changeGuaResult.lowerGua,
      guaName: getGuaName(changeGuaResult.upperGua, changeGuaResult.lowerGua)
    },
    method: '数字起卦',
    rawData: {
      upperNumber,
      lowerNumber,
      totalNumber
    }
  };
}

/**
 * 汉字起卦
 * @param char 汉字
 * @param strokeCount 笔画数（如果不提供，会尝试计算）
 */
export function qiguaByChar(char: string, strokeCount?: number): GuaResult {
  // 如果没有提供笔画数，使用字符的Unicode编码作为替代
  const strokes = strokeCount || getStrokeCount(char);

  // 使用笔画数起卦
  const upperNumber = strokes;
  const lowerNumber = strokes;
  const totalNumber = strokes * 2;

  return {
    ...qiguaByNumber(upperNumber, lowerNumber, totalNumber),
    method: `字占起卦（${char}字，${strokes}画）`
  };
}

/**
 * 时间起卦
 * @param date 时间（默认当前时间）
 */
export function qiguaByTime(date: Date = new Date()): GuaResult {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;  // 1-12
  const day = date.getDate();         // 1-31
  const hour = date.getHours();       // 0-23

  // 转换时辰（每两小时一个时辰）
  const shiChen = Math.floor((hour + 1) / 2) % 12 || 12;

  // 上卦 = (年数 + 月数 + 日数) % 8
  const upperNumber = year + month + day;

  // 下卦 = (年数 + 月数 + 日数 + 时数) % 8
  const lowerNumber = year + month + day + shiChen;

  // 动爻 = (年数 + 月数 + 日数 + 时数) % 6
  const totalNumber = year + month + day + shiChen;

  const upperGua = getGuaByNumber(upperNumber);
  const lowerGua = getGuaByNumber(lowerNumber);
  const changingLine = getChangingLine(totalNumber);
  const mainGuaName = getGuaName(upperGua, lowerGua);

  const changeGuaResult = getChangeGua(upperGua, lowerGua, changingLine);

  return {
    upperGua,
    lowerGua,
    changingLine,
    mainGuaName,
    changeGua: {
      upperGua: changeGuaResult.upperGua,
      lowerGua: changeGuaResult.lowerGua,
      guaName: getGuaName(changeGuaResult.upperGua, changeGuaResult.lowerGua)
    },
    method: `时间起卦（${year}年${month}月${day}日${hour}时）`,
    rawData: {
      upperNumber,
      lowerNumber,
      totalNumber
    }
  };
}

/**
 * 获取汉字笔画数（简化版）
 * 实际使用中应该使用完整的汉字笔画数据库
 */
function getStrokeCount(char: string): number {
  // 这是一个简化的实现，使用字符编码
  // 实际应该使用康熙字典笔画数据库
  const code = char.charCodeAt(0);

  // 简单映射：使用Unicode编码的最后几位
  const baseStroke = (code % 20) + 1;  // 1-20画

  return baseStroke;
}

/**
 * 常用汉字笔画数据库（部分）
 */
export const CHAR_STROKES: Record<string, number> = {
  // 数字
  '一': 1, '二': 2, '三': 3, '四': 5, '五': 4,
  '六': 4, '七': 2, '八': 2, '九': 2, '十': 2,

  // 天干
  '甲': 5, '乙': 1, '丙': 5, '丁': 2, '戊': 5,
  '己': 3, '庚': 8, '辛': 7, '壬': 6, '癸': 9,

  // 地支
  '子': 3, '丑': 4, '寅': 11, '卯': 5, '辰': 7,
  '巳': 3, '午': 4, '未': 5, '申': 5, '酉': 7,
  '戌': 6, '亥': 6,

  // 常用字
  '找': 7, '钥': 9, '匙': 11, '手': 4, '机': 6,
  '钱': 10, '包': 5, '文': 4, '件': 6, '书': 4,
  '本': 5, '笔': 10, '水': 4, '杯': 8, '眼': 11,
  '镜': 16, '戒': 7, '指': 9, '项': 9, '链': 12,
  '耳': 6, '环': 8, '表': 8, '卡': 5, '证': 12,
  '照': 13, '片': 4, '药': 9, '品': 9,
  '伞': 6, '帽': 12, '鞋': 15, '衣': 6,
  '服': 8, '裤': 13, '袜': 10, '毛': 4,
  '牙': 4, '刷': 8, '梳': 11
};

/**
 * 获取更准确的笔画数
 */
export function getAccurateStrokeCount(char: string): number {
  // 处理空字符串
  if (!char || char.length === 0) {
    return 1;  // 默认返回1
  }

  return CHAR_STROKES[char] || getStrokeCount(char);
}
