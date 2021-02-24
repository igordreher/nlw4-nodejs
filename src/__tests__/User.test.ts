import request from 'supertest';
import { Connection } from 'typeorm';
import app from '../app';
import createConnection from '../database';


describe('User', () => {
    let connection: Connection;

    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.close();
    });

    it('Should create a new user', async (done) => {
        const result = await request(app).post('/users').send({
            email: 'user@email.com',
            name: 'Person'
        });
        expect(result.status).toBe(201);
        done();
    });

    it('Should fail to create new user with existing email', async (done) => {
        const result = await request(app).post('/users').send({
            email: 'user@email.com',
            name: 'Person'
        });
        expect(result.status).toBe(400);
        done();
    });
});