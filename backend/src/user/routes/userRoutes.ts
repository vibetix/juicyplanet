import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  sendVerificationEmailController,
  checkVerificationStatus,
  resendEmailController,
  verifyEmail,
  getAllProducts,
  getProductBySlug,
  initiateMoMoPayment, 
} from '../controllers/userController'; 

import {
  authenticateToken,
  requireUser,
} from '../middleware/UserAuthMiddleware';

const router = express.Router();

// =======================
// 🔓 Public User Routes
// =======================

// Register a new user
router.post('/register', registerUser);

// User login route
router.post('/login', loginUser);

//send email token
router.post('/send-verification-email', sendVerificationEmailController);

//resend email token
router.post('/resend-email', resendEmailController);

// ✅ Verify email route (GET /verify-email?token=...)
router.get('/verify-email/:token', verifyEmail);

// check verification
router.post('/check-verification', checkVerificationStatus);



// =======================
// 🔐 Protected User Routes
// =======================

// Get logged-in user profile
router.get('/profile', authenticateToken, requireUser, getUserProfile);

// Get all products
router.get('/products', getAllProducts);

// GET /api/products/:slug
router.get('/product/:slug', getProductBySlug);

// make mobile money payment
router.post('/checkout', initiateMoMoPayment);

export default router;
