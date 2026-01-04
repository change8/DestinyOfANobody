/**
 * 用户输入理解模块
 *
 * 使用 LLM 理解用户的自然语言输入，提取结构化信息
 */

import type { LLMClient } from './client';
import type { UserIntentUnderstanding, LLMMessage } from './types';

/**
 * 输入理解服务
 */
export class InputUnderstandingService {
  private llmClient: LLMClient;

  constructor(llmClient: LLMClient) {
    this.llmClient = llmClient;
  }

  /**
   * 理解用户输入
   */
  async understand(userInput: string): Promise<UserIntentUnderstanding> {
    const messages: LLMMessage[] = [
      {
        role: 'system',
        content: this.getSystemPrompt()
      },
      {
        role: 'user',
        content: userInput
      }
    ];

    const response = await this.llmClient.chat(messages);

    // 解析 LLM 返回的 JSON
    const result = this.parseResponse(response.content);

    return {
      ...result,
      originalInput: userInput
    };
  }

  /**
   * 获取系统提示词
   */
  private getSystemPrompt(): string {
    return `你是一个专业的中国传统命理助手，负责理解用户的占卜需求。

你的任务是分析用户输入，提取关键信息，并返回 JSON 格式的结构化数据。

## 支持的占卜类型

1. **八字排盘**：需要提取出生日期、时间、性别
2. **失物占**：需要提取丢失物品名称、问题描述
3. **事业占**：需要提取具体问题
4. **感情占**：需要提取具体问题
5. **其他**：通用占卜

## 输出格式

请严格按照以下 JSON 格式返回，不要包含任何其他文字：

\`\`\`json
{
  "divinationType": "八字排盘" | "失物占" | "事业占" | "感情占" | "其他",
  "extractedInfo": {
    "birthDateTime": {
      "date": "YYYY-MM-DD",
      "time": "HH:mm",
      "timezone": 8,
      "longitude": 120
    },
    "gender": "male" | "female",
    "name": "姓名",
    "lostItem": "物品名称",
    "question": "问题描述",
    "characters": ["字1", "字2"],
    "additionalInfo": {}
  },
  "confidence": 0.95,
  "clarificationNeeded": ["需要澄清的问题1", "需要澄清的问题2"]
}
\`\`\`

## 示例

**输入1**："我是1990年1月15日早上8点出生的男性，帮我算算八字"
**输出1**：
\`\`\`json
{
  "divinationType": "八字排盘",
  "extractedInfo": {
    "birthDateTime": {
      "date": "1990-01-15",
      "time": "08:00",
      "timezone": 8
    },
    "gender": "male"
  },
  "confidence": 0.95,
  "clarificationNeeded": []
}
\`\`\`

**输入2**："我的钥匙丢了，在哪里能找到？"
**输出2**：
\`\`\`json
{
  "divinationType": "失物占",
  "extractedInfo": {
    "lostItem": "钥匙",
    "question": "钥匙丢了在哪里能找到"
  },
  "confidence": 0.9,
  "clarificationNeeded": ["请报一个字，用于起卦"]
}
\`\`\`

**输入3**："找钥匙"
**输出3**：
\`\`\`json
{
  "divinationType": "失物占",
  "extractedInfo": {
    "lostItem": "钥匙",
    "characters": ["找"],
    "question": "找钥匙"
  },
  "confidence": 0.85,
  "clarificationNeeded": []
}
\`\`\`

## 注意事项

1. 如果信息不完整，在 clarificationNeeded 中列出需要用户补充的信息
2. confidence 表示理解的置信度（0-1），信息越完整置信度越高
3. 日期格式必须是 YYYY-MM-DD，时间格式必须是 HH:mm
4. 如果用户没有明确说明性别，clarificationNeeded 中添加
5. 只返回 JSON，不要有任何额外说明

现在，请分析用户输入并返回结果：`;
  }

  /**
   * 解析 LLM 响应
   */
  private parseResponse(content: string): Omit<UserIntentUnderstanding, 'originalInput'> {
    try {
      // 提取 JSON 部分
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) ||
                       content.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error('无法从响应中提取 JSON');
      }

      const jsonStr = jsonMatch[1] || jsonMatch[0];
      const parsed = JSON.parse(jsonStr);

      return {
        divinationType: parsed.divinationType,
        extractedInfo: parsed.extractedInfo || {},
        confidence: parsed.confidence || 0.5,
        clarificationNeeded: parsed.clarificationNeeded || []
      };
    } catch (error) {
      console.error('解析 LLM 响应失败:', error);
      console.error('原始响应:', content);

      // 返回一个低置信度的默认结果
      return {
        divinationType: '其他',
        extractedInfo: {},
        confidence: 0.3,
        clarificationNeeded: ['无法理解您的输入，请更详细地描述您的问题']
      };
    }
  }

  /**
   * 验证理解结果的完整性
   */
  validateUnderstanding(understanding: UserIntentUnderstanding): boolean {
    const { divinationType, extractedInfo, confidence } = understanding;

    // 置信度太低
    if (confidence < 0.6) {
      return false;
    }

    // 根据不同类型验证必需信息
    switch (divinationType) {
      case '八字排盘':
        return !!(
          extractedInfo.birthDateTime?.date &&
          extractedInfo.birthDateTime?.time &&
          extractedInfo.gender
        );

      case '失物占':
        return !!(
          extractedInfo.lostItem ||
          extractedInfo.question
        );

      default:
        return !!extractedInfo.question;
    }
  }
}
