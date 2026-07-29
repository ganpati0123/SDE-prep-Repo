import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

let client: SupabaseClient

function makeNoopBuilder() {
  const handler: ProxyHandler<any> = {
    get(_t, prop) {
      if (prop === 'then' || prop === 'catch' || prop === 'finally') return undefined
      return () => new Proxy(async () => ({ data: null, error: null, count: null, status: 200, statusText: '' }), handler)
    },
  }
  return new Proxy({}, handler)
}

if (supabaseUrl && supabaseAnonKey) {
  client = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } })
} else {
  console.warn('[supabase] Env vars missing — running in offline mode. Data will not persist.')
  client = makeNoopBuilder() as unknown as SupabaseClient
}

export const supabase = client
export const supabaseReady = !!(supabaseUrl && supabaseAnonKey)
