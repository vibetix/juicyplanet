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
exports.getUserProfile = exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../utils/jwt");
const supabaseClient_1 = __importDefault(require("../utils/supabaseClient"));
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const { data: existingUser } = yield supabaseClient_1.default
        .from("users")
        .select("id")
        .eq("email", email)
        .maybeSingle();
    if (existingUser)
        return res.status(400).json({ error: "User already exists" });
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const { error } = yield supabaseClient_1.default.from("users").insert([
        { email, password: hashedPassword, role: "user" }
    ]);
    if (error)
        return res.status(500).json({ error: error.message });
    const token = (0, jwt_1.signToken)({ email, role: "user" });
    res.status(201).json({ success: true, token });
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const { data: user } = yield supabaseClient_1.default
        .from("users")
        .select("*")
        .eq("email", email)
        .eq("role", "user")
        .maybeSingle();
    if (!user)
        return res.status(401).json({ error: "Invalid credentials" });
    const match = yield bcrypt_1.default.compare(password, user.password);
    if (!match)
        return res.status(401).json({ error: "Incorrect password" });
    const token = (0, jwt_1.signToken)({ email: user.email, role: user.role });
    res.json({ success: true, token });
});
exports.loginUser = loginUser;
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if ((user === null || user === void 0 ? void 0 : user.role) !== "user")
        return res.status(403).json({ error: "Forbidden" });
    res.json({ success: true, user });
});
exports.getUserProfile = getUserProfile;
