# Fortune Engine 演示指南

本项目提供多种演示方式，展示 Fortune Engine 的完整功能。

---

## 📦 演示文件说明

### 1. **核心计算演示**（不需要 LLM）

#### `test-example.ts` - 八字排盘示例
```bash
npm run example:bazi
```

#### `meihua-example.ts` - 梅花易数示例  
```bash
npm run example:meihua
```

#### `demo.html` - 网页版八字排盘
```bash
npm run serve
# 访问 http://localhost:3000
```

---

### 2. **LLM 集成演示**（需要配置 API Key）

#### `llm-example.ts` - 完整 LLM 集成流程
```bash
# 1. 配置 API Key
export ZHIPU_API_KEY=your-key

# 2. 运行示例
npm run example:llm
```

#### `demo-app.html` - 网页版 LLM 演示
```bash
npm run serve
# 访问 http://localhost:3000/demo-app.html
```
**注意**: 网页版目前为演示模式（模拟数据）

---

## ⚙️ LLM 配置

Fortune Engine 支持 5 个 LLM 提供商：

### 1. 智谱AI (GLM-4) ⭐ 推荐国内用户
```bash
export ZHIPU_API_KEY=your-key
```
- 获取地址: https://open.bigmodel.cn/
- 优点: 国内快，中文好，性价比高

### 2. OpenAI (GPT-4/3.5)
```bash
export OPENAI_API_KEY=sk-your-key
```
- 获取地址: https://platform.openai.com/
- 优点: 质量高
- 缺点: 较贵，需代理

### 3. Anthropic (Claude)
```bash
export ANTHROPIC_API_KEY=sk-ant-your-key
```

### 4. 通义千问 (Qwen)
```bash
export DASHSCOPE_API_KEY=your-key
```

### 5. DeepSeek
```bash
export DEEPSEEK_API_KEY=your-key
```

---

## 🚀 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 构建项目
npm run build

# 3. 运行演示（无需 LLM）
npm run example:bazi     # 八字排盘
npm run example:meihua   # 梅花易数
npm run serve            # Web 界面

# 4. 运行 LLM 演示（需配置 API Key）
export ZHIPU_API_KEY=your-key
npm run example:llm
```

---

## 📖 详细文档

- [LLM 集成配置指南](./docs/技术参考文档/LLM集成配置指南.md)
- [项目核心文档](./docs/项目核心文档/)
- [技术参考文档](./docs/技术参考文档/)

---

## 💡 提示

### 测试阶段
- 使用便宜模型：通义千问、DeepSeek
- 使用 `concise` 风格减少 token
- 限制测试次数

### 成本参考

单次八字解读（约 3000 tokens）：
- OpenAI GPT-4: ~$0.20
- 智谱 GLM-4: ~¥0.30
- 通义千问: ~¥0.024
- DeepSeek: ~¥0.006

---

**祝使用愉快！** 🎉
