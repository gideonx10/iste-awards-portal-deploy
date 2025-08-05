import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { supabase } from '@/lib/supabaseClient'

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(req) {
  const { email, membership_no } = await req.json()

  if (!email || !membership_no) {
    return NextResponse.json({ error: 'Email and membership number are required.' }, { status: 400 })
  }

  // Step 1: Check if the membership_no exists
  const { data: validMembership, error: membershipError } = await supabase
    .from('membership_numbers')
    .select('*')
    .eq('membership_number', membership_no)
    .single();

  if (!validMembership || membershipError) {
    return NextResponse.json({ error: 'Invalid Membership Number' }, { status: 403 })
  }

  // Step 2: Generate OTP
  const otp = generateOTP()

  // Step 3: Store OTP in Supabase otps table (overwrite any existing)
  await supabase
    .from('otps')
    .upsert({
      email,
      otp,
      created_at: new Date().toISOString(),
    })

  // Step 4: Send OTP Email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASS,
    },
  })

  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: email,
    subject: 'ISTE Awards Portal - Verify Your Email',
    html: `
      <h2>ISTE Email Verification</h2>
      <p>Use the following OTP to verify your email:</p>
      <h1>${otp}</h1>
      <p>This OTP is valid for 5 minutes.</p>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    return NextResponse.json({ success: true, message: 'OTP sent successfully' })
  } catch (error) {
    console.error('Email sending failed:', error)
    return NextResponse.json({ error: 'Failed to send OTP email.' }, { status: 500 })
  }
}
