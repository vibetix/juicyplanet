"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_1 = require("@supabase/supabase-js");
const { SUPABASE_URL, SUPABASE_KEY, NODE_ENV } = process.env;
// 🔒 Validate environment variables
if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing Supabase environment variables');
    console.error('SUPABASE_URL:', SUPABASE_URL !== null && SUPABASE_URL !== void 0 ? SUPABASE_URL : '[missing]');
    console.error('SUPABASE_KEY:', SUPABASE_KEY ? '[exists]' : '[missing]');
    throw new Error('Supabase URL and Key must be defined in the .env file');
}
// ✅ Log only in development
if (NODE_ENV !== 'production') {
    console.log('✅ Supabase environment variables loaded');
    console.log('URL:', SUPABASE_URL);
    console.log('KEY (first 10):', SUPABASE_KEY.slice(0, 10) + '...');
}
// ⚙️ Initialize Supabase client
const supabase = (0, supabase_js_1.createClient)(SUPABASE_URL, SUPABASE_KEY);
exports.default = supabase;
