/* eslint-disable no-undef */
import HTTPTransport from '../src/core/HTTPTransport';

describe('HTTPTransport tests', () => {
    const http = new HTTPTransport('https://petstore.swagger.io/v2/user', false);

    test('HTTPTransport post', async () => {
        const data = { username: "test", password: "qwerty"};
        const { response } = await http.post('', { data, headers: { 'Content-Type': 'application/json' } });
        expect(JSON.parse(response).code).toBe(200);
    });

    test('HTTPTransport get', async () => {
        const { response } = await http.get('/test', { headers: { 'accept': 'application/json' } });
        expect(JSON.parse(response).username).toBe('test');
    });

    test('HTTPTransport put', async () => {
        const data = { firstName: 'Dmitry', lastName: 'Andreev' };
        const { response } = await http.put('/test', { data, headers: { 'Content-Type': 'application/json' } });
        expect(JSON.parse(response).code).toBe(200);
    });

    test('HTTPTransport delete', async () => {
        const { response } = await http.delete('/test', { headers: { 'Content-Type': 'application/json' } });
        expect(JSON.parse(response).code).toBe(200);
    });
});
