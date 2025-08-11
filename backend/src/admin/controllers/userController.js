"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = exports.loginUser = exports.registerUser = void 0;
// controllers/userController.ts
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../utils/jwt");
const supabaseClient_1 = __importDefault(require("../utils/supabaseClient"));
const registerUser = async (req, res) => {
    const { email, password } = req.body;
    const { data: existingUser } = await supabaseClient_1.default
        .from("users")
        .select("id")
        .eq("email", email)
        .maybeSingle();
    if (existingUser)
        return res.status(400).json({ error: "User already exists" });
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const { error } = await supabaseClient_1.default.from("users").insert([
        { email, password: hashedPassword, role: "user" }
    ]);
    if (error)
        return res.status(500).json({ error: error.message });
    const token = (0, jwt_1.signToken)({ email, role: "user" });
    res.status(201).json({ success: true, token });
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const { data: user } = await supabaseClient_1.default
        .from("users")
        .select("*")
        .eq("email", email)
        .eq("role", "user")
        .maybeSingle();
    if (!user)
        return res.status(401).json({ error: "Invalid credentials" });
    const match = await bcrypt_1.default.compare(password, user.password);
    if (!match)
        return res.status(401).json({ error: "Incorrect password" });
    const token = (0, jwt_1.signToken)({ email: user.email, role: user.role });
    res.json({ success: true, token });
};
exports.loginUser = loginUser;
const getUserProfile = async (req, res) => {
    const user = req.user;
    if (user?.role !== "user")
        return res.status(403).json({ error: "Forbidden" });
    res.json({ success: true, user });
};
exports.getUserProfile = getUserProfile;
//# sourceMappingURL=userController.js.map