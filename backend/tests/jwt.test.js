import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { generateToken, verifyToken, getJwtSecret, getInternalServiceKey } from '../src/utils/jwt.js';

describe('JWT Utilities & Fail-Closed Secret Validation', () => {
  const originalEnv = { ...process.env };

  before(() => {
    process.env.JWT_SECRET = 'test-secret-key-for-unit-tests-12345';
    process.env.INTERNAL_SERVICE_KEY = 'test-internal-ai-service-key-xyz';
  });

  after(() => {
    process.env = originalEnv;
  });

  test('getJwtSecret returns secret when configured', () => {
    assert.equal(getJwtSecret(), 'test-secret-key-for-unit-tests-12345');
  });

  test('getJwtSecret throws and fails closed when secret is empty', () => {
    process.env.JWT_SECRET = '';
    assert.throws(() => getJwtSecret(), /JWT_SECRET is not configured\. Operation failed closed\./);
    process.env.JWT_SECRET = 'test-secret-key-for-unit-tests-12345';
  });

  test('getInternalServiceKey returns key when configured', () => {
    assert.equal(getInternalServiceKey(), 'test-internal-ai-service-key-xyz');
  });

  test('getInternalServiceKey throws and fails closed when key is empty', () => {
    process.env.INTERNAL_SERVICE_KEY = '';
    assert.throws(() => getInternalServiceKey(), /INTERNAL_SERVICE_KEY is not configured\. Operation failed closed\./);
    process.env.INTERNAL_SERVICE_KEY = 'test-internal-ai-service-key-xyz';
  });

  test('generateToken and verifyToken correctly sign and decode payload', () => {
    const payload = {
      id: 'user_123456789012345678901234',
      role: 'CITIZEN',
      email: 'citizen@example.com',
    };

    const token = generateToken(payload);
    assert.ok(typeof token === 'string' && token.length > 20);

    const decoded = verifyToken(token);
    assert.equal(decoded.id, payload.id);
    assert.equal(decoded.role, 'CITIZEN');
    assert.equal(decoded.email, 'citizen@example.com');
  });

  test('verifyToken throws on tampered token', () => {
    const payload = { id: 'user_123', role: 'ADMIN', email: 'admin@ndip.gov' };
    const token = generateToken(payload);
    const tampered = token.slice(0, -5) + 'abcde';

    assert.throws(() => verifyToken(tampered));
  });

  test('generateToken fails closed when JWT_SECRET is unset', () => {
    delete process.env.JWT_SECRET;
    assert.throws(() => generateToken({ id: '1', role: 'CITIZEN', email: 'a@b.com' }), /JWT_SECRET is not configured/);
    process.env.JWT_SECRET = 'test-secret-key-for-unit-tests-12345';
  });
});
