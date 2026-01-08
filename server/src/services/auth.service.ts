import { AppDataSource } from '../config/database.config';
import { User, UserPreferences } from '../models';
import { hashPassword, comparePassword } from '../utils/password.util';
import { generateToken } from '../utils/jwt.util';

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
  nickname?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'passwordHash'>;
  token: string;
}

export class AuthService {
  // 移除模块加载时的 getRepository 调用
  private getUserRepository() {
    return AppDataSource.getRepository(User);
  }

  private getPreferencesRepository() {
    return AppDataSource.getRepository(UserPreferences);
  }

  /**
   * 用户注册
   */
  async register(input: RegisterInput): Promise<AuthResponse> {
    const userRepository = this.getUserRepository();
    const preferencesRepository = this.getPreferencesRepository();

    // 检查用户名是否已存在
    const existingUser = await userRepository.findOne({
      where: [{ username: input.username }, { email: input.email }],
    });

    if (existingUser) {
      if (existingUser.username === input.username) {
        throw new Error('用户名已被使用');
      }
      if (existingUser.email === input.email) {
        throw new Error('邮箱已被使用');
      }
    }

    // 创建用户
    const user = userRepository.create({
      username: input.username,
      email: input.email,
      passwordHash: await hashPassword(input.password),
      nickname: input.nickname || input.username,
    });

    await userRepository.save(user);

    // 创建用户偏好设置
    const preferences = preferencesRepository.create({
      userId: user.id,
      theme: 'light',
      language: 'zh-CN',
    });
    await preferencesRepository.save(preferences);

    // 生成 token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    return {
      user: user.toJSON() as Omit<User, 'passwordHash'>,
      token,
    };
  }

  /**
   * 用户登录
   */
  async login(input: LoginInput): Promise<AuthResponse> {
    const userRepository = this.getUserRepository();

    // 查找用户
    const user = await userRepository.findOne({
      where: { email: input.email },
    });

    if (!user) {
      throw new Error('邮箱或密码错误');
    }

    if (!user.isActive) {
      throw new Error('账户已被禁用');
    }

    // 验证密码
    const isPasswordValid = await comparePassword(input.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('邮箱或密码错误');
    }

    // 更新最后登录时间
    user.lastLoginAt = new Date();
    await userRepository.save(user);

    // 生成 token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    return {
      user: user.toJSON() as Omit<User, 'passwordHash'>,
      token,
    };
  }

  /**
   * 获取当前用户信息
   */
  async getCurrentUser(userId: number): Promise<Omit<User, 'passwordHash'>> {
    const userRepository = this.getUserRepository();
    const user = await userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('用户不存在');
    }

    return user.toJSON() as Omit<User, 'passwordHash'>;
  }
}

export const authService = new AuthService();
