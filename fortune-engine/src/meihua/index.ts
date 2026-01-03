/**
 * 梅花易数模块
 *
 * 提供完整的梅花易数占卜功能，包括：
 * - 起卦：多种起卦方式（字占、数占、时间占）
 * - 断卦：失物占、射覆等应用
 * - 八卦类象：完整的八卦万物类象数据
 */

// 导出八卦基础数据
export {
  type BaGua,
  type BaGuaXiang,
  type BaGuaInfo,
  BA_GUA_XIANG,
  BA_GUA_DATA
} from './bagua-data';

// 导出六十四卦数据
export {
  type LiuShiSiGua,
  LIUSHISI_GUA,
  getGuaName
} from './liushisi-gua';

// 导出起卦功能
export {
  type GuaResult,
  qiguaByNumber,
  qiguaByChar,
  qiguaByTime,
  getAccurateStrokeCount,
  CHAR_STROKES
} from './qigua';

// 导出断卦功能
export {
  type LostItemResult,
  divineForLostItem,
  sheFu
} from './duangua';

// 导出字义分析
export {
  type CharAnalysisResult,
  type CharStructure,
  analyzeCharacter,
  analyzeMultipleChars,
  CHAR_SEMANTICS,
  RADICAL_WUXING
} from './char-analysis';

// 导出体用分析
export {
  type TiYongAnalysis,
  type TiYongRelation,
  type Wuxing,
  analyzeTiYong,
  generateTiYongExplanation,
  determineTiYong
} from './tigua-yonggua';

// 导出互卦分析
export {
  type HuguaResult,
  calculateHugua,
  generateHuguaExplanation
} from './hugua';

// 导出交互式断卦
export {
  type DivinationSession,
  type DivinationStage,
  type UserFeedback,
  type NextStepSuggestion,
  createDivinationSession,
  getNextStep,
  processFeedback,
  generateFinalReport
} from './interactive-divination';

/**
 * 梅花易数快捷使用示例：
 *
 * @example 基础使用 - 字占失物
 * ```typescript
 * import { qiguaByChar, divineForLostItem } from 'fortune-engine/meihua';
 *
 * // 字占找手机
 * const gua = qiguaByChar('找');
 * const result = divineForLostItem(gua, '手机丢了在哪里', '手机');
 *
 * console.log(result.location.方位);  // 方位信息
 * console.log(result.location.具体位置);  // 具体位置推断
 * console.log(result.体用分析);  // 体用生克分析
 * console.log(result.互卦分析);  // 互卦分析
 * console.log(result.字义分析);  // 字义分析
 * ```
 *
 * @example 高级使用 - 交互式断卦
 * ```typescript
 * import {
 *   qiguaByChar,
 *   createDivinationSession,
 *   getNextStep,
 *   processFeedback
 * } from 'fortune-engine/meihua';
 *
 * // 创建交互式占卜会话
 * const gua = qiguaByChar('找');
 * const session = createDivinationSession('钥匙丢了', gua, '字占-找');
 *
 * // 获取下一步建议
 * const nextStep = getNextStep(session);
 * console.log(nextStep.question);  // 向用户提问
 *
 * // 处理用户反馈
 * const feedback = {
 *   准确性: 'partial',
 *   额外信息: {
 *     再起一字: '家',
 *     看到颜色: ['黄色']
 *   }
 * };
 * const { updatedSession, nextStep: next, analysis } = processFeedback(session, feedback);
 * console.log(analysis);  // 基于反馈的新分析
 * ```
 */
