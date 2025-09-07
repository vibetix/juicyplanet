"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const UserAuthMiddleware_1 = require("../middleware/UserAuthMiddleware");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
// =======================
// 🔓 Public User Routes
// =======================
// Register a new user
router.post('/register', userController_1.registerUser);
// User login route
router.post('/login', userController_1.loginUser);
// ✅ Send OTP
router.post('/send-verification-otp', userController_1.sendVerificationEmailController);
// ✅ Resend OTP
router.post('/resend-otp', userController_1.resendEmailController);
// ✅ Verify OTP (instead of token in URL, use in body)
router.post('/verify-otp', userController_1.verifyEmail);
// ✅ Check verification status
router.post('/check-verification', userController_1.checkVerificationStatus);
router.get('/testimonials', userController_1.getTestimonials);
router.post('/testimonial', userController_1.addTestimonial);
router.delete('/delete-testimonial/:id', userController_1.deleteTestimonial);
// =======================
// 🔐 Protected User Routes
// =======================
// Get logged-in user profile
router.get('/profile', UserAuthMiddleware_1.authenticateToken, UserAuthMiddleware_1.requireUser, userController_1.getUserProfile);
// Get all products
router.get('/products', userController_1.getAllProducts);
// GET /api/products/:slug
router.get('/product/:slug', userController_1.getProductBySlug);
// make mobile money payment
router.post('/checkout', userController_1.initiateMoMoPayment);
router.get('/contact-info', userController_1.getContactInfo);
router.post("/contact", userController_1.sendContactMessage);
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, '../public/images'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path_1.default.extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
    },
});
const upload = (0, multer_1.default)({ storage });
router.post('/upload-image', upload.single('image'), userController_1.uploadImageController);
exports.default = router;
