import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(req) {
  const { email, otp } = await req.json()

  if (!email || !otp) {
    return NextResponse.json({ error: 'Email and OTP are required.' }, { status: 400 })
  }

  // 1. Fetch the OTP record from Supabase
  const { data: otpEntry, error } = await supabase
    .from('otps')
    .select('*')
    .eq('email', email)
    .single()

  if (!otpEntry || error) {
    return NextResponse.json({ error: 'OTP not found or expired.' }, { status: 404 })
  }

  // 2. Check if OTP matches
  if (otpEntry.otp !== otp) {
    return NextResponse.json({ error: 'Incorrect OTP' }, { status: 401 })
  }

  // 3. Check if OTP is within 5 minutes
  const createdAt = new Date(otpEntry.created_at)
  const now = new Date()
  const diffInMinutes = (now - createdAt) / 1000 / 60

  // if (diffInMinutes > 5) {
  //   return NextResponse.json({ error: 'OTP expired' }, { status: 410 })
  // }

  // 4. Cleanup — delete OTP from DB
  await supabase.from('otps').delete().eq('email', email)

  // 5. Return success
  return NextResponse.json({ success: true, message: 'OTP verified successfully.' })
}
