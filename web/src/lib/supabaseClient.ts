import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ngmcjvsqontdwgxyedwx.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_QNIuyXbtKQ_1-1NnU1J4pA_53Jckpes';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
