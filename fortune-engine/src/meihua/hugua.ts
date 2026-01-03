/**
 * 互卦模块
 *
 * 互卦是梅花易数的重要概念，代表事物发展的中间过程
 *
 * 互卦取法：
 * 六爻卦由下往上数为：初爻、二爻、三爻、四爻、五爻、上爻
 * - 上互卦：由三爻、四爻、五爻组成
 * - 下互卦：由二爻、三爻、四爻组成
 *
 * 例如：水山蹇（☵☶）
 * 上卦坎（☵）：010 下卦艮（☶）：100
 * 从下往上：1-0-0-0-1-0
 * 下互：2-3-4爻 = 0-0-0 = 坤（☷）
 * 上互：3-4-5爻 = 0-0-1 = 艮（☶）
 * 互卦为 艮坤 = 地山谦
 */

import type { BaGua } from './bagua-data';
import { BA_GUA_DATA } from './bagua-data';
import { getGuaName } from './liushisi-gua';

/**
 * 八卦的爻象表示（从下往上）
 */
const GUA_YAOS: Record<BaGua, [number, number, number]> = {
  '乾': [1, 1, 1], // ☰
  '兑': [0, 1, 1], // ☱
  '离': [1, 0, 1], // ☲
  '震': [0, 0, 1], // ☳
  '巽': [1, 1, 0], // ☴
  '坎': [0, 1, 0], // ☵
  '艮': [1, 0, 0], // ☶
  '坤': [0, 0, 0]  // ☷
};

/**
 * 根据爻象反查八卦
 */
function yaosToGua(yaos: [number, number, number]): BaGua {
  for (const [gua, guaYaos] of Object.entries(GUA_YAOS)) {
    if (yaos[0] === guaYaos[0] && yaos[1] === guaYaos[1] && yaos[2] === guaYaos[2]) {
      return gua as BaGua;
    }
  }
  return '坤'; // 默认返回坤卦
}

/**
 * 互卦结果
 */
export interface HuguaResult {
  // 上互卦（由3、4、5爻组成）
  上互卦: BaGua;

  // 下互卦（由2、3、4爻组成）
  下互卦: BaGua;

  // 互卦名称
  互卦名: string;

  // 互卦的象征意义
  互卦含义: {
    上互象征: string;
    下互象征: string;
    整体含义: string;
  };
}

/**
 * 计算互卦
 *
 * @param upperGua 上卦（外卦）
 * @param lowerGua 下卦（内卦）
 * @returns 互卦结果
 */
export function calculateHugua(upperGua: BaGua, lowerGua: BaGua): HuguaResult {
  // 获取上下卦的爻象
  const upperYaos = GUA_YAOS[upperGua];
  const lowerYaos = GUA_YAOS[lowerGua];

  // 组合成六爻（从下往上：初、二、三、四、五、上）
  const sixYaos = [
    lowerYaos[0], // 初爻
    lowerYaos[1], // 二爻
    lowerYaos[2], // 三爻
    upperYaos[0], // 四爻
    upperYaos[1], // 五爻
    upperYaos[2]  // 上爻
  ];

  // 下互卦：2、3、4爻（索引1、2、3）
  const lowerHuYaos: [number, number, number] = [sixYaos[1], sixYaos[2], sixYaos[3]];
  const lowerHugua = yaosToGua(lowerHuYaos);

  // 上互卦：3、4、5爻（索引2、3、4）
  const upperHuYaos: [number, number, number] = [sixYaos[2], sixYaos[3], sixYaos[4]];
  const upperHugua = yaosToGua(upperHuYaos);

  const huguaName = getGuaName(upperHugua, lowerHugua);

  const upperHuData = BA_GUA_DATA[upperHugua];
  const lowerHuData = BA_GUA_DATA[lowerHugua];

  let overallMeaning = `互卦${huguaName}，代表事物发展的中间过程。`;

  if (upperHugua === lowerHugua) {
    overallMeaning += `上下互卦皆为${upperHugua}，表示过程中${upperHuData.象征}的特质持续显现。`;
  } else {
    overallMeaning += `从${lowerHugua}（${lowerHuData.象征}）渐变到${upperHugua}（${upperHuData.象征}），体现了从内到外的转变过程。`;
  }

  return {
    上互卦: upperHugua,
    下互卦: lowerHugua,
    互卦名: huguaName,
    互卦含义: {
      上互象征: `${upperHugua}卦，象征${upperHuData.象征}`,
      下互象征: `${lowerHugua}卦，象征${lowerHuData.象征}`,
      整体含义: overallMeaning
    }
  };
}

/**
 * 生成互卦详细说明
 */
export function generateHuguaExplanation(
  hugua: HuguaResult,
  mainGuaName: string
): string {
  let explanation = '【互卦分析】\n\n';

  explanation += `本卦：${mainGuaName}\n`;
  explanation += `互卦：${hugua.互卦名}\n\n`;

  explanation += `互卦的意义：\n`;
  explanation += `互卦代表事物发展的中间过程，是从本卦（现状）到变卦（结果）之间的过渡阶段。\n\n`;

  explanation += `下互卦：${hugua.下互卦}（由二、三、四爻组成）\n`;
  explanation += `  ${hugua.互卦含义.下互象征}\n`;
  explanation += `  代表内在的、初期的、隐藏的变化趋势\n\n`;

  explanation += `上互卦：${hugua.上互卦}（由三、四、五爻组成）\n`;
  explanation += `  ${hugua.互卦含义.上互象征}\n`;
  explanation += `  代表外在的、后期的、显现的发展方向\n\n`;

  explanation += `整体含义：${hugua.互卦含义.整体含义}\n`;

  return explanation;
}

/**
 * 判断互卦的吉凶
 *
 * @param hugua 互卦结果
 * @param tiGua 体卦
 * @returns 吉凶判断
 */
export function judgeHuguaJixiong(
  hugua: HuguaResult,
  tiGua: BaGua
): {
  吉凶: '吉' | '平' | '凶';
  说明: string;
} {
  const tiWuxing = BA_GUA_DATA[tiGua].nature;
  const shangHuWuxing = BA_GUA_DATA[hugua.上互卦].nature;
  const xiaHuWuxing = BA_GUA_DATA[hugua.下互卦].nature;

  let score = 0;
  let explanation = '';

  // 检查上互卦与体卦的关系
  if (shangHuWuxing === tiWuxing) {
    score += 1;
    explanation += `上互卦${hugua.上互卦}与体卦${tiGua}同属${tiWuxing}，比和相助；`;
  } else if (isSheng(shangHuWuxing, tiWuxing)) {
    score += 2;
    explanation += `上互卦${hugua.上互卦}（${shangHuWuxing}）生体卦${tiGua}（${tiWuxing}），得助力；`;
  } else if (isKe(shangHuWuxing, tiWuxing)) {
    score -= 2;
    explanation += `上互卦${hugua.上互卦}（${shangHuWuxing}）克体卦${tiGua}（${tiWuxing}），有阻碍；`;
  }

  // 检查下互卦与体卦的关系
  if (xiaHuWuxing === tiWuxing) {
    score += 1;
    explanation += `下互卦${hugua.下互卦}与体卦${tiGua}同属${tiWuxing}，比和相助。`;
  } else if (isSheng(xiaHuWuxing, tiWuxing)) {
    score += 2;
    explanation += `下互卦${hugua.下互卦}（${xiaHuWuxing}）生体卦${tiGua}（${tiWuxing}），得助力。`;
  } else if (isKe(xiaHuWuxing, tiWuxing)) {
    score -= 2;
    explanation += `下互卦${hugua.下互卦}（${xiaHuWuxing}）克体卦${tiGua}（${tiWuxing}），有阻碍。`;
  }

  let jixiong: '吉' | '平' | '凶';
  if (score >= 2) {
    jixiong = '吉';
  } else if (score <= -2) {
    jixiong = '凶';
  } else {
    jixiong = '平';
  }

  return {
    吉凶: jixiong,
    说明: explanation
  };
}

/**
 * 判断五行相生
 */
function isSheng(from: string, to: string): boolean {
  const sheng: Record<string, string> = {
    '木': '火',
    '火': '土',
    '土': '金',
    '金': '水',
    '水': '木'
  };
  return sheng[from] === to;
}

/**
 * 判断五行相克
 */
function isKe(from: string, to: string): boolean {
  const ke: Record<string, string> = {
    '木': '土',
    '土': '水',
    '水': '火',
    '火': '金',
    '金': '木'
  };
  return ke[from] === to;
}
