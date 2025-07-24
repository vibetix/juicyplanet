import { createClient } from '@supabase/supabase-js';

const { SUPABASE_URL, SUPABASE_KEY, NODE_ENV } = process.env;

// 🔒 Validate environment variables
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase environment variables');
  console.error('SUPABASE_URL:', SUPABASE_URL ?? '[missing]');
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
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;
