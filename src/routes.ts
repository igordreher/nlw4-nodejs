import { Router } from 'express';
import answersController from './controllers/answersController';
import npsController from './controllers/npsController';
import sendMailController from './controllers/sendMailController';
import surveyController from './controllers/surveyController';
import userController from './controllers/userController';

const router = Router();

router.post('/users', userController.create);

router.post('/surveys', surveyController.create);
router.get('/surveys', surveyController.show);

router.post('/sendMail', sendMailController.execute);
router.get('/answers/:value', answersController.execute);
router.get('/nps/:survey_id', npsController.execute);

export default router;