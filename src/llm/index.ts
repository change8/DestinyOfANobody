/**
 * LLM 集成模块
 *
 * Fortune Engine 的 LLM 集成层：
 * - 输入理解：将用户自然语言转化为结构化数据
 * - 结果解读：将计算结果转化为人性化文字
 */

// 导出类型
export type {
  LLMProvider,
  LLMConfig,
  LLMMessage,
  LLMResponse,
  UserIntentUnderstanding,
  InterpretationRequest,
  InterpretationResult
} from './types';

export { DEFAULT_LLM_CONFIGS } from './types';

// 导出客户端
export {
  LLMClient,
  OpenAIClient,
  AnthropicClient,
  ZhipuClient,
  QwenClient,
  DeepSeekClient,
  createLLMClient
} from './client';

// 导出服务
export { InputUnderstandingService } from './input-understanding';
export { ResultInterpretationService } from './result-interpretation';

/**
 * 快速使用示例：
 *
 * @example 配置 LLM
 * ```typescript
 * import { createLLMClient, DEFAULT_LLM_CONFIGS } from 'fortune-engine/llm';
 *
 * // 方式1：使用默认配置
 * const client = createLLMClient({
 *   provider: 'openai',
 *   apiKey: process.env.OPENAI_API_KEY,
 *   ...DEFAULT_LLM_CONFIGS.openai
 * });
 *
 * // 方式2：自定义配置
 * const client = createLLMClient({
 *   provider: 'anthropic',
 *   apiKey: process.env.ANTHROPIC_API_KEY,
 *   model: 'claude-3-opus-20240229',
 *   temperature: 0.5,
 *   maxTokens: 3000
 * });
 *
 * // 方式3：使用国产模型（智谱AI）
 * const client = createLLMClient({
 *   provider: 'zhipu',
 *   apiKey: process.env.ZHIPU_API_KEY,
 *   model: 'glm-4'
 * });
 * ```
 *
 * @example 理解用户输入
 * ```typescript
 * import { createLLMClient, InputUnderstandingService } from 'fortune-engine/llm';
 *
 * const client = createLLMClient({ ... });
 * const understandingService = new InputUnderstandingService(client);
 *
 * // 理解自然语言输入
 * const understanding = await understandingService.understand(
 *   '我是1990年1月15日早上8点出生的男性，帮我算算八字'
 * );
 *
 * console.log(understanding.divinationType);  // "八字排盘"
 * console.log(understanding.extractedInfo.birthDateTime);
 * // { date: "1990-01-15", time: "08:00", timezone: 8 }
 *
 * // 检查是否需要澄清
 * if (understanding.clarificationNeeded.length > 0) {
 *   console.log('需要用户提供：', understanding.clarificationNeeded);
 * }
 * ```
 *
 * @example 解读计算结果
 * ```typescript
 * import { BaziCalculator } from 'fortune-engine';
 * import { createLLMClient, ResultInterpretationService } from 'fortune-engine/llm';
 *
 * // 1. 使用 Fortune Engine 计算
 * const calculator = new BaziCalculator();
 * const result = calculator.calculate({
 *   birthDate: '1990-01-15',
 *   birthTime: '08:00',
 *   gender: 'male'
 * });
 *
 * // 2. 使用 LLM 解读结果
 * const client = createLLMClient({ ... });
 * const interpretationService = new ResultInterpretationService(client);
 *
 * const interpretation = await interpretationService.interpretBazi(
 *   result,
 *   '帮我分析一下我的八字',
 *   'professional'  // 或 'casual', 'detailed', 'concise'
 * );
 *
 * console.log(interpretation.summary);  // 一句话总结
 * console.log(interpretation.sections);  // 详细解读章节
 * console.log(interpretation.keyFindings);  // 关键发现
 * console.log(interpretation.suggestions);  // 实用建议
 *
 * // 3. 格式化为文本
 * const text = interpretationService.formatInterpretationText(interpretation);
 * console.log(text);  // Markdown 格式的完整解读
 * ```
 *
 * @example 完整流程（从输入到输出）
 * ```typescript
 * import { BaziCalculator } from 'fortune-engine';
 * import {
 *   createLLMClient,
 *   InputUnderstandingService,
 *   ResultInterpretationService
 * } from 'fortune-engine/llm';
 *
 * // 初始化
 * const client = createLLMClient({
 *   provider: 'openai',
 *   apiKey: process.env.OPENAI_API_KEY
 * });
 * const understandingService = new InputUnderstandingService(client);
 * const interpretationService = new ResultInterpretationService(client);
 *
 * // 用户输入
 * const userInput = '我是1990年1月15日早上8点出生的男性，帮我算算八字';
 *
 * // 1. 理解输入
 * const understanding = await understandingService.understand(userInput);
 *
 * if (understanding.divinationType !== '八字排盘') {
 *   throw new Error('不支持的占卜类型');
 * }
 *
 * // 2. 计算八字
 * const calculator = new BaziCalculator();
 * const result = calculator.calculate({
 *   birthDate: understanding.extractedInfo.birthDateTime!.date,
 *   birthTime: understanding.extractedInfo.birthDateTime!.time,
 *   gender: understanding.extractedInfo.gender!
 * });
 *
 * // 3. 解读结果
 * const interpretation = await interpretationService.interpretBazi(
 *   result,
 *   userInput,
 *   'professional'
 * );
 *
 * // 4. 返回给用户
 * const finalOutput = interpretationService.formatInterpretationText(interpretation);
 * console.log(finalOutput);
 * ```
 *
 * @example 梅花易数完整流程
 * ```typescript
 * import { qiguaByChar, divineForLostItem } from 'fortune-engine';
 * import {
 *   createLLMClient,
 *   InputUnderstandingService,
 *   ResultInterpretationService
 * } from 'fortune-engine/llm';
 *
 * const client = createLLMClient({ ... });
 * const understandingService = new InputUnderstandingService(client);
 * const interpretationService = new ResultInterpretationService(client);
 *
 * // 用户输入："我的钥匙丢了，在哪里能找到？"
 * const understanding = await understandingService.understand('找钥匙');
 *
 * // 检查是否需要起卦用的字
 * const char = understanding.extractedInfo.characters?.[0] || '找';
 *
 * // 起卦
 * const gua = qiguaByChar(char);
 *
 * // 断卦
 * const result = divineForLostItem(
 *   gua,
 *   understanding.extractedInfo.question || '寻找钥匙',
 *   understanding.extractedInfo.lostItem
 * );
 *
 * // 解读
 * const interpretation = await interpretationService.interpretMeihua(
 *   result,
 *   '找钥匙',
 *   'casual'
 * );
 *
 * console.log(interpretation.summary);
 * // "根据梅花易数分析，您的钥匙很可能在西北方向的高处..."
 * ```
 */
