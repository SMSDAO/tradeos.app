import { createBrowserClient as createClient } from '@supabase/ssr'

/**
 * Create a Supabase client for browser/client-side usage
 * This client is safe to use in client components and API routes
 */
export function createBrowserClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

/**
 * For server-side usage in App Router, use this in Server Components
 * WARNING: This uses the anon key, not the service role key
 */
export function createServerClient() {
  // Import dynamically to avoid server-only code in client bundle
  const { createServerClient: createServer } = require('@supabase/ssr')
  const { cookies } = require('next/headers')
  
  return createServer(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookies().get(name)?.value
        },
      },
    }
  )
}

/**
 * Server-only admin client with service role key
 * CAUTION: This bypasses Row Level Security (RLS)
 * Only use in secure server-side contexts
 */
export function createAdminClient() {
  const { createClient } = require('@supabase/supabase-js')
  
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  }
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}
