// api/check-submission/route.js
import { supabase } from '@/lib/supabaseClient'
import { NextResponse } from 'next/server'

/**
 * GET /api/check-submission?email=<user_email>&form=<table_name>
 * Checks if the given user has submitted a nomination for the given form/table.
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')
    const formTable = searchParams.get('form')

    if (!email || !formTable) {
      return NextResponse.json(
        { error: 'Missing required parameters: email, form' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from(formTable)
      .select('registration_slip_url')
      .eq('user_email', email)
      .maybeSingle() // safer than .single() if no rows exist

    if (error) {
      console.error(`Supabase error on table ${formTable}:`, error)
      return NextResponse.json(
        { error: 'Database error', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      exists: !!data,
      registration_slip_url: data?.registration_slip_url || null,
    })
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
