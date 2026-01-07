import { Request, Response } from 'express';
import { historyService } from '../services/history.service';

export class HistoryController {
  /**
   * 获取历史记录列表
   * GET /api/history?page=1&limit=20&type=bazi
   */
  async getRecords(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: '未认证' });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const type = req.query.type as string | undefined;

      const result = await historyService.getRecords(req.user.userId, page, limit, type);

      res.json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : '获取历史记录失败',
      });
    }
  }

  /**
   * 获取单条历史记录
   * GET /api/history/:id
   */
  async getRecordById(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: '未认证' });
        return;
      }

      const recordId = parseInt(req.params.id);
      const result = await historyService.getRecordById(recordId, req.user.userId);

      res.json({ success: true, data: result });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error instanceof Error ? error.message : '记录不存在',
      });
    }
  }

  /**
   * 删除历史记录
   * DELETE /api/history/:id
   */
  async deleteRecord(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: '未认证' });
        return;
      }

      const recordId = parseInt(req.params.id);
      await historyService.deleteRecord(recordId, req.user.userId);

      res.json({ success: true, message: '记录已删除' });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : '删除失败',
      });
    }
  }

  /**
   * 收藏/取消收藏
   * PUT /api/history/:id/favorite
   */
  async toggleFavorite(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: '未认证' });
        return;
      }

      const recordId = parseInt(req.params.id);
      const { is_favorite } = req.body;

      const result = await historyService.toggleFavorite(
        recordId,
        req.user.userId,
        is_favorite
      );

      res.json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : '操作失败',
      });
    }
  }
}

export const historyController = new HistoryController();
