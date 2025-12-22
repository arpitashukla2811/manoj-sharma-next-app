import Book from '../models/books.model.js';
import fs from 'fs';
import path from 'path';

// Get all books with enhanced filtering and pagination
export const getBooks = async (req, res) => {
  try {
    const { 
      search, 
      year, 
      genre, 
      sort, 
      page = 1, 
      limit = 12,
      minPrice,
      maxPrice,
      format
    } = req.query;

    let query = {};
    
    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by year
    if (year) {
      if (year.includes('-')) {
        const [startYear, endYear] = year.split('-');
        query.year = { $gte: Number(startYear), $lte: Number(endYear) };
      } else {
        query.year = Number(year);
      }
    }

    // Filter by genre
    if (genre) {
      query.genre = { $regex: genre, $options: 'i' };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Format filter
    if (format) {
      query.format = format;
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Build query
    let booksQuery = Book.find(query);

    // Sorting
    if (sort) {
      switch (sort) {
        case 'title': booksQuery = booksQuery.sort({ title: 1 }); break;
        case 'year': booksQuery = booksQuery.sort({ year: -1 }); break;
        case 'price': booksQuery = booksQuery.sort({ price: 1 }); break;
        case 'price-desc': booksQuery = booksQuery.sort({ price: -1 }); break;
        case 'rating': booksQuery = booksQuery.sort({ rating: -1 }); break;
        default: booksQuery = booksQuery.sort({ createdAt: -1 });
      }
    } else {
      booksQuery = booksQuery.sort({ createdAt: -1 });
    }

    // Execute query with pagination
    const books = await booksQuery.skip(skip).limit(Number(limit));
    const total = await Book.countDocuments(query);
    const totalPages = Math.ceil(total / Number(limit));

    console.log('getBooks - returning books:', books.map(book => ({ 
      title: book.title, 
      slug: book.slug, 
      _id: book._id 
    })));

    res.json({ 
      success: true, 
      data: books, 
      pagination: {
        currentPage: Number(page),
        totalPages,
        total,
        hasNextPage: Number(page) < totalPages,
        hasPrevPage: Number(page) > 1
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch books', error: error.message });
  }
};

// Get book by ID with view increment
export const getBookById = async (req, res) => {
  try {
    console.log('getBookById - called with ID:', req.params.id);
    const book = await Book.findById(req.params.id);
    if (!book) {
      console.log('getBookById - book not found for ID:', req.params.id);
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    console.log('getBookById - returning book:', JSON.stringify(book, null, 2));
    res.json({ success: true, data: book });
  } catch (error) {
    console.error('getBookById - error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch book', error: error.message });
  }
};

// Get book by slug with view increment
export const getBookBySlug = async (req, res) => {
  try {
    console.log('getBookBySlug - called with slug:', req.params.slug);
    const book = await Book.findOne({ slug: req.params.slug });
    if (!book) {
      console.log('getBookBySlug - book not found for slug:', req.params.slug);
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    console.log('getBookBySlug - returning book:', JSON.stringify(book, null, 2));
    res.json({ success: true, data: book });
  } catch (error) {
    console.error('getBookBySlug - error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch book', error: error.message });
  }
};

// Create new book with image handling (admin only)
export const createBook = async (req, res) => {
  try {
    const data = req.body;
    
    console.log('Creating book with data:', JSON.stringify(data, null, 2));
    
    // Validate required fields
    if (!data.title || !data.description || !data.author || !data.price) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide title, description, author, and price' 
      });
    }

    // Validate and convert numeric fields
    const price = parseFloat(data.price);
    if (isNaN(price) || price < 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Price must be a valid positive number' 
      });
    }
    data.price = price;

    const year = parseInt(data.year);
    if (isNaN(year) || year < 1000 || year > new Date().getFullYear() + 10) {
      return res.status(400).json({ 
        success: false, 
        message: 'Year must be a valid number' 
      });
    }
    data.year = year;

    // Validate optional numeric fields
    if (data.rating !== undefined) {
      const rating = parseFloat(data.rating);
      if (isNaN(rating) || rating < 0 || rating > 5) {
        return res.status(400).json({ 
          success: false, 
          message: 'Rating must be a number between 0 and 5' 
        });
      }
      data.rating = rating;
    }

    if (data.reviews !== undefined) {
      const reviews = parseInt(data.reviews);
      if (isNaN(reviews) || reviews < 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'Reviews must be a non-negative integer' 
        });
      }
      data.reviews = reviews;
    }

    if (data.stock !== undefined) {
      const stock = parseInt(data.stock);
      if (isNaN(stock) || stock < 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'Stock must be a non-negative integer' 
        });
      }
      data.stock = stock;
    }

    // Check if cover image is provided
    if (!data.coverImage) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cover image is required' 
      });
    }

    // Check for existing book with same title
    const existingBook = await Book.findOne({ 
      title: { $regex: new RegExp(`^${data.title}$`, 'i') } 
    });
    
    if (existingBook) {
      return res.status(400).json({ 
        success: false, 
        message: 'A book with this title already exists' 
      });
    }

    // Validate format
    const validFormats = ['Hardcover', 'Paperback', 'eBook'];
    if (!validFormats.includes(data.format)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Format must be one of: Hardcover, Paperback, eBook' 
      });
    }

    // Validate and sanitize language field to prevent MongoDB language override errors
    const validLanguages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Bengali', 'Urdu', 'Turkish', 'Dutch', 'Swedish', 'Norwegian', 'Danish', 'Finnish', 'Polish', 'Czech', 'Hungarian', 'Romanian', 'Bulgarian', 'Greek', 'Hebrew', 'Thai', 'Vietnamese', 'Indonesian', 'Malay', 'Filipino', 'Persian', 'Ukrainian', 'Belarusian', 'Slovak', 'Slovenian', 'Croatian', 'Serbian', 'Bosnian', 'Macedonian', 'Albanian', 'Estonian', 'Latvian', 'Lithuanian', 'Georgian', 'Armenian', 'Azerbaijani', 'Kazakh', 'Uzbek', 'Kyrgyz', 'Tajik', 'Turkmen', 'Mongolian', 'Nepali', 'Sinhala', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Marathi', 'Gujarati', 'Punjabi', 'Odia', 'Assamese', 'Kashmiri', 'Sindhi', 'Konkani', 'Manipuri', 'Bodo', 'Sanskrit', 'Santhali', 'Dogri', 'Maithili', 'Kashmiri', 'Konkani', 'Manipuri', 'Bodo', 'Sanskrit', 'Santhali', 'Dogri', 'Maithili'];
    
    // If language is not in valid list, default to English
    if (!validLanguages.includes(data.language)) {
      data.language = 'English';
    }

    // Generate slug for the book
    const generateSlug = (title) => {
      let slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      // Ensure slug is not empty
      if (!slug) {
        slug = 'book-' + Date.now();
      }
      
      return slug;
    };
    
    data.slug = generateSlug(data.title);
    
    // Ensure slug is unique
    let uniqueSlug = data.slug;
    let counter = 1;
    while (await Book.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${data.slug}-${counter}`;
      counter++;
    }
    data.slug = uniqueSlug;
    
    console.log('Final book data before creation:', JSON.stringify(data, null, 2));

    const book = await Book.create(data);
    
    res.status(201).json({ 
      success: true, 
      message: 'Book created successfully', 
      data: book 
    });
  } catch (error) {
    console.error('Error creating book:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      errors: error.errors
    });
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create book', 
      error: error.message 
    });
  }
};

// Update book with image handling (admin only)
export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if book exists
    const existingBook = await Book.findById(id);
    if (!existingBook) {
      return res.status(404).json({ 
        success: false, 
        message: 'Book not found' 
      });
    }

    // If title is being updated, check for duplicates and generate new slug
    if (updateData.title && updateData.title !== existingBook.title) {
      const duplicateBook = await Book.findOne({ 
        title: { $regex: new RegExp(`^${updateData.title}$`, 'i') },
        _id: { $ne: id }
      });
      
      if (duplicateBook) {
        return res.status(400).json({ 
          success: false, 
          message: 'A book with this title already exists' 
        });
      }
      
      // Generate new slug for the updated title
      const generateSlug = (title) => {
        let slug = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        
        // Ensure slug is not empty
        if (!slug) {
          slug = 'book-' + Date.now();
        }
        
        return slug;
      };
      
      updateData.slug = generateSlug(updateData.title);
    }

    // Handle image updates
    if (updateData.coverImage && updateData.coverImage !== existingBook.coverImage) {
      // Delete old cover image if it exists and is not a default image
      if (existingBook.coverImage && !existingBook.coverImage.includes('ui-avatars.com')) {
        try {
          const oldImagePath = path.join(process.cwd(), existingBook.coverImage.replace(/^.*\/uploads\//, 'uploads/'));
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        } catch (error) {
          console.error('Error deleting old cover image:', error);
        }
      }
    }

    const book = await Book.findByIdAndUpdate(id, updateData, { 
      new: true, 
      runValidators: true 
    });

    res.json({ 
      success: true, 
      message: 'Book updated successfully', 
      data: book 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update book', 
      error: error.message 
    });
  }
};

// Delete book with image cleanup (admin only)
export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ 
        success: false, 
        message: 'Book not found' 
      });
    }

    // Delete associated images
    try {
      // Delete cover image
      if (book.coverImage && !book.coverImage.includes('ui-avatars.com')) {
        const coverImagePath = path.join(process.cwd(), book.coverImage.replace(/^.*\/uploads\//, 'uploads/'));
        if (fs.existsSync(coverImagePath)) {
          fs.unlinkSync(coverImagePath);
        }
      }
    } catch (error) {
      console.error('Error deleting book images:', error);
    }

    await Book.findByIdAndDelete(id);
    
    res.json({ 
      success: true, 
      message: 'Book deleted successfully', 
      data: book 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete book', 
      error: error.message 
    });
  }
};

// Get books statistics (admin only)
export const getBookStats = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    
    const totalStockAgg = await Book.aggregate([
      { $group: { _id: null, total: { $sum: '$stock' } } }
    ]);
    const totalStock = totalStockAgg[0]?.total || 0;
    
    const totalValueAgg = await Book.aggregate([
      { $group: { _id: null, total: { $sum: { $multiply: ['$price', '$stock'] } } } }
    ]);
    const totalValue = totalValueAgg[0]?.total || 0;

    // Get top rated books
    const topRatedBooks = await Book.find()
      .sort({ rating: -1 })
      .limit(5)
      .select('title rating price');

    // Get most reviewed books
    const mostReviewedBooks = await Book.find()
      .sort({ reviews: -1 })
      .limit(5)
      .select('title reviews price');

    res.json({ 
      success: true, 
      data: { 
        totalBooks, 
        totalStock, 
        totalValue,
        topRatedBooks,
        mostReviewedBooks
      } 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch statistics', 
      error: error.message 
    });
  }
};

// Get featured books
export const getFeaturedBooks = async (req, res) => {
  try {
    const books = await Book.find().limit(6);
    
    res.json({ success: true, data: books });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch featured books', 
      error: error.message 
    });
  }
};

// Get best sellers
export const getBestSellers = async (req, res) => {
  try {
    const books = await Book.find().sort({ rating: -1 }).limit(6);
    
    res.json({ success: true, data: books });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch best sellers', 
      error: error.message 
    });
  }
};

// Get new releases
export const getNewReleases = async (req, res) => {
  try {
    const books = await Book.find().sort({ year: -1 }).limit(6);
    
    res.json({ success: true, data: books });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch new releases', 
      error: error.message 
    });
  }
};

// Get books on sale
export const getBooksOnSale = async (req, res) => {
  try {
    const books = await Book.find().sort({ price: 1 }).limit(6);
    
    res.json({ success: true, data: books });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch books on sale', 
      error: error.message 
    });
  }
}; 