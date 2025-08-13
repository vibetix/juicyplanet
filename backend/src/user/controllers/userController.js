"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initiateMoMoPayment = exports.getProductBySlug = exports.getAllProducts = exports.getUserProfile = exports.loginUser = exports.resendEmailController = exports.verifyEmail = exports.checkVerificationStatus = exports.sendVerificationEmailController = exports.registerUser = void 0;
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const supabaseClient_1 = __importDefault(require("../utils/supabaseClient"));
const jwt_1 = require("../utils/jwt");
const token_1 = require("../utils/token");
const mailer_1 = require("../utils/mailer");
const crypto_1 = __importDefault(require("crypto"));
const axios_1 = __importDefault(require("axios"));
const registerUser = async (req, res) => {
    const { email, password, username, phone } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    try {
        // 🚫 Check if user exists
        const { data: existingUser, error: fetchError } = await supabaseClient_1.default
            .from('users')
            .select('id')
            .eq('email', email)
            .maybeSingle();
        if (fetchError)
            throw fetchError;
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }
        // 🔐 Hash password
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        // ✅ Insert new user
        const { data: newUser, error: insertError } = await supabaseClient_1.default
            .from('users')
            .insert([
            {
                email,
                password: hashedPassword,
                role: 'user',
                username,
                phone,
                is_verified: false,
            },
        ])
            .select()
            .single();
        if (insertError)
            throw insertError;
        // 🧪 Generate token and save to email_tokens
        const token = (0, token_1.generateToken)();
        const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now
        const { error: tokenError } = await supabaseClient_1.default
            .from('email_tokens')
            .insert([{ user_id: newUser.id, token, expires_at: expiry.toISOString(), }]);
        if (tokenError) {
            return res.status(500).json({ error: 'Failed to save verification token' });
        }
        // ✅ Return user_id and email so frontend can trigger email sending separately
        return res.status(201).json({
            success: true,
            message: 'User registered. Please check your email to verify your account.',
            user_id: newUser.id,
            email: newUser.email
        });
    }
    catch (err) {
        return res.status(500).json({ error: err.message || 'Server error' });
    }
};
exports.registerUser = registerUser;
const sendVerificationEmailController = async (req, res) => {
    const { user_id, email } = req.body;
    console.log("📥 Email verification request received:", { user_id, email }); // 🔍 Log input
    if (!user_id || !email) {
        return res.status(400).json({ error: 'user_id and email are required' });
    }
    try {
        // Get token from email_tokens table
        const { data: tokenData, error: tokenError } = await supabaseClient_1.default
            .from('email_tokens')
            .select('token')
            .eq('user_id', user_id)
            .maybeSingle();
        if (tokenError)
            throw tokenError;
        if (!tokenData) {
            return res.status(404).json({ error: 'Verification token not found' });
        }
        // Send the email
        await (0, mailer_1.sendVerificationEmail)({ email, token: tokenData.token });
        return res.status(200).json({ message: 'Verification email sent.' });
    }
    catch (err) {
        console.error("❌ Failed to send verification email:", err); // Log error
        return res.status(500).json({ error: err.message || 'Failed to send verification email' });
    }
};
exports.sendVerificationEmailController = sendVerificationEmailController;
// ✅ check Email verification status
const checkVerificationStatus = async (req, res) => {
    try {
        const { user_id, email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required.' });
        }
        const { data: user, error } = await supabaseClient_1.default
            .from('users')
            .select('is_verified')
            .eq('email', email)
            .single();
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.status(200).json({ verified: user?.is_verified });
    }
    catch (err) {
        res.status(500).json({ error: 'Something went wrong.' });
    }
};
exports.checkVerificationStatus = checkVerificationStatus;
// ✅ Verify Email
const verifyEmail = async (req, res) => {
    const token = req.params.token;
    console.log("🔐 Token received in URL:", token);
    try {
        // 1. Look up token in email_tokens table
        const { data: tokenRow, error: tokenError } = await supabaseClient_1.default
            .from('email_tokens')
            .select('*')
            .eq('token', token)
            .single();
        if (tokenError || !tokenRow) {
            console.error("❌ Token not found or already used.");
            return res.status(400).json({ error: 'Invalid or expired token' });
        }
        // 2. Check if token is expired
        const now = new Date();
        const tokenExpiry = new Date(tokenRow.expires_at);
        if (tokenExpiry < now) {
            console.warn("⌛ Token has expired.");
            return res.status(400).json({ error: 'Token has expired. Please request a new one.' });
        }
        const userId = tokenRow.user_id;
        // 3. Look up user by user_id
        const { data: user, error: userError } = await supabaseClient_1.default
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();
        if (userError || !user) {
            console.error("❌ User not found for token.");
            return res.status(404).json({ error: 'User not found' });
        }
        if (user.is_verified) {
            console.log("ℹ️ User already verified.");
            return res.status(200).json({ message: 'Email already verified' });
        }
        // 4. Update user to set is_verified = true
        const { error: updateError } = await supabaseClient_1.default
            .from('users')
            .update({ is_verified: true })
            .eq('id', userId);
        if (updateError) {
            console.error("❌ Failed to update user verification:", updateError);
            return res.status(500).json({ error: 'Could not verify email' });
        }
        // 5. Delete token after successful verification
        await supabaseClient_1.default
            .from('email_tokens')
            .delete()
            .eq('token', token);
        console.log(`✅ Email verified for user: ${user.email}`);
        return res.status(200).json({ message: 'Email verified successfully' });
    }
    catch (err) {
        console.error("❌ Unexpected error:", err.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.verifyEmail = verifyEmail;
// ✅ Resend Verification Email
const resendEmailController = async (req, res) => {
    const { user_id, email } = req.body;
    console.log("📥 Resend verification email request:", { user_id, email });
    if (!user_id || !email) {
        return res.status(400).json({ error: "user_id and email are required" });
    }
    try {
        // 1. Generate new token
        const newToken = (0, token_1.generateToken)();
        const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now
        // 2. Delete old token (cleanup)
        await supabaseClient_1.default.from("email_tokens").delete().eq("user_id", user_id);
        // 3. Save new token
        const { error: insertError } = await supabaseClient_1.default.from("email_tokens").insert([
            {
                user_id,
                token: newToken,
                expires_at: expiry.toISOString(),
            },
        ]);
        if (insertError)
            throw insertError;
        // 4. Send verification email
        await (0, mailer_1.sendVerificationEmail)({ email, token: newToken });
        return res.status(200).json({ message: "Verification email sent." });
    }
    catch (err) {
        console.error("❌ Error resending verification email:", err);
        return res.status(500).json({ error: "Could not resend verification email." });
    }
};
exports.resendEmailController = resendEmailController;
// ✅ Login
const loginUser = async (req, res) => {
    const { identifier, password } = req.body;
    const { data: user, error } = await supabaseClient_1.default
        .from("users")
        .select("*")
        .or(`email.eq.${identifier},username.eq.${identifier},phone.eq.${identifier}`)
        .single();
    if (error || !user) {
        return res.status(400).json({ message: "User not found" });
    }
    const isValid = await bcrypt_1.default.compare(password, user.password);
    if (!isValid) {
        return res.status(401).json({ message: "Incorrect password" });
    }
    const token = (0, jwt_1.signToken)(user); // use your JWT utility
    // ✅ Return more user fields
    const { id, email, username, phone, role } = user;
    return res.json({
        token,
        user: {
            id,
            email,
            username,
            phone,
            role
        }
    });
};
exports.loginUser = loginUser;
// ✅ Get User Profile
const getUserProfile = async (req, res) => {
    const user = req.user;
    console.log("👤 Logged-in user:", user);
    if (!user || user.role !== 'user') {
        return res.status(403).json({ error: 'Forbidden: Users only' });
    }
    try {
        const { data, error } = await supabaseClient_1.default
            .from('users')
            .select('id, email, username, phone, role, is_verified, created_at')
            .eq('id', user.id)
            .maybeSingle();
        if (error)
            throw error;
        if (!data)
            return res.status(404).json({ error: 'User not found' });
        return res.json({ success: true, user: data });
    }
    catch (err) {
        return res.status(500).json({ error: err.message || 'Server error' });
    }
};
exports.getUserProfile = getUserProfile;
// GET /api/products
const getAllProducts = async (req, res) => {
    try {
        const category = req.query.category;
        const isFeatured = req.query.featured === 'true';
        // Build Supabase query
        let query = supabaseClient_1.default
            .from('products')
            .select(`
        id,
        slug,
        name,
        description,
        price,
        original_price,
        images,
        rating,
        review_count,
        category,
        benefits,
        is_featured
      `)
            .order('created_at', { ascending: false });
        if (category) {
            query = query.eq('category', category);
        }
        if (isFeatured) {
            query = query.eq('is_featured', true);
        }
        const { data, error } = await query;
        if (error) {
            console.error('Supabase error:', error.message);
            return res.status(500).json({ error: error.message });
        }
        return res.status(200).json(data);
    }
    catch (err) {
        console.error('Server error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getAllProducts = getAllProducts;
// GET /api/products/:slug
const getProductBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const { data, error } = await supabaseClient_1.default
            .from('products')
            .select('*')
            .eq('slug', slug)
            .single();
        if (error || !data) {
            console.error('Product fetch error:', error?.message || 'Product not found');
            return res.status(404).json({ error: 'Product not found' });
        }
        return res.status(200).json(data);
    }
    catch (err) {
        console.error('Server error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getProductBySlug = getProductBySlug;
// controllers/paymentController.ts
const initiateMoMoPayment = async (req, res) => {
    const { phone, amount } = req.body;
    try {
        const momoRes = await axios_1.default.post('https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay', {
            amount: amount,
            currency: 'GHS',
            externalId: Date.now().toString(),
            payer: {
                partyIdType: 'MSISDN',
                partyId: phone, // e.g. 233540000000
            },
            payerMessage: 'Payment for your order',
            payeeNote: 'Thanks for shopping!',
        }, {
            headers: {
                'X-Reference-Id': 'GENERATE_UUID_HERE', // required
                'X-Target-Environment': 'sandbox',
                'Ocp-Apim-Subscription-Key': '95752155dcfa4ecfabff17ede089ebe3',
                Authorization: `Bearer YOUR_ACCESS_TOKEN`,
                'Content-Type': 'application/json',
            },
        });
        res.json({ success: true, momoRes: momoRes.data });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Payment failed' });
    }
};
exports.initiateMoMoPayment = initiateMoMoPayment;
//# sourceMappingURL=userController.js.map