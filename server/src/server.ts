import { createApp } from './app';
import { initializeDatabase } from './config/database.config';
import { config } from './config/env.config';

const startServer = async (): Promise<void> => {
  try {
    // 初始化数据库
    await initializeDatabase();

    // 创建并启动 Express 应用
    const app = createApp();
    const port = config.port;

    app.listen(port, () => {
      console.log(`
╔════════════════════════════════════════╗
║   🔮 命运之卦 - 后端服务启动成功     ║
╠════════════════════════════════════════╣
║   端口: ${port}                          ║
║   环境: ${config.nodeEnv}               ║
║   数据库: SQLite                       ║
╚════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ 服务启动失败:', error);
    process.exit(1);
  }
};

// 启动服务
startServer();
