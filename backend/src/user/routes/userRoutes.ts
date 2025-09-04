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
  getContactInfo,
  sendContactMessage,
  getTestimonials, 
  addTestimonial, 
  deleteTestimonial
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

// ✅ Send OTP
router.post('/send-verification-otp', sendVerificationEmailController);

// ✅ Resend OTP
router.post('/resend-otp', resendEmailController);

// ✅ Verify OTP (instead of token in URL, use in body)
router.post('/verify-otp', verifyEmail);

// ✅ Check verification status
router.post('/check-verification', checkVerificationStatus);

router.post('/get-testimonials', getTestimonials);

router.post('/add-testimonial', addTestimonial);

router.post('/delete-testimonial/:id', deleteTestimonial);


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

router.get('/contact-info', getContactInfo);
router.post("/contact", sendContactMessage);

export default router;
