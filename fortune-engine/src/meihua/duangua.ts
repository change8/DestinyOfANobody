/**
 * 梅花易数 - 断卦模块（增强版）
 */

import { BA_GUA_XIANG, BA_GUA_DATA, type BaGua } from './bagua-data';
import type { GuaResult } from './qigua';
import { analyzeTiYong, type TiYongAnalysis } from './tigua-yonggua';
import { calculateHugua, type HuguaResult } from './hugua';

/**
 * 失物占结果（增强版）
 */
export interface LostItemResult {
  // 问题信息
  question: string;
  itemName?: string;

  // 卦象信息
  gua: {
    mainGua: string;
    upperGua: BaGua;
    lowerGua: BaGua;
    changingLine: number;
    changeGua: string;
  };

  // 体用分析（新增）
  体用分析?: TiYongAnalysis;

  // 互卦分析（新增）
  互卦分析?: HuguaResult;

  // 字义分析（如果是字占）
  字义分析?: string;

  // 物品特征推断
  itemFeatures: {
    可能形状: string[];
    可能颜色: string[];
    可能材质: string[];
    物品特征: string[];
    具体物品: string[];
  };

  // 位置推断
  location: {
    方位: string;
    高低位置: string;
    内外: string;
    具体位置: string[];
    距离远近: string;
  };

  // 时间推断
  timing: {
    能否找到: boolean;
    预计时间: string;
    吉凶: string;
    建议: string;
  };

  // 详细分析
  analysis: {
    上卦分析: string;
    下卦分析: string;
    动爻分析: string;
    体用判断?: string;  // 新增
    互卦过程?: string;  // 新增
    综合判断: string;
  };
}

/**
 * 失物占（增强版，整合体用、互卦分析）
 */
export function divineForLostItem(
  guaResult: GuaResult,
  question: string,
  itemName?: string
): LostItemResult {
  const { upperGua, lowerGua, changingLine, mainGuaName, changeGua, charAnalysis } = guaResult;

  // ===== 核心分析：体用论 =====
  const tiYongAnalysis = analyzeTiYong(guaResult);

  // ===== 核心分析：互卦 =====
  const huguaAnalysis = calculateHugua(upperGua, lowerGua);

  // 获取八卦类象
  const upperXiang = BA_GUA_XIANG[upperGua];
  const lowerXiang = BA_GUA_XIANG[lowerGua];

  // 分析物品特征
  const itemFeatures = analyzeItemFeatures(upperXiang, lowerXiang);

  // 分析位置（结合体卦和用卦）
  const location = analyzeLocation(upperXiang, lowerXiang, changingLine, tiYongAnalysis);

  // 分析时间和吉凶（优先使用体用分析的结果）
  const timing = analyzeTiming(upperGua, lowerGua, changingLine, tiYongAnalysis);

  // 详细分析（整合所有分析）
  const analysis = generateAnalysis(
    upperXiang,
    lowerXiang,
    changingLine,
    mainGuaName,
    tiYongAnalysis,
    huguaAnalysis
  );

  // 字义分析（如果是字占）
  let charAnalysisText: string | undefined;
  if (charAnalysis) {
    charAnalysisText = `${charAnalysis.分析说明}\n建议卦象：${charAnalysis.建议卦象.join('、')}`;
  }

  return {
    question,
    itemName,
    gua: {
      mainGua: mainGuaName,
      upperGua,
      lowerGua,
      changingLine,
      changeGua: changeGua?.guaName || ''
    },
    体用分析: tiYongAnalysis,
    互卦分析: huguaAnalysis,
    字义分析: charAnalysisText,
    itemFeatures,
    location,
    timing,
    analysis
  };
}

/**
 * 分析物品特征
 */
function analyzeItemFeatures(upperXiang: any, lowerXiang: any) {
  return {
    可能形状: [...new Set([...upperXiang.物象.形状, ...lowerXiang.物象.形状])],
    可能颜色: [...new Set([...upperXiang.物象.颜色, ...lowerXiang.物象.颜色])],
    可能材质: [...new Set([...upperXiang.物象.质地, ...lowerXiang.物象.质地])],
    物品特征: [...new Set([...upperXiang.物象.特征, ...lowerXiang.物象.特征])],
    具体物品: [...new Set([...upperXiang.物象.物品, ...lowerXiang.物象.物品])]
  };
}

/**
 * 分析位置
 */
function analyzeLocation(
  upperXiang: any,
  lowerXiang: any,
  changingLine: number,
  tiYongAnalysis?: TiYongAnalysis
) {
  // 方位主要看体卦（如果有体用分析）
  let primaryDirection: string;
  let secondaryDirection: string;

  if (tiYongAnalysis) {
    // 使用体用分析确定主次方位
    const tiGuaXiang = BA_GUA_XIANG[tiYongAnalysis.体卦.卦名];
    const yongGuaXiang = BA_GUA_XIANG[tiYongAnalysis.用卦.卦名];
    primaryDirection = tiGuaXiang.方位;
    secondaryDirection = yongGuaXiang.方位;
  } else {
    // 传统方法：下卦为主，上卦为次
    primaryDirection = lowerXiang.方位;
    secondaryDirection = upperXiang.方位;
  }

  // 高低位置综合判断
  const heightPosition = combinePositions(upperXiang.位置.高低, lowerXiang.位置.高低, changingLine);

  // 内外判断
  const inOut = changingLine <= 3 ? lowerXiang.位置.内外 : upperXiang.位置.内外;

  // 具体位置
  const specificLocations = [...new Set([...upperXiang.位置.具体, ...lowerXiang.位置.具体])];

  // 距离远近
  const distance = analyzeDistance(upperXiang, lowerXiang);

  return {
    方位: `${primaryDirection}（主），${secondaryDirection}（次）`,
    高低位置: heightPosition,
    内外: inOut,
    具体位置: specificLocations,
    距离远近: distance
  };
}

/**
 * 组合位置判断
 */
/**
 * 根据五行推断时间
 */
function getTimingByWuxing(wuxing: string): string {
  const timingMap: Record<string, string> = {
    '木': '春季或寅卯日',
    '火': '夏季或巳午日',
    '土': '四季月或辰戌丑未日',
    '金': '秋季或申酉日',
    '水': '冬季或亥子日'
  };
  return timingMap[wuxing] || '近期';
}

function combinePositions(upper: string, lower: string, changingLine: number): string {
  if (changingLine <= 3) {
    return lower;  // 动爻在下卦，以下卦为主
  } else {
    return upper;  // 动爻在上卦，以上卦为主
  }
}

/**
 * 分析距离
 */
function analyzeDistance(upperXiang: any, lowerXiang: any): string {
  // 根据八卦的时间特征推断距离
  const upperTime = upperXiang.时间特征;
  const lowerTime = lowerXiang.时间特征;

  if (upperTime.includes('立即') || lowerTime.includes('立即')) {
    return '很近，就在附近';
  } else if (upperTime.includes('缓慢') || lowerTime.includes('缓慢')) {
    return '较远，需要仔细寻找';
  } else if (upperTime.includes('等待') || lowerTime.includes('停滞')) {
    return '可能被遮挡或压在其他物品下';
  } else {
    return '中等距离';
  }
}

/**
 * 分析时间和吉凶
 */
function analyzeTiming(
  upperGua: BaGua,
  lowerGua: BaGua,
  changingLine: number,
  tiYongAnalysis?: TiYongAnalysis
) {
  const upperData = BA_GUA_DATA[upperGua];
  const lowerData = BA_GUA_DATA[lowerGua];

  // 优先使用体用分析的失物判断
  if (tiYongAnalysis?.失物判断) {
    return {
      能否找到: tiYongAnalysis.失物判断.能否找到,
      预计时间: getTimingByWuxing(tiYongAnalysis.用卦.五行),
      吉凶: tiYongAnalysis.生克分析.吉凶,
      建议: tiYongAnalysis.失物判断.寻找建议
    };
  }

  // 传统方法：判断能否找到
  let canFind = true;
  let timing = '近期';
  let jiXiong = '吉';
  let advice = '仔细寻找';

  // 根据五行生克判断
  const upperWuxing = upperData.nature;
  const lowerWuxing = lowerData.nature;

  if (upperWuxing === lowerWuxing) {
    // 五行相同，比和
    canFind = true;
    timing = '当天或明天';
    jiXiong = '吉';
    advice = '东西就在附近，仔细找找';
  } else if (isWuxingSheng(lowerWuxing, upperWuxing)) {
    // 下生上，物品主动来
    canFind = true;
    timing = '很快';
    jiXiong = '大吉';
    advice = '东西会自己出现，或有人送回';
  } else if (isWuxingKe(lowerWuxing, upperWuxing)) {
    // 下克上，我克物
    canFind = true;
    timing = '需要努力寻找';
    jiXiong = '平';
    advice = '需要主动去找，多问问别人';
  } else if (isWuxingKe(upperWuxing, lowerWuxing)) {
    // 上克下，物克我
    canFind = false;
    timing = '较难';
    jiXiong = '凶';
    advice = '可能已丢失或损坏，不易找回';
  } else {
    // 其他情况
    canFind = true;
    timing = '中等时间';
    jiXiong = '平';
    advice = '耐心寻找，注意卦象提示的方位';
  }

  // 根据动爻调整
  if (changingLine === 6) {
    timing = '时间较长';
  } else if (changingLine === 1) {
    timing = '很快';
  }

  return {
    能否找到: canFind,
    预计时间: timing,
    吉凶: jiXiong,
    建议: advice
  };
}

/**
 * 五行相生判断
 */
function isWuxingSheng(wx1: string, wx2: string): boolean {
  const sheng: Record<string, string> = {
    '木': '火',
    '火': '土',
    '土': '金',
    '金': '水',
    '水': '木'
  };
  return sheng[wx1] === wx2;
}

/**
 * 五行相克判断
 */
function isWuxingKe(wx1: string, wx2: string): boolean {
  const ke: Record<string, string> = {
    '木': '土',
    '土': '水',
    '水': '火',
    '火': '金',
    '金': '木'
  };
  return ke[wx1] === wx2;
}

/**
 * 生成详细分析
 */
function generateAnalysis(
  upperXiang: any,
  lowerXiang: any,
  changingLine: number,
  mainGuaName: string,
  tiYongAnalysis?: TiYongAnalysis,
  huguaAnalysis?: HuguaResult
) {
  const upperAnalysis = `上卦为${upperXiang.gua}（${upperXiang.卦符}），五行属${upperXiang.五行}，` +
    `代表${upperXiang.方位}方位，物象为${upperXiang.物象.特征.slice(0, 3).join('、')}，` +
    `位置在${upperXiang.位置.高低}、${upperXiang.位置.内外}。`;

  const lowerAnalysis = `下卦为${lowerXiang.gua}（${lowerXiang.卦符}），五行属${lowerXiang.五行}，` +
    `代表${lowerXiang.方位}方位，物象为${lowerXiang.物象.特征.slice(0, 3).join('、')}，` +
    `位置在${lowerXiang.位置.高低}、${lowerXiang.位置.内外}。`;

  const yaoPosition = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'][changingLine - 1];
  const yaoInGua = changingLine <= 3 ? '下卦' : '上卦';
  const yaoAnalysis = `动爻在${yaoPosition}（${yaoInGua}），表示变化的焦点在${yaoInGua}所代表的方面。`;

  // 体用分析文本
  let tiYongText: string | undefined;
  if (tiYongAnalysis) {
    tiYongText = `\n【体用分析】\n` +
      `体卦${tiYongAnalysis.体卦.卦名}，用卦${tiYongAnalysis.用卦.卦名}，${tiYongAnalysis.体用关系}。\n` +
      `${tiYongAnalysis.生克分析.关系描述}，${tiYongAnalysis.生克分析.强弱判断}。\n` +
      `失物判断：${tiYongAnalysis.失物判断?.寻找建议}`;
  }

  // 互卦分析文本
  let huguaText: string | undefined;
  if (huguaAnalysis) {
    huguaText = `\n【互卦】${huguaAnalysis.互卦名}\n` +
      `${huguaAnalysis.互卦含义.整体含义}`;
  }

  let comprehensive = `得卦${mainGuaName}，综合判断：\n`;

  if (tiYongAnalysis) {
    const tiGuaXiang = BA_GUA_XIANG[tiYongAnalysis.体卦.卦名];
    const yongGuaXiang = BA_GUA_XIANG[tiYongAnalysis.用卦.卦名];
    comprehensive += `物品方位应在${tiGuaXiang.方位}（主要）或${yongGuaXiang.方位}（次要）方向，` +
      `位置${tiGuaXiang.位置.高低}或${yongGuaXiang.位置.高低}，` +
      `建议在${tiGuaXiang.位置.具体[0]}、${yongGuaXiang.位置.具体[0]}等地方寻找。\n` +
      `物品特征：${tiGuaXiang.物象.颜色[0]}或${yongGuaXiang.物象.颜色[0]}色，` +
      `${tiGuaXiang.物象.形状[0]}或${yongGuaXiang.物象.形状[0]}，` +
      `材质为${tiGuaXiang.物象.质地[0]}或${yongGuaXiang.物象.质地[0]}。`;
  } else {
    comprehensive += `物品方位应在${lowerXiang.方位}（主要）或${upperXiang.方位}（次要）方向，` +
      `位置${upperXiang.位置.高低}或${lowerXiang.位置.高低}，` +
      `建议在${lowerXiang.位置.具体[0]}、${upperXiang.位置.具体[0]}等地方寻找。\n` +
      `物品特征：${upperXiang.物象.颜色[0]}或${lowerXiang.物象.颜色[0]}色，` +
      `${upperXiang.物象.形状[0]}或${lowerXiang.物象.形状[0]}，` +
      `材质为${upperXiang.物象.质地[0]}或${lowerXiang.物象.质地[0]}。`;
  }

  return {
    上卦分析: upperAnalysis,
    下卦分析: lowerAnalysis,
    动爻分析: yaoAnalysis,
    体用判断: tiYongText,
    互卦过程: huguaText,
    综合判断: comprehensive
  };
}

/**
 * 射覆（猜物）
 * 根据卦象推测隐藏的物品
 */
export function sheFu(guaResult: GuaResult): {
  可能物品: string[];
  物品特征: string;
  详细分析: string;
} {
  const { upperGua, lowerGua } = guaResult;
  const upperXiang = BA_GUA_XIANG[upperGua];
  const lowerXiang = BA_GUA_XIANG[lowerGua];

  // 综合上下卦的物象
  const possibleItems = [
    ...upperXiang.物象.物品.slice(0, 3),
    ...lowerXiang.物象.物品.slice(0, 3)
  ];

  const features = `形状：${upperXiang.物象.形状[0]}或${lowerXiang.物象.形状[0]}；` +
    `颜色：${upperXiang.物象.颜色[0]}或${lowerXiang.物象.颜色[0]}；` +
    `材质：${upperXiang.物象.质地[0]}或${lowerXiang.物象.质地[0]}；` +
    `特征：${upperXiang.物象.特征.slice(0, 2).join('、')}、${lowerXiang.物象.特征.slice(0, 2).join('、')}`;

  const analysis = `根据${upperGua}${lowerGua}卦象分析：\n` +
    `上卦${upperGua}，五行${upperXiang.五行}，代表外在特征为${upperXiang.物象.特征[0]}、${upperXiang.物象.特征[1]}；\n` +
    `下卦${lowerGua}，五行${lowerXiang.五行}，代表内在本质为${lowerXiang.物象.特征[0]}、${lowerXiang.物象.特征[1]}。\n` +
    `综合判断：物品可能是${possibleItems.slice(0, 3).join('、')}等类似物品。`;

  return {
    可能物品: possibleItems,
    物品特征: features,
    详细分析: analysis
  };
}
