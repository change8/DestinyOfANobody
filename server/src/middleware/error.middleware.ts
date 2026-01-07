import { Request, Response, NextFunction } from 'express';

/**
 * 全局错误处理中间件
 */
export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('❌ Error:', err.message);
  console.error(err.stack);

  res.status(500).json({
    success: false,
    error: err.message || '服务器内部错误',
  });
};

/**
 * 404 处理中间件
 */
export const notFoundMiddleware = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: '请求的资源不存在',
  });
};
