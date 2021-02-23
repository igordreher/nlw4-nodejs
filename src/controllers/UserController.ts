import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../models/User';

export default {
    async create(req: Request, res: Response) {
        const { name, email } = req.body;

        const usersRepository = getRepository(User);

        const userEmailExists = await usersRepository.findOne({ email });
        if (userEmailExists)
            return res.status(400).json({ error: 'email already registered' });

        const user = usersRepository.create({ name, email });
        await usersRepository.save(user);

        res.json(user);
    }
};