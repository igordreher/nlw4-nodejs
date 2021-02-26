import 'reflect-metadata';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import createConnection from './database';
import routes from './routes';
import { AppError } from './errors/AppError';
import { ValidationError } from 'yup';

createConnection();
const app = express();

app.use(express.json());
app.use(routes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError)
        return res.status(err.statusCode).json({ error: err.message });
    if (err instanceof ValidationError)
        return res.status(400).json({ error: err.message });

    return res.status(500).json({ error: err.message });
});

export default app;