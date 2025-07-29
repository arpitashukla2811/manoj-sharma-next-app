import express from 'express';
import { auth, adminAuth, authorize } from '../middleware/auth.middleware.js';
import {
  getBooks,
  getBookById,
  getBookBySlug,
  createBook,
  updateBook,
  deleteBook,
  getBookStats,
  getFeaturedBooks,
  getBestSellers,
  getNewReleases,
  getBooksOnSale
} from '../controllers/books.controller.js';

const router = express.Router();

// Public routes
router.get('/', getBooks);
router.get('/featured', getFeaturedBooks);
router.get('/bestsellers', getBestSellers);
router.get('/new-releases', getNewReleases);
router.get('/on-sale', getBooksOnSale);
router.get('/slug/:slug', getBookBySlug);
router.get('/:id', getBookById);

// Admin routes
router.post('/', adminAuth, createBook);
router.put('/:id', adminAuth, updateBook);
router.delete('/:id', adminAuth, deleteBook);
router.get('/admin/stats', adminAuth, getBookStats);

// Role-based routes (for moderators and admins)
router.post('/admin', auth, authorize('admin', 'moderator'), createBook);
router.put('/admin/:id', auth, authorize('admin', 'moderator'), updateBook);

export default router; 