"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/userRoutes.ts
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const UserAuthMiddleware_1 = require("../middleware/UserAuthMiddleware");
const router = express_1.default.Router();
router.post("/register", userController_1.registerUser);
router.post("/login", userController_1.loginUser);
router.get("/profile", UserAuthMiddleware_1.authenticateToken, userController_1.getUserProfile);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map