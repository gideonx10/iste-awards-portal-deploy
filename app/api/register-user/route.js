// app/api/register-user/route.js
import { supabase } from '@/lib/supabaseClient'

export async function POST(req) {
  try {
    const { email, password, membership_no, role } = await req.json()

    if (!email || !password || !membership_no || !role) {
      return Response.json({ success: false, message: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('users')
      .insert([{ email, password, membership_no, role }])

    if (error) {
      console.error('User registration error:', error)
      return Response.json({ success: false, message: error.message }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (err) {
    console.error('Internal registration error:', err)
    return Response.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
