import express from 'express';
import { loginAdmin, registerAdmin, getAllAdmins, getAdminById, validateAdminToken } from '../controllers/admin.controller.js';
import { adminAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// Admin login
router.post('/login', loginAdmin);
// Validate admin token
router.get('/validate', adminAuth, validateAdminToken);
// Optionally, allow admin registration
// router.post('/register', registerAdmin);
router.get('/', getAllAdmins);
router.get('/:id', getAdminById);

export default router; 