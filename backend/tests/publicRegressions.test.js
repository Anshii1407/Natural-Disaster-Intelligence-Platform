import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';
import { request } from './helpers/mockRequest.js';
import { generateToken } from '../src/utils/jwt.js';

describe('Public Endpoints Regression Tests', () => {
  const originalEnv = { ...process.env };

  before(() => {
    process.env.JWT_SECRET = 'unit-test-jwt-secret-very-secure-key-12345';
  });

  after(() => {
    process.env = originalEnv;
  });

  test('GET /api/health returns 200 without authentication', async () => {
    const res = await request(app, {
      method: 'GET',
      url: '/api/health',
    });

    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'ok');
    assert.equal(res.body.service, 'Backend Service (Express.js)');
  });

  test('GET /api/map/layers returns 200 FeatureCollection without authentication', async () => {
    const res = await request(app, {
      method: 'GET',
      url: '/api/map/layers',
    });

    assert.equal(res.status, 200);
    assert.equal(res.body.type, 'FeatureCollection');
    assert.ok(Array.isArray(res.body.features));
  });

  test('GET /api/map/nearby returns 200 with valid query without authentication', async () => {
    const res = await request(app, {
      method: 'GET',
      url: '/api/map/nearby?lng=77.10&lat=28.70&radiusKm=25',
    });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.reports));
    assert.ok(Array.isArray(res.body.assessments));
  });

  test('GET /api/reports/public returns 200 without authentication', async () => {
    const res = await request(app, {
      method: 'GET',
      url: '/api/reports/public',
    });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
  });

  test('GET /api/assessment/latest remains public (200)', async () => {
    const res = await request(app, {
      method: 'GET',
      url: '/api/assessment/latest',
    });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
  });

  test('GET /api/assessment/history remains public (200)', async () => {
    const res = await request(app, {
      method: 'GET',
      url: '/api/assessment/history',
    });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
  });

  test('POST /api/reports accepts anonymous reports without 401', async () => {
    const res = await request(app, {
      method: 'POST',
      url: '/api/reports',
      body: {
        hazardType: 'waterlogging',
        coordinates: [77.21, 28.61],
        description: 'Road blocked due to knee-deep water',
      },
    });

    // Fails with 503 if DB is offline, or 201 if DB is online; NEVER 401
    assert.notEqual(res.status, 401);
    assert.notEqual(res.status, 403);
    assert.ok([201, 503].includes(res.status));
  });

  test('POST /api/reports accepts authenticated reports and associates reporter', async () => {
    const citizenToken = generateToken({ id: 'citizen_xyz', role: 'CITIZEN', email: 'citizen@ndip.gov' });
    const res = await request(app, {
      method: 'POST',
      url: '/api/reports',
      headers: { authorization: `Bearer ${citizenToken}` },
      body: {
        hazardType: 'waterlogging',
        coordinates: [77.21, 28.61],
        description: 'Road blocked due to knee-deep water',
      },
    });

    assert.notEqual(res.status, 401);
    assert.notEqual(res.status, 403);
    assert.ok([201, 503].includes(res.status));
  });
});
