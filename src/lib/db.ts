// Database connection using Supabase
// This is a simplified version that works with Supabase client

let supabase: any = null;
let supabaseAdmin: any = null;

if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  try {
    // Uncomment when @supabase/supabase-js is installed:
    // import { createClient } from '@supabase/supabase-js';
    // supabase = createClient(
    //   process.env.NEXT_PUBLIC_SUPABASE_URL,
    //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    // );
  } catch (error) {
    console.warn('Supabase client not initialized');
  }
}

if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  try {
    // Uncomment when @supabase/supabase-js is installed:
    // import { createClient } from '@supabase/supabase-js';
    // supabaseAdmin = createClient(
    //   process.env.NEXT_PUBLIC_SUPABASE_URL,
    //   process.env.SUPABASE_SERVICE_ROLE_KEY
    // );
  } catch (error) {
    console.warn('Supabase admin client not initialized');
  }
}

export { supabase, supabaseAdmin };
