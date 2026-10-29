import crypto from 'crypto';
import { verifyToken, getInternalServiceKey } from '../utils/jwt.js';
import User from '../models/User.js';
import { getDatabaseStatus } from '../config/db.js';

/**
 * Timing-safe string comparison to protect against timing attacks.
 */
const safeCompare = (a, b) => {
  if (typeof a !== 'string' || typeof b !== 'string') {
    return false;
  }
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
};

/**
 * Mandatory authentication middleware for protected user endpoints.
 * Verifies Bearer JWT token, validates fail-closed secret, and attaches req.user.
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Authentication token is required. Format: Bearer <token>',
      });
    }

    const token = authHeader.split(' ')[1];
    let decoded;

    try {
      decoded = verifyToken(token);
    } catch (err) {
      if (err.message && err.message.includes('Operation failed closed')) {
        return res.status(500).json({
          success: false,
          error: 'Server Misconfiguration',
          message: 'Authentication service is misconfigured and failing closed.',
        });
      }
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Invalid, malformed, or expired authentication token.',
      });
    }

    // If database is connected, verify user still exists and is active
    const { isConnected } = getDatabaseStatus();
    if (isConnected) {
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          message: 'The user belonging to this token no longer exists.',
        });
      }
      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          error: 'Forbidden',
          message: 'User account has been deactivated.',
        });
      }
      req.user = user;
    } else {
      // Offline fallback: use decoded JWT claims
      req.user = {
        _id: decoded.id,
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        name: decoded.name || 'User',
      };
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Optional authentication middleware.
 * If a valid Bearer token is present, populates req.user.
 * If no token is provided, proceeds as anonymous without failing.
 */
export const optionalAuthenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = verifyToken(token);
      const { isConnected } = getDatabaseStatus();
      if (isConnected) {
        const user = await User.findById(decoded.id).select('-password');
        if (user && user.isActive) {
          req.user = user;
        } else {
          req.user = null;
        }
      } else {
        req.user = {
          _id: decoded.id,
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
        };
      }
    } catch {
      // Invalid or expired token on optional route: treat as anonymous
      req.user = null;
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Role-Based Access Control (RBAC) middleware generator.
 * Restricts access to callers with at least one of the specified roles.
 */
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Authentication is required before checking role authorization.',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: `Access denied. Requires one of the following roles: [${roles.join(', ')}].`,
      });
    }

    next();
  };
};

/**
 * Dual authentication middleware for AI Disaster Risk Assessment ingestion (POST /api/assessment).
 * Accepts:
 *   1. An internal service secret header: `x-internal-service-key` matching INTERNAL_SERVICE_KEY, OR
 *   2. An authenticated User with ADMIN role via `Authorization: Bearer <token>`.
 * Fails closed if secrets are missing or credentials are invalid.
 */
export const authenticateInternalOrAdmin = async (req, res, next) => {
  const serviceKeyHeader = req.headers['x-internal-service-key'];
  const authHeader = req.headers.authorization;

  // 1. Check Internal Microservice Key
  if (serviceKeyHeader) {
    let configuredKey;
    try {
      configuredKey = getInternalServiceKey();
    } catch {
      return res.status(500).json({
        success: false,
        error: 'Server Misconfiguration',
        message: 'Internal service authentication is unconfigured and failing closed.',
      });
    }

    if (safeCompare(serviceKeyHeader, configuredKey)) {
      req.caller = { type: 'internal_service', name: 'ai-risk-assessment-engine' };
      return next();
    }

    // If key provided but invalid, reject immediately
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Invalid internal service key provided.',
    });
  }

  // 2. Check Admin JWT Token
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    let decoded;

    try {
      decoded = verifyToken(token);
    } catch (err) {
      if (err.message && err.message.includes('Operation failed closed')) {
        return res.status(500).json({
          success: false,
          error: 'Server Misconfiguration',
          message: 'Authentication service is misconfigured and failing closed.',
        });
      }
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Invalid, malformed, or expired authentication token.',
      });
    }

    if (decoded.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'Disaster assessment ingestion requires ADMIN role or authorized internal service.',
      });
    }

    req.caller = { type: 'admin_user', id: decoded.id, email: decoded.email };
    req.user = decoded;
    return next();
  }

  // 3. Neither valid header present: fail closed
  return res.status(401).json({
    success: false,
    error: 'Unauthorized',
    message: 'Assessment ingestion requires either a valid internal service key or an ADMIN Bearer token.',
  });
};
