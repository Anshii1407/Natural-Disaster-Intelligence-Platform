import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { getDatabaseStatus } from '../config/db.js';

/**
 * Public Citizen Registration
 * SECURITY RULE: Public registration creates CITIZEN accounts only.
 * Any role parameter supplied in req.body is strictly overridden to 'CITIZEN'.
 */
export const register = async (req, res, next) => {
  try {
    const { isConnected } = getDatabaseStatus();
    if (!isConnected) {
      return res.status(503).json({
        success: false,
        error: 'Database Unavailable',
        message: 'MongoDB Atlas is not connected. User registration is temporarily unavailable.',
      });
    }

    const { name, email, password } = req.body;

    // Basic format checks
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Input',
        message: 'Name must be at least 2 characters long.',
      });
    }

    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid Input',
        message: 'A valid email address is required.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Input',
        message: 'Please provide a valid email format.',
      });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Input',
        message: 'Password must be at least 6 characters long.',
      });
    }

    // Check if email is already registered
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email In Use',
        message: 'An account with this email address already exists.',
      });
    }

    // Strict Role Enforcement: CITIZEN only
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: 'CITIZEN', // Never allow 'ADMIN' from public registration
    });

    const token = generateToken({
      id: user._id.toString(),
      role: user.role,
      email: user.email,
    });

    res.status(201).json({
      success: true,
      message: 'Citizen account registered successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * User Login (CITIZEN or ADMIN)
 * Authenticates user credentials and returns signed JWT token.
 */
export const login = async (req, res, next) => {
  try {
    const { isConnected } = getDatabaseStatus();
    if (!isConnected) {
      return res.status(503).json({
        success: false,
        error: 'Database Unavailable',
        message: 'MongoDB Atlas is not connected. User authentication is temporarily unavailable.',
      });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Missing Credentials',
        message: 'Both email and password are required to log in.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Retrieve user including hashed password field
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid Credentials',
        message: 'Invalid email or password.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'User account has been deactivated. Please contact support.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid Credentials',
        message: 'Invalid email or password.',
      });
    }

    const token = generateToken({
      id: user._id.toString(),
      role: user.role,
      email: user.email,
    });

    res.status(200).json({
      success: true,
      message: 'Authentication successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Authenticated User Profile
 * Returns currently logged-in user profile from req.user
 */
export const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: {
        id: req.user._id || req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
