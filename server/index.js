import express from 'express';
import cors from 'cors';
import path from 'path';
import config from 'dotenv';
import authRoutes from './routes/auth.routes.js'
import orderRoutes from './routes/orders.routes.js'
import userRoutes from './routes/user.routes.js'
import cartRoutes from './routes/cart.routes.js'
import bookRoutes from './routes/books.routes.js'
import adminRoutes from './routes/admin.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import connectToDatabase from './database/mongodb.js';
import User from './models/user.model.js';
import Book from './models/books.model.js';
import Admin from './models/admin.model.js';
import { rateLimit } from './middleware/auth.middleware.js';

config.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use('/api/', rateLimit(15 * 60 * 1000, 100)); // 100 requests per 15 minutes

// Static file serving for uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/books', bookRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/upload', uploadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    message: 'API Documentation',
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      books: '/api/v1/books',
      users: '/api/v1/users',
      orders: '/api/v1/orders',
      cart: '/api/v1/cart',
      admin: '/api/v1/admin',
      upload: '/api/v1/upload'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Handle multer errors
  if (err.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      message: 'File upload error',
      error: err.message
    });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  // Handle JWT expiration
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }

  // Default error response
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found',
    path: req.originalUrl
  });
});

async function seedAdminAndBooks() {
  try {
    // Seed admin in Admin model
    const adminEmail = 'admin@example.com';
    const adminPassword = 'Admin@123';
    const adminExists = await Admin.findOne({ email: adminEmail });
    if (!adminExists) {
      await Admin.create({
        name: 'Admin User',
        email: adminEmail,
        password: adminPassword,
      });
      console.log('✅ Default admin user created:', adminEmail, adminPassword);
    } else {
      console.log('ℹ️  Admin user already exists.');
    }

    // Helper function to generate slugs
    const generateSlug = (title) => {
      return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    };

    // Seed dummy books if none exist
    const bookCount = await Book.countDocuments();
    if (bookCount === 0) {
      const dummyBooks = [
        {
          title: 'The Art of Success',
          slug: 'the-art-of-success',
          description: 'A motivational book about achieving your dreams.',
          fullDescription: 'This book provides practical steps and inspiring stories to help you reach your goals. It covers various aspects of personal development including goal setting, time management, and building positive habits.',
          author: 'Manoj Kumar Sharma',
          price: 19.99,
          originalPrice: 24.99,
          discountPercentage: 20,
          rating: 4.5,
          reviews: 12,
          year: 2022,
          pages: 220,
          isbn: '9781234567890',
          genre: 'Motivation',
          stock: 10,
          language: 'English',
          format: 'Paperback',
          dimensions: '8.5 x 5.5 x 0.6 inches',
          weight: '0.7 lbs',
          amazonLink: 'https://amazon.com/dp/1234567890',
          coverImage: '/images/books/book1.jpeg',
          galleryImages: ['/images/books/book1.jpeg'],
          isFeatured: true,
          isBestSeller: true,
          isNewRelease: false,
          isOnSale: true,
          tags: ['motivation', 'success', 'personal-development'],
          status: 'published',
          views: 150,
          sales: 25
        },
        {
          title: 'Journey to Wisdom',
          slug: 'journey-to-wisdom',
          description: 'A guide to personal growth and wisdom.',
          fullDescription: 'Explore the path to wisdom with actionable advice and timeless principles. This book delves into ancient wisdom and modern psychology to provide a comprehensive guide for personal transformation.',
          author: 'Manoj Kumar Sharma',
          price: 24.99,
          originalPrice: 29.99,
          discountPercentage: 17,
          rating: 4.8,
          reviews: 8,
          year: 2021,
          pages: 180,
          isbn: '9780987654321',
          genre: 'Self-Help',
          stock: 7,
          language: 'English',
          format: 'Hardcover',
          dimensions: '9 x 6 x 0.8 inches',
          weight: '1.1 lbs',
          amazonLink: 'https://amazon.com/dp/0987654321',
          coverImage: '/images/books/book2.jpeg',
          galleryImages: ['/images/books/book2.jpeg'],
          isFeatured: false,
          isBestSeller: false,
          isNewRelease: true,
          isOnSale: false,
          tags: ['wisdom', 'growth', 'philosophy'],
          status: 'published',
          views: 89,
          sales: 12
        },
        {
          title: 'Mindful Living',
          slug: 'mindful-living',
          description: 'Discover the art of mindful living in a busy world.',
          fullDescription: 'Learn practical mindfulness techniques to reduce stress, improve focus, and find inner peace. This book combines traditional mindfulness practices with modern lifestyle applications.',
          author: 'Manoj Kumar Sharma',
          price: 16.99,
          originalPrice: 19.99,
          discountPercentage: 15,
          rating: 4.6,
          reviews: 15,
          year: 2023,
          pages: 200,
          isbn: '9781122334455',
          genre: 'Mindfulness',
          stock: 15,
          language: 'English',
          format: 'Paperback',
          dimensions: '8.5 x 5.5 x 0.5 inches',
          weight: '0.6 lbs',
          amazonLink: 'https://amazon.com/dp/1122334455',
          coverImage: '/images/books/book3.jpeg',
          galleryImages: ['/images/books/book3.jpeg'],
          isFeatured: true,
          isBestSeller: false,
          isNewRelease: true,
          isOnSale: true,
          tags: ['mindfulness', 'meditation', 'stress-relief'],
          status: 'published',
          views: 203,
          sales: 31
        },
        {
          title: 'Leadership Principles',
          slug: 'leadership-principles',
          description: 'Essential leadership skills for the modern world.',
          fullDescription: 'Master the art of leadership with proven principles and strategies. This comprehensive guide covers everything from team building to decision-making in today\'s dynamic business environment.',
          author: 'Manoj Kumar Sharma',
          price: 29.99,
          originalPrice: 34.99,
          discountPercentage: 14,
          rating: 4.7,
          reviews: 22,
          year: 2022,
          pages: 280,
          isbn: '9785566778899',
          genre: 'Leadership',
          stock: 8,
          language: 'English',
          format: 'Hardcover',
          dimensions: '9.5 x 6.5 x 1.0 inches',
          weight: '1.3 lbs',
          amazonLink: 'https://amazon.com/dp/5566778899',
          coverImage: '/images/books/book4.jpeg',
          galleryImages: ['/images/books/book4.jpeg'],
          isFeatured: false,
          isBestSeller: true,
          isNewRelease: false,
          isOnSale: false,
          tags: ['leadership', 'management', 'business'],
          status: 'published',
          views: 167,
          sales: 28
        }
      ];
      await Book.insertMany(dummyBooks);
      console.log('✅ Dummy books seeded successfully.');
    } else {
      console.log('ℹ️  Books already exist in the database.');
    }
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
}

app.listen(PORT, async () => {
  try {
    await connectToDatabase();
    await seedAdminAndBooks();
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📚 API docs: http://localhost:${PORT}/api/docs`);
    console.log(`📁 Uploads: http://localhost:${PORT}/uploads`);
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}); 