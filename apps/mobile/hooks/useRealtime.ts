import { useEffect, useState } from 'react'
import { createClient, RealtimeChannel } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || ''

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export function useRealtime<T = any>(
  table: string,
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*' = '*',
  callback: (payload: any) => void
) {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)

  useEffect(() => {
    const channelInstance = supabase
      .channel(`public:${table}`)
      .on('postgres_changes', { event, schema: 'public', table }, callback)
      .subscribe()

    setChannel(channelInstance)

    return () => {
      channelInstance.unsubscribe()
    }
  }, [table, event, callback])

  return channel
}

export function useRealtimeTable<T = any>(table: string) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initial fetch
    const fetchData = async () => {
      const { data: initialData, error } = await supabase
        .from(table)
        .select('*')
      
      if (!error && initialData) {
        setData(initialData as T[])
      }
      setLoading(false)
    }

    fetchData()

    // Subscribe to changes
    const channel = supabase
      .channel(`public:${table}`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setData((prev) => [...prev, payload.new as T])
        } else if (payload.eventType === 'UPDATE') {
          setData((prev) =>
            prev.map((item: any) =>
              item.id === payload.new.id ? (payload.new as T) : item
            )
          )
        } else if (payload.eventType === 'DELETE') {
          setData((prev) =>
            prev.filter((item: any) => item.id !== payload.old.id)
          )
        }
      })
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [table])

  return { data, loading }
}
