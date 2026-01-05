/**
 * 梅花易数 - 扩展起卦方法
 *
 * 本模块实现多种传统起卦方法：
 * 1. 声调起卦（基于汉字拼音声调）
 * 2. 字形起卦（基于字的结构）
 * 3. 部首起卦（基于偏旁部首）
 * 4. 方位起卦（基于用户所处方位）
 * 5. 环境物象起卦（基于周围观察到的事物）
 */

import type { BaGua } from './bagua-data';
import { BA_GUA_BY_INDEX, BA_GUA_DATA } from './bagua-data';
import { getGuaName } from './liushisi-gua';
import type { GuaResult } from './qigua';
import type { CharStructure } from './char-analysis';
import { analyzeCharacter } from './char-analysis';

/**
 * 声调类型
 */
export type PinyinTone = 1 | 2 | 3 | 4 | 0;  // 0代表轻声

/**
 * 方位类型
 */
export type Direction = '东' | '南' | '西' | '北' | '东南' | '西南' | '西北' | '东北';

/**
 * 声调到八卦的映射
 * 基于：阴平1、阳平2、上声3、去声4、轻声0
 */
const TONE_TO_GUA_NUMBER: Record<number, number> = {
  1: 1,  // 阴平 → 数字1
  2: 2,  // 阳平 → 数字2
  3: 3,  // 上声 → 数字3
  4: 4,  // 去声 → 数字4
  0: 5   // 轻声 → 数字5
};

/**
 * 方位到八卦的映射（后天八卦方位）
 */
const DIRECTION_TO_GUA: Record<Direction, BaGua> = {
  '南': '离',    // 南方离火
  '西南': '坤',  // 西南坤土
  '西': '兑',    // 西方兑金
  '西北': '乾',  // 西北乾金
  '北': '坎',    // 北方坎水
  '东北': '艮',  // 东北艮土
  '东': '震',    // 东方震木
  '东南': '巽'   // 东南巽木
};

/**
 * 方位到数字的映射
 */
const DIRECTION_TO_NUMBER: Record<Direction, number> = {
  '南': 3,
  '西南': 8,
  '西': 2,
  '西北': 1,
  '北': 6,
  '东北': 7,
  '东': 4,
  '东南': 5
};

/**
 * 字形结构到数字的映射
 */
const STRUCTURE_TO_NUMBER: Record<CharStructure, number> = {
  '独体字': 1,
  '左右结构': 2,
  '上下结构': 3,
  '左中右': 4,
  '上中下': 5,
  '半包围': 6,
  '全包围': 7
};

/**
 * 声调起卦
 *
 * 规则：
 * - 取第一个字的声调作为上卦数
 * - 取第二个字的声调作为下卦数（如果只有一个字，则上下卦同）
 * - 取所有字的声调之和作为动爻数
 *
 * @param chars 汉字数组（1-3个字为宜）
 * @param tones 对应的声调数组（1=阴平, 2=阳平, 3=上声, 4=去声, 0=轻声）
 * @returns 卦象结果
 *
 * @example
 * ```ts
 * // "找钥匙" - zhao(4) yao(4) shi(0)
 * const result = qiguaByTone(['找', '钥', '匙'], [4, 4, 0]);
 * // 上卦数: 4 → 震卦
 * // 下卦数: 4 → 震卦
 * // 动爻数: (4+4+0) % 6 = 2 → 第二爻动
 * ```
 */
export function qiguaByTone(chars: string[], tones: PinyinTone[]): GuaResult {
  if (chars.length === 0 || tones.length === 0) {
    throw new Error('字符和声调不能为空');
  }

  if (chars.length !== tones.length) {
    throw new Error('字符数量和声调数量必须相同');
  }

  // 第一个字的声调 → 上卦数
  const firstTone = tones[0];
  const upperNumber = TONE_TO_GUA_NUMBER[firstTone];

  // 第二个字的声调 → 下卦数（如果只有一个字，则同上卦）
  const secondTone = tones.length > 1 ? tones[1] : tones[0];
  const lowerNumber = TONE_TO_GUA_NUMBER[secondTone];

  // 所有声调之和 → 动爻数
  const totalTone: number = tones.reduce((sum: number, tone) => sum + TONE_TO_GUA_NUMBER[tone], 0);
  const changingLine = ((totalTone - 1) % 6) + 1;

  // 获取卦象
  const upperGua = getGuaByNumber(upperNumber);
  const lowerGua = getGuaByNumber(lowerNumber);
  const mainGuaName = getGuaName(upperGua, lowerGua);

  // 计算变卦
  const changeGuaResult = getChangeGua(upperGua, lowerGua, changingLine);

  // 生成声调说明
  const toneNames = ['轻声', '阴平', '阳平', '上声', '去声'];
  const toneDesc = chars.map((char, i) => `${char}(${toneNames[tones[i]]})`).join(' ');

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
    method: `声调起卦（${toneDesc}）`,
    rawData: {
      upperNumber,
      lowerNumber,
      totalNumber: totalTone,
      character: chars.join('')
    }
  };
}

/**
 * 字形起卦（基于字的结构）
 *
 * 规则：
 * - 第一个字的结构 → 上卦数
 * - 第二个字的结构 → 下卦数（如果只有一个字，则同上卦）
 * - 结构数之和 → 动爻数
 *
 * @param chars 汉字数组
 * @returns 卦象结果
 *
 * @example
 * ```ts
 * // "找" = 左右结构 → 2
 * // "家" = 上下结构 → 3
 * const result = qiguaByStructure(['找', '家']);
 * // 上卦: 2 → 兑卦
 * // 下卦: 3 → 离卦
 * // 动爻: (2+3) % 6 = 5
 * ```
 */
export function qiguaByStructure(chars: string[]): GuaResult {
  if (chars.length === 0) {
    throw new Error('字符不能为空');
  }

  // 分析每个字的结构
  const analyses = chars.map(char => analyzeCharacter(char));
  const structures = analyses.map(a => a.结构);

  // 第一个字的结构 → 上卦数
  const upperNumber = STRUCTURE_TO_NUMBER[structures[0]];

  // 第二个字的结构 → 下卦数
  const lowerNumber = structures.length > 1
    ? STRUCTURE_TO_NUMBER[structures[1]]
    : upperNumber;

  // 结构数之和 → 动爻数
  const totalNumber = structures.reduce((sum, struct) => sum + STRUCTURE_TO_NUMBER[struct], 0);
  const changingLine = ((totalNumber - 1) % 6) + 1;

  // 获取卦象
  const upperGua = getGuaByNumber(upperNumber);
  const lowerGua = getGuaByNumber(lowerNumber);
  const mainGuaName = getGuaName(upperGua, lowerGua);

  // 计算变卦
  const changeGuaResult = getChangeGua(upperGua, lowerGua, changingLine);

  // 生成结构说明
  const structDesc = chars.map((char, i) => `${char}(${structures[i]})`).join(' ');

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
    method: `字形起卦（${structDesc}）`,
    rawData: {
      upperNumber,
      lowerNumber,
      totalNumber,
      character: chars.join('')
    },
    charAnalysis: analyses[0]  // 附加第一个字的完整分析
  };
}

/**
 * 部首起卦（基于字的部首五行）
 *
 * 规则：
 * - 提取字的部首，根据部首的五行属性起卦
 * - 第一个字的部首五行 → 上卦
 * - 第二个字的部首五行 → 下卦
 * - 笔画数之和 → 动爻数
 *
 * @param chars 汉字数组
 * @returns 卦象结果
 */
export function qiguaByRadical(chars: string[]): GuaResult {
  if (chars.length === 0) {
    throw new Error('字符不能为空');
  }

  // 分析每个字的部首
  const analyses = chars.map(char => analyzeCharacter(char));

  // 根据部首五行确定卦象
  const getGuaByRadical = (analysis: typeof analyses[0]): BaGua => {
    if (!analysis.部首信息) {
      // 没有部首信息，使用笔画数
      return getGuaByNumber(analysis.笔画数);
    }

    const relatedGua = analysis.部首信息.相关卦;

    // 返回相关卦的第一个
    return relatedGua[0] || getGuaByNumber(analysis.笔画数);
  };

  const upperGua = getGuaByRadical(analyses[0]);
  const lowerGua = analyses.length > 1 ? getGuaByRadical(analyses[1]) : upperGua;

  // 笔画数之和 → 动爻数
  const totalStrokes = analyses.reduce((sum, a) => sum + a.笔画数, 0);
  const changingLine = ((totalStrokes - 1) % 6) + 1;

  const mainGuaName = getGuaName(upperGua, lowerGua);

  // 计算变卦
  const changeGuaResult = getChangeGua(upperGua, lowerGua, changingLine);

  // 生成部首说明
  const radicalDesc = chars.map((char, i) => {
    const radical = analyses[i].部首 || '无';
    const wuxing = analyses[i].部首信息?.五行 || '-';
    return `${char}(${radical}旁·${wuxing})`;
  }).join(' ');

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
    method: `部首起卦（${radicalDesc}）`,
    rawData: {
      upperNumber: BA_GUA_DATA[upperGua].index,
      lowerNumber: BA_GUA_DATA[lowerGua].index,
      totalNumber: totalStrokes,
      character: chars.join('')
    },
    charAnalysis: analyses[0]
  };
}

/**
 * 方位起卦
 *
 * 规则：
 * - 用户当前面向的方位 → 上卦
 * - 用户想问的事物所在方位 → 下卦
 * - 当前时辰 → 动爻数
 *
 * @param userDirection 用户面向的方位
 * @param targetDirection 目标方位（可选，默认同用户方位）
 * @param time 当前时间（可选，默认当前时间）
 * @returns 卦象结果
 *
 * @example
 * ```ts
 * // 用户面向南方，问东边的事情
 * const result = qiguaByDirection('南', '东');
 * ```
 */
export function qiguaByDirection(
  userDirection: Direction,
  targetDirection?: Direction,
  time: Date = new Date()
): GuaResult {
  const upperGua = DIRECTION_TO_GUA[userDirection];
  const lowerGua = targetDirection
    ? DIRECTION_TO_GUA[targetDirection]
    : upperGua;

  // 时辰数 → 动爻
  const hour = time.getHours();
  const shiChen = Math.floor((hour + 1) / 2) % 12 || 12;
  const changingLine = ((shiChen - 1) % 6) + 1;

  const mainGuaName = getGuaName(upperGua, lowerGua);

  // 计算变卦
  const changeGuaResult = getChangeGua(upperGua, lowerGua, changingLine);

  const upperNumber = DIRECTION_TO_NUMBER[userDirection];
  const lowerNumber = targetDirection
    ? DIRECTION_TO_NUMBER[targetDirection]
    : upperNumber;

  const directionDesc = targetDirection
    ? `面向${userDirection}，问${targetDirection}方`
    : `面向${userDirection}`;

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
    method: `方位起卦（${directionDesc}，${hour}时）`,
    rawData: {
      upperNumber,
      lowerNumber,
      totalNumber: shiChen
    }
  };
}

/**
 * 物象信息
 */
export interface ObjectInfo {
  name: string;      // 物品名称，如"白色花瓶"
  color?: string;    // 颜色
  shape?: string;    // 形状
  material?: string; // 材质
  count?: number;    // 数量
}

/**
 * 环境物象起卦
 *
 * 规则：
 * - 让用户观察周围环境，报出看到的事物
 * - 根据物象的特征（颜色、形状、数量等）起卦
 * - 第一个物象 → 上卦
 * - 第二个物象 → 下卦
 * - 物象总数 → 动爻
 *
 * @param objects 观察到的物象数组
 * @returns 卦象结果
 *
 * @example
 * ```ts
 * const objects = [
 *   { name: '白色花瓶', color: '白色', shape: '圆形', count: 1 },
 *   { name: '绿色植物', color: '绿色', count: 3 }
 * ];
 * const result = qiguaByEnvironment(objects);
 * ```
 */
export function qiguaByEnvironment(objects: ObjectInfo[]): GuaResult {
  if (objects.length === 0) {
    throw new Error('至少需要观察一个物象');
  }

  /**
   * 根据物象特征推断八卦
   */
  const inferGuaFromObject = (obj: ObjectInfo): { gua: BaGua; number: number } => {
    let guaNumber = obj.count || 1;

    // 根据颜色推断五行和八卦
    if (obj.color) {
      const colorGua = inferGuaByColor(obj.color);
      if (colorGua) {
        return { gua: colorGua.gua, number: colorGua.number };
      }
    }

    // 根据形状推断八卦
    if (obj.shape) {
      const shapeGua = inferGuaByShape(obj.shape);
      if (shapeGua) {
        return { gua: shapeGua.gua, number: shapeGua.number };
      }
    }

    // 根据材质推断八卦
    if (obj.material) {
      const materialGua = inferGuaByMaterial(obj.material);
      if (materialGua) {
        return { gua: materialGua.gua, number: materialGua.number };
      }
    }

    // 默认使用数量
    const gua = getGuaByNumber(guaNumber);
    return { gua, number: guaNumber };
  };

  const firstInfer = inferGuaFromObject(objects[0]);
  const upperGua = firstInfer.gua;
  const upperNumber = firstInfer.number;

  let lowerGua: BaGua;
  let lowerNumber: number;

  if (objects.length > 1) {
    const secondInfer = inferGuaFromObject(objects[1]);
    lowerGua = secondInfer.gua;
    lowerNumber = secondInfer.number;
  } else {
    lowerGua = upperGua;
    lowerNumber = upperNumber;
  }

  // 物象总数 → 动爻
  const totalCount = objects.reduce((sum, obj) => sum + (obj.count || 1), 0);
  const changingLine = ((totalCount - 1) % 6) + 1;

  const mainGuaName = getGuaName(upperGua, lowerGua);

  // 计算变卦
  const changeGuaResult = getChangeGua(upperGua, lowerGua, changingLine);

  // 生成物象说明
  const objectDesc = objects.map(obj => obj.name).join('、');

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
    method: `环境物象起卦（观察：${objectDesc}）`,
    rawData: {
      upperNumber,
      lowerNumber,
      totalNumber: totalCount
    }
  };
}

/**
 * 根据颜色推断八卦
 */
function inferGuaByColor(color: string): { gua: BaGua; number: number } | null {
  const colorMap: Record<string, { gua: BaGua; number: number }> = {
    '白': { gua: '乾', number: 1 },
    '白色': { gua: '乾', number: 1 },
    '金': { gua: '乾', number: 1 },
    '金色': { gua: '乾', number: 1 },
    '银': { gua: '兑', number: 2 },
    '银色': { gua: '兑', number: 2 },
    '红': { gua: '离', number: 3 },
    '红色': { gua: '离', number: 3 },
    '紫': { gua: '离', number: 3 },
    '紫色': { gua: '离', number: 3 },
    '青': { gua: '震', number: 4 },
    '青色': { gua: '震', number: 4 },
    '蓝': { gua: '震', number: 4 },
    '蓝色': { gua: '震', number: 4 },
    '绿': { gua: '巽', number: 5 },
    '绿色': { gua: '巽', number: 5 },
    '黑': { gua: '坎', number: 6 },
    '黑色': { gua: '坎', number: 6 },
    '黄': { gua: '坤', number: 8 },
    '黄色': { gua: '坤', number: 8 },
    '棕': { gua: '艮', number: 7 },
    '棕色': { gua: '艮', number: 7 }
  };

  return colorMap[color] || null;
}

/**
 * 根据形状推断八卦
 */
function inferGuaByShape(shape: string): { gua: BaGua; number: number } | null {
  const shapeMap: Record<string, { gua: BaGua; number: number }> = {
    '圆': { gua: '乾', number: 1 },
    '圆形': { gua: '乾', number: 1 },
    '球': { gua: '乾', number: 1 },
    '球形': { gua: '乾', number: 1 },
    '方': { gua: '坤', number: 8 },
    '方形': { gua: '坤', number: 8 },
    '长': { gua: '震', number: 4 },
    '长条': { gua: '震', number: 4 },
    '三角': { gua: '离', number: 3 },
    '三角形': { gua: '离', number: 3 },
    '弯曲': { gua: '兑', number: 2 },
    '曲': { gua: '兑', number: 2 }
  };

  return shapeMap[shape] || null;
}

/**
 * 根据材质推断八卦
 */
function inferGuaByMaterial(material: string): { gua: BaGua; number: number } | null {
  const materialMap: Record<string, { gua: BaGua; number: number }> = {
    '金属': { gua: '乾', number: 1 },
    '铁': { gua: '乾', number: 1 },
    '钢': { gua: '乾', number: 1 },
    '木': { gua: '震', number: 4 },
    '木头': { gua: '震', number: 4 },
    '木制': { gua: '震', number: 4 },
    '水': { gua: '坎', number: 6 },
    '液体': { gua: '坎', number: 6 },
    '土': { gua: '坤', number: 8 },
    '泥': { gua: '坤', number: 8 },
    '陶瓷': { gua: '坤', number: 8 },
    '石': { gua: '艮', number: 7 },
    '石头': { gua: '艮', number: 7 },
    '玻璃': { gua: '离', number: 3 },
    '塑料': { gua: '巽', number: 5 }
  };

  return materialMap[material] || null;
}

/**
 * 辅助函数：根据数字获取八卦
 */
function getGuaByNumber(num: number): BaGua {
  const absNum = Math.abs(num);
  const index = ((absNum - 1) % 8) + 1;
  return BA_GUA_BY_INDEX[index];
}

/**
 * 辅助函数：获取变卦
 */
function getChangeGua(
  upperGua: BaGua,
  lowerGua: BaGua,
  changingLine: number
): { upperGua: BaGua; lowerGua: BaGua } {
  const guaToIndex: Record<BaGua, number> = {
    '乾': 1, '兑': 2, '离': 3, '震': 4,
    '巽': 5, '坎': 6, '艮': 7, '坤': 8
  };

  let newUpperIndex = guaToIndex[upperGua];
  let newLowerIndex = guaToIndex[lowerGua];

  if (changingLine <= 3) {
    // 动爻在下卦
    newLowerIndex = (newLowerIndex % 8) + 1;
  } else {
    // 动爻在上卦
    newUpperIndex = (newUpperIndex % 8) + 1;
  }

  return {
    upperGua: BA_GUA_BY_INDEX[newUpperIndex],
    lowerGua: BA_GUA_BY_INDEX[newLowerIndex]
  };
}
