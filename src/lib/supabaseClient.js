import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const CONTACT_MESSAGES_TABLE = 'portfolio_contact_messages';
export const ADMIN_EMAIL = 'kushagras1234890@gmail.com';

// Null (not a thrown error) when misconfigured, so a missing/broken env var
// only breaks the contact form and admin page — not the rest of the site.
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseConfigured = supabase !== null;
