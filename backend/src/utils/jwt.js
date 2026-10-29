import jwt from 'jsonwebtoken';

/**
 * Retrieve JWT secret from environment.
 * Enforces fail-closed safety by throwing if the secret is undefined or empty.
 */
export const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.trim() === '') {
    throw new Error('JWT_SECRET is not configured. Operation failed closed.');
  }
  return secret;
};

/**
 * Retrieve Internal Microservice Key from environment.
 * Enforces fail-closed safety by throwing if the key is undefined or empty.
 */
export const getInternalServiceKey = () => {
  const key = process.env.INTERNAL_SERVICE_KEY;
  if (!key || key.trim() === '') {
    throw new Error('INTERNAL_SERVICE_KEY is not configured. Operation failed closed.');
  }
  return key;
};

/**
 * Generate a signed JWT token containing user identity and role.
 *
 * @param {Object} payload - { id, role, email }
 * @param {string} [expiresIn] - Optional custom expiry
 * @returns {string} Signed JWT
 */
export const generateToken = (payload, expiresIn) => {
  const secret = getJwtSecret();
  const tokenExpiresIn = expiresIn || process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign(
    {
      id: payload.id,
      role: payload.role,
      email: payload.email,
    },
    secret,
    { expiresIn: tokenExpiresIn }
  );
};

/**
 * Verify and decode a JWT token.
 * Throws if token is invalid, expired, or if JWT_SECRET is not set.
 *
 * @param {string} token
 * @returns {Object} Decoded payload
 */
export const verifyToken = (token) => {
  const secret = getJwtSecret();
  return jwt.verify(token, secret);
};
