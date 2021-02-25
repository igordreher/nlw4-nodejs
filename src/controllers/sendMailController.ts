import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import { UsersRepository } from '../repositories/UsersRepository';
import SendMailService from '../services/SendMailService';
import path from 'path';

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

        const npsPath = path.resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs');
        await SendMailService.execute(userFound.email, surveyFound.title, {
            name: userFound.name,
            title: surveyFound.title,
            description: surveyFound.description,
            user_id: userFound.id,
            link: process.env.URL_MAIL
        }, npsPath);

        const surveyUserFound = await surveysUsersRepository.findOne({
            where: [{ user_id: userFound.id }, { value: null }]
        });
        if (surveyUserFound)
            return res.json(surveyUserFound);

        const surveyUser = surveysUsersRepository.create({
            user_id: userFound.id,
            survey_id
        });
        await surveysUsersRepository.save(surveyUser);

        return res.status(201).json(surveyUser);
    }
};