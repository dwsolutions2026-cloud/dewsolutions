import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    // During static build time env vars are not available — return a no-op stub
    return null as unknown as ReturnType<typeof createBrowserClient>
  }
  return createBrowserClient(url, key)
}
