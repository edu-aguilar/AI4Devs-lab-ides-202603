import request from 'supertest';
import { createApp } from '../app';

const app = createApp();

describe('GET /', () => {
    it('responds with Hello World!', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Hola LTI!');
    });
});
