import { Router } from 'express';
import { divinationController } from '../controllers/divination.controller';
import { optionalAuthMiddleware } from '../middleware/auth.middleware';

const router = Router();

// 占卜 API（可选认证，登录用户会保存历史）
router.post('/bazi', optionalAuthMiddleware, (req, res) => divinationController.bazi(req, res));
router.post('/meihua', optionalAuthMiddleware, (req, res) => divinationController.meihua(req, res));

export default router;
