// app/api/check-membership/route.js
import { supabase } from '@/lib/supabaseClient'

export async function POST(req) {
  try {
    const { membership_no } = await req.json()

    if (!membership_no) {
      return Response.json({ valid: false, error: 'Missing membership number' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('membership_numbers')
      .select('membership_no')
      .eq('membership_no', membership_no)
      .single()

    if (error || !data) {
      return Response.json({ valid: false })
    }

    return Response.json({ valid: true })
  } catch (err) {
    console.error('Check membership error:', err)
    return Response.json({ valid: false, error: 'Internal server error' }, { status: 500 })
  }
}
