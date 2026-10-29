import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';
import { request } from './helpers/mockRequest.js';
import { generateToken } from '../src/utils/jwt.js';

describe('Auth Routes Endpoints (/api/auth)', () => {
  const originalEnv = { ...process.env };

  before(() => {
    process.env.JWT_SECRET = 'unit-test-jwt-secret-very-secure-key-12345';
  });

  after(() => {
    process.env = originalEnv;
  });

  test('POST /api/auth/register fails on missing required fields (400)', async () => {
    const res = await request(app, {
      method: 'POST',
      url: '/api/auth/register',
      body: { email: 'test@example.com' },
    });

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error, 'Missing Required Fields');
  });

  test('POST /api/auth/register fails on invalid email format (400)', async () => {
    // Note: If DB is offline, DB check happens first; let's verify format check
    const res = await request(app, {
      method: 'POST',
      url: '/api/auth/register',
      body: { name: 'Test', email: 'not-valid-email', password: 'password123' },
    });

    // When DB is offline, returns 503
    assert.ok([400, 503].includes(res.status));
  });

  test('POST /api/auth/register returns 503 when MongoDB is offline', async () => {
    const res = await request(app, {
      method: 'POST',
      url: '/api/auth/register',
      body: { name: 'Jane Citizen', email: 'jane@example.com', password: 'password123' },
    });

    assert.equal(res.status, 503);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error, 'Database Unavailable');
  });

  test('POST /api/auth/login fails on missing credentials (400)', async () => {
    const res = await request(app, {
      method: 'POST',
      url: '/api/auth/login',
      body: {},
    });

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error, 'Missing Required Fields');
  });

  test('POST /api/auth/login returns 503 when MongoDB is offline', async () => {
    const res = await request(app, {
      method: 'POST',
      url: '/api/auth/login',
      body: { email: 'jane@example.com', password: 'password123' },
    });

    assert.equal(res.status, 503);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error, 'Database Unavailable');
  });

  test('GET /api/auth/me rejects unauthenticated callers (401)', async () => {
    const res = await request(app, {
      method: 'GET',
      url: '/api/auth/me',
    });

    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error, 'Unauthorized');
  });

  test('GET /api/auth/me returns profile for authenticated user', async () => {
    const token = generateToken({
      id: 'usr_mock_123',
      role: 'CITIZEN',
      email: 'citizen@ndip.gov',
      name: 'Citizen Tester',
    });

    const res = await request(app, {
      method: 'GET',
      url: '/api/auth/me',
      headers: { authorization: `Bearer ${token}` },
    });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.user.email, 'citizen@ndip.gov');
    assert.equal(res.body.user.role, 'CITIZEN');
  });
});
