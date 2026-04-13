const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { ApiError } = require('./ApiError');
const { logger } = require('../utils/logger');
const { prisma } = require('../prisma');

// JWT Authentication Middleware
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError('Authentication token missing', 401, 'UNAUTHORIZED');
    }

    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      include: { role: true }
    });

    if (!user) {
      throw new ApiError('User no longer exists', 401, 'UNAUTHORIZED');
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role.name
    };

    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      next(new ApiError('Invalid or expired token', 401, 'UNAUTHORIZED'));
    } else {
      next(err);
    }
  }
};

// Role-Based Access Control Middleware
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      logger.warn(`Unauthorized access attempt by user ${req.user?.id} to ${req.originalUrl}`);
      return next(new ApiError('Forbidden: Access denied', 403, 'FORBIDDEN'));
    }
    next();
  };
};

// Rate Limiting (Standard)
const standardLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { message: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate Limiting (Sensitive - Auth)
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 login/register attempts per hour
  message: { message: 'Brute force protection: Too many attempts. Please try again in an hour.' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  authenticate,
  authorize,
  standardLimiter,
  authLimiter
};
