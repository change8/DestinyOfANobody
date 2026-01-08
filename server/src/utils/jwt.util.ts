import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config/env.config';

export interface JwtPayload {
  userId: number;
  email: string;
}

/**
 * 生成 JWT token
 */
export const generateToken = (payload: JwtPayload): string => {
  const options: SignOptions = {
    expiresIn: config.jwt.expiresIn as any, // 临时绕过类型检查，expiresIn 支持 string 格式如 "7d"
  };
  return jwt.sign(payload, config.jwt.secret, options);
};

/**
 * 验证 JWT token
 */
export const verifyToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * 从 Authorization header 中提取 token
 */
export const extractTokenFromHeader = (authHeader?: string): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7); // 移除 'Bearer ' 前缀
};
