import { Router } from 'express';
import surveyController from './controllers/surveyController';
import userController from './controllers/userController';

const router = Router();

router.post('/users', userController.create);

router.post('/surveys', surveyController.create);
router.get('/surveys', surveyController.show);

export default router;