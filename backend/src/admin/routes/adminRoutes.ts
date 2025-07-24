import express from 'express';
import {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
} from '../controllers/adminController';
import {
  authenticateToken,
  requireAdmin,
} from '../middleware/authMiddleware';

const router = express.Router();

// =======================
// 🔓 Public Admin Routes
// =======================

// Register a new admin (for setup or restricted to superadmin use)
router.post('/register', registerAdmin);

// Admin login route
router.post('/login', loginAdmin);

// =======================
// 🔐 Protected Admin Routes
// =======================

// Get logged-in admin profile
router.get('/profile', authenticateToken, requireAdmin, getAdminProfile);

export default router;
