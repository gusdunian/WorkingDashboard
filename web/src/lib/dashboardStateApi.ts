import { supabase } from './supabaseClient';

export async function fetchDashboardState(userId: string) {
  const { data, error } = await supabase
    .from('dashboard_state')
    .select('state, updated_at')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}
