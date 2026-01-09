import { Request, Response } from 'express';
import { historyService } from '../services/history.service';

export class HistoryController {
  /**
   * 获取历史记录列表
   * GET /api/history?page=1&pageSize=20&type=bazi
   * 兼容旧参数 limit
   */
  async getRecords(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: '未认证' });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      // 优先读取 pageSize（前端使用），fallback 到 limit（向后兼容）
      const pageSize = parseInt(req.query.pageSize as string) || parseInt(req.query.limit as string) || 20;
      const type = req.query.type as string | undefined;

      const result = await historyService.getRecords(req.user.userId, page, pageSize, type);

      // 直接返回业务数据
      res.json(result);
    } catch (error) {
      res.status(400).json({
        message: error instanceof Error ? error.message : '获取历史记录失败',
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
        res.status(401).json({ message: '未认证' });
        return;
      }

      const recordId = parseInt(req.params.id);
      const result = await historyService.getRecordById(recordId, req.user.userId);

      // 直接返回业务数据
      res.json(result);
    } catch (error) {
      res.status(404).json({
        message: error instanceof Error ? error.message : '记录不存在',
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
        res.status(401).json({ message: '未认证' });
        return;
      }

      const recordId = parseInt(req.params.id);
      await historyService.deleteRecord(recordId, req.user.userId);

      // 删除成功，返回 204 No Content
      res.status(204).send();
    } catch (error) {
      res.status(400).json({
        message: error instanceof Error ? error.message : '删除失败',
      });
    }
  }

  /**
   * 收藏/取消收藏（自动切换）
   * PUT /api/history/:id/favorite
   */
  async toggleFavorite(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: '未认证' });
        return;
      }

      const recordId = parseInt(req.params.id);

      // 先获取当前状态，然后切换
      const recordRepository = (historyService as any).getRecordRepository();
      const record = await recordRepository.findOne({
        where: { id: recordId, userId: req.user.userId },
      });

      if (!record) {
        res.status(404).json({ message: '记录不存在' });
        return;
      }

      // 自动切换收藏状态
      const newFavoriteState = !record.isFavorite;
      const result = await historyService.toggleFavorite(
        recordId,
        req.user.userId,
        newFavoriteState
      );

      // 直接返回业务数据
      res.json(result);
    } catch (error) {
      res.status(400).json({
        message: error instanceof Error ? error.message : '操作失败',
      });
    }
  }
}

export const historyController = new HistoryController();
