/**
 * LLM 集成 - 类型定义
 *
 * Fortune Engine 的核心计算是确定性的，但需要 LLM 来：
 * 1. 理解用户的自然语言输入
 * 2. 将计算结果解读为人性化的文字
 */

/**
 * 支持的 LLM 提供商
 */
export type LLMProvider =
  | 'openai'       // OpenAI GPT-3.5/4
  | 'anthropic'    // Anthropic Claude
  | 'zhipu'        // 智谱 AI (GLM)
  | 'qwen'         // 阿里通义千问
  | 'deepseek'     // DeepSeek
  | 'custom';      // 自定义提供商

/**
 * LLM 配置
 */
export interface LLMConfig {
  /** 提供商 */
  provider: LLMProvider;

  /** API Key */
  apiKey: string;

  /** API Base URL（可选，用于自定义端点或代理） */
  baseURL?: string;

  /** 模型名称 */
  model: string;

  /** 温度参数 (0-1) */
  temperature?: number;

  /** 最大 token 数 */
  maxTokens?: number;

  /** 超时时间（毫秒） */
  timeout?: number;
}

/**
 * LLM 提供商的默认配置
 */
export const DEFAULT_LLM_CONFIGS: Record<LLMProvider, Partial<LLMConfig>> = {
  openai: {
    baseURL: 'https://api.openai.com/v1',
    model: 'gpt-4-turbo-preview',
    temperature: 0.7,
    maxTokens: 2000,
    timeout: 30000
  },
  anthropic: {
    baseURL: 'https://api.anthropic.com/v1',
    model: 'claude-3-sonnet-20240229',
    temperature: 0.7,
    maxTokens: 2000,
    timeout: 30000
  },
  zhipu: {
    baseURL: 'https://open.bigmodel.cn/api/paas/v4',
    model: 'glm-4',
    temperature: 0.7,
    maxTokens: 2000,
    timeout: 30000
  },
  qwen: {
    baseURL: 'https://dashscope.aliyuncs.com/api/v1',
    model: 'qwen-turbo',
    temperature: 0.7,
    maxTokens: 2000,
    timeout: 30000
  },
  deepseek: {
    baseURL: 'https://api.deepseek.com/v1',
    model: 'deepseek-chat',
    temperature: 0.7,
    maxTokens: 2000,
    timeout: 30000
  },
  custom: {
    // 用户自定义
  }
};

/**
 * 用户输入理解结果
 */
export interface UserIntentUnderstanding {
  /** 占卜类型 */
  divinationType: '八字排盘' | '失物占' | '事业占' | '感情占' | '其他';

  /** 提取的关键信息 */
  extractedInfo: {
    /** 出生日期时间（八字排盘） */
    birthDateTime?: {
      date: string;  // YYYY-MM-DD
      time: string;  // HH:mm
      timezone?: number;
      longitude?: number;
    };

    /** 性别 */
    gender?: 'male' | 'female';

    /** 姓名 */
    name?: string;

    /** 失物名称 */
    lostItem?: string;

    /** 问题描述 */
    question?: string;

    /** 起卦用的字 */
    characters?: string[];

    /** 其他补充信息 */
    additionalInfo?: Record<string, any>;
  };

  /** 理解的置信度 (0-1) */
  confidence: number;

  /** 需要向用户澄清的问题 */
  clarificationNeeded?: string[];

  /** 原始用户输入 */
  originalInput: string;
}

/**
 * 结果解读请求
 */
export interface InterpretationRequest {
  /** 占卜类型 */
  type: '八字排盘' | '梅花易数';

  /** Fortune Engine 的原始计算结果 */
  rawResult: any;  // BaziResult | LostItemResult 等

  /** 用户的原始问题 */
  userQuestion: string;

  /** 解读风格 */
  style?: 'professional' | 'casual' | 'detailed' | 'concise';

  /** 是否包含建议 */
  includeSuggestions?: boolean;
}

/**
 * 解读结果
 */
export interface InterpretationResult {
  /** 解读摘要 */
  summary: string;

  /** 详细解读（分段） */
  sections: {
    title: string;
    content: string;
  }[];

  /** 关键发现 */
  keyFindings: string[];

  /** 实用建议（如果请求） */
  suggestions?: string[];

  /** 注意事项 */
  caveats?: string[];

  /** 原始数据引用 */
  rawDataReference: any;
}

/**
 * LLM 请求消息
 */
export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * LLM 响应
 */
export interface LLMResponse {
  /** 响应内容 */
  content: string;

  /** 使用的 token 数 */
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };

  /** 模型信息 */
  model?: string;

  /** 耗时（毫秒） */
  duration?: number;
}
