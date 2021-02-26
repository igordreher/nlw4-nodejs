import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import { UsersRepository } from '../repositories/UsersRepository';
import SendMailService from '../services/SendMailService';
import path from 'path';
import * as yup from 'yup';
import { AppError } from '../errors/AppError';

export default {
    async execute(req: Request, res: Response) {
        const { email, survey_id } = req.body;

        const schema = yup.object({
            email: yup.string().email().required(),
            survey_id: yup.string().required()
        });
        await schema.validate({ email, survey_id });

        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const userFound = await usersRepository.findOne({ email });
        if (!userFound)
            throw new AppError('User email not found');

        const surveyFound = await surveysRepository.findOne({ id: survey_id });
        if (!surveyFound)
            throw new AppError('Survey not found');

        const npsPath = path.resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs');

        let surveyUserFound = await surveysUsersRepository.findOne({
            where: { user_id: userFound.id, survey_id: surveyFound.id },
            relations: ['user', 'survey']
        });

        if (!surveyUserFound) {
            surveyUserFound = surveysUsersRepository.create({
                user_id: userFound.id,
                survey_id
            });
            await surveysUsersRepository.save(surveyUserFound);
        }

        const mailVariables = {
            name: userFound.name,
            title: surveyFound.title,
            description: surveyFound.description,
            id: surveyUserFound.id,
            link: process.env.URL_MAIL
        };

        await SendMailService.execute(userFound.email, surveyFound.title, mailVariables, npsPath);
        return res.status(201).json(surveyUserFound);
    }
};