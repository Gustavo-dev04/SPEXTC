import { createClient } from '@supabase/supabase-js'
import type { Modelo, Melhoria, Inspecao, Dataset } from './types'

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://btjboljaylsiezpcdqfp.supabase.co'
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0amJvbGpheWxzaWV6cGNkcWZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyODQwODYsImV4cCI6MjA5NDg2MDA4Nn0.rN2PQOv6h5SdukY_XwT4Y3aYULR7IqrH9qlyIba9dok'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Database {
  public: {
    Tables: {
      modelos: { Row: Modelo }
      melhorias: { Row: Melhoria }
      inspecoes: { Row: Inspecao }
      datasets: { Row: Dataset }
    }
  }
}
