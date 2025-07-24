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
import connectToDatabase from './database/mongodb.js';
import User from './models/user.model.js';
import Book from './models/books.model.js';
import Admin from './models/admin.model.js';


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/books', bookRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
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
    message: 'Route not found' 
  });
});

async function seedAdminAndBooks() {
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
    console.log('Default admin user created:', adminEmail, adminPassword);
  } else {
    console.log('Admin user already exists.');
  }

  // Seed dummy books if none exist
  const bookCount = await Book.countDocuments();
  if (bookCount === 0) {
    const dummyBooks = [
      {
        title: 'The Art of Success',
        description: 'A motivational book about achieving your dreams.',
        fullDescription: 'This book provides practical steps and inspiring stories to help you reach your goals.',
        author: 'Manoj Kumar Sharma',
        price: 19.99,
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
      },
      {
        title: 'Journey to Wisdom',
        description: 'A guide to personal growth and wisdom.',
        fullDescription: 'Explore the path to wisdom with actionable advice and timeless principles.',
        author: 'Manoj Kumar Sharma',
        price: 24.99,
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
      },
    ];
    await Book.insertMany(dummyBooks);
    console.log('Dummy books seeded.');
  } else {
    console.log('Books already exist in the database.');
  }
}

app.listen(PORT, async () => {
  await connectToDatabase();
  await seedAdminAndBooks();
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
}); 