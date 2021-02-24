import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';

export default {
    async create(req: Request, res: Response) {
        const { name, email } = req.body;

        const usersRepository = getCustomRepository(UsersRepository);

        const userEmailExists = await usersRepository.findOne({ email });
        if (userEmailExists)
            return res.status(400).json({ error: 'email already registered' });

        const user = usersRepository.create({ name, email });
        await usersRepository.save(user);

        res.status(201).json(user);
    }
};