import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pfrwtxznrtohdlblhfbc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmcnd0eHpucnRvaGRsYmxoZmJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MzY2MTAsImV4cCI6MjA5MjIxMjYxMH0.wfPK2tIrS4o1R17VFNEnRrfEAcX_pdd81xgpO8aDpZc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function saveLead(leadData) {
  const { error } = await supabase
    .from('leads')
    .insert([{
      first_name: leadData.firstName,
      last_name: leadData.lastName || '',
      phone: leadData.phone,
      email: leadData.email || '',
      address: leadData.address || '',
      service_type: leadData.serviceType,
      scheduled_for: leadData.scheduledFor || 'Flexible',
      message: leadData.message || '',
      status: 'new',
      source: 'website',
    }]);

  if (error) console.error('Supabase error:', error);
  return { error };
}

export async function getLeads() {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
}
