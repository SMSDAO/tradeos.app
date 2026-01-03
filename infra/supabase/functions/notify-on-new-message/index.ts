// Edge Function: notify-on-new-message
// Triggered when a new message is created to send notifications

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Parse the payload
    const payload = await req.json()
    const { record } = payload

    console.log('New message received:', record)

    // Here you would implement notification logic:
    // - Send push notification via FCM/APNs
    // - Send email notification
    // - Send webhook to external service
    // - Update notification counters

    // Example: Fetch user info
    const { data: user } = await supabaseClient
      .from('users')
      .select('email, full_name')
      .eq('id', record.user_id)
      .single()

    console.log('Message from user:', user)

    // TODO: Implement actual notification sending
    // For now, just log the event
    const notification = {
      type: 'new_message',
      user: user,
      message: record.content,
      timestamp: record.created_at,
    }

    return new Response(
      JSON.stringify({
        success: true,
        notification,
        message: 'Notification processed (stub implementation)',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error processing notification:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
