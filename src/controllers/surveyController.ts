import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { SurveysRepository } from '../repositories/SurveysRepository';
import * as yup from 'yup';

export default {
    async create(req: Request, res: Response) {
        const { title, description } = req.body;
        const surveysRepository = getCustomRepository(SurveysRepository);

        const schema = yup.object({
            title: yup.string().required(),
            description: yup.string().required()
        });
        await schema.validate({ title, description });

        const survey = surveysRepository.create({
            title, description
        });
        await surveysRepository.save(survey);
        return res.status(201).json(survey);
    },

    async show(req: Request, res: Response) {
        const surveysRepository = getCustomRepository(SurveysRepository);
        const allSurveys = await surveysRepository.find();
        return res.json(allSurveys);
    }
};