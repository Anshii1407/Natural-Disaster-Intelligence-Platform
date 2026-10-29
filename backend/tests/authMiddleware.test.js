import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import {
  authenticate,
  optionalAuthenticate,
  requireRole,
  authenticateInternalOrAdmin,
} from '../src/middleware/auth.js';
import { generateToken } from '../src/utils/jwt.js';

describe('Auth & RBAC Middleware Unit Tests', () => {
  const originalEnv = { ...process.env };

  before(() => {
    process.env.JWT_SECRET = 'unit-test-jwt-secret-very-secure-key-12345';
    process.env.INTERNAL_SERVICE_KEY = 'unit-test-ai-service-secret-xyz';
  });

  after(() => {
    process.env = originalEnv;
  });

  // Helper to mock Express req, res, next
  const createMockContext = (headers = {}, body = {}) => {
    const req = {
      headers,
      body,
      user: null,
      caller: null,
    };

    let responseData = null;
    let statusCode = 200;

    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(data) {
        responseData = data;
        return this;
      },
      getStatusCode: () => statusCode,
      getData: () => responseData,
    };

    let nextCalled = false;
    let nextError = null;
    const next = (err) => {
      nextCalled = true;
      if (err) nextError = err;
    };

    return { req, res, next, getStatus: () => statusCode, getData: () => responseData, wasNextCalled: () => nextCalled, getError: () => nextError };
  };

  describe('authenticate middleware', () => {
    test('rejects request without authorization header (401)', async () => {
      const { req, res, next, getStatus, getData, wasNextCalled } = createMockContext({});
      await authenticate(req, res, next);

      assert.equal(getStatus(), 401);
      assert.equal(getData().success, false);
      assert.equal(wasNextCalled(), false);
    });

    test('rejects malformed authorization header without Bearer (401)', async () => {
      const { req, res, next, getStatus, wasNextCalled } = createMockContext({
        authorization: 'Basic dXNlcjpwYXNz',
      });
      await authenticate(req, res, next);

      assert.equal(getStatus(), 401);
      assert.equal(wasNextCalled(), false);
    });

    test('rejects forged/invalid Bearer token (401)', async () => {
      const { req, res, next, getStatus, wasNextCalled } = createMockContext({
        authorization: 'Bearer invalid.fake.token',
      });
      await authenticate(req, res, next);

      assert.equal(getStatus(), 401);
      assert.equal(wasNextCalled(), false);
    });

    test('accepts valid Bearer token and attaches req.user', async () => {
      const token = generateToken({ id: 'user_abc', role: 'CITIZEN', email: 'citizen@ndip.gov' });
      const { req, res, next, wasNextCalled } = createMockContext({
        authorization: `Bearer ${token}`,
      });

      await authenticate(req, res, next);

      assert.equal(wasNextCalled(), true);
      assert.ok(req.user);
      assert.equal(req.user.id, 'user_abc');
      assert.equal(req.user.role, 'CITIZEN');
    });

    test('fails closed with 500 if JWT_SECRET is unset in environment', async () => {
      delete process.env.JWT_SECRET;
      const { req, res, next, getStatus, getData } = createMockContext({
        authorization: 'Bearer dummy.token.here',
      });

      await authenticate(req, res, next);
      assert.equal(getStatus(), 500);
      assert.equal(getData().error, 'Server Misconfiguration');

      process.env.JWT_SECRET = 'unit-test-jwt-secret-very-secure-key-12345';
    });
  });

  describe('optionalAuthenticate middleware', () => {
    test('proceeds anonymously when no authorization header is provided', async () => {
      const { req, res, next, wasNextCalled } = createMockContext({});
      await optionalAuthenticate(req, res, next);

      assert.equal(wasNextCalled(), true);
      assert.equal(req.user, null);
    });

    test('attaches req.user when valid token is provided', async () => {
      const token = generateToken({ id: 'user_opt', role: 'CITIZEN', email: 'opt@ndip.gov' });
      const { req, res, next, wasNextCalled } = createMockContext({
        authorization: `Bearer ${token}`,
      });

      await optionalAuthenticate(req, res, next);

      assert.equal(wasNextCalled(), true);
      assert.ok(req.user);
      assert.equal(req.user.id, 'user_opt');
    });

    test('falls back to anonymous if provided token is invalid without failing', async () => {
      const { req, res, next, wasNextCalled } = createMockContext({
        authorization: 'Bearer corrupted.token',
      });

      await optionalAuthenticate(req, res, next);

      assert.equal(wasNextCalled(), true);
      assert.equal(req.user, null);
    });
  });

  describe('requireRole middleware', () => {
    test('denies access if req.user is missing (401)', () => {
      const { req, res, next, getStatus, wasNextCalled } = createMockContext();
      requireRole('ADMIN')(req, res, next);

      assert.equal(getStatus(), 401);
      assert.equal(wasNextCalled(), false);
    });

    test('denies access if req.user role is not authorized (403)', () => {
      const { req, res, next, getStatus, getData, wasNextCalled } = createMockContext();
      req.user = { id: '1', role: 'CITIZEN' };
      requireRole('ADMIN')(req, res, next);

      assert.equal(getStatus(), 403);
      assert.equal(getData().success, false);
      assert.equal(wasNextCalled(), false);
    });

    test('grants access when req.user has the required role', () => {
      const { req, res, next, wasNextCalled } = createMockContext();
      req.user = { id: 'admin_1', role: 'ADMIN' };
      requireRole('ADMIN')(req, res, next);

      assert.equal(wasNextCalled(), true);
    });
  });

  describe('authenticateInternalOrAdmin middleware', () => {
    test('rejects unauthenticated request (401)', async () => {
      const { req, res, next, getStatus, wasNextCalled } = createMockContext({});
      await authenticateInternalOrAdmin(req, res, next);

      assert.equal(getStatus(), 401);
      assert.equal(wasNextCalled(), false);
    });

    test('accepts valid x-internal-service-key', async () => {
      const { req, res, next, wasNextCalled } = createMockContext({
        'x-internal-service-key': 'unit-test-ai-service-secret-xyz',
      });

      await authenticateInternalOrAdmin(req, res, next);

      assert.equal(wasNextCalled(), true);
      assert.ok(req.caller);
      assert.equal(req.caller.type, 'internal_service');
    });

    test('rejects invalid x-internal-service-key (401)', async () => {
      const { req, res, next, getStatus, wasNextCalled } = createMockContext({
        'x-internal-service-key': 'wrong-key-attempt',
      });

      await authenticateInternalOrAdmin(req, res, next);

      assert.equal(getStatus(), 401);
      assert.equal(wasNextCalled(), false);
    });

    test('accepts valid ADMIN Bearer token', async () => {
      const token = generateToken({ id: 'admin_1', role: 'ADMIN', email: 'admin@ndip.gov' });
      const { req, res, next, wasNextCalled } = createMockContext({
        authorization: `Bearer ${token}`,
      });

      await authenticateInternalOrAdmin(req, res, next);

      assert.equal(wasNextCalled(), true);
      assert.ok(req.caller);
      assert.equal(req.caller.type, 'admin_user');
      assert.equal(req.user.role, 'ADMIN');
    });

    test('rejects CITIZEN Bearer token on assessment ingest (403)', async () => {
      const token = generateToken({ id: 'citizen_1', role: 'CITIZEN', email: 'citizen@ndip.gov' });
      const { req, res, next, getStatus, wasNextCalled } = createMockContext({
        authorization: `Bearer ${token}`,
      });

      await authenticateInternalOrAdmin(req, res, next);

      assert.equal(getStatus(), 403);
      assert.equal(wasNextCalled(), false);
    });

    test('fails closed with 500 if INTERNAL_SERVICE_KEY is unset and key header is sent', async () => {
      delete process.env.INTERNAL_SERVICE_KEY;
      const { req, res, next, getStatus, getData } = createMockContext({
        'x-internal-service-key': 'some-key',
      });

      await authenticateInternalOrAdmin(req, res, next);

      assert.equal(getStatus(), 500);
      assert.equal(getData().error, 'Server Misconfiguration');

      process.env.INTERNAL_SERVICE_KEY = 'unit-test-ai-service-secret-xyz';
    });
  });
});
