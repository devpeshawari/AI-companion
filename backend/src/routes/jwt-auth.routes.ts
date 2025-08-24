import { Router } from 'express';
import { JwtAuthService } from '../services/JwtAuthService';
import { JwtAuthController } from '../controllers/JwtAuthController';

const router = Router();
const service = new JwtAuthService();
const controller = new JwtAuthController(service);

router.post('/signup', controller.signup);
router.post('/login', controller.login);
router.post('/refresh', controller.refresh);
router.get('/me', controller.me);

export default router;


