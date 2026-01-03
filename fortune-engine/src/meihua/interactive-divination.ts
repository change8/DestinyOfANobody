/**
 * 交互式断卦系统
 *
 * 真正的梅花易数不是一次性给出结果，而是：
 * 1. 先给出初步判断
 * 2. 询问求测者反馈
 * 3. 根据反馈和外应调整判断
 * 4. 可能要求提供更多信息（再说个字、观察到的现象等）
 * 5. 逐步缩小范围，逼近真相
 */

import type { BaGua } from './bagua-data';
import type { GuaResult } from './qigua';
import type { TiYongAnalysis } from './tigua-yonggua';
import type { HuguaResult } from './hugua';
import { analyzeTiYong } from './tigua-yonggua';
import { calculateHugua } from './hugua';
import { analyzeCharacter, CHAR_SEMANTICS } from './char-analysis';
import { BA_GUA_XIANG } from './bagua-data';

/**
 * 占卜阶段
 */
export type DivinationStage =
  | 'initial'        // 初步起卦
  | 'direction'      // 确定方位
  | 'location'       // 确定具体位置
  | 'features'       // 确定物品特征
  | 'timing'         // 确定时间
  | 'refinement'     // 精细化调整
  | 'final';         // 最终结论

/**
 * 用户反馈类型
 */
export interface UserFeedback {
  // 上一轮的判断是否准确
  准确性: 'accurate' | 'partial' | 'inaccurate';

  // 用户的具体反馈
  反馈内容?: string;

  // 用户观察到的外应（环境中的特殊现象）
  外应?: string[];

  // 用户提供的额外信息
  额外信息?: {
    再起一字?: string;      // 用户再报一个字
    再起一数?: number;      // 用户再报一个数字
    观察方位?: string;      // 用户观察到的方位
    看到颜色?: string[];    // 用户看到的颜色
    听到声音?: string;      // 用户听到的声音
  };
}

/**
 * 交互式占卜会话
 */
export interface DivinationSession {
  // 会话ID
  sessionId: string;

  // 问题
  question: string;

  // 当前阶段
  currentStage: DivinationStage;

  // 起卦记录
  guaHistory: {
    gua: GuaResult;
    source: string;      // 起卦来源（"字占-找"、"数字占-3,7"等）
    timestamp: Date;
  }[];

  // 体用分析
  tiYongAnalysis?: TiYongAnalysis;

  // 互卦分析
  huguaAnalysis?: HuguaResult;

  // 当前判断
  currentJudgment: {
    方位?: string[];
    具体位置?: string[];
    物品特征?: string[];
    时间?: string;
    置信度: number;  // 0-100
  };

  // 外应记录
  externalSigns: string[];

  // 交互历史
  interactions: {
    stage: DivinationStage;
    question: string;
    answer?: string;
    feedback?: UserFeedback;
    timestamp: Date;
  }[];

  // 综合分析
  综合分析: string;
}

/**
 * 下一步操作建议
 */
export interface NextStepSuggestion {
  // 向用户提出的问题
  question: string;

  // 问题类型
  questionType: 'yes_no' | 'choice' | 'input' | 'multiple_choice';

  // 选项（如果是选择题）
  options?: string[];

  // 说明
  explanation: string;

  // 如果用户无法回答，可以采取的替代方案
  alternatives?: string[];
}

/**
 * 创建新的占卜会话
 */
export function createDivinationSession(
  question: string,
  initialGua: GuaResult,
  source: string
): DivinationSession {
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const tiYongAnalysis = analyzeTiYong(initialGua);
  const huguaAnalysis = calculateHugua(initialGua.upperGua, initialGua.lowerGua);

  // 初步判断
  const upperXiang = BA_GUA_XIANG[initialGua.upperGua];
  const lowerXiang = BA_GUA_XIANG[initialGua.lowerGua];

  const initialJudgment = {
    方位: [upperXiang.方位, lowerXiang.方位],
    具体位置: [
      ...upperXiang.位置.具体.slice(0, 3),
      ...lowerXiang.位置.具体.slice(0, 3)
    ],
    物品特征: [
      ...upperXiang.物象.形状.slice(0, 2),
      ...upperXiang.物象.颜色.slice(0, 2)
    ],
    置信度: 40  // 初始置信度较低
  };

  return {
    sessionId,
    question,
    currentStage: 'initial',
    guaHistory: [{
      gua: initialGua,
      source,
      timestamp: new Date()
    }],
    tiYongAnalysis,
    huguaAnalysis,
    currentJudgment: initialJudgment,
    externalSigns: [],
    interactions: [],
    综合分析: generateInitialAnalysis(initialGua, tiYongAnalysis, huguaAnalysis)
  };
}

/**
 * 生成初步分析
 */
function generateInitialAnalysis(
  gua: GuaResult,
  tiYong: TiYongAnalysis,
  hugua: HuguaResult
): string {
  let analysis = `【初步分析】\n\n`;
  analysis += `起卦得${gua.mainGuaName}，动${gua.changingLine}爻，变${gua.changeGua?.guaName}。\n\n`;
  analysis += `体卦为${tiYong.体卦.卦名}，用卦为${tiYong.用卦.卦名}，${tiYong.体用关系}。\n`;
  analysis += `${tiYong.生克分析.关系描述}，${tiYong.生克分析.强弱判断}。\n\n`;
  analysis += `互卦为${hugua.互卦名}，${hugua.互卦含义.整体含义}\n\n`;

  if (tiYong.失物判断) {
    analysis += `【初步判断】\n`;
    analysis += `${tiYong.失物判断.能否找到 ? '可以找到' : '较难找到'}，`;
    analysis += `难度：${tiYong.失物判断.难易程度}。\n`;
    analysis += `建议：${tiYong.失物判断.寻找建议}\n`;
  }

  return analysis;
}

/**
 * 获取下一步建议
 */
export function getNextStep(session: DivinationSession): NextStepSuggestion {
  const { currentStage, currentJudgment, tiYongAnalysis } = session;

  switch (currentStage) {
    case 'initial':
      return {
        question: `根据卦象，初步判断方位在${currentJudgment.方位?.[0]}或${currentJudgment.方位?.[1]}。请问这个方位判断是否符合您的实际情况？`,
        questionType: 'choice',
        options: ['符合', '部分符合', '不符合', '不确定'],
        explanation: `体卦${tiYongAnalysis?.体卦.卦名}对应${tiYongAnalysis?.体卦.象征}，用卦${tiYongAnalysis?.用卦.卦名}对应${tiYongAnalysis?.用卦.象征}，综合判断方位。`,
        alternatives: [
          '您可以再报一个字或数字，以便更准确地判断',
          '您可以描述一下周围环境的特殊现象'
        ]
      };

    case 'direction':
      return {
        question: `方位确认后，我们来缩小范围。在这个方位，可能在以下位置：${currentJudgment.具体位置?.slice(0, 5).join('、')}。您是否在这些地方找过？`,
        questionType: 'multiple_choice',
        options: currentJudgment.具体位置?.slice(0, 5),
        explanation: `根据卦象的具体类象分析得出这些位置。`,
        alternatives: [
          '如果这些位置都不对，您可以再说一个与丢失物品相关的字',
          '您可以描述一下最后一次看到物品的情景'
        ]
      };

    case 'location':
      return {
        question: `现在让我们确认物品特征。根据卦象，物品可能具有以下特征：${currentJudgment.物品特征?.join('、')}。这是否与您丢失的物品特征相符？`,
        questionType: 'choice',
        options: ['完全相符', '部分相符', '不相符'],
        explanation: `从八卦万物类象推断物品特征。`,
        alternatives: [
          '您可以直接告诉我物品的主要特征，以便更精确判断'
        ]
      };

    case 'features':
      return {
        question: `根据体用生克关系，预计${tiYongAnalysis?.失物判断?.预计时间}能找到。您是否愿意按照卦象指示的方位和位置再仔细寻找一次？`,
        questionType: 'yes_no',
        explanation: `${tiYongAnalysis?.失物判断?.寻找建议}`,
        alternatives: [
          '如果实在找不到，可以换个时间再占一次'
        ]
      };

    case 'timing':
      return {
        question: `您在寻找过程中是否注意到什么特殊的现象或巧合？比如听到某种声音、看到某种颜色、或者突然想到什么？`,
        questionType: 'input',
        explanation: `外应是梅花易数的重要部分，周围环境的变化往往能提供关键线索。`,
        alternatives: []
      };

    default:
      return {
        question: `根据目前的信息，建议您在${currentJudgment.方位?.[0]}方向的${currentJudgment.具体位置?.[0]}寻找。您是否需要更多细节？`,
        questionType: 'yes_no',
        explanation: `当前置信度：${currentJudgment.置信度}%`,
        alternatives: []
      };
  }
}

/**
 * 处理用户反馈，更新会话
 */
export function processFeedback(
  session: DivinationSession,
  feedback: UserFeedback
): {
  updatedSession: DivinationSession;
  nextStep: NextStepSuggestion;
  analysis: string;
} {
  const newSession = { ...session };
  let analysis = '';

  // 记录反馈
  newSession.interactions.push({
    stage: session.currentStage,
    question: getNextStep(session).question,
    answer: feedback.反馈内容,
    feedback,
    timestamp: new Date()
  });

  // 根据准确性调整置信度
  if (feedback.准确性 === 'accurate') {
    newSession.currentJudgment.置信度 = Math.min(100, newSession.currentJudgment.置信度 + 20);
    analysis += '✓ 判断准确，继续深入分析。\n';
  } else if (feedback.准确性 === 'partial') {
    newSession.currentJudgment.置信度 = Math.min(80, newSession.currentJudgment.置信度 + 10);
    analysis += '△ 部分准确，需要调整判断。\n';
  } else {
    newSession.currentJudgment.置信度 = Math.max(20, newSession.currentJudgment.置信度 - 15);
    analysis += '✗ 判断有误，需要重新分析。\n';
  }

  // 处理外应
  if (feedback.外应 && feedback.外应.length > 0) {
    newSession.externalSigns.push(...feedback.外应);
    analysis += `\n【外应】观察到：${feedback.外应.join('、')}\n`;
    analysis += analyzeExternalSigns(feedback.外应, session.guaHistory[session.guaHistory.length - 1].gua);
  }

  // 处理额外信息
  if (feedback.额外信息) {
    const { 再起一字, 再起一数, 观察方位, 看到颜色, 听到声音 } = feedback.额外信息;

    if (再起一字) {
      // 分析新字的含义
      const charAnalysis = analyzeCharacter(再起一字);
      analysis += `\n【新字分析】"${再起一字}"字：${charAnalysis.分析说明}\n`;

      // 根据新字调整判断
      if (charAnalysis.建议卦象.length > 0) {
        const newGua = charAnalysis.建议卦象[0];
        const newXiang = BA_GUA_XIANG[newGua];
        newSession.currentJudgment.方位 = [newXiang.方位, ...newSession.currentJudgment.方位 || []];
        newSession.currentJudgment.具体位置 = [
          ...newXiang.位置.具体.slice(0, 2),
          ...newSession.currentJudgment.具体位置 || []
        ];
      }
    }

    if (观察方位) {
      analysis += `\n【方位确认】用户确认方位为${观察方位}\n`;
      newSession.currentJudgment.方位 = [观察方位];
      newSession.currentJudgment.置信度 += 15;
    }

    if (看到颜色 && 看到颜色.length > 0) {
      analysis += `\n【颜色线索】观察到${看到颜色.join('、')}色\n`;
      analysis += analyzeColorClues(看到颜色, session);
    }

    if (听到声音) {
      analysis += `\n【声音外应】听到${听到声音}\n`;
      analysis += analyzeSoundClues(听到声音);
    }
  }

  // 推进到下一阶段
  newSession.currentStage = getNextStage(newSession.currentStage, feedback.准确性);

  const nextStep = getNextStep(newSession);

  return {
    updatedSession: newSession,
    nextStep,
    analysis
  };
}

/**
 * 分析外应
 */
function analyzeExternalSigns(signs: string[], gua: GuaResult): string {
  let analysis = '';

  for (const sign of signs) {
    // 简单的外应分析
    if (sign.includes('鸟') || sign.includes('飞')) {
      analysis += `鸟飞象征震卦（动），提示物品可能在会动的地方或东方。\n`;
    } else if (sign.includes('水') || sign.includes('雨')) {
      analysis += `水象征坎卦，提示物品可能在北方或潮湿的地方。\n`;
    } else if (sign.includes('声') || sign.includes('响')) {
      analysis += `声响象征震卦或兑卦，注意有声音的地方或开口处。\n`;
    } else if (sign.includes('光') || sign.includes('亮')) {
      analysis += `光亮象征离卦，提示物品在明亮处或南方。\n`;
    }
  }

  return analysis || '外应与卦象相应，继续按卦象指示寻找。\n';
}

/**
 * 分析颜色线索
 */
function analyzeColorClues(colors: string[], session: DivinationSession): string {
  const colorToGua: Record<string, BaGua> = {
    '红': '离',
    '黄': '坤',
    '白': '乾',
    '黑': '坎',
    '绿': '震',
    '蓝': '坎'
  };

  let analysis = '';
  for (const color of colors) {
    const gua = colorToGua[color];
    if (gua) {
      const xiang = BA_GUA_XIANG[gua];
      analysis += `${color}色对应${gua}卦，方位${xiang.方位}，`;
      analysis += `可能在${xiang.位置.具体[0]}等地。\n`;
    }
  }

  return analysis;
}

/**
 * 分析声音线索
 */
function analyzeSoundClues(sound: string): string {
  if (sound.includes('敲') || sound.includes('击')) {
    return '敲击声属震卦，物品可能在会发声的地方或东方。\n';
  } else if (sound.includes('风')) {
    return '风声属巽卦，物品可能在通风处或东南方。\n';
  } else if (sound.includes('水')) {
    return '水声属坎卦，物品可能在水边或北方。\n';
  }

  return '注意声音来源的方向。\n';
}

/**
 * 确定下一阶段
 */
function getNextStage(current: DivinationStage, accuracy: 'accurate' | 'partial' | 'inaccurate'): DivinationStage {
  if (accuracy === 'inaccurate') {
    // 如果判断不准，可能需要重新起卦或收集更多信息
    return current === 'initial' ? 'initial' : 'refinement';
  }

  const stageOrder: DivinationStage[] = ['initial', 'direction', 'location', 'features', 'timing', 'final'];
  const currentIndex = stageOrder.indexOf(current);

  if (currentIndex < stageOrder.length - 1) {
    return stageOrder[currentIndex + 1];
  }

  return 'final';
}

/**
 * 生成最终报告
 */
export function generateFinalReport(session: DivinationSession): string {
  let report = '【最终占断报告】\n\n';

  report += `问题：${session.question}\n`;
  report += `占卜时间：${session.guaHistory[0].timestamp.toLocaleString('zh-CN')}\n`;
  report += `起卦方式：${session.guaHistory[0].source}\n`;
  report += `互动轮次：${session.interactions.length}次\n`;
  report += `当前置信度：${session.currentJudgment.置信度}%\n\n`;

  report += `===== 综合判断 =====\n\n`;

  if (session.currentJudgment.方位 && session.currentJudgment.方位.length > 0) {
    report += `【方位】${session.currentJudgment.方位[0]}\n`;
  }

  if (session.currentJudgment.具体位置 && session.currentJudgment.具体位置.length > 0) {
    report += `【具体位置】\n`;
    session.currentJudgment.具体位置.slice(0, 5).forEach((loc, i) => {
      report += `  ${i + 1}. ${loc}\n`;
    });
  }

  if (session.currentJudgment.物品特征 && session.currentJudgment.物品特征.length > 0) {
    report += `【物品特征】${session.currentJudgment.物品特征.join('、')}\n`;
  }

  if (session.currentJudgment.时间) {
    report += `【寻找时间】${session.currentJudgment.时间}\n`;
  }

  if (session.externalSigns.length > 0) {
    report += `\n【外应记录】\n`;
    session.externalSigns.forEach((sign, i) => {
      report += `  ${i + 1}. ${sign}\n`;
    });
  }

  report += `\n===== 卦理依据 =====\n\n`;
  report += session.综合分析;

  report += `\n===== 最终建议 =====\n\n`;
  if (session.tiYongAnalysis?.失物判断) {
    report += session.tiYongAnalysis.失物判断.寻找建议;
  }

  report += `\n\n（占卜仅供参考，最终还需结合实际情况判断）`;

  return report;
}
