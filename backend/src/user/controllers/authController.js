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
exports.verifyEmail = void 0;
const supabaseClient_1 = __importDefault(require("../utils/supabaseClient"));
// ✅ Verify email using token
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.query;
    if (!token || typeof token !== 'string') {
        return res.status(400).json({ error: 'Invalid verification token' });
    }
    try {
        // 1. Find the token
        const { data: tokenData, error: tokenError } = yield supabaseClient_1.default
            .from('email_tokens')
            .select('user_id')
            .eq('token', token)
            .maybeSingle();
        if (tokenError || !tokenData) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }
        const userId = tokenData.user_id;
        // 2. Update the user as verified
        const { error: updateError } = yield supabaseClient_1.default
            .from('users')
            .update({ is_verified: true })
            .eq('id', userId);
        if (updateError) {
            return res.status(500).json({ error: 'Failed to verify email' });
        }
        // 3. Delete token (optional but clean)
        yield supabaseClient_1.default.from('email_tokens').delete().eq('token', token);
        return res.json({ success: true, message: 'Email verified successfully' });
    }
    catch (err) {
        return res.status(500).json({ error: err.message || 'Server error' });
    }
});
exports.verifyEmail = verifyEmail;
