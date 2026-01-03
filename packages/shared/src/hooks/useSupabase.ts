import { useState, useEffect } from 'react'
import { createClient, SupabaseClient, Session } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null

export function initializeSupabase(url: string, anonKey: string) {
  if (!supabaseInstance) {
    supabaseInstance = createClient(url, anonKey)
  }
  return supabaseInstance
}

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseInstance) {
    throw new Error('Supabase not initialized. Call initializeSupabase first.')
  }
  return supabaseInstance
}

export function useSupabase() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const client = getSupabaseClient()

  useEffect(() => {
    // Get initial session
    client.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [client])

  return {
    client,
    session,
    loading,
    user: session?.user ?? null,
  }
}
