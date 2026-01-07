import { DataSource } from 'typeorm';
import path from 'path';
import { config } from './env.config';
import { User } from '../models/User.entity';
import { DivinationRecord } from '../models/DivinationRecord.entity';
import { UserPreferences } from '../models/UserPreferences.entity';

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: config.database.path,
  synchronize: true, // 开发环境自动同步表结构，生产环境应设为 false
  logging: config.nodeEnv === 'development',
  entities: [User, DivinationRecord, UserPreferences],
  migrations: [],
  subscribers: [],
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('✅ 数据库连接成功');
  } catch (error) {
    console.error('❌ 数据库连接失败:', error);
    throw error;
  }
};
