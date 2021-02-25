import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import { UsersRepository } from '../repositories/UsersRepository';
import SendMailService from '../services/SendMailService';

export default {
    async execute(req: Request, res: Response) {
        const { email, survey_id } = req.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const userFound = await usersRepository.findOne({ email });
        if (!userFound)
            return res.status(400).json({ error: 'user with given email not found' });

        const surveyFound = await surveysRepository.findOne({ id: survey_id });
        if (!surveyFound)
            return res.status(400).json({ error: 'survey not found' });

        const surveyUser = surveysUsersRepository.create({
            user_id: userFound.id,
            survey_id
        });
        try {
            await surveysUsersRepository.save(surveyUser);
            await SendMailService.execute(userFound.email, surveyFound.title, surveyFound.description);
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({ error: error.message });
        }

        return res.status(201).json(surveyUser);
    }
};