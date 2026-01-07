/**
 * 梅花易数 - 起卦模块
 */

import { BA_GUA_BY_INDEX, type BaGua } from './bagua-data';
import { getGuaName } from './liushisi-gua';
import type { CharAnalysisResult } from './char-analysis';
import { analyzeCharacter } from './char-analysis';
import { solarToLunar } from '../utils/lunar-converter';

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
    character?: string;     // 如果是字占，记录原始字符
  };

  // 字义分析（仅字占时有）
  charAnalysis?: CharAnalysisResult;
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
 * 八卦的二进制表示（阳=1，阴=0，从下往上三个爻）
 * 例如：乾卦（☰）三个阳爻 = 111
 */
const GUA_TO_BINARY: Record<BaGua, string> = {
  '乾': '111',  // ☰ 三阳爻
  '兑': '011',  // ☱ 上阴下二阳
  '离': '101',  // ☲ 中阴上下阳
  '震': '001',  // ☳ 上二阴下阳
  '巽': '110',  // ☴ 下阴上二阳
  '坎': '010',  // ☵ 上下阴中阳
  '艮': '100',  // ☶ 下二阴上阳
  '坤': '000'   // ☷ 三阴爻
};

/**
 * 根据二进制字符串反查八卦
 */
const BINARY_TO_GUA: Record<string, BaGua> = Object.fromEntries(
  Object.entries(GUA_TO_BINARY).map(([gua, binary]) => [binary, gua as BaGua])
) as Record<string, BaGua>;

/**
 * 获取变卦（正确实现：翻转动爻的阴阳）
 *
 * 原理：
 * 1. 将上下卦转为二进制表示（六爻从下往上：初、二、三、四、五、上）
 * 2. 翻转动爻位置的阴阳（阳爻变阴爻，阴爻变阳爻）
 * 3. 将新的六爻重新拆分为上下卦
 *
 * 例如：水山蹇（☵☶）动初爻
 * - 下卦艮（☶）= 100，上卦坎（☵）= 010
 * - 六爻从下往上：1-0-0-0-1-0
 * - 初爻（第1爻）翻转：1→0，得到 0-0-0-0-1-0
 * - 新下卦：000 = 坤（☷），新上卦：010 = 坎（☵）
 * - 变卦：水地比（☵☷）
 */
function getChangeGua(upperGua: BaGua, lowerGua: BaGua, changingLine: number): { upperGua: BaGua; lowerGua: BaGua } {
  // 1. 获取上下卦的二进制表示
  const lowerBinary = GUA_TO_BINARY[lowerGua];  // 下卦三爻（初、二、三）
  const upperBinary = GUA_TO_BINARY[upperGua];  // 上卦三爻（四、五、上）

  // 2. 组合成六爻（从下往上）
  const sixLines = lowerBinary + upperBinary;

  // 3. 翻转动爻（阳变阴，阴变阳）
  const lines = sixLines.split('');
  const index = changingLine - 1;  // 转为数组索引（0-5）
  lines[index] = lines[index] === '1' ? '0' : '1';  // 翻转爻

  // 4. 重新组合
  const newSixLines = lines.join('');

  // 5. 拆分回上下卦
  const newLowerBinary = newSixLines.substring(0, 3);  // 前三位是下卦
  const newUpperBinary = newSixLines.substring(3, 6);  // 后三位是上卦

  // 6. 转回八卦
  const newLowerGua = BINARY_TO_GUA[newLowerBinary];
  const newUpperGua = BINARY_TO_GUA[newUpperBinary];

  // 7. 防御性检查
  if (!newLowerGua || !newUpperGua) {
    console.error('变卦计算错误：', {
      original: { upperGua, lowerGua, changingLine },
      binary: { sixLines, newSixLines, newLowerBinary, newUpperBinary }
    });
    // 降级处理：返回原卦
    return { upperGua, lowerGua };
  }

  return {
    upperGua: newUpperGua,
    lowerGua: newLowerGua
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
 * 汉字起卦（多字版 - 推荐）
 *
 * 传统方法：
 * - 双字起卦：第一字笔画为上卦，第二字笔画为下卦，总笔画为动爻
 * - 多字起卦：可用前两字、或字数与总笔画组合
 *
 * 例如："云哲" = 云(4画) + 哲(10画)
 * - 上卦：4 ÷ 8 余 4 → 震卦
 * - 下卦：10 ÷ 8 余 2 → 兑卦
 * - 动爻：14 ÷ 6 余 2 → 二爻
 *
 * @param chars 汉字字符串（建议2个字）
 * @param strokeCounts 笔画数数组（可选）
 */
export function qiguaByChars(chars: string, strokeCounts?: number[]): GuaResult {
  // 1. 处理多字情况
  const charArray = Array.from(chars);

  if (charArray.length === 0) {
    throw new Error('请至少提供一个字');
  }

  // 2. 获取笔画数
  let strokes: number[];
  if (strokeCounts && strokeCounts.length > 0) {
    strokes = strokeCounts;
  } else {
    strokes = charArray.map(c => getAccurateStrokeCount(c));
  }

  // 3. 根据字数确定起卦方法
  let upperNumber: number;
  let lowerNumber: number;
  let totalNumber: number;

  if (charArray.length === 1) {
    // 单字起卦：需要结合时间或字形拆分
    // 这里使用简化方法：笔画数 + 当前时辰
    const singleStroke = strokes[0];
    const now = new Date();
    const hour = now.getHours();
    const shiChen = Math.floor((hour + 1) / 2) % 12 || 12;

    upperNumber = singleStroke;
    lowerNumber = singleStroke + shiChen;
    totalNumber = singleStroke + shiChen;
  } else {
    // 双字或多字起卦：第一字为上卦，第二字为下卦
    upperNumber = strokes[0];
    lowerNumber = strokes[1];
    totalNumber = strokes.reduce((sum, s) => sum + s, 0);
  }

  // 4. 起卦
  const upperGua = getGuaByNumber(upperNumber);
  const lowerGua = getGuaByNumber(lowerNumber);
  const changingLine = getChangingLine(totalNumber);
  const mainGuaName = getGuaName(upperGua, lowerGua);

  // 5. 计算变卦
  const changeGuaResult = getChangeGua(upperGua, lowerGua, changingLine);

  // 6. 进行字义分析（仅对前两个字）
  const analysisChars = charArray.slice(0, 2);
  const charAnalysis = analyzeCharacter(analysisChars.join(''), totalNumber);

  // 7. 格式化方法说明
  const strokeInfo = charArray.map((c, i) => `${c}(${strokes[i]}画)`).join(' + ');
  const method = charArray.length === 1
    ? `字占起卦（${strokeInfo}，结合时辰）`
    : `字占起卦（${strokeInfo}，共${totalNumber}画）`;

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
    method,
    rawData: {
      upperNumber,
      lowerNumber,
      totalNumber,
      character: chars
    },
    charAnalysis
  };
}

/**
 * 汉字起卦（单字简化版，保留向后兼容）
 * @param char 汉字
 * @param strokeCount 笔画数（如果不提供，会尝试计算）
 * @deprecated 建议使用 qiguaByChars 代替，支持更准确的多字起卦
 */
export function qiguaByChar(char: string, strokeCount?: number): GuaResult {
  // 兼容旧接口，调用新的多字起卦函数
  return qiguaByChars(char, strokeCount ? [strokeCount] : undefined);
}

/**
 * 时间起卦（使用农历）
 *
 * 梅花易数的时间起卦必须使用农历年月日，而非公历！
 *
 * 公式：
 * - 上卦 = (农历年 + 农历月 + 农历日) ÷ 8 的余数
 * - 下卦 = (农历年 + 农历月 + 农历日 + 时辰) ÷ 8 的余数
 * - 动爻 = (农历年 + 农历月 + 农历日 + 时辰) ÷ 6 的余数
 *
 * @param date 时间（默认当前时间）
 */
export function qiguaByTime(date: Date = new Date()): GuaResult {
  // 1. 转换为农历日期
  const lunar = solarToLunar(date);
  const year = lunar.year;   // 使用农历年
  const month = lunar.month; // 使用农历月
  const day = lunar.day;     // 使用农历日
  const hour = date.getHours();  // 时辰仍用公历小时计算

  // 2. 转换时辰（每两小时一个时辰）
  // 子(23-01) 丑(01-03) 寅(03-05) 卯(05-07) 辰(07-09) 巳(09-11)
  // 午(11-13) 未(13-15) 申(15-17) 酉(17-19) 戌(19-21) 亥(21-23)
  const shiChen = Math.floor((hour + 1) / 2) % 12 || 12;

  // 3. 按照梅花易数公式计算
  // 上卦 = (年 + 月 + 日) % 8
  const upperNumber = year + month + day;

  // 下卦 = (年 + 月 + 日 + 时) % 8
  const lowerNumber = year + month + day + shiChen;

  // 动爻 = (年 + 月 + 日 + 时) % 6
  const totalNumber = year + month + day + shiChen;

  // 4. 起卦
  const upperGua = getGuaByNumber(upperNumber);
  const lowerGua = getGuaByNumber(lowerNumber);
  const changingLine = getChangingLine(totalNumber);
  const mainGuaName = getGuaName(upperGua, lowerGua);

  // 5. 计算变卦
  const changeGuaResult = getChangeGua(upperGua, lowerGua, changingLine);

  // 6. 格式化日期信息（用于显示）
  const solarYear = date.getFullYear();
  const solarMonth = date.getMonth() + 1;
  const solarDay = date.getDate();

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
    method: `时间起卦（公历${solarYear}年${solarMonth}月${solarDay}日${hour}时 / 农历${year}年${month}月${day}日）`,
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
