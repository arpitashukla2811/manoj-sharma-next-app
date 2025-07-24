import express from 'express';
import { loginAdmin, registerAdmin, getAllAdmins, getAdminById } from '../controllers/admin.controller.js';

const router = express.Router();

// Admin login
router.post('/login', loginAdmin);
// Optionally, allow admin registration
// router.post('/register', registerAdmin);
router.get('/', getAllAdmins);
router.get('/:id', getAdminById);

export default router; 