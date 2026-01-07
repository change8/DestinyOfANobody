import dotenv from 'dotenv';
import path from 'path';

// 加载环境变量
dotenv.config();

export const config = {
  // 服务器配置
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  // 数据库配置
  database: {
    type: process.env.DB_TYPE || 'sqlite',
    path: process.env.DB_PATH || path.join(__dirname, '../../data/dev.db'),
  },

  // JWT 配置
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-key-change-this',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  // CORS 配置
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  },

  // LLM API Keys
  llm: {
    openai: process.env.OPENAI_API_KEY || '',
    anthropic: process.env.ANTHROPIC_API_KEY || '',
    zhipu: process.env.ZHIPU_API_KEY || '',
    qwen: process.env.QWEN_API_KEY || '',
    deepseek: process.env.DEEPSEEK_API_KEY || '',
  },
};

export default config;
