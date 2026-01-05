# LLM 集成模块

## 概述

本模块提供 Fortune Engine 与大语言模型的集成，用于：

1. **输入理解**：将用户的自然语言输入转化为结构化数据
2. **结果解读**：将计算结果转化为人性化的文字解读

**重要**：核心计算逻辑（八字排盘、梅花易数）完全独立，不依赖 LLM。LLM 仅用于增强用户体验。

---

## 架构

```
用户输入（自然语言）
    ↓
[InputUnderstandingService]  ← 使用 LLM
    ↓
结构化数据
    ↓
[Fortune Engine 核心计算]  ← 确定性算法，不使用 LLM
    ↓
结构化结果
    ↓
[ResultInterpretationService]  ← 使用 LLM
    ↓
人性化文字
```

---

## 支持的提供商

- ✅ OpenAI (GPT-3.5/4)
- ✅ Anthropic (Claude 3)
- ✅ 智谱AI (GLM-4)
- ✅ 通义千问 (Qwen)
- ✅ DeepSeek
- ✅ 自定义（兼容 OpenAI API 格式）

---

## 快速开始

```typescript
import { llm } from 'fortune-engine';

// 1. 创建 LLM 客户端
const client = llm.createLLMClient({
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY
});

// 2. 理解用户输入
const understandingService = new llm.InputUnderstandingService(client);
const understanding = await understandingService.understand(
  '我是1990年1月15日早上8点出生的男性，帮我算算八字'
);

// 3. 解读计算结果
const interpretationService = new llm.ResultInterpretationService(client);
const interpretation = await interpretationService.interpretBazi(
  baziResult,
  '帮我分析一下',
  'professional'
);
```

---

## 文件说明

| 文件 | 说明 |
|------|------|
| `types.ts` | 类型定义 |
| `client.ts` | LLM 客户端实现（支持多提供商） |
| `input-understanding.ts` | 输入理解服务 |
| `result-interpretation.ts` | 结果解读服务 |
| `index.ts` | 模块导出 |

---

## 详细文档

请查看：[LLM 集成配置指南](../../docs/LLM集成配置指南.md)

---

## 设计原则

1. **可选性**：不使用 LLM 也能完整使用 Fortune Engine
2. **提供商中立**：支持多个 LLM 提供商，统一接口
3. **错误降级**：LLM 失败时返回基本解读或原始数据
4. **成本透明**：清晰说明各提供商的成本
