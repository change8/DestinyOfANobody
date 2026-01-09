/**
 * 数据库同步脚本
 * 用于手动触发 TypeORM 表结构同步
 */
import { AppDataSource, initializeDatabase } from '../config/database.config';

async function syncDatabase() {
  try {
    console.log('🔄 开始同步数据库表结构...');

    // 初始化数据库连接
    await initializeDatabase();

    // TypeORM 的 synchronize 选项会自动同步表结构
    // 在 database.config.ts 中已启用 synchronize: true
    console.log('✅ 数据库表结构同步成功');

    // 关闭连接
    await AppDataSource.destroy();
    console.log('👋 数据库连接已关闭');

    process.exit(0);
  } catch (error) {
    console.error('❌ 数据库同步失败:', error);
    process.exit(1);
  }
}

syncDatabase();
