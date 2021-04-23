const request = require('supertest');
const server = require('./server');
const db = require('../data/dbConfig');
const Users = require('./auth/auth-model');

// Need two tests per endpoint.
// Endpoints are '/api/auth/register, 'api/auth/login', and 'api/jokes'

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

afterAll(async () => {
  await db.destroy();
});

it('process.env.NODE_ENV must be "testing"', () => {
  expect(process.env.NODE_ENV).toBe('testing');
});

describe('Auth Endpoints', () => {
  describe('[POST] register request', () => {
    it('adds a record to the db', async () => {
      await request(server)
        .post('/api/auth/register')
        .send({
          username: 'Nardwuar',
          password: '1234',
        });
      expect(await db('users')).toHaveLength(1);
      expect(await db('users')).not.toHaveLength(46);
    });
    it('responds with the new user', async () => {
      const user = await request(server)
        .post('/api/auth/register')
        .send({
          username: 'KittyCat',
          password: '1234',
        });
      expect(user.body.username).toEqual('KittyCat');
    });
  });
  describe('[POST] login request', () => {
    it('returns a token', async () => {
      // Before we can login we need to add a user to the db
      await request(server)
        .post('/api/auth/register')
        .send({
          username: 'Nardwuar',
          password: '1234',
        });
      const res = await request(server)
        .post('/api/auth/login').send({
          username: 'Nardwuar',
          password: '1234',
        });
      const { token } = res.body;
      expect(token).not.toBeNull();
      expect(token).toBeTruthy();
    });
    it('rejects invalid credentials', async () => {
      const res = await request(server)
        .post('/api/auth/login').send({
          username: 'BadBadMan',
          password: '1234',
        });
      const { status } = res;
      expect(status).toBe(500);
    });
  });
});
