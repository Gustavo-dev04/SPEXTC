import { createClient } from '@supabase/supabase-js'
import type { Modelo, Melhoria, Inspecao, Dataset } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

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
