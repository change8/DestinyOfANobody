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

/**
 * 梅花易数快捷使用示例：
 *
 * @example
 * ```typescript
 * import { qiguaByChar, divineForLostItem } from 'fortune-engine/meihua';
 *
 * // 字占找手机
 * const gua = qiguaByChar('找');
 * const result = divineForLostItem(gua, '手机丢了在哪里', '手机');
 *
 * console.log(result.location.方位);  // 方位信息
 * console.log(result.location.具体位置);  // 具体位置推断
 * console.log(result.itemFeatures.可能颜色);  // 物品颜色
 * console.log(result.timing.能否找到);  // 能否找到
 * ```
 *
 * @example
 * ```typescript
 * import { qiguaByNumber, sheFu } from 'fortune-engine/meihua';
 *
 * // 数字占射覆
 * const gua = qiguaByNumber(7, 3);
 * const result = sheFu(gua);
 *
 * console.log(result.可能物品);  // ['羊', '鸡', '玉器', ...]
 * console.log(result.物品特征);  // "形状：缺损或开口..."
 * ```
 */
