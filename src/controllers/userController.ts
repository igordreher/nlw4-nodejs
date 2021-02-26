import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { AppError } from '../errors/AppError';
import { UsersRepository } from '../repositories/UsersRepository';
import * as yup from 'yup';

export default {
    async create(req: Request, res: Response) {
        const { name, email } = req.body;

        const usersRepository = getCustomRepository(UsersRepository);

        const schema = yup.object({
            name: yup.string().required(),
            email: yup.string().email().required()
        });
        await schema.validate({ name, email });

        const userEmailExists = await usersRepository.findOne({ email });
        if (userEmailExists)
            throw new AppError('User email already registered');

        const user = usersRepository.create({ name, email });
        await usersRepository.save(user);

        res.status(201).json(user);
    }
};