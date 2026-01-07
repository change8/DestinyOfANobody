import { Router } from 'express';
import { historyController } from '../controllers/history.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// 所有历史记录路由都需要认证
router.use(authMiddleware);

router.get('/', (req, res) => historyController.getRecords(req, res));
router.get('/:id', (req, res) => historyController.getRecordById(req, res));
router.delete('/:id', (req, res) => historyController.deleteRecord(req, res));
router.put('/:id/favorite', (req, res) => historyController.toggleFavorite(req, res));

export default router;
