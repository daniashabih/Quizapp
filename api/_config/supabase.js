const { createAdminClient } = require('@supabase/server/core');

// Admin client — uses SUPABASE_URL + SUPABASE_SECRET_KEY, bypasses RLS.
// Server-side only: never expose this client or the secret key to the frontend.
let supabaseAdmin;

try {
    supabaseAdmin = createAdminClient();
    console.log('Supabase admin client initialized successfully');
} catch (error) {
    console.error('Failed to initialize Supabase admin client:', error.message);
    supabaseAdmin = new Proxy({}, {
        get() {
            return async () => {
                throw new Error(`Supabase admin client not initialized: ${error.message}`);
            };
        }
    });
}

module.exports = supabaseAdmin;
