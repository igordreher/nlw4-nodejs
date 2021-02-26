import { Request, Response } from "express";
import { getCustomRepository, Not, IsNull } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

export default {

    async execute(req: Request, res: Response) {
        const { survey_id } = req.params;
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const surveyUser = await surveysUsersRepository.find({ survey_id, value: Not(IsNull()) });

        const detractors = surveyUser.filter(survey => survey.value <= 6);
        const promoters = surveyUser.filter(survey => survey.value >= 9);
        const passives = surveyUser.filter(
            survey => survey.value >= 7 && survey.value <= 8
        );

        const result = (((promoters.length - detractors.length) / surveyUser.length) * 100).toFixed(2);

        return res.json({
            detractors: detractors.length,
            promoters: promoters.length,
            passives: passives.length,
            nps: Number(result)
        });
    }
};