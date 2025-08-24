import { Router } from 'express';
import { AvatarController } from '../controllers/AvatarController';
import { AvatarService } from '../services/AvatarService';
import { ReadyPlayerMeClient } from '../clients/ReadyPlayerMeClient';

const router = Router();

const rpm = new ReadyPlayerMeClient();
const service = new AvatarService(rpm);
const controller = new AvatarController(service);

// Step 1: create anonymous user
router.post('/rpm/users', controller.createAnonymousUser);

export default router;


