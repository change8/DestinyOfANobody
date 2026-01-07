import 'reflect-metadata';
import express, { Application } from 'express';
import cors from 'cors';
import { config } from './config/env.config';
import authRoutes from './routes/auth.routes';
import divinationRoutes from './routes/divination.routes';
import historyRoutes from './routes/history.routes';
import { errorMiddleware, notFoundMiddleware } from './middleware/error.middleware';

export const createApp = (): Application => {
  const app = express();

  // 中间件
  app.use(cors({
    origin: config.cors.origin,
    credentials: true,
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // 健康检查路由
  app.get('/health', (req, res) => {
    res.json({
      success: true,
      message: '服务正常运行',
      timestamp: new Date().toISOString(),
    });
  });

  // API 路由
  app.use('/api/auth', authRoutes);
  app.use('/api/divination', divinationRoutes);
  app.use('/api/history', historyRoutes);

  // 404 处理
  app.use(notFoundMiddleware);

  // 错误处理
  app.use(errorMiddleware);

  return app;
};
