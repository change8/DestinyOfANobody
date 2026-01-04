# LLM 集成配置指南

## 概述

Fortune Engine 采用**双层架构**：

```
┌─────────────────────────────────────────┐
│  LLM 层（可选）                          │
│  - 理解用户自然语言输入                  │
│  - 将结果解读为人性化文字                │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  核心计算层（确定性算法）                │
│  - 八字排盘                              │
│  - 梅花易数起卦/断卦                     │
│  - 五行生克分析                          │
└─────────────────────────────────────────┘
```

**核心计算**：确定性的传统算法，**不需要** LLM
**LLM 集成**：可选的增强功能，用于输入理解和结果解读

---

## 为什么需要 LLM？

### 问题1：用户输入是自然语言

**用户说**："我是1990年1月15日早上8点出生的男性，帮我算算八字"
**需要提取**：
```json
{
  "birthDate": "1990-01-15",
  "birthTime": "08:00",
  "gender": "male"
}
```

### 问题2：计算结果用户看不懂

**Fortune Engine 输出**：
```json
{
  "pillars": {
    "year": { "gan": "庚", "zhi": "午" },
    "day": { "gan": "甲", "zhi": "子" }
  },
  "wuxing": {
    "dayMasterWuxing": "木",
    "dayMasterStrength": "身弱"
  }
}
```

**用户想看到**：
> "您的日主为甲木，生于冬季，五行偏弱，需要火土来帮扶。您性格温和但缺乏果断，建议在事业上多寻求合作伙伴的支持..."

---

## 支持的 LLM 提供商

| 提供商 | 模型示例 | 推荐场景 | 费用 |
|--------|---------|---------|------|
| **OpenAI** | GPT-4, GPT-3.5 | 国际用户，英文支持好 | 中高 |
| **Anthropic** | Claude 3 Sonnet/Opus | 长文本理解，安全性高 | 中高 |
| **智谱AI** | GLM-4 | 国内用户，中文优化 | 中 |
| **通义千问** | Qwen-Turbo | 阿里云用户，性价比高 | 低 |
| **DeepSeek** | DeepSeek-Chat | 开发者友好，便宜 | 低 |
| **自定义** | 任何兼容OpenAI格式的API | 私有部署 | - |

---

## 快速开始

### 1. 安装 Fortune Engine

```bash
npm install fortune-engine
```

### 2. 配置 LLM（选择一个提供商）

#### 方案 A：使用 OpenAI

```typescript
import { llm } from 'fortune-engine';

const client = llm.createLLMClient({
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY,  // 从环境变量读取
  model: 'gpt-4-turbo-preview',
  temperature: 0.7
});
```

**获取 API Key**：
1. 访问 https://platform.openai.com/
2. 注册并创建 API Key
3. 设置环境变量：`export OPENAI_API_KEY=sk-...`

---

#### 方案 B：使用智谱 AI（推荐国内用户）

```typescript
import { llm } from 'fortune-engine';

const client = llm.createLLMClient({
  provider: 'zhipu',
  apiKey: process.env.ZHIPU_API_KEY,
  model: 'glm-4'
});
```

**获取 API Key**：
1. 访问 https://open.bigmodel.cn/
2. 注册并创建 API Key
3. 设置环境变量：`export ZHIPU_API_KEY=your-key`

---

#### 方案 C：使用通义千问（阿里云）

```typescript
import { llm } from 'fortune-engine';

const client = llm.createLLMClient({
  provider: 'qwen',
  apiKey: process.env.DASHSCOPE_API_KEY,
  model: 'qwen-turbo'
});
```

**获取 API Key**：
1. 访问 https://dashscope.aliyun.com/
2. 开通服务并获取 API Key

---

#### 方案 D：使用 Anthropic Claude

```typescript
import { llm } from 'fortune-engine';

const client = llm.createLLMClient({
  provider: 'anthropic',
  apiKey: process.env.ANTHROPIC_API_KEY,
  model: 'claude-3-sonnet-20240229'
});
```

---

### 3. 使用输入理解服务

```typescript
import { llm } from 'fortune-engine';

// 创建服务
const understandingService = new llm.InputUnderstandingService(client);

// 理解用户输入
const understanding = await understandingService.understand(
  '我是1990年1月15日早上8点出生的男性，帮我算算八字'
);

console.log(understanding);
// {
//   divinationType: '八字排盘',
//   extractedInfo: {
//     birthDateTime: { date: '1990-01-15', time: '08:00' },
//     gender: 'male'
//   },
//   confidence: 0.95,
//   clarificationNeeded: []
// }
```

---

### 4. 使用结果解读服务

```typescript
import { BaziCalculator, llm } from 'fortune-engine';

// 1. 计算八字
const calculator = new BaziCalculator();
const result = calculator.calculate({
  birthDate: '1990-01-15',
  birthTime: '08:00',
  gender: 'male'
});

// 2. 解读结果
const interpretationService = new llm.ResultInterpretationService(client);
const interpretation = await interpretationService.interpretBazi(
  result,
  '帮我分析一下我的八字',
  'professional'  // 风格：professional | casual | detailed | concise
);

// 3. 输出
console.log(interpretation.summary);
// "您的日主为甲木，五行偏弱，性格温和谨慎..."

// 查看详细章节
interpretation.sections.forEach(section => {
  console.log(`\n### ${section.title}`);
  console.log(section.content);
});

// 查看建议
console.log('\n💡 实用建议：');
interpretation.suggestions?.forEach(s => console.log(`- ${s}`));
```

---

## 完整示例

### 示例 1：八字排盘完整流程

```typescript
import { BaziCalculator, llm } from 'fortune-engine';

async function analyzeBazi(userInput: string) {
  // 1. 配置 LLM
  const client = llm.createLLMClient({
    provider: 'openai',
    apiKey: process.env.OPENAI_API_KEY
  });

  // 2. 理解用户输入
  const understandingService = new llm.InputUnderstandingService(client);
  const understanding = await understandingService.understand(userInput);

  // 检查是否需要澄清
  if (understanding.clarificationNeeded.length > 0) {
    console.log('需要用户提供：', understanding.clarificationNeeded);
    return;
  }

  // 检查类型
  if (understanding.divinationType !== '八字排盘') {
    console.log('当前只支持八字排盘');
    return;
  }

  // 3. 计算八字
  const calculator = new BaziCalculator();
  const result = calculator.calculate({
    birthDate: understanding.extractedInfo.birthDateTime!.date,
    birthTime: understanding.extractedInfo.birthDateTime!.time,
    gender: understanding.extractedInfo.gender!
  });

  // 4. 解读结果
  const interpretationService = new llm.ResultInterpretationService(client);
  const interpretation = await interpretationService.interpretBazi(
    result,
    userInput,
    'professional'
  );

  // 5. 格式化输出
  const text = interpretationService.formatInterpretationText(interpretation);
  console.log(text);

  return {
    understanding,
    rawResult: result,
    interpretation,
    formattedText: text
  };
}

// 使用
const result = await analyzeBazi(
  '我是1990年1月15日早上8点出生的男性，帮我算算八字'
);
```

---

### 示例 2：梅花易数失物占

```typescript
import { meihua, llm } from 'fortune-engine';

async function findLostItem(userInput: string) {
  // 1. 配置 LLM
  const client = llm.createLLMClient({
    provider: 'zhipu',  // 使用国产模型
    apiKey: process.env.ZHIPU_API_KEY
  });

  // 2. 理解用户输入
  const understandingService = new llm.InputUnderstandingService(client);
  const understanding = await understandingService.understand(userInput);

  // 提取关键信息
  const lostItem = understanding.extractedInfo.lostItem || '物品';
  const char = understanding.extractedInfo.characters?.[0] || '找';

  // 3. 起卦
  const gua = meihua.qiguaByChar(char);

  // 4. 断卦
  const result = meihua.divineForLostItem(
    gua,
    understanding.extractedInfo.question || `寻找${lostItem}`,
    lostItem
  );

  // 5. 解读结果
  const interpretationService = new llm.ResultInterpretationService(client);
  const interpretation = await interpretationService.interpretMeihua(
    result,
    userInput,
    'casual'  // 使用轻松友好的风格
  );

  // 6. 输出
  console.log('\n📍 摘要：', interpretation.summary);
  console.log('\n🔍 关键发现：');
  interpretation.keyFindings.forEach(f => console.log(`  - ${f}`));
  console.log('\n💡 寻找建议：');
  interpretation.suggestions?.forEach(s => console.log(`  - ${s}`));

  return interpretation;
}

// 使用
await findLostItem('我的钥匙丢了，在哪里能找到？用"找"字起卦');
```

---

## 高级配置

### 自定义 baseURL（使用代理或私有部署）

```typescript
const client = llm.createLLMClient({
  provider: 'openai',
  apiKey: 'your-key',
  baseURL: 'https://your-proxy.com/v1',  // 自定义端点
  model: 'gpt-4',
  timeout: 60000  // 60秒超时
});
```

### 调整温度参数

```typescript
const client = llm.createLLMClient({
  provider: 'openai',
  apiKey: 'your-key',
  temperature: 0.3,  // 更确定性的输出（0-1，越低越确定）
  maxTokens: 3000    // 最大输出长度
});
```

### 使用默认配置

```typescript
import { llm } from 'fortune-engine';

const client = llm.createLLMClient({
  provider: 'openai',
  apiKey: 'your-key',
  ...llm.DEFAULT_LLM_CONFIGS.openai  // 使用推荐的默认配置
});
```

---

## 环境变量配置

推荐使用环境变量管理 API Key：

### .env 文件

```bash
# OpenAI
OPENAI_API_KEY=sk-...

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# 智谱AI
ZHIPU_API_KEY=...

# 通义千问
DASHSCOPE_API_KEY=...

# DeepSeek
DEEPSEEK_API_KEY=...
```

### 加载环境变量（Node.js）

```typescript
import dotenv from 'dotenv';
dotenv.config();

const client = llm.createLLMClient({
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY!
});
```

---

## 解读风格说明

| 风格 | 适用场景 | 特点 |
|------|---------|------|
| `professional` | 专业用户、命理师 | 严谨客观，包含术语解释 |
| `casual` | 普通用户 | 轻松友好，像朋友聊天 |
| `detailed` | 深度研究 | 详尽分析，包含理论依据 |
| `concise` | 快速查看 | 简明扼要，突出重点 |

**示例对比**：

**Professional**：
> "您的日主为甲木，生于午月，火旺木焚之象。根据五行生克理论，火泄木之气，加之地支无水木帮扶，判断为身弱格局..."

**Casual**：
> "简单来说，您的命格属于比较温和的类型，但有点缺乏自信。就像一棵小树生长在炎热的夏天，需要更多的水分和养料来帮助成长..."

---

## 成本估算

### OpenAI GPT-4

- 输入：$0.03 / 1K tokens
- 输出：$0.06 / 1K tokens
- 单次解读约 3000 tokens ≈ **$0.20**

### 智谱 GLM-4

- 约 ¥0.1 / 1K tokens
- 单次解读 ≈ **¥0.3**

### 通义千问

- 约 ¥0.008 / 1K tokens
- 单次解读 ≈ **¥0.024**

**建议**：
- 开发测试：使用便宜的模型（通义千问、DeepSeek）
- 生产环境：根据预算选择（GPT-4质量最好但贵，GLM-4性价比高）

---

## 错误处理

```typescript
import { llm } from 'fortune-engine';

try {
  const client = llm.createLLMClient({
    provider: 'openai',
    apiKey: process.env.OPENAI_API_KEY
  });

  const understandingService = new llm.InputUnderstandingService(client);
  const understanding = await understandingService.understand(userInput);

  // ... 处理结果
} catch (error) {
  if (error.message.includes('API Error')) {
    console.error('LLM API 调用失败:', error.message);
    // 降级：返回原始数据或提示用户
  } else if (error.message.includes('timeout')) {
    console.error('请求超时，请重试');
  } else {
    console.error('未知错误:', error);
  }
}
```

---

## 不使用 LLM 的场景

如果你不需要：
- ✅ 自然语言输入（用户直接提供结构化数据）
- ✅ 人性化解读（只需要原始数据）

那么**不需要配置 LLM**，直接使用核心计算：

```typescript
import { BaziCalculator } from 'fortune-engine';

const calculator = new BaziCalculator();
const result = calculator.calculate({
  birthDate: '1990-01-15',
  birthTime: '08:00',
  gender: 'male'
});

// 直接使用结果
console.log(result.pillars);
console.log(result.wuxing);
```

---

## 常见问题

### Q1: 必须使用 LLM 吗？

**A**: 不必须。核心计算功能完全独立，不需要 LLM。LLM 只是可选的增强功能。

### Q2: 哪个 LLM 提供商最好？

**A**:
- **质量优先**：OpenAI GPT-4 或 Anthropic Claude
- **性价比**：智谱 GLM-4 或通义千问
- **国内访问**：智谱AI、通义千问（无需翻墙）

### Q3: LLM 会影响计算准确性吗？

**A**: 不会。核心计算完全独立，LLM 只用于输入解析和结果展示。

### Q4: 可以切换提供商吗？

**A**: 可以。只需更改 `provider` 和 `apiKey` 即可无缝切换。

### Q5: 支持流式输出吗？

**A**: 目前版本暂不支持，未来会加入。

---

## 下一步

- 📖 阅读 [核心数据对象说明](./06-核心数据对象说明.md)
- 📖 阅读 [业务规则与系统约束](./07-业务规则与系统约束说明.md)
- 🎯 查看完整 API 文档
- 💡 查看更多使用示例

---

**更新时间**：2024-01-03
**适用版本**：Fortune Engine v1.1.0+
