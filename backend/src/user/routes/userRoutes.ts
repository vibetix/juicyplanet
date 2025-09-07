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
  deleteTestimonial,
  uploadImageController
} from '../controllers/userController'; 

import {
  authenticateToken,
  requireUser,
} from '../middleware/UserAuthMiddleware';
import multer from 'multer';
import path from 'path';


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

router.get('/testimonials', getTestimonials);

router.post('/testimonial', addTestimonial);

router.delete('/delete-testimonial/:id', deleteTestimonial);


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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/images'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const upload = multer({ storage });

router.post('/upload-image', upload.single('image'), uploadImageController);

export default router;
