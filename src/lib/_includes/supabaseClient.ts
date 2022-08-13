import { createClient } from '@supabase/supabase-js'

// This is safe to expose https://supabase.com/docs/guides/api
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey)