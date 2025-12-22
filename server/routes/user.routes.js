import express from 'express';
import { auth, adminAuth } from '../middleware/auth.middleware.js';
import { getUsers, getUserById, deleteUser } from '../controllers/user.controller.js';

const router = express.Router();

// Get all users (admin only)
router.get('/', adminAuth, getUsers);

// Get user by ID (admin only)
router.get('/:id', adminAuth, getUserById);

// Delete user (admin only)
router.delete('/:id', adminAuth, deleteUser);

export default router; 