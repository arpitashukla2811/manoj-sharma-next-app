import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import Admin from '../models/admin.model.js';

// Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Basic authentication middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '') || 
                  req.cookies?.token ||
                  req.query?.token;
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    const decoded = verifyToken(token);
    
    // Check if user exists and is active
    const user = await User.findById(decoded.id).select('-password');
    if (!user || !user.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found or account deactivated.' 
      });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token.' 
    });
  }
};

// Admin authentication middleware
const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '') || 
                  req.cookies?.adminToken ||
                  req.query?.token;
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    const decoded = verifyToken(token);
    
    // Check if admin exists - using 'id' from token (as generated in admin controller)
    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) {
      return res.status(401).json({ 
        success: false, 
        message: 'Admin not found.' 
      });
    }

    req.admin = admin;
    req.user = admin; // Also set req.user for compatibility
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token.' 
    });
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. ${req.user.role} role is not authorized.`
      });
    }

    next();
  };
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '') || 
                  req.cookies?.token ||
                  req.query?.token;
    
    if (token) {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.userId).select('-password');
      if (user && user.isActive) {
        req.user = user;
        req.token = token;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

// Rate limiting middleware (basic implementation)
const rateLimitMap = new Map();

const rateLimit = (windowMs = 15 * 60 * 1000, max = 100) => {
  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;

    if (!rateLimitMap.has(key)) {
      rateLimitMap.set(key, []);
    }

    const requests = rateLimitMap.get(key);
    const validRequests = requests.filter(time => time > windowStart);
    
    if (validRequests.length >= max) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.'
      });
    }

    validRequests.push(now);
    rateLimitMap.set(key, validRequests);
    next();
  };
};

// CSRF protection middleware
const csrfProtection = (req, res, next) => {
  if (req.method === 'GET') {
    return next();
  }

  const csrfToken = req.header('X-CSRF-Token') || req.body._csrf;
  const sessionToken = req.session?.csrfToken;

  if (!csrfToken || !sessionToken || csrfToken !== sessionToken) {
    return res.status(403).json({
      success: false,
      message: 'CSRF token validation failed.'
    });
  }

  next();
};

// Session middleware
const sessionAuth = async (req, res, next) => {
  try {
    const sessionId = req.cookies?.sessionId || req.header('X-Session-ID');
    
    if (!sessionId) {
      return res.status(401).json({
        success: false,
        message: 'No session found.'
      });
    }

    // Here you would typically validate the session against your session store
    // For now, we'll use a simple approach
    const user = await User.findOne({ 
      'sessions.sessionId': sessionId,
      'sessions.expiresAt': { $gt: new Date() }
    }).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Session validation error.'
    });
  }
};

// Export all middleware functions
export { 
  auth, 
  adminAuth, 
  authorize, 
  optionalAuth, 
  rateLimit, 
  csrfProtection, 
  sessionAuth,
  generateToken,
  verifyToken
};