/**
 * Supabase client singleton.
 * Loaded after config.js and the Supabase CDN script.
 */
const supabase = window.supabase.createClient(
  SUPABASE_CONFIG.url,
  SUPABASE_CONFIG.anonKey
);
