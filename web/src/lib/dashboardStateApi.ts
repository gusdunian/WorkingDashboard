import { supabase } from './supabaseClient';
import type { DashboardState } from './dashboardStateModel';

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

export async function upsertDashboardState(userId: string, state: DashboardState) {
  const nowIso = new Date().toISOString();

  const { data, error } = await supabase
    .from('dashboard_state')
    .upsert({ user_id: userId, state, updated_at: nowIso })
    .select('updated_at')
    .single();

  if (error) {
    throw error;
  }

  return data;
}
