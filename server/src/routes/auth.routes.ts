import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// 公开路由
router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));

// 需要认证的路由
router.get('/me', authMiddleware, (req, res) => authController.getCurrentUser(req, res));

export default router;
