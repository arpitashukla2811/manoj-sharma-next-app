import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Book from './server/models/books.model.js';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please Define MONGODB_URI environment variable inside .env');
}

const clearBooks = async () => {
  try {
    // Connect to database
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Database connected successfully');

    // Clear all books
    const result = await Book.deleteMany({});
    console.log(`✅ Cleared ${result.deletedCount} books from database`);

  } catch (error) {
    console.error('❌ Error clearing books:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the clear function
clearBooks();