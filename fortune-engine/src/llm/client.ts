/**
 * LLM 客户端 - 统一接口
 *
 * 支持多个 LLM 提供商，提供统一的调用接口
 */

import type {
  LLMConfig,
  LLMMessage,
  LLMResponse,
  LLMProvider
} from './types';

/**
 * LLM 客户端抽象基类
 */
export abstract class LLMClient {
  protected config: LLMConfig;

  constructor(config: LLMConfig) {
    this.config = config;
  }

  /**
   * 发送聊天请求
   */
  abstract chat(messages: LLMMessage[]): Promise<LLMResponse>;

  /**
   * 流式聊天（可选实现）
   */
  async *chatStream(messages: LLMMessage[]): AsyncGenerator<string> {
    // 默认实现：调用非流式接口
    const response = await this.chat(messages);
    yield response.content;
  }
}

/**
 * OpenAI 客户端
 */
export class OpenAIClient extends LLMClient {
  async chat(messages: LLMMessage[]): Promise<LLMResponse> {
    const startTime = Date.now();

    const response = await fetch(`${this.config.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify({
        model: this.config.model,
        messages,
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens
      }),
      signal: AbortSignal.timeout(this.config.timeout || 30000)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API Error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();

    return {
      content: data.choices[0].message.content,
      usage: {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens
      },
      model: data.model,
      duration: Date.now() - startTime
    };
  }
}

/**
 * Anthropic Claude 客户端
 */
export class AnthropicClient extends LLMClient {
  async chat(messages: LLMMessage[]): Promise<LLMResponse> {
    const startTime = Date.now();

    // Anthropic 的消息格式需要转换
    const systemMessage = messages.find(m => m.role === 'system')?.content || '';
    const conversationMessages = messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content
      }));

    const response = await fetch(`${this.config.baseURL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.config.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: this.config.model,
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
        system: systemMessage,
        messages: conversationMessages
      }),
      signal: AbortSignal.timeout(this.config.timeout || 30000)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Anthropic API Error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();

    return {
      content: data.content[0].text,
      usage: {
        promptTokens: data.usage.input_tokens,
        completionTokens: data.usage.output_tokens,
        totalTokens: data.usage.input_tokens + data.usage.output_tokens
      },
      model: data.model,
      duration: Date.now() - startTime
    };
  }
}

/**
 * 智谱 AI 客户端
 */
export class ZhipuClient extends LLMClient {
  async chat(messages: LLMMessage[]): Promise<LLMResponse> {
    const startTime = Date.now();

    const response = await fetch(`${this.config.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify({
        model: this.config.model,
        messages,
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens
      }),
      signal: AbortSignal.timeout(this.config.timeout || 30000)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Zhipu API Error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();

    return {
      content: data.choices[0].message.content,
      usage: data.usage ? {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens
      } : undefined,
      model: data.model,
      duration: Date.now() - startTime
    };
  }
}

/**
 * 通义千问客户端
 */
export class QwenClient extends LLMClient {
  async chat(messages: LLMMessage[]): Promise<LLMResponse> {
    const startTime = Date.now();

    const response = await fetch(`${this.config.baseURL}/services/aigc/text-generation/generation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify({
        model: this.config.model,
        input: {
          messages
        },
        parameters: {
          temperature: this.config.temperature,
          max_tokens: this.config.maxTokens
        }
      }),
      signal: AbortSignal.timeout(this.config.timeout || 30000)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Qwen API Error: ${error.message || 'Unknown error'}`);
    }

    const data = await response.json();

    return {
      content: data.output.text,
      usage: data.usage ? {
        promptTokens: data.usage.input_tokens,
        completionTokens: data.usage.output_tokens,
        totalTokens: data.usage.total_tokens
      } : undefined,
      model: this.config.model,
      duration: Date.now() - startTime
    };
  }
}

/**
 * DeepSeek 客户端
 */
export class DeepSeekClient extends LLMClient {
  async chat(messages: LLMMessage[]): Promise<LLMResponse> {
    const startTime = Date.now();

    const response = await fetch(`${this.config.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify({
        model: this.config.model,
        messages,
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens
      }),
      signal: AbortSignal.timeout(this.config.timeout || 30000)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`DeepSeek API Error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();

    return {
      content: data.choices[0].message.content,
      usage: data.usage ? {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens
      } : undefined,
      model: data.model,
      duration: Date.now() - startTime
    };
  }
}

/**
 * LLM 客户端工厂
 */
export function createLLMClient(config: LLMConfig): LLMClient {
  switch (config.provider) {
    case 'openai':
      return new OpenAIClient(config);
    case 'anthropic':
      return new AnthropicClient(config);
    case 'zhipu':
      return new ZhipuClient(config);
    case 'qwen':
      return new QwenClient(config);
    case 'deepseek':
      return new DeepSeekClient(config);
    case 'custom':
      throw new Error('Custom provider requires custom implementation');
    default:
      throw new Error(`Unsupported LLM provider: ${config.provider}`);
  }
}
