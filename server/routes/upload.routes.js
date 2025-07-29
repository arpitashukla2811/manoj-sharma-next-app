import express from 'express';
import { auth, adminAuth, authorize } from '../middleware/auth.middleware.js';
import {
  uploadSingleImage,
  uploadMultipleImages,
  uploadBookImages,
  deleteFile,
  getFileInfo,
  listFiles,
  cleanupTempFiles
} from '../controllers/upload.controller.js';

const router = express.Router();

// Public routes (for basic file info)
router.get('/files', listFiles);
router.get('/files/:filename', getFileInfo);

// Protected routes (require authentication)
router.post('/single', auth, uploadSingleImage);
router.post('/multiple', auth, uploadMultipleImages);
router.delete('/files/:filename', auth, deleteFile);

// Admin only routes
router.post('/book-images', adminAuth, uploadBookImages);
router.post('/cleanup', adminAuth, cleanupTempFiles);

// Admin image upload route (for book covers)
router.post('/image', adminAuth, uploadSingleImage);

// Role-based routes
router.post('/admin/single', auth, authorize('admin', 'moderator'), uploadSingleImage);
router.post('/admin/multiple', auth, authorize('admin', 'moderator'), uploadMultipleImages);

export default router; 