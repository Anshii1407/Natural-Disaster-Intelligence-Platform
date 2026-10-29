import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import User from '../src/models/User.js';

describe('User Model & Password Hashing Unit Tests', () => {
  test('User schema defaults role to CITIZEN', () => {
    const user = new User({
      name: 'Default Role User',
      email: 'default@ndip.gov',
      password: 'mypassword123',
    });

    assert.equal(user.role, 'CITIZEN');
    assert.equal(user.isActive, true);
  });

  test('User schema accepts ADMIN role', () => {
    const admin = new User({
      name: 'Admin User',
      email: 'admin@ndip.gov',
      password: 'adminpassword123',
      role: 'ADMIN',
    });

    assert.equal(admin.role, 'ADMIN');
  });

  test('User schema rejects invalid roles via validation', async () => {
    const invalid = new User({
      name: 'Invalid Role',
      email: 'invalid@ndip.gov',
      password: 'password123',
      role: 'SUPERUSER',
    });

    let validationError = null;
    try {
      await invalid.validate();
    } catch (err) {
      validationError = err;
    }
    assert.ok(validationError);
    assert.ok(validationError.errors.role);
  });

  test('User schema rejects invalid email formats', async () => {
    const invalid = new User({
      name: 'Bad Email',
      email: 'not-an-email',
      password: 'password123',
    });

    let validationError = null;
    try {
      await invalid.validate();
    } catch (err) {
      validationError = err;
    }
    assert.ok(validationError);
    assert.ok(validationError.errors.email);
  });

  test('Password match function correctly verifies plain passwords against bcrypt hash', async () => {
    const user = new User({
      name: 'Hash Verification User',
      email: 'verify@ndip.gov',
      password: 'plain_password_to_hash',
    });

    // Run pre-save hook manually to simulate persistence
    const salt = await import('bcryptjs').then(b => b.default.genSalt(10));
    user.password = await import('bcryptjs').then(b => b.default.hash(user.password, salt));

    assert.notEqual(user.password, 'plain_password_to_hash');
    assert.ok(user.password.startsWith('$2'));

    const isMatch = await user.matchPassword('plain_password_to_hash');
    assert.equal(isMatch, true);

    const isWrong = await user.matchPassword('wrong_password_attempt');
    assert.equal(isWrong, false);
  });
});
