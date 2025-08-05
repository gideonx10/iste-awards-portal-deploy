// lib/generatePDFBestChapter.js

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

export async function generatePDFBuffer(formData, userEmail) {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595, 842]) // A4 size

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontSize = 12
  const lineHeight = 18

  let y = 800

  page.drawText('ISTE Best Chapter Registration Slip', {
    x: 50,
    y,
    size: 18,
    font,
    color: rgb(0, 0.53, 0.71),
  })

  y -= 30

  page.drawText(`Submitted by: ${userEmail}`, { x: 50, y, size: 12, font })
  y -= 20

  // Loop through formData and render key-value pairs
  for (const key in formData) {
    const label = key.replace(/_/g, ' ').toUpperCase()
    const value = formData[key] || ''

    // Stop writing if page overflows
    if (y < 40) break

    page.drawText(`${label}: ${value}`, {
      x: 50,
      y,
      size: fontSize,
      font,
    })

    y -= lineHeight
  }

  const pdfBytes = await pdfDoc.save()
  return pdfBytes
}
