import mongoose from 'mongoose';

// A helper function to generate slugs, similar to the one provided.
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with -
    .replace(/(^-|-$)/g, '');    // Remove leading or trailing -
};

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Book title is required.'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      // The slug will be generated from the title before saving.
    },
    description: {
      type: String,
      required: [true, 'A short description is required.'],
      trim: true,
    },
    fullDescription: {
      type: String,
      required: [true, 'A full description is required.'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Author name is required.'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required.'],
      min: [0, 'Price cannot be negative'],
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    year: {
      type: Number,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    language: {
      type: String,
      default: 'English',
    },
    format: {
      type: String,
      enum: ['Hardcover', 'Paperback', 'eBook'],
      required: true,
    },
    amazonLink: {
      type: String,
    },
    coverImage: {
      type: String,
      required: [true, 'Cover image is required.'],
    },
  },
  {
    // This option automatically adds `createdAt` and `updatedAt` fields.
    timestamps: true,
  }
);

// Mongoose middleware to automatically generate a slug before saving
bookSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = generateSlug(this.title);
  }
  next();
});

// Indexes for better query performance
bookSchema.index({ title: 'text', author: 'text', description: 'text' });
bookSchema.index({ genre: 1 });
bookSchema.index({ price: 1 });
bookSchema.index({ rating: -1 });
bookSchema.index({ createdAt: -1 });

export default mongoose.model('Book', bookSchema);