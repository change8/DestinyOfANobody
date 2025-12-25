# 命运之道 - 易经八字算命小程序

> 基于易经理论和八字命理的智能算命小程序，融合传统文化与现代技术

## 📖 项目简介

本项目是一款专注于传统易经、八字命理的微信小程序，旨在为用户提供专业、准确的命理分析服务。项目遵循传统命理学原理，使用现代算法实现八字排盘、大运流年、易经占卜等核心功能。

**核心特色：**
- ✨ 精准的八字排盘算法（基于天干地支计算）
- 🎯 完整的命理分析体系（十神、纳音、藏干等）
- 📊 可视化运势展示（人生K线图）
- 🔮 易经占卜功能（六爻、梅花易数）
- 📚 专业的命理知识库

## 🗂️ 文档导航

**请按以下顺序阅读项目文档，以全面了解项目：**

### 1️⃣ 必读文档（项目启动前）

- **[产品设计文档](docs/产品设计文档.md)** - 了解产品定位、核心功能、用户流程
- **[技术架构文档](docs/技术架构文档.md)** - 了解技术选型、系统架构、模块划分
- **[开发规范文档](docs/开发规范文档.md)** - 了解代码规范、Git工作流、开发流程

### 2️⃣ 核心技术文档（开发必读）

- **[算命逻辑说明](docs/算命逻辑说明.md)** - 深入了解八字排盘、易经算法的核心逻辑
- **[易经八字基础知识](docs/易经八字基础知识.md)** - 学习命理学基础理论和原理
- **[数据库设计文档](docs/数据库设计文档.md)** - 查看数据库表结构、字段说明、关系设计

### 3️⃣ 项目管理文档（日常开发）

- **[项目任务清单](docs/项目任务清单.md)** - 查看待办任务、当前进度、里程碑计划

## 🚀 快速开始

### 环境要求

- Node.js >= 16.x
- 微信开发者工具 >= 稳定版
- MySQL >= 8.0 / MongoDB >= 5.0
- Redis >= 6.0（可选，用于缓存）

### 安装步骤

```bash
# 1. 克隆项目
git clone <repository-url>
cd DestinyOfANobody

# 2. 安装依赖（小程序端）
cd miniprogram
npm install

# 3. 安装依赖（后端服务）
cd ../server
npm install

# 4. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填写数据库连接等配置

# 5. 初始化数据库
npm run db:migrate

# 6. 启动开发服务器
npm run dev
```

### 目录结构

```
DestinyOfANobody/
├── miniprogram/          # 微信小程序前端代码
│   ├── pages/           # 页面文件
│   ├── components/      # 组件
│   ├── utils/           # 工具函数
│   └── api/             # API 接口封装
├── server/              # 后端服务代码
│   ├── src/
│   │   ├── controllers/ # 控制器
│   │   ├── services/    # 业务逻辑
│   │   ├── models/      # 数据模型
│   │   └── utils/       # 工具函数
│   └── tests/           # 测试文件
├── fortune-engine/      # 算命引擎（独立NPM包）
│   ├── bazi/           # 八字算法
│   ├── yijing/         # 易经算法
│   └── calendar/       # 农历日历
├── docs/               # 项目文档
└── README.md           # 本文件
```

## 🛠️ 技术栈

### 前端（小程序）
- 微信小程序原生框架
- TypeScript
- Vant Weapp UI组件库

### 后端
- Node.js + NestJS
- TypeScript
- MySQL / MongoDB
- Redis（缓存）

### 算命引擎
- 纯JavaScript实现
- 无外部依赖
- 支持独立使用

## 📚 参考资料

### 学习资源（已研读）
- 《周易·系辞传》- 南怀瑾《易经杂说》
- 子平八字基础理论
- 天干地支与五行学说

### 参考项目
- [lifekline](https://github.com/curionox/lifekline) - 人生K线项目（AI代理架构）
- [chinese-lunar](https://github.com/tony801015/chinese-lunar) - 农历与八字计算库

### 技术文章
- [八字排盘算法实现原理](https://blog.csdn.net/weixin_46152976/article/details/130895243)
- [天干地支计算方法](https://blog.csdn.net/yangguangwudao/article/details/125704405)
- [易经系辞传原文](https://zhuanlan.zhihu.com/p/584448012)

## 📊 当前进度

- [x] 项目框架搭建
- [x] 文档体系建立
- [ ] 算命引擎开发（进行中）
- [ ] 后端API开发
- [ ] 小程序前端开发
- [ ] 测试与优化

详细进度请查看 [项目任务清单](docs/项目任务清单.md)

## 🤝 参与贡献

欢迎提交 Issue 和 Pull Request！

在开始之前，请务必阅读：
1. [开发规范文档](docs/开发规范文档.md)
2. [技术架构文档](docs/技术架构文档.md)

## 📄 开源协议

MIT License

## 📞 联系方式

如有问题或建议，请提交 Issue 或联系项目维护者。

---

**⚠️ 免责声明**

本项目仅供学习交流使用，算命结果仅供娱乐参考，不构成任何人生决策建议。请理性对待命理文化，不要过度迷信。
