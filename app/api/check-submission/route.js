// /api/check-submission/route.js
import { supabase } from '@/lib/supabaseClient'
import { NextResponse } from 'next/server'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')

  const { data, error } = await supabase
    .from('best_chapter_award')
    .select('registration_slip_url')
    .eq('user_email', email)
    .single()

  if (data) {
    return NextResponse.json({ exists: true, registration_slip_url: data.registration_slip_url })
  } else {
    return NextResponse.json({ exists: false })
  }
}
