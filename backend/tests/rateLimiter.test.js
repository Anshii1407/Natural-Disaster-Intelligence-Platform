import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';
import { request } from './helpers/mockRequest.js';
import { createAuthLimiter } from '../src/middleware/rateLimiter.js';
import express from 'express';

describe('Authentication Rate Limiting Security Tests', () => {
  const originalEnv = { ...process.env };

  before(() => {
    process.env.JWT_SECRET = 'unit-test-jwt-secret-very-secure-key-12345';
  });

  after(() => {
    process.env = originalEnv;
  });

  describe('createAuthLimiter unit tests', () => {
    test('blocks requests when custom limit is exceeded (HTTP 429)', async () => {
      const testApp = express();
      testApp.use(express.json());
      const testLimiter = createAuthLimiter({ windowMs: 60 * 1000, limit: 3 });

      testApp.post('/test-limit', testLimiter, (req, res) => {
        res.status(200).json({ success: true, message: 'Allowed' });
      });

      const clientIp = '203.0.113.195';

      // First 3 requests should pass through
      for (let i = 1; i <= 3; i++) {
        const res = await request(testApp, {
          method: 'POST',
          url: '/test-limit',
          headers: { 'x-forwarded-for': clientIp },
        });
        assert.equal(res.status, 200, `Request ${i} should have been allowed`);
        assert.equal(res.body.success, true);
      }

      // 4th request must be rate-limited (HTTP 429)
      const blockedRes = await request(testApp, {
        method: 'POST',
        url: '/test-limit',
        headers: { 'x-forwarded-for': clientIp },
      });

      assert.equal(blockedRes.status, 429);
      assert.equal(blockedRes.body.success, false);
      assert.equal(blockedRes.body.error, 'Too Many Requests');
      assert.ok(blockedRes.body.message.includes('Too many authentication attempts'));
    });

    test('rate limit is partitioned by client IP', async () => {
      const testApp = express();
      testApp.use(express.json());
      const testLimiter = createAuthLimiter({ windowMs: 60 * 1000, limit: 2 });

      testApp.post('/test-partition', testLimiter, (req, res) => {
        res.status(200).json({ success: true });
      });

      const ipA = '198.51.100.10';
      const ipB = '198.51.100.20';

      // Exhaust IP A
      await request(testApp, { method: 'POST', url: '/test-partition', headers: { 'x-forwarded-for': ipA } });
      await request(testApp, { method: 'POST', url: '/test-partition', headers: { 'x-forwarded-for': ipA } });
      const blockedA = await request(testApp, { method: 'POST', url: '/test-partition', headers: { 'x-forwarded-for': ipA } });
      assert.equal(blockedA.status, 429);

      // IP B should still be allowed
      const resB = await request(testApp, { method: 'POST', url: '/test-partition', headers: { 'x-forwarded-for': ipB } });
      assert.equal(resB.status, 200);
    });
  });

  describe('Route-level rate limit integration on /api/auth', () => {
    test('POST /api/auth/login returns 429 after exceeding limit from same IP', async () => {
      const clientIp = '192.0.2.77';

      // Standard limit is 10 requests per 15 min; send 11 requests from clientIp
      let lastRes;
      for (let i = 1; i <= 11; i++) {
        lastRes = await request(app, {
          method: 'POST',
          url: '/api/auth/login',
          headers: { 'x-forwarded-for': clientIp },
          body: { email: 'brute@example.com', password: 'wrongpassword' },
        });

        if (i <= 10) {
          // While within limit, returns 400 (validation) or 503 (offline DB) or 401 (invalid creds)
          assert.notEqual(lastRes.status, 429, `Attempt ${i} should not be rate-limited yet`);
        }
      }

      // 11th request must receive 429
      assert.equal(lastRes.status, 429);
      assert.equal(lastRes.body.success, false);
      assert.equal(lastRes.body.error, 'Too Many Requests');
    });

    test('POST /api/auth/register returns 429 after exceeding limit from same IP', async () => {
      const clientIp = '192.0.2.88';

      let lastRes;
      for (let i = 1; i <= 11; i++) {
        lastRes = await request(app, {
          method: 'POST',
          url: '/api/auth/register',
          headers: { 'x-forwarded-for': clientIp },
          body: { name: 'User', email: `user${i}@example.com`, password: 'password123' },
        });

        if (i <= 10) {
          assert.notEqual(lastRes.status, 429, `Attempt ${i} should not be rate-limited yet`);
        }
      }

      assert.equal(lastRes.status, 429);
      assert.equal(lastRes.body.success, false);
      assert.equal(lastRes.body.error, 'Too Many Requests');
    });

    test('Public routes (Map, Health, Reports) are NOT blocked by auth rate limiting', async () => {
      const clientIp = '192.0.2.77'; // Same IP that was exhausted on login

      // Health endpoint
      const healthRes = await request(app, {
        method: 'GET',
        url: '/api/health',
        headers: { 'x-forwarded-for': clientIp },
      });
      assert.equal(healthRes.status, 200);

      // Public map layers
      const mapRes = await request(app, {
        method: 'GET',
        url: '/api/map/layers',
        headers: { 'x-forwarded-for': clientIp },
      });
      assert.equal(mapRes.status, 200);

      // Public reports stream
      const reportsRes = await request(app, {
        method: 'GET',
        url: '/api/reports/public',
        headers: { 'x-forwarded-for': clientIp },
      });
      assert.equal(reportsRes.status, 200);

      // Citizen report submission
      const citizenReportRes = await request(app, {
        method: 'POST',
        url: '/api/reports',
        headers: { 'x-forwarded-for': clientIp },
        body: { hazardType: 'flood', coordinates: [77.2, 28.6], description: 'River overflow' },
      });
      assert.notEqual(citizenReportRes.status, 429);
    });
  });
});
