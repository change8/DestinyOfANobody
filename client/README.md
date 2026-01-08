# 命运之卦 - 前端应用

这是"命运之卦"项目的前端应用，使用 React + Vite + TypeScript + TailwindCSS 构建。

## 技术栈

- **React 19** - UI 框架
- **TypeScript 5** - 类型安全
- **Vite 7** - 构建工具
- **TailwindCSS 4** - CSS 框架
- **React Router v6** - 路由管理
- **Axios** - HTTP 客户端
- **Day.js** - 日期处理

## 项目结构

```
client/
├── src/
│   ├── api/              # API 服务层
│   │   ├── client.ts     # Axios 配置
│   │   ├── auth.ts       # 认证 API
│   │   ├── divination.ts # 占卜 API
│   │   └── history.ts    # 历史记录 API
│   ├── components/       # React 组件
│   │   ├── common/       # 通用组件
│   │   └── layout/       # 布局组件
│   ├── contexts/         # React Context
│   │   └── AuthContext.tsx
│   ├── pages/            # 页面组件
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── BaziPage.tsx
│   │   ├── MeihuaPage.tsx
│   │   ├── History.tsx
│   │   └── Profile.tsx
│   ├── types/            # TypeScript 类型定义
│   ├── App.tsx           # 应用根组件
│   ├── main.tsx          # 应用入口
│   └── index.css         # 全局样式
├── public/               # 静态资源
├── .env                  # 环境变量
└── package.json
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env`，并根据需要修改：

```env
VITE_API_URL=http://localhost:3000
```

### 3. 启动开发服务器

```bash
npm run dev
```

应用将在 http://localhost:5173 启动。

### 4. 构建生产版本

```bash
npm run build
```

构建文件将输出到 `dist/` 目录。

### 5. 预览生产构建

```bash
npm run preview
```

## 功能模块

### 认证系统
- 用户注册
- 用户登录
- Token 管理
- 受保护的路由

### 八字排盘
- 输入出生信息
- 计算四柱八字
- 显示命理分析
- 保存历史记录（需登录）

### 梅花易数
- 时间起卦
- 数字起卦
- 文字起卦
- 显示本卦、变卦、互卦
- 保存历史记录（需登录）

### 历史记录
- 查看所有占卜记录
- 按类型筛选
- 收藏功能
- 删除记录

### 个人中心
- 查看个人信息
- 统计数据

## 开发说明

### 代码风格

- 使用 ESLint 进行代码检查
- 使用 TypeScript 严格模式
- 遵循 React 最佳实践

### 组件规范

- 所有组件使用 TypeScript
- Props 必须定义类型
- 使用函数式组件和 Hooks

### API 调用

所有 API 调用都通过 `src/api/` 目录下的服务层进行，统一处理：

- 请求拦截（添加 Token）
- 响应拦截（处理错误）
- 类型安全

### 状态管理

- 全局状态使用 React Context
- 组件状态使用 useState
- 副作用使用 useEffect

## 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| VITE_API_URL | 后端 API 地址 | http://localhost:3000 |

## 构建优化

- 代码分割
- Tree Shaking
- CSS 压缩
- 资源优化

## 浏览器支持

- Chrome (最新)
- Firefox (最新)
- Safari (最新)
- Edge (最新)

## 许可证

MIT
