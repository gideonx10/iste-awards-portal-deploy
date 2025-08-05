import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(req) {
  try {
    const payload = await req.json()

    const { user_email, nomination_pdf_url, registration_slip_url, ...formFields } = payload

    const { error } = await supabase.from('best_chapter_award').insert([
      {
        ...formFields,
        user_email,
        nomination_pdf_url,
        registration_slip_url,
      },
    ])

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Submission error:', err)
    return NextResponse.json({ success: false, error: 'Unexpected server error.' }, { status: 500 })
  }
}
