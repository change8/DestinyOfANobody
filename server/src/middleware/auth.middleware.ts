import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader } from '../utils/jwt.util';

// 扩展 Express Request 类型
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        email: string;
      };
    }
  }
}

/**
 * 认证中间件
 * 验证 JWT token 并将用户信息注入到 req.user
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 提取 token
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      res.status(401).json({
        success: false,
        error: '未提供认证令牌',
      });
      return;
    }

    // 验证 token
    const payload = verifyToken(token);

    // 将用户信息注入到请求对象
    req.user = {
      userId: payload.userId,
      email: payload.email,
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: '无效或过期的令牌',
    });
  }
};

/**
 * 可选认证中间件
 * 如果有 token 则验证并注入用户信息，没有则继续
 */
export const optionalAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (token) {
      const payload = verifyToken(token);
      req.user = {
        userId: payload.userId,
        email: payload.email,
      };
    }

    next();
  } catch (error) {
    // 即使 token 无效也继续，不抛出错误
    next();
  }
};
