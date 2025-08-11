"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_1 = require("@supabase/supabase-js");
// ✅ Check and log environment variable status
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    console.error('❌ Missing Supabase environment variables');
    console.error('SUPABASE_URL:', process.env.SUPABASE_URL);
    console.error('SUPABASE_KEY:', process.env.SUPABASE_KEY ? '[exists]' : '[missing]');
    throw new Error('Supabase URL and Key must be set in the .env file');
}
// ✅ Optional: log only partial key for debug
console.log('✅ Supabase config loaded');
console.log('URL:', process.env.SUPABASE_URL);
console.log('KEY (first 10):', process.env.SUPABASE_KEY.slice(0, 10) + '...');
// ✅ Create the Supabase client
const supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
exports.default = supabase;
//# sourceMappingURL=supabaseClient.js.map