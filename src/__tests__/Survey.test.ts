import request from 'supertest';
import { Connection } from 'typeorm';
import app from '../app';
import createConnection from '../database';

describe('Survey', () => {
    let connection: Connection;

    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it('Should create a new survey', async (done) => {
        const response = await request(app).post('/surveys')
            .send({ title: 'some title', description: 'Description' });
        expect(response.status).toBe(201);
        done();
    });
});