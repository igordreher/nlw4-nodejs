import { Connection } from "typeorm";
import request from 'supertest';
import app from '../app';
import createConnection from '../database';

describe('Send Email', () => {
    let connection: Connection;

    beforeAll(async () => {
        connection = await createConnection();
        await connection.dropDatabase();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it('Should fail to create surveyUser with non existing email', async (done) => {
        const response = await request(app).post('/sendMail').send({
            email: 'name@email.com',
            survey_id: 'some_uuid'
        });
        expect(response.status).toBe(400);
        done();
    });

    it('Should create a surveyUser', async (done) => {
        const user = await request(app).post('/users').send({ name: 'name', email: 'email' });
        const survey = await request(app).post('/surveys').send({ title: 'title', description: 'text' });

        const response = await request(app).post('/sendMail').send({
            email: user.body.email,
            survey_id: survey.body.id
        });
        expect(response.status).toBe(201);
        done();
    });
});