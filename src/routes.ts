import { Router } from 'express';
import userController from './controllers/UserController';

const router = Router();

router.post('/users', userController.create);

export default router;