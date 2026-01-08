# 命运之卦 - 快速开始指南

本指南将帮助您快速启动"命运之卦"项目的前后端服务。

## 项目概述

**命运之卦**是一个全栈 Web 应用，提供中国传统命理占卜服务：
- 八字排盘（四柱命理）
- 梅花易数（占卜起卦）
- AI 智能解读
- 用户系统和历史记录

## 技术栈

### 后端
- Node.js + Express 4.18
- TypeScript 5.3
- TypeORM 0.3 + SQLite
- JWT 认证

### 前端
- React 19 + TypeScript 5
- Vite 7
- TailwindCSS 4
- React Router v6

### 核心算法
- 八字排盘算法（已修复）
- 梅花易数算法（已修复）
- 农历转换

## 项目结构

```
DestinyOfANobody/
├── src/                   # 核心算法库
│   ├── bazi/              # 八字排盘
│   ├── meihua/            # 梅花易数
│   ├── llm/               # LLM 集成
│   └── utils/             # 工具函数
├── server/                # 后端服务
│   ├── src/               # Express 应用
│   ├── data/              # SQLite 数据库
│   └── package.json
├── client/                # 前端应用
│   ├── src/               # React 应用
│   └── package.json
└── docs/                  # 项目文档
```

## 快速启动

### 1. 系统要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 2. 克隆项目

```bash
git clone https://github.com/change8/DestinyOfANobody.git
cd DestinyOfANobody
```

### 3. 启动后端服务

```bash
# 进入 server 目录
cd server

# 安装依赖
npm install

# 配置环境变量（可选）
cp .env.example .env
# 编辑 .env 文件，修改配置（默认配置已可用）

# 启动开发服务器
npm run dev
```

后端服务将在 **http://localhost:3000** 启动

### 4. 启动前端应用

打开新的终端窗口：

```bash
# 进入 client 目录
cd client

# 安装依赖
npm install

# 配置环境变量（可选）
cp .env.example .env
# 默认配置已可用，无需修改

# 启动开发服务器
npm run dev
```

前端应用将在 **http://localhost:5173** 启动

### 5. 访问应用

在浏览器中打开：**http://localhost:5173**

## 功能测试

### 测试八字排盘

1. 访问首页，点击"八字排盘"卡片
2. 输入出生信息（年月日时）
3. 点击"开始排盘"
4. 查看四柱八字结果

### 测试梅花易数

1. 访问首页，点击"梅花易数"卡片
2. 选择起卦方式（时间/数字/文字）
3. 输入相关信息
4. 点击"开始起卦"
5. 查看卦象结果

### 测试用户系统

1. 点击右上角"注册"
2. 填写用户名、邮箱、密码
3. 注册成功后自动登录
4. 可以查看历史记录、个人中心

## API 端点

### 认证 API

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户

### 占卜 API

- `POST /api/divination/bazi` - 八字排盘
- `POST /api/divination/meihua` - 梅花易数

### 历史记录 API

- `GET /api/history` - 获取历史记录列表
- `GET /api/history/:id` - 获取记录详情
- `DELETE /api/history/:id` - 删除记录
- `PUT /api/history/:id/favorite` - 收藏/取消收藏

### 健康检查

- `GET /health` - 服务健康状态

## 示例请求

### 注册用户

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "123456",
    "nickname": "测试用户"
  }'
```

### 八字排盘

```bash
curl -X POST http://localhost:3000/api/divination/bazi \
  -H "Content-Type: application/json" \
  -d '{
    "year": 1990,
    "month": 5,
    "day": 15,
    "hour": 14,
    "minute": 30,
    "gender": "male"
  }'
```

### 梅花易数（时间起卦）

```bash
curl -X POST http://localhost:3000/api/divination/meihua \
  -H "Content-Type: application/json" \
  -d '{
    "type": "time"
  }'
```

## 生产构建

### 构建前端

```bash
cd client
npm run build
```

构建文件将输出到 `client/dist/`

### 构建核心库

```bash
npm run build
```

构建文件将输出到 `dist/`

## 常见问题

### Q: 后端启动失败，提示端口被占用

A: 修改 `server/.env` 文件中的 `PORT` 配置，或停止占用 3000 端口的进程。

### Q: 前端无法连接后端

A: 检查：
1. 后端服务是否正常运行（http://localhost:3000/health）
2. 前端 `.env` 文件中的 `VITE_API_URL` 配置是否正确

### Q: 数据库在哪里？

A: SQLite 数据库文件位于 `server/data/dev.db`，会在首次启动时自动创建。

### Q: 如何重置数据库？

A: 删除 `server/data/dev.db` 文件，重启后端服务即可重新初始化。

## 下一步

- 查看 [项目文档](docs/项目核心文档/)
- 查看 [API 文档](server/README.md)
- 查看 [前端文档](client/README.md)
- 集成 LLM 解读功能（需配置 API Key）

## 技术支持

如有问题，请查看：
- [GitHub Issues](https://github.com/change8/DestinyOfANobody/issues)
- [项目进度总结](docs/项目核心文档/10-项目进度总结.md)

## 许可证

MIT License
