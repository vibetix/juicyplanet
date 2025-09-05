"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const adminRoutes_1 = __importDefault(require("./admin/routes/adminRoutes"));
const userRoutes_1 = __importDefault(require("./user/routes/userRoutes"));
// ✅ Load environment variables from .env
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
// ✅ Debug path resolution
console.log('ENV CHECK →', {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_KEY: ((_a = process.env.SUPABASE_KEY) === null || _a === void 0 ? void 0 : _a.slice(0, 10)) + '...',
    PORT: process.env.PORT
});
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
// ✅ CORS config — allow frontend domain
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || "https://juicyplanet.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express_1.default.json());
// ✅ Routes
app.use('/admin', adminRoutes_1.default);
app.use('/user', userRoutes_1.default);
app.get('/', (_req, res) => {
    res.send('Backend is running 🚀');
});
app.listen(PORT, () => {
    console.log(`✅ Server is running at http://localhost:${PORT}`);
});
