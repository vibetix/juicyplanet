"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// =======================
// 🔓 Public Admin Routes
// =======================
// Register a new admin (for setup or restricted to superadmin use)
router.post('/register', adminController_1.registerAdmin);
// Admin login route
router.post('/login', adminController_1.loginAdmin);
// =======================
// 🔐 Protected Admin Routes
// =======================
// Get logged-in admin profile
router.get('/profile', authMiddleware_1.authenticateToken, authMiddleware_1.requireAdmin, adminController_1.getAdminProfile);
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map