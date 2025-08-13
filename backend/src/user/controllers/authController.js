"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmail = void 0;
const express_1 = require("express");
const supabaseClient_1 = __importDefault(require("../utils/supabaseClient"));
// ✅ Verify email using token
const verifyEmail = async (req, res) => {
    const { token } = req.query;
    if (!token || typeof token !== 'string') {
        return res.status(400).json({ error: 'Invalid verification token' });
    }
    try {
        // 1. Find the token
        const { data: tokenData, error: tokenError } = await supabaseClient_1.default
            .from('email_tokens')
            .select('user_id')
            .eq('token', token)
            .maybeSingle();
        if (tokenError || !tokenData) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }
        const userId = tokenData.user_id;
        // 2. Update the user as verified
        const { error: updateError } = await supabaseClient_1.default
            .from('users')
            .update({ is_verified: true })
            .eq('id', userId);
        if (updateError) {
            return res.status(500).json({ error: 'Failed to verify email' });
        }
        // 3. Delete token (optional but clean)
        await supabaseClient_1.default.from('email_tokens').delete().eq('token', token);
        return res.json({ success: true, message: 'Email verified successfully' });
    }
    catch (err) {
        return res.status(500).json({ error: err.message || 'Server error' });
    }
};
exports.verifyEmail = verifyEmail;
//# sourceMappingURL=authController.js.map