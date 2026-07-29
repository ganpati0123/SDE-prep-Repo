import { supabase, supabaseReady } from './supabase'

export async function safeSelect<T = any>(table: string, query?: any): Promise<T[]> {
  if (!supabaseReady || !supabase) return []
  try {
    let q = supabase.from(table).select('*')
    if (query?.eq) {
      for (const [col, val] of Object.entries(query.eq)) {
        q = q.eq(col, val)
      }
    }
    const { data, error } = await q
    if (error) {
      console.warn(`safeSelect ${table}:`, error.message)
      return []
    }
    return (data as T[]) || []
  } catch (e) {
    console.warn(`safeSelect ${table} failed:`, e)
    return []
  }
}

export async function safeUpsert<T = any>(table: string, row: Record<string, any>): Promise<T | null> {
  if (!supabaseReady || !supabase) return null
  try {
    const { data, error } = await supabase.from(table).upsert(row).select().single()
    if (error) {
      console.warn(`safeUpsert ${table}:`, error.message)
      return null
    }
    return data as T
  } catch (e) {
    console.warn(`safeUpsert ${table} failed:`, e)
    return null
  }
}

export async function safeDelete(table: string, match: Record<string, any>): Promise<boolean> {
  if (!supabaseReady || !supabase) return false
  try {
    const { error } = await supabase.from(table).delete().match(match)
    if (error) {
      console.warn(`safeDelete ${table}:`, error.message)
      return false
    }
    return true
  } catch (e) {
    console.warn(`safeDelete ${table} failed:`, e)
    return false
  }
}
