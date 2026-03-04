import { createClient } from '@supabase/supabase-js';

const LEGACY_SUPABASE_URL = 'https://ngmcjvsqontdwgxyedwx.supabase.co';
const LEGACY_SUPABASE_ANON_KEY = 'sb_publishable_QNIuyXbtKQ_1-1NnU1J4pA_53Jckpes';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || LEGACY_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || LEGACY_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
