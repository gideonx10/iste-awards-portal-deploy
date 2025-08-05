import nodemailer from 'nodemailer'

export async function POST(req) {
  try {
    const { toEmail, pdfUrl, institute_name } = await req.json()

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: 'ISTE Nomination Confirmation - Best Chapter Award',
      html: `
        <p>Dear Participant,</p>
        <p>Thank you for submitting your nomination for the <strong>ISTE Best Chapter Award</strong>.</p>
        <p>Your institute: <strong>${institute_name || 'N/A'}</strong></p>
        <p>Attached is your registration slip as confirmation of your submission.</p>
        <br/>
        <p>Best Regards,<br/>ISTE Gujarat Section</p>
      `,
      attachments: [
        {
          filename: `registration-slip-${toEmail.replace(/[@.]/g, '_')}.pdf`,
          path: pdfUrl,
        },
      ],
    }

    await transporter.sendMail(mailOptions)

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    })
  } catch (err) {
    console.error('Email sending failed:', err)
    return new Response(JSON.stringify({ error: 'Email failed' }), {
      status: 500,
    })
  }
}
