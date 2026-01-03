/**
 * 体用分析模块
 *
 * 体用论是梅花易数的核心理论：
 * - 动爻所在的卦为用卦（代表外部、事物、他人）
 * - 无动爻的卦为体卦（代表自己、主体、内在）
 * - 体用生克关系决定吉凶成败
 */

import type { BaGua } from './bagua-data';
import { BA_GUA_DATA } from './bagua-data';
import type { GuaResult } from './qigua';

/**
 * 五行
 */
export type Wuxing = '金' | '木' | '水' | '火' | '土';

/**
 * 体用关系
 */
export type TiYongRelation =
  | '体克用'   // 我克他，可成但费力
  | '用克体'   // 他克我，凶险难成
  | '体生用'   // 我生他，耗损自己
  | '用生体'   // 他生我，吉利易成
  | '比和';     // 同类，平稳

/**
 * 体用分析结果
 */
export interface TiYongAnalysis {
  // 体卦信息
  体卦: {
    卦名: BaGua;
    五行: Wuxing;
    卦数: number;
    象征: string;
  };

  // 用卦信息
  用卦: {
    卦名: BaGua;
    五行: Wuxing;
    卦数: number;
    象征: string;
  };

  // 体用关系
  体用关系: TiYongRelation;

  // 生克分析
  生克分析: {
    关系描述: string;
    强弱判断: string;
    吉凶: '大吉' | '吉' | '平' | '凶' | '大凶';
  };

  // 失物占专用判断
  失物判断?: {
    能否找到: boolean;
    难易程度: '很容易' | '容易' | '普通' | '较难' | '很难';
    寻找建议: string;
  };
}

/**
 * 获取八卦的五行属性
 */
export function getGuaWuxing(gua: BaGua): Wuxing {
  return BA_GUA_DATA[gua].nature;
}

/**
 * 判断五行生克关系
 */
export function getWuxingRelation(from: Wuxing, to: Wuxing):
  '生' | '克' | '被生' | '被克' | '比和' {

  // 相生关系：木生火、火生土、土生金、金生水、水生木
  const sheng: Record<Wuxing, Wuxing> = {
    '木': '火',
    '火': '土',
    '土': '金',
    '金': '水',
    '水': '木'
  };

  // 相克关系：木克土、土克水、水克火、火克金、金克木
  const ke: Record<Wuxing, Wuxing> = {
    '木': '土',
    '土': '水',
    '水': '火',
    '火': '金',
    '金': '木'
  };

  if (from === to) {
    return '比和';
  }

  if (sheng[from] === to) {
    return '生';
  }

  if (sheng[to] === from) {
    return '被生';
  }

  if (ke[from] === to) {
    return '克';
  }

  if (ke[to] === from) {
    return '被克';
  }

  return '比和';
}

/**
 * 确定体卦和用卦
 *
 * 规则：
 * - 动爻在上卦（4、5、6爻），则上卦为用卦，下卦为体卦
 * - 动爻在下卦（1、2、3爻），则下卦为用卦，上卦为体卦
 */
export function determineTiYong(guaResult: GuaResult): {
  体卦: BaGua;
  用卦: BaGua;
} {
  const { upperGua, lowerGua, changingLine } = guaResult;

  if (changingLine >= 4) {
    // 动爻在上卦，上卦为用，下卦为体
    return {
      体卦: lowerGua,
      用卦: upperGua
    };
  } else {
    // 动爻在下卦，下卦为用，上卦为体
    return {
      体卦: upperGua,
      用卦: lowerGua
    };
  }
}

/**
 * 分析体用关系
 */
export function analyzeTiYong(guaResult: GuaResult): TiYongAnalysis {
  const { 体卦, 用卦 } = determineTiYong(guaResult);

  const tiWuxing = getGuaWuxing(体卦);
  const yongWuxing = getGuaWuxing(用卦);

  const tiData = BA_GUA_DATA[体卦];
  const yongData = BA_GUA_DATA[用卦];

  // 判断体用关系
  const wuxingRelation = getWuxingRelation(tiWuxing, yongWuxing);
  let tiYongRelation: TiYongRelation;
  let relationDesc: string;
  let strengthJudgment: string;
  let jiXiong: '大吉' | '吉' | '平' | '凶' | '大凶';

  switch (wuxingRelation) {
    case '克':
      tiYongRelation = '体克用';
      relationDesc = `体卦${体卦}（${tiWuxing}）克用卦${用卦}（${yongWuxing}）`;
      strengthJudgment = '体旺用衰，主体强势，能够克服困难';
      jiXiong = '吉';
      break;

    case '被克':
      tiYongRelation = '用克体';
      relationDesc = `用卦${用卦}（${yongWuxing}）克体卦${体卦}（${tiWuxing}）`;
      strengthJudgment = '体弱用强，主体受制，事情艰难';
      jiXiong = '凶';
      break;

    case '生':
      tiYongRelation = '体生用';
      relationDesc = `体卦${体卦}（${tiWuxing}）生用卦${用卦}（${yongWuxing}）`;
      strengthJudgment = '体耗用旺，付出较多，收获较少';
      jiXiong = '平';
      break;

    case '被生':
      tiYongRelation = '用生体';
      relationDesc = `用卦${用卦}（${yongWuxing}）生体卦${体卦}（${tiWuxing}）`;
      strengthJudgment = '体旺用耗，得外界助力，顺利吉利';
      jiXiong = '大吉';
      break;

    case '比和':
    default:
      tiYongRelation = '比和';
      relationDesc = `体卦${体卦}与用卦${用卦}同属${tiWuxing}，五行比和`;
      strengthJudgment = '体用平衡，事情平稳，不大起大落';
      jiXiong = '平';
      break;
  }

  // 失物占的专门判断
  let lostItemJudgment: TiYongAnalysis['失物判断'];

  if (tiYongRelation === '体克用') {
    lostItemJudgment = {
      能否找到: true,
      难易程度: '普通',
      寻找建议: '可以找到，但需要一些时间和努力。主动寻找，仔细搜索。'
    };
  } else if (tiYongRelation === '用克体') {
    lostItemJudgment = {
      能否找到: false,
      难易程度: '很难',
      寻找建议: '较难找到，可能已经遗失或被他人拿走。建议放弃或换个时间再找。'
    };
  } else if (tiYongRelation === '体生用') {
    lostItemJudgment = {
      能否找到: false,
      难易程度: '较难',
      寻找建议: '物品难以找到，可能已经远离或损坏。即使找到也要付出较大代价。'
    };
  } else if (tiYongRelation === '用生体') {
    lostItemJudgment = {
      能否找到: true,
      难易程度: '很容易',
      寻找建议: '很容易找到，物品就在附近，或者有人会主动归还。'
    };
  } else {
    // 比和
    lostItemJudgment = {
      能否找到: true,
      难易程度: '容易',
      寻找建议: '物品未丢失，可能只是暂时找不到，仔细找找就能发现。'
    };
  }

  return {
    体卦: {
      卦名: 体卦,
      五行: tiWuxing,
      卦数: tiData.number,
      象征: tiData.象征
    },
    用卦: {
      卦名: 用卦,
      五行: yongWuxing,
      卦数: yongData.number,
      象征: yongData.象征
    },
    体用关系: tiYongRelation,
    生克分析: {
      关系描述: relationDesc,
      强弱判断: strengthJudgment,
      吉凶: jiXiong
    },
    失物判断: lostItemJudgment
  };
}

/**
 * 生成详细的体用分析说明
 */
export function generateTiYongExplanation(analysis: TiYongAnalysis): string {
  let explanation = '【体用分析】\n\n';

  explanation += `体卦：${analysis.体卦.卦名}卦\n`;
  explanation += `  - 五行属${analysis.体卦.五行}\n`;
  explanation += `  - 象征：${analysis.体卦.象征}\n`;
  explanation += `  - 代表：主体、自己、内在、问卜者\n\n`;

  explanation += `用卦：${analysis.用卦.卦名}卦\n`;
  explanation += `  - 五行属${analysis.用卦.五行}\n`;
  explanation += `  - 象征：${analysis.用卦.象征}\n`;
  explanation += `  - 代表：外部、事物、他人、所占之事\n\n`;

  explanation += `体用关系：${analysis.体用关系}\n`;
  explanation += `  ${analysis.生克分析.关系描述}\n`;
  explanation += `  ${analysis.生克分析.强弱判断}\n`;
  explanation += `  吉凶：${analysis.生克分析.吉凶}\n`;

  if (analysis.失物判断) {
    explanation += `\n【失物占判断】\n`;
    explanation += `  能否找到：${analysis.失物判断.能否找到 ? '✓ 可以找到' : '✗ 难以找到'}\n`;
    explanation += `  难易程度：${analysis.失物判断.难易程度}\n`;
    explanation += `  建议：${analysis.失物判断.寻找建议}\n`;
  }

  return explanation;
}
