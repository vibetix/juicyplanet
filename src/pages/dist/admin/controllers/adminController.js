"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminProfile = exports.loginAdmin = exports.registerAdmin = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const supabaseClient_1 = __importDefault(require("../utils/supabaseClient"));
const jwt_1 = require("../utils/jwt");
// Register a new admin
const registerAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    try {
        const { data: existingUser, error: fetchError } = yield supabaseClient_1.default
            .from('users')
            .select()
            .eq('email', email)
            .maybeSingle();
        if (fetchError)
            throw fetchError;
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const { error: insertError } = yield supabaseClient_1.default.from('users').insert([
            {
                email,
                password: hashedPassword,
                role: 'admin',
            },
        ]);
        if (insertError)
            throw insertError;
        const token = (0, jwt_1.signToken)({ email, role: 'admin' });
        res.status(201).json({ success: true, token });
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Something went wrong' });
    }
});
exports.registerAdmin = registerAdmin;
// Login admin
const loginAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    try {
        const { data: user, error: fetchError } = yield supabaseClient_1.default
            .from('users')
            .select()
            .eq('email', email)
            .eq('role', 'admin')
            .maybeSingle();
        if (fetchError)
            throw fetchError;
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const match = yield bcrypt_1.default.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const token = (0, jwt_1.signToken)({ email: user.email, role: user.role });
        res.json({ success: true, token });
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Something went wrong' });
    }
});
exports.loginAdmin = loginAdmin;
// Admin profile
const getAdminProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user || user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: Admins only' });
    }
    res.json({ success: true, admin: user });
});
exports.getAdminProfile = getAdminProfile;
