"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const UserAuthMiddleware_1 = require("../middleware/UserAuthMiddleware");
const router = express_1.default.Router();
// =======================
// 🔓 Public User Routes
// =======================
// Register a new user
router.post('/register', userController_1.registerUser);
// User login route
router.post('/login', userController_1.loginUser);
//send email token
router.post('/send-verification-email', userController_1.sendVerificationEmailController);
//resend email token
router.post('/resend-email', userController_1.resendEmailController);
// ✅ Verify email route (GET /verify-email?token=...)
router.get('/verify-email/:token', userController_1.verifyEmail);
// check verification
router.post('/check-verification', userController_1.checkVerificationStatus);
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
exports.default = router;
