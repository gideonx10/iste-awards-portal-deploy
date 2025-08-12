import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { formConfig } from '@/lib/formConfig'
import nodemailer from 'nodemailer'
import axios from 'axios'

// Main POST handler
export async function POST(req) {
  try {
    const { formKey, formData, userEmail } = await req.json()

    // Validate form key
    const config = formConfig[formKey]
    if (!config) {
      return NextResponse.json({ error: 'Invalid form key' }, { status: 400 })
    }

    // 1️⃣ Generate Registration Slip PDF
    const pdfBuffer = await config.generatePDF(formData, userEmail)
    const blob = new Blob([pdfBuffer], { type: 'application/pdf' })

    const safeEmail = userEmail.replace(/[@.]/g, '_')
    const formName = formKey.replace(/_/g, '-').toLowerCase()
    const file = new File(
      [blob],
      `registration-slip-${safeEmail}-${formName}.pdf`,
      { type: 'application/pdf' }
    )

    // 2️⃣ Upload Registration Slip to Cloudinary
    const formDataCloudinary = new FormData()
    formDataCloudinary.append('file', file)
    formDataCloudinary.append('upload_preset', 'pdf_uploads') // preset from Cloudinary settings
    formDataCloudinary.append('folder', `ISTE-Awards-Portal`)
    formDataCloudinary.append('public_id', `ISTE-Awards-Portal/${safeEmail}/${formName}/registration-slip`)
    formDataCloudinary.append('resource_type', 'raw')

    const cloudRes = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload`,
      {
        method: 'POST',
        body: formDataCloudinary
      }
    )

    const cloudData = await cloudRes.json()
    if (!cloudData.secure_url) {
      throw new Error('Failed to upload registration slip to Cloudinary.')
    }
    const registrationSlipUrl = cloudData.secure_url

    // 3️⃣ Store in Supabase
    const { error: dbError } = await supabase
      .from(config.table)
      .insert([
        {
          ...formData,
          user_email: userEmail,
          registration_slip_url: registrationSlipUrl,
        },
      ])

    if (dbError) {
      console.error(dbError)
      return NextResponse.json({ error: 'Error saving submission' }, { status: 500 })
    }

    // 4️⃣ Fetch PDF from Cloudinary for attachment
    const pdfResponse = await axios.get(registrationSlipUrl, { responseType: 'arraybuffer' })
    const pdfAttachmentBuffer = Buffer.from(pdfResponse.data)

    // 5️⃣ Send Confirmation Email with PDF attachment
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: userEmail,
      subject: config.emailSubject,
      text: `Dear ${userEmail},

${config.emailIntro}

Please find your registration slip attached.

Regards,
ISTE Team`,
      attachments: [
        {
          filename: `registration-slip-${safeEmail}-${formName}.pdf`,
          content: pdfAttachmentBuffer,
          contentType: 'application/pdf',
        }
      ]
    })

    // 6️⃣ Return success
    return NextResponse.json({ success: true, registrationSlipUrl })

  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
