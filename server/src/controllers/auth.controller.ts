import { Request, Response } from 'express';
import { authService } from '../services/auth.service';

export class AuthController {
  /**
   * 用户注册
   * POST /api/auth/register
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password, nickname } = req.body;

      // 基本验证
      if (!username || !email || !password) {
        res.status(400).json({
          message: '请提供用户名、邮箱和密码',
        });
        return;
      }

      // 邮箱格式验证
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({
          message: '邮箱格式不正确',
        });
        return;
      }

      // 密码长度验证
      if (password.length < 6) {
        res.status(400).json({
          message: '密码长度至少为 6 位',
        });
        return;
      }

      const result = await authService.register({
        username,
        email,
        password,
        nickname,
      });

      // 直接返回业务数据，不包装
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({
        message: error instanceof Error ? error.message : '注册失败',
      });
    }
  }

  /**
   * 用户登录
   * POST /api/auth/login
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({
          message: '请提供邮箱和密码',
        });
        return;
      }

      const result = await authService.login({ email, password });

      // 直接返回业务数据
      res.json(result);
    } catch (error) {
      res.status(401).json({
        message: error instanceof Error ? error.message : '登录失败',
      });
    }
  }

  /**
   * 获取当前用户信息
   * GET /api/auth/me
   */
  async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          message: '未认证',
        });
        return;
      }

      const user = await authService.getCurrentUser(req.user.userId);

      // 直接返回用户数据
      res.json(user);
    } catch (error) {
      res.status(404).json({
        message: error instanceof Error ? error.message : '获取用户信息失败',
      });
    }
  }
}

export const authController = new AuthController();
