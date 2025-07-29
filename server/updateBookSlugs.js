import mongoose from 'mongoose';
import Book from './models/books.model.js';
import { MONGODB_URI } from './config/env.js';

// A helper function to generate slugs
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with -
    .replace(/(^-|-$)/g, '');    // Remove leading or trailing -
};

const updateBookSlugs = async () => {
  try {
    // Connect to database
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to database');

    // Find all books that don't have a slug or have an empty slug
    const books = await Book.find({
      $or: [
        { slug: { $exists: false } },
        { slug: null },
        { slug: '' }
      ]
    });

    console.log(`Found ${books.length} books without slugs`);

    for (const book of books) {
      const newSlug = generateSlug(book.title);
      console.log(`Updating book "${book.title}" with slug: ${newSlug}`);
      
      // Check if slug already exists
      const existingBook = await Book.findOne({ slug: newSlug, _id: { $ne: book._id } });
      if (existingBook) {
        // If slug exists, append a number
        let counter = 1;
        let finalSlug = `${newSlug}-${counter}`;
        while (await Book.findOne({ slug: finalSlug, _id: { $ne: book._id } })) {
          counter++;
          finalSlug = `${newSlug}-${counter}`;
        }
        book.slug = finalSlug;
        console.log(`  Using unique slug: ${finalSlug}`);
      } else {
        book.slug = newSlug;
      }
      
      await book.save();
    }

    console.log('All books updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating book slugs:', error);
    process.exit(1);
  }
};

updateBookSlugs(); 