import User from '../models/user.model.js'; // Adjust path to your User model
import jwt from 'jsonwebtoken';

// Helper to generate JWT
const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'secret-jwt-key-2026';
  if (!process.env.JWT_SECRET) {
    console.warn('⚠️  WARNING: JWT_SECRET not set in environment variables. Using default secret.');
  }
  return jwt.sign({ id }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/users/register
 * @access  Public
 */

export const registerUser = async (req, res) => {
  try {
    console.log('Registration request received:', {
      body: { ...req.body, password: req.body.password ? '***' : undefined },
      headers: req.headers,
      timestamp: new Date().toISOString()
    });

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      console.log('Validation failed: Missing required fields');
      return res.status(400).json({ 
        success: false,
        message: 'Please provide all required fields.' 
      });
    }

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase().trim();

    // Check database connection (0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting)
    try {
      const dbState = User.db?.readyState ?? 0;
      if (dbState !== 1) {
        console.error('Database not connected. ReadyState:', dbState);
        return res.status(503).json({ 
          success: false,
          message: 'Database connection unavailable. Please try again later.' 
        });
      }
    } catch (dbCheckError) {
      console.error('Database connection check failed:', dbCheckError.message);
      // Continue anyway, let mongoose handle the error
    }

    // Check if user already exists using the User model
    console.log('Checking if user exists:', normalizedEmail);
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      console.log('User already exists:', normalizedEmail);
      return res.status(400).json({ 
        success: false,
        message: 'User with this email already exists.' 
      });
    }
    
    // Create new user. Password hashing is handled by the model's 'pre-save' hook.
    console.log('Creating new user:', normalizedEmail);
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
    });

    if (user) {
      console.log('User created successfully:', user._id);
      const token = generateToken(user._id);
      res.status(201).json({
        success: true,
        message: 'User registered successfully.',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
        token: token,
      });
    } else {
      console.error('User creation returned null/undefined');
      res.status(400).json({ 
        success: false,
        message: 'Invalid user data.' 
      });
    }
  } catch (error) {
    console.error('Registration error - Full details:', {
      message: error.message,
      name: error.name,
      code: error.code,
      stack: error.stack,
      errors: error.errors
    });
    
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || 'email';
      console.log('Duplicate key error on field:', field);
      return res.status(400).json({ 
        success: false,
        message: `User with this ${field} already exists.` 
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      console.log('Validation errors:', errors);
      return res.status(400).json({ 
        success: false,
        message: 'Validation error',
        errors 
      });
    }

    // Handle MongoDB connection errors
    if (error.name === 'MongoServerError' || error.name === 'MongooseError') {
      console.error('MongoDB error:', error.message);
      return res.status(503).json({ 
        success: false,
        message: 'Database error. Please try again later.' 
      });
    }
    
    // Generic error response - always show error details for debugging
    res.status(500).json({ 
      success: false,
      message: 'Server error. Please try again later.',
      error: error.message || 'Unknown error',
      errorType: error.name || 'UnknownError',
      // Include stack in development
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
};


/**
 * @desc    Authenticate user & get token (Login)
 * @route   POST /api/users/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists and if password matches using the model's method
    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        message: 'Login successful.',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};


/**
 * @desc    Get user profile
 * @route   GET /api/auth/me
 * @access  Private (requires auth middleware)
 */
export const getUserProfile = async (req, res) => {
  try {
    // req.user.id is populated by the auth middleware after decoding the token
    const user = await User.findById(req.user.id).select('-password');

    if (user) {
      res.json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role || 'user',
          avatar: user.avatar,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};


/**
 * @desc    Get all users (admin only)
 * @route   GET /api/users
 * @access  Private/Admin
 */
export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    
    let query = {};
    
    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const users = await User.find(query)
      .select('-password -emailVerificationToken -emailVerificationExpires -passwordResetToken -passwordResetExpires')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    
    const total = await User.countDocuments(query);
    const totalPages = Math.ceil(total / Number(limit));
    
    res.json({ 
      success: true,
      data: users, 
      pagination: {
        currentPage: Number(page),
        totalPages,
        total,
        hasNextPage: Number(page) < totalPages,
        hasPrevPage: Number(page) > 1
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};


/**
 * @desc    Get user by ID (admin only)
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -emailVerificationToken -emailVerificationExpires -passwordResetToken -passwordResetExpires');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Delete a user
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.status(200).json({ success: true, message: 'User deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};