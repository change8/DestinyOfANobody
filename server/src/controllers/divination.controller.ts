import { Request, Response } from 'express';
import { divinationService } from '../services/divination.service';

export class DivinationController {
  /**
   * 八字排盘
   * POST /api/divination/bazi
   */
  async bazi(req: Request, res: Response): Promise<void> {
    try {
      const result = await divinationService.calculateBazi(
        req.body,
        req.user?.userId
      );

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : '八字排盘失败',
      });
    }
  }

  /**
   * 梅花易数起卦
   * POST /api/divination/meihua
   */
  async meihua(req: Request, res: Response): Promise<void> {
    try {
      const { method, input, question } = req.body;

      if (!method || !question) {
        res.status(400).json({
          success: false,
          error: '请提供起卦方法和问题',
        });
        return;
      }

      const result = await divinationService.meihuaDivination(
        method,
        input,
        question,
        req.user?.userId
      );

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : '起卦失败',
      });
    }
  }
}

export const divinationController = new DivinationController();
