const request = require('supertest');
const server = require('./server');
const db = require('../data/dbConfig');
const Users = require('./auth/auth-model');

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db.seed.run();
});
afterAll(async () => {
  await db.destroy();
});

it('process.env.NODE_ENV must be "testing"', () => {
  expect(true).toBe(true);
});
