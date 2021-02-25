import { Router } from 'express';
import sendMailController from './controllers/sendMailController';
import surveyController from './controllers/surveyController';
import userController from './controllers/userController';

const router = Router();

router.post('/users', userController.create);

router.post('/surveys', surveyController.create);
router.get('/surveys', surveyController.show);

router.post('/sendMail', sendMailController.execute);

export default router;