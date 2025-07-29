import mongoose from 'mongoose';
import Book from './models/books.model.js';
import { MONGODB_URI } from './config/env.js';

const checkBookSlugs = async () => {
  try {
    // Connect to database
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to database');

    // Find all books
    const books = await Book.find({});
    console.log(`Found ${books.length} books in database`);

    console.log('\nBook details:');
    books.forEach((book, index) => {
      console.log(`${index + 1}. Title: "${book.title}"`);
      console.log(`   Slug: ${book.slug || 'MISSING'}`);
      console.log(`   ID: ${book._id}`);
      console.log('---');
    });

    // Count books without slugs
    const booksWithoutSlugs = books.filter(book => !book.slug);
    console.log(`\nBooks without slugs: ${booksWithoutSlugs.length}`);

    if (booksWithoutSlugs.length > 0) {
      console.log('\nBooks that need slugs:');
      booksWithoutSlugs.forEach(book => {
        console.log(`- "${book.title}" (ID: ${book._id})`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('Error checking book slugs:', error);
    process.exit(1);
  }
};

checkBookSlugs(); 