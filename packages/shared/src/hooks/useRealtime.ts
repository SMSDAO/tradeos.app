import { useEffect, useState } from 'react'
import { RealtimeChannel } from '@supabase/supabase-js'
import { getSupabaseClient } from './useSupabase'

export function useRealtime<T = any>(
  table: string,
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*' = '*',
  callback: (payload: any) => void
) {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)
  const client = getSupabaseClient()

  useEffect(() => {
    const channelInstance = client
      .channel(`public:${table}`)
      .on('postgres_changes', { event, schema: 'public', table }, callback)
      .subscribe()

    setChannel(channelInstance)

    return () => {
      channelInstance.unsubscribe()
    }
  }, [table, event, callback, client])

  return channel
}
