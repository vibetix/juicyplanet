"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.requireUser = exports.authenticateToken = exports.authenticateUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
// ✅ Middleware: Authenticate only users
const authenticateUser = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer '))) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (_a) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};
exports.authenticateUser = authenticateUser;
// ✅ Generic Token Auth (still useful for shared logic)
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer '))) {
        return res.status(401).json({ error: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (_a) {
        return res.status(403).json({ error: 'Invalid token' });
    }
};
exports.authenticateToken = authenticateToken;
// ✅ Role Guard: Only users
const requireUser = (req, res, next) => {
    const user = req.user;
    if (!user || user.role !== 'user') {
        return res.status(403).json({ error: 'Users only' });
    }
    next();
};
exports.requireUser = requireUser;
// ✅ (Optional) Still keep admin-specific checks
const requireAdmin = (req, res, next) => {
    const user = req.user;
    if (!user || user.role !== 'admin') {
        return res.status(403).json({ error: 'Admins only' });
    }
    next();
};
exports.requireAdmin = requireAdmin;
