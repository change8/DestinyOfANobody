/**
 * 结果解读模块
 *
 * 使用 LLM 将 Fortune Engine 的计算结果解读为人性化的文字
 */

import type { LLMClient } from './client';
import type {
  InterpretationRequest,
  InterpretationResult,
  LLMMessage
} from './types';
import type { BaziResult } from '../types';
import type { LostItemResult } from '../meihua/duangua';

/**
 * 结果解读服务
 */
export class ResultInterpretationService {
  private llmClient: LLMClient;

  constructor(llmClient: LLMClient) {
    this.llmClient = llmClient;
  }

  /**
   * 解读八字排盘结果
   */
  async interpretBazi(
    result: BaziResult,
    userQuestion: string,
    style: 'professional' | 'casual' | 'detailed' | 'concise' = 'professional'
  ): Promise<InterpretationResult> {
    const request: InterpretationRequest = {
      type: '八字排盘',
      rawResult: result,
      userQuestion,
      style,
      includeSuggestions: true
    };

    return this.interpret(request);
  }

  /**
   * 解读梅花易数结果
   */
  async interpretMeihua(
    result: LostItemResult,
    userQuestion: string,
    style: 'professional' | 'casual' | 'detailed' | 'concise' = 'professional'
  ): Promise<InterpretationResult> {
    const request: InterpretationRequest = {
      type: '梅花易数',
      rawResult: result,
      userQuestion,
      style,
      includeSuggestions: true
    };

    return this.interpret(request);
  }

  /**
   * 通用解读方法
   */
  private async interpret(request: InterpretationRequest): Promise<InterpretationResult> {
    const messages: LLMMessage[] = [
      {
        role: 'system',
        content: this.getSystemPrompt(request)
      },
      {
        role: 'user',
        content: this.formatRequest(request)
      }
    ];

    const response = await this.llmClient.chat(messages);

    // 解析 LLM 返回的结果
    return this.parseInterpretation(response.content, request.rawResult);
  }

  /**
   * 获取系统提示词
   */
  private getSystemPrompt(request: InterpretationRequest): string {
    const basePrompt = `你是一位精通中国传统命理学的专业解读师。你的任务是将算命系统计算出的结构化数据，转化为通俗易懂、有价值的文字解读。

## 核心原则

1. **准确性优先**：严格基于提供的数据进行解读，不编造信息
2. **通俗易懂**：避免过多专业术语，用日常语言解释
3. **实用建议**：提供可操作的建议和注意事项
4. **客观中立**：既不过分夸大，也不过分贬低
5. **尊重传统**：遵循传统命理理论，但要用现代视角解读

## 免责声明要求

每次解读必须包含：
- 传统命理学仅供参考，不是科学预测
- 人生由自己把握，不应过分迷信
- 重大决策应咨询专业人士

## 输出格式

请严格按照以下 JSON 格式返回：

\`\`\`json
{
  "summary": "一句话总结（50字以内）",
  "sections": [
    {
      "title": "板块标题",
      "content": "详细内容"
    }
  ],
  "keyFindings": [
    "关键发现1",
    "关键发现2",
    "关键发现3"
  ],
  "suggestions": [
    "建议1",
    "建议2"
  ],
  "caveats": [
    "注意事项1",
    "免责声明"
  ]
}
\`\`\``;

    // 根据类型添加特定指导
    if (request.type === '八字排盘') {
      return basePrompt + `

## 八字排盘解读重点

1. **四柱分析**：年月日时四柱的含义
2. **十神关系**：性格特征、人际关系
3. **五行平衡**：身旺身弱，喜用神忌神
4. **大运流年**：运势走向
5. **性格特点**：从命局看性格
6. **事业财运**：适合的职业方向
7. **感情婚姻**：感情模式和建议

## 解读风格：${request.style}

${this.getStyleGuidance(request.style)}`;
    } else {
      return basePrompt + `

## 梅花易数解读重点

1. **卦象含义**：主卦和变卦的象征
2. **体用生克**：体卦用卦的关系分析
3. **互卦过程**：事物发展的中间状态
4. **方位判断**：具体的方位和位置
5. **时间推断**：能否找到，什么时候
6. **物品特征**：颜色、形状、材质
7. **寻找建议**：具体可行的寻找方法

## 失物占专用建议

- 明确指出最可能的位置（3-5个具体地点）
- 提供寻找的先后顺序
- 说明什么时候去找最合适
- 如果卦象不利，诚实告知但保持希望

## 解读风格：${request.style}

${this.getStyleGuidance(request.style)}`;
    }
  }

  /**
   * 根据风格提供指导
   */
  private getStyleGuidance(style?: string): string {
    switch (style) {
      case 'professional':
        return '使用专业但不晦涩的语言，保持严谨和客观';
      case 'casual':
        return '使用轻松友好的口吻，像朋友聊天一样，但不失专业性';
      case 'detailed':
        return '提供详尽的分析，包括理论依据和多角度解读';
      case 'concise':
        return '简明扼要，突出重点，避免冗长';
      default:
        return '';
    }
  }

  /**
   * 格式化请求
   */
  private formatRequest(request: InterpretationRequest): string {
    let prompt = `用户问题：${request.userQuestion}\n\n`;
    prompt += `以下是系统计算出的结构化数据：\n\n`;
    prompt += '```json\n';
    prompt += JSON.stringify(request.rawResult, null, 2);
    prompt += '\n```\n\n';
    prompt += '请基于以上数据，生成通俗易懂的解读。';

    if (request.type === '梅花易数') {
      const result = request.rawResult as LostItemResult;
      prompt += `\n\n特别提示：用户在寻找${result.itemName || '物品'}，请重点说明：`;
      prompt += '\n1. 最可能在哪里（方位+具体位置）';
      prompt += '\n2. 什么时候去找';
      prompt += '\n3. 物品的特征（帮助确认）';
      prompt += '\n4. 寻找的先后顺序';
    }

    return prompt;
  }

  /**
   * 解析解读结果
   */
  private parseInterpretation(
    content: string,
    rawData: any
  ): InterpretationResult {
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
        summary: parsed.summary || '解读完成',
        sections: parsed.sections || [],
        keyFindings: parsed.keyFindings || [],
        suggestions: parsed.suggestions,
        caveats: parsed.caveats || [
          '传统命理学仅供参考，不应作为决策的唯一依据。',
          '人生由自己把握，积极面对生活才是关键。'
        ],
        rawDataReference: rawData
      };
    } catch (error) {
      console.error('解析解读结果失败:', error);
      console.error('原始响应:', content);

      // 返回一个基本的解读
      return {
        summary: '解读过程出现问题，请稍后重试',
        sections: [{
          title: '原始数据',
          content: JSON.stringify(rawData, null, 2)
        }],
        keyFindings: [],
        caveats: [
          '自动解读失败，请查看原始数据或联系技术支持。'
        ],
        rawDataReference: rawData
      };
    }
  }

  /**
   * 生成完整的解读文本（供直接展示）
   */
  formatInterpretationText(interpretation: InterpretationResult): string {
    let text = '';

    // 摘要
    text += `## 解读摘要\n\n${interpretation.summary}\n\n`;

    // 详细章节
    text += '## 详细解读\n\n';
    interpretation.sections.forEach((section, index) => {
      text += `### ${index + 1}. ${section.title}\n\n`;
      text += `${section.content}\n\n`;
    });

    // 关键发现
    if (interpretation.keyFindings.length > 0) {
      text += '## 🔍 关键发现\n\n';
      interpretation.keyFindings.forEach((finding, index) => {
        text += `${index + 1}. ${finding}\n`;
      });
      text += '\n';
    }

    // 建议
    if (interpretation.suggestions && interpretation.suggestions.length > 0) {
      text += '## 💡 实用建议\n\n';
      interpretation.suggestions.forEach((suggestion, index) => {
        text += `${index + 1}. ${suggestion}\n`;
      });
      text += '\n';
    }

    // 注意事项
    if (interpretation.caveats && interpretation.caveats.length > 0) {
      text += '## ⚠️ 重要提示\n\n';
      interpretation.caveats.forEach((caveat) => {
        text += `- ${caveat}\n`;
      });
    }

    return text;
  }
}
