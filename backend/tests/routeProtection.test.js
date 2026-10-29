import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';
import { request } from './helpers/mockRequest.js';
import { generateToken } from '../src/utils/jwt.js';

describe('Route Protection & RBAC Integration Tests', () => {
  const originalEnv = { ...process.env };

  before(() => {
    process.env.JWT_SECRET = 'unit-test-jwt-secret-very-secure-key-12345';
    process.env.INTERNAL_SERVICE_KEY = 'unit-test-ai-service-secret-xyz';
  });

  after(() => {
    process.env = originalEnv;
  });

  describe('Government Dashboard Route Protection (/api/dashboard/*)', () => {
    test('GET /api/dashboard/summary rejects unauthenticated caller (401)', async () => {
      const res = await request(app, {
        method: 'GET',
        url: '/api/dashboard/summary',
      });

      assert.equal(res.status, 401);
      assert.equal(res.body.success, false);
      assert.equal(res.body.error, 'Unauthorized');
    });

    test('GET /api/dashboard/summary rejects CITIZEN role (403)', async () => {
      const citizenToken = generateToken({ id: 'c1', role: 'CITIZEN', email: 'citizen@ndip.gov' });
      const res = await request(app, {
        method: 'GET',
        url: '/api/dashboard/summary',
        headers: { authorization: `Bearer ${citizenToken}` },
      });

      assert.equal(res.status, 403);
      assert.equal(res.body.success, false);
      assert.equal(res.body.error, 'Forbidden');
    });

    test('GET /api/dashboard/summary allows ADMIN role (200)', async () => {
      const adminToken = generateToken({ id: 'a1', role: 'ADMIN', email: 'admin@ndip.gov' });
      const res = await request(app, {
        method: 'GET',
        url: '/api/dashboard/summary',
        headers: { authorization: `Bearer ${adminToken}` },
      });

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.ok(res.body.summary);
    });

    test('GET /api/dashboard/reports rejects unauthenticated caller (401)', async () => {
      const res = await request(app, {
        method: 'GET',
        url: '/api/dashboard/reports',
      });

      assert.equal(res.status, 401);
    });

    test('POST /api/dashboard/alerts rejects unauthenticated caller (401)', async () => {
      const res = await request(app, {
        method: 'POST',
        url: '/api/dashboard/alerts',
        body: { title: 'Emergency Flood Alert' },
      });

      assert.equal(res.status, 401);
    });

    test('PATCH /api/dashboard/reports/:id/status rejects unauthenticated caller (401)', async () => {
      const res = await request(app, {
        method: 'PATCH',
        url: '/api/dashboard/reports/64a1b2c3d4e5f6a7b8c9d0e1/status',
        body: { status: 'verified' },
      });

      assert.equal(res.status, 401);
    });
  });

  describe('Disaster Assessment Ingestion Route Protection (POST /api/assessment)', () => {
    test('POST /api/assessment rejects unauthenticated caller (401)', async () => {
      const res = await request(app, {
        method: 'POST',
        url: '/api/assessment',
        body: { disasterType: 'flood', region: 'Assam', coordinates: [92.5, 26.2], riskLevel: 'High' },
      });

      assert.equal(res.status, 401);
      assert.equal(res.body.success, false);
      assert.equal(res.body.error, 'Unauthorized');
    });

    test('POST /api/assessment rejects CITIZEN role token (403)', async () => {
      const citizenToken = generateToken({ id: 'c1', role: 'CITIZEN', email: 'citizen@ndip.gov' });
      const res = await request(app, {
        method: 'POST',
        url: '/api/assessment',
        headers: { authorization: `Bearer ${citizenToken}` },
        body: { disasterType: 'flood', region: 'Assam', coordinates: [92.5, 26.2], riskLevel: 'High' },
      });

      assert.equal(res.status, 403);
      assert.equal(res.body.success, false);
      assert.equal(res.body.error, 'Forbidden');
    });

    test('POST /api/assessment accepts valid internal service key', async () => {
      const res = await request(app, {
        method: 'POST',
        url: '/api/assessment',
        headers: { 'x-internal-service-key': 'unit-test-ai-service-secret-xyz' },
        body: { disasterType: 'flood', region: 'Assam', coordinates: [92.5, 26.2], riskLevel: 'High' },
      });

      // Passed auth layer: reaches controller which returns 503 if DB offline or 201 if DB online
      assert.ok([201, 503].includes(res.status));
      assert.notEqual(res.status, 401);
      assert.notEqual(res.status, 403);
    });

    test('POST /api/assessment accepts valid ADMIN Bearer token', async () => {
      const adminToken = generateToken({ id: 'a1', role: 'ADMIN', email: 'admin@ndip.gov' });
      const res = await request(app, {
        method: 'POST',
        url: '/api/assessment',
        headers: { authorization: `Bearer ${adminToken}` },
        body: { disasterType: 'flood', region: 'Assam', coordinates: [92.5, 26.2], riskLevel: 'High' },
      });

      // Passed auth layer
      assert.ok([201, 503].includes(res.status));
      assert.notEqual(res.status, 401);
      assert.notEqual(res.status, 403);
    });

    test('POST /api/assessment fails closed if service key is wrong (401)', async () => {
      const res = await request(app, {
        method: 'POST',
        url: '/api/assessment',
        headers: { 'x-internal-service-key': 'attacker-forged-key' },
        body: { disasterType: 'flood', region: 'Assam', coordinates: [92.5, 26.2], riskLevel: 'High' },
      });

      assert.equal(res.status, 401);
    });
  });
});
