# AI配置和使用指南

> 本文档说明如何配置和使用AI功能进行命理解读

## 一、架构设计

### 1.1 分层架构

```
用户输入
  ↓
【Fortune Engine】精确计算
  ├─ 四柱排盘 ✓ 100%准确
  ├─ 十神五行 ✓ 100%准确
  ├─ 大运流年 ✓ 100%准确
  └─ 基础数据 ✓ 完全确定
  ↓
排盘结果（JSON）
  ↓
【AI解读层】结构化分析
  ├─ 使用结构化提示词模板
  ├─ 限制输出格式（JSON）
  ├─ 基于精确数据分析
  └─ 返回结构化结果
  ↓
前端展示
```

### 1.2 核心原则

1. **精确计算由代码完成**：排盘、十神、五行等必须用算法实现
2. **AI仅做解读润色**：基于计算结果，AI提供分析和建议
3. **结构化输出**：使用JSON Schema限制AI输出格式
4. **可选功能**：AI解读作为增强功能，不影响核心排盘

---

## 二、AI配置

### 2.1 支持的AI提供商

本项目支持以下AI提供商：

| 提供商 | 模型推荐 | 性价比 | 速度 |
|--------|----------|--------|------|
| OpenAI | GPT-4 | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| Anthropic | Claude 3 Sonnet | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 国产 | 文心一言/通义千问 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

### 2.2 环境变量配置

创建 `.env` 文件：

```bash
# AI配置
AI_PROVIDER=openai              # openai | anthropic | wenxin | tongyi
AI_API_KEY=your_api_key_here    # API密钥
AI_MODEL=gpt-4                  # 模型名称
AI_BASE_URL=                    # 自定义API地址（可选）
AI_TEMPERATURE=0.7              # 温度参数（0-1）
AI_MAX_TOKENS=2000              # 最大token数

# 功能开关
ENABLE_AI_ANALYSIS=true         # 是否启用AI分析
AI_CACHE_TTL=86400              # AI结果缓存时间（秒）
```

### 2.3 配置示例

**OpenAI配置：**
```bash
AI_PROVIDER=openai
AI_API_KEY=sk-xxx...
AI_MODEL=gpt-4
AI_TEMPERATURE=0.7
```

**Anthropic Claude配置：**
```bash
AI_PROVIDER=anthropic
AI_API_KEY=sk-ant-xxx...
AI_MODEL=claude-3-sonnet-20240229
AI_TEMPERATURE=0.7
```

**文心一言配置：**
```bash
AI_PROVIDER=wenxin
AI_API_KEY=your_key
AI_MODEL=ERNIE-Bot-4
AI_TEMPERATURE=0.7
```

---

## 三、AI解读提示词模板

### 3.1 结构化提示词

```typescript
const prompt = `
你是一位精通子平八字的专业命理师。请基于以下精确计算的八字数据进行分析。

# 八字数据（已精确计算）

## 基础信息
- 姓名：${name}
- 性别：${gender === 'male' ? '男' : '女'}
- 生辰：${birthDate} ${birthTime}

## 四柱八字
\`\`\`
年柱：${pillars.year.gan}${pillars.year.zhi}  十神：${shishen.year}  纳音：${nayin.year}
月柱：${pillars.month.gan}${pillars.month.zhi}  十神：${shishen.month}  纳音：${nayin.month}
日柱：${pillars.day.gan}${pillars.day.zhi}  日主  纳音：${nayin.day}
时柱：${pillars.hour.gan}${pillars.hour.zhi}  十神：${shishen.hour}  纳音：${nayin.hour}
\`\`\`

## 五行分析
- 五行个数：木${wuxing.count.木} 火${wuxing.count.火} 土${wuxing.count.土} 金${wuxing.count.金} 水${wuxing.count.水}
- 五行力量：木${wuxing.strength.木}% 火${wuxing.strength.火}% 土${wuxing.strength.土}% 金${wuxing.strength.金}% 水${wuxing.strength.水}%
- 日主五行：${wuxing.dayMasterWuxing}
- 日主强弱：${wuxing.dayMasterStrength}
- 喜用神：${wuxing.xiyongshen}
- 忌神：${wuxing.jishen}

## 大运（前3步）
${dayun.slice(0, 3).map((dy, i) =>
  `第${i+1}步：${dy.startAge}-${dy.endAge}岁 ${dy.gan}${dy.zhi} (${dy.nayin})`
).join('\n')}

---

# 分析要求

请严格按照以下JSON格式输出分析结果，不要输出其他内容：

\`\`\`json
{
  "summary": {
    "overall": "命局总体评价（100-150字）",
    "pattern": "格局类型（如：正官格、从财格等）",
    "level": "命格等级（上上/上中/中上/中中/中下/下等）"
  },
  "personality": {
    "keywords": ["关键词1", "关键词2", "关键词3", "关键词4", "关键词5"],
    "description": "性格特点详细分析（200-300字）",
    "strengths": ["优点1", "优点2", "优点3"],
    "weaknesses": ["缺点1", "缺点2", "缺点3"],
    "basis": "分析依据（如：日主丁火...，100字以内）"
  },
  "career": {
    "suitable_industries": [
      {"industry": "行业1", "reason": "原因"},
      {"industry": "行业2", "reason": "原因"},
      {"industry": "行业3", "reason": "原因"}
    ],
    "development_direction": "事业发展方向建议（150字）",
    "peak_period": "事业高峰期（如：35-45岁）",
    "advice": ["建议1", "建议2", "建议3"]
  },
  "wealth": {
    "wealth_type": "财运类型（正财运旺/偏财运佳/财运一般）",
    "level": "财富等级（1-5星）",
    "analysis": "财运分析（150字）",
    "peak_years": ["发财年份1", "发财年份2"],
    "advice": "求财建议（100字）"
  },
  "marriage": {
    "marriage_age": "适婚年龄段（如：26-30岁）",
    "spouse_characteristics": {
      "personality": "配偶性格特点",
      "appearance": "配偶外貌特征",
      "family": "配偶家庭背景"
    },
    "marriage_quality": "婚姻质量（美满/和顺/一般/坎坷）",
    "relationship_advice": ["建议1", "建议2", "建议3"]
  },
  "health": {
    "constitution": "体质特点（如：偏寒/偏热/平和）",
    "weak_organs": ["易患部位1", "易患部位2"],
    "prone_diseases": ["易患疾病1", "易患疾病2"],
    "health_advice": "健康建议（150字）",
    "exercise_recommendation": "运动建议（100字）"
  },
  "lifeStages": [
    {
      "age_range": "年龄段（如：3-12岁）",
      "description": "运势描述",
      "key_events": "关键事件提示"
    },
    {
      "age_range": "13-22岁",
      "description": "运势描述",
      "key_events": "关键事件提示"
    }
    // ... 可以包含5-8个人生阶段
  ],
  "luckyElements": {
    "colors": ["颜色1", "颜色2", "颜色3"],
    "directions": ["方位1", "方位2"],
    "numbers": [数字1, 数字2, 数字3],
    "seasons": ["季节1", "季节2"]
  },
  "warnings": [
    "注意事项1（如：避免投资高风险项目）",
    "注意事项2",
    "注意事项3"
  ],
  "suggestions": [
    "人生建议1",
    "人生建议2",
    "人生建议3"
  ]
}
\`\`\`

# 注意事项

1. **严格基于给定数据**：不要重新计算四柱、十神等，完全信任给定的数据
2. **遵循传统理论**：分析必须基于《子平真诠》《滴天髓》等经典理论
3. **客观中性**：避免过度吉凶断语，保持客观理性
4. **具体实用**：给出具体可操作的建议，避免模糊表述
5. **JSON格式**：必须返回有效的JSON，所有字段都要填写
6. **字数控制**：每个字段严格控制字数，不要过长或过短
7. **避免敏感词**：不要使用"算命""迷信"等敏感词汇，改用"命理分析""传统文化"

---

请开始分析。
`;
```

### 3.2 简化版提示词（适用于快速分析）

```typescript
const simplePrompt = `
基于以下八字数据，用100字总结命主的性格特点和人生建议：

四柱：${pillars.year.gan}${pillars.year.zhi} ${pillars.month.gan}${pillars.month.zhi} ${pillars.day.gan}${pillars.day.zhi} ${pillars.hour.gan}${pillars.hour.zhi}
日主：${pillars.day.gan}（${wuxing.dayMasterWuxing}）
强弱：${wuxing.dayMasterStrength}
喜用神：${wuxing.xiyongshen}

要求：JSON格式，包含personality（性格）和advice（建议）两个字段。
`;
```

---

## 四、代码实现

### 4.1 AI服务封装

创建 `server/src/services/ai.service.ts`：

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

@Injectable()
export class AIService {
  private openai?: OpenAI;
  private anthropic?: Anthropic;
  private provider: string;

  constructor(private configService: ConfigService) {
    this.provider = this.configService.get('AI_PROVIDER') || 'openai';

    // 初始化对应的AI客户端
    if (this.provider === 'openai') {
      this.openai = new OpenAI({
        apiKey: this.configService.get('AI_API_KEY'),
        baseURL: this.configService.get('AI_BASE_URL')
      });
    } else if (this.provider === 'anthropic') {
      this.anthropic = new Anthropic({
        apiKey: this.configService.get('AI_API_KEY')
      });
    }
  }

  /**
   * 调用AI进行命理解读
   */
  async analyze(prompt: string): Promise<string> {
    if (this.provider === 'openai') {
      return this.analyzeWithOpenAI(prompt);
    } else if (this.provider === 'anthropic') {
      return this.analyzeWithAnthropic(prompt);
    }

    throw new Error(`不支持的AI提供商：${this.provider}`);
  }

  /**
   * 使用OpenAI分析
   */
  private async analyzeWithOpenAI(prompt: string): Promise<string> {
    const response = await this.openai!.chat.completions.create({
      model: this.configService.get('AI_MODEL') || 'gpt-4',
      messages: [
        {
          role: 'system',
          content: '你是一位精通子平八字的专业命理师，擅长分析命局和提供人生建议。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: parseFloat(this.configService.get('AI_TEMPERATURE') || '0.7'),
      max_tokens: parseInt(this.configService.get('AI_MAX_TOKENS') || '2000'),
      response_format: { type: 'json_object' } // 强制JSON输出
    });

    return response.choices[0].message.content || '';
  }

  /**
   * 使用Anthropic Claude分析
   */
  private async analyzeWithAnthropic(prompt: string): Promise<string> {
    const response = await this.anthropic!.messages.create({
      model: this.configService.get('AI_MODEL') || 'claude-3-sonnet-20240229',
      max_tokens: parseInt(this.configService.get('AI_MAX_TOKENS') || '2000'),
      temperature: parseFloat(this.configService.get('AI_TEMPERATURE') || '0.7'),
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const textContent = response.content.find(c => c.type === 'text');
    return textContent?.text || '';
  }

  /**
   * 提取JSON内容
   */
  extractJSON(text: string): any {
    // 尝试直接解析
    try {
      return JSON.parse(text);
    } catch {
      // 尝试提取JSON代码块
      const match = text.match(/```json\n([\s\S]*?)\n```/);
      if (match) {
        return JSON.parse(match[1]);
      }

      // 尝试提取花括号内容
      const match2 = text.match(/\{[\s\S]*\}/);
      if (match2) {
        return JSON.parse(match2[0]);
      }

      throw new Error('无法提取JSON内容');
    }
  }
}
```

### 4.2 完整的分析流程

创建 `server/src/services/bazi-analysis.service.ts`：

```typescript
import { Injectable } from '@nestjs/common';
import { calculate } from '@destiny/fortune-engine';
import { AIService } from './ai.service';
import { buildPrompt } from '../utils/prompt-builder';

@Injectable()
export class BaziAnalysisService {
  constructor(private aiService: AIService) {}

  /**
   * 完整的八字分析（包含AI解读）
   */
  async analyzeComplete(input: any) {
    // 1. 精确计算八字
    const baziResult = calculate(input);

    // 2. 构建AI提示词
    const prompt = buildPrompt(baziResult);

    // 3. 调用AI分析
    const aiResponse = await this.aiService.analyze(prompt);

    // 4. 解析AI返回的JSON
    const aiAnalysis = this.aiService.extractJSON(aiResponse);

    // 5. 合并结果
    return {
      bazi: baziResult,      // 精确计算结果
      analysis: aiAnalysis   // AI解读结果
    };
  }
}
```

---

## 五、使用示例

### 5.1 后端API调用

```typescript
// POST /api/bazi/analyze
{
  "birthDate": "1990-01-01",
  "birthTime": "12:30",
  "gender": "male",
  "name": "张三",
  "enableAI": true  // 是否启用AI分析
}

// Response
{
  "code": 200,
  "data": {
    "bazi": {
      // 精确计算的八字数据
    },
    "analysis": {
      // AI解读结果
    }
  }
}
```

### 5.2 小程序端调用

```javascript
// 调用排盘分析
wx.request({
  url: 'https://api.destiny.com/api/bazi/analyze',
  method: 'POST',
  data: {
    birthDate: '1990-01-01',
    birthTime: '12:30',
    gender: 'male',
    enableAI: true
  },
  success: (res) => {
    console.log('四柱：', res.data.data.bazi.pillars);
    console.log('AI分析：', res.data.data.analysis);
  }
});
```

---

## 六、成本控制

### 6.1 缓存策略

```typescript
// 使用Redis缓存AI结果
const cacheKey = `ai:${birthDate}:${birthTime}:${gender}`;
const cached = await redis.get(cacheKey);

if (cached) {
  return JSON.parse(cached);
}

const result = await aiService.analyze(prompt);
await redis.set(cacheKey, JSON.stringify(result), 'EX', 86400); // 24小时
```

### 6.2 费用估算

| 提供商 | 模型 | 输入价格 | 输出价格 | 单次成本 |
|--------|------|----------|----------|----------|
| OpenAI | GPT-4 | $0.03/1K tokens | $0.06/1K tokens | ~$0.15 |
| Anthropic | Claude 3 Sonnet | $0.003/1K tokens | $0.015/1K tokens | ~$0.03 |
| 国产 | 文心一言 | ¥0.012/1K tokens | ¥0.012/1K tokens | ~¥0.05 |

**节省成本的方法：**
1. 使用缓存（相同生辰只计算一次）
2. 使用更便宜的模型（Claude Haiku、GPT-3.5）
3. 免费版用户不提供AI解读
4. 批量分析时共享上下文

---

## 七、质量保证

### 7.1 输出验证

```typescript
function validateAIOutput(output: any): boolean {
  // 检查必需字段
  const requiredFields = ['summary', 'personality', 'career', 'wealth', 'marriage', 'health'];

  for (const field of requiredFields) {
    if (!output[field]) {
      throw new Error(`缺少必需字段：${field}`);
    }
  }

  // 检查字段类型
  if (!Array.isArray(output.personality.keywords)) {
    throw new Error('personality.keywords 必须是数组');
  }

  // ... 更多验证

  return true;
}
```

### 7.2 人工审核

建议对AI输出进行人工抽查，确保质量。

---

**文档版本：** v1.0
**最后更新：** 2025-12-26
**维护者：** 技术团队
