// lib/pdfGenerators/bestChapterAward.js

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

export async function generateBestChapterAwardPDF(formData = {}, userEmail = '') {
  // Create PDF
  const pdfDoc = await PDFDocument.create()
  let page = pdfDoc.addPage([595, 842]) // A4 size in points

  // Embed fonts
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const fontSize = 12
  const lineHeight = 18
  let y = 800

  // Title
  page.drawText('ISTE Best Chapter Award - Registration Slip', {
    x: 50,
    y,
    size: 18,
    font: boldFont,
    color: rgb(0, 0.53, 0.71),
  })

  y -= 30

  // Submitted by
  page.drawText(`Submitted by: ${userEmail}`, {
    x: 50,
    y,
    size: fontSize,
    font,
  })
  y -= 25

  // Loop through formData keys
  for (const key of Object.keys(formData)) {
    const label = key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase())

    const value = formData[key] != null ? String(formData[key]) : ''

    // Add new page if space is running out
    if (y < 50) {
      page = pdfDoc.addPage([595, 842])
      y = 800
    }

    // Draw label
    page.drawText(`${label}:`, {
      x: 50,
      y,
      size: fontSize,
      font: boldFont,
    })

    // Draw value
    page.drawText(value, {
      x: 200,
      y,
      size: fontSize,
      font,
    })

    y -= lineHeight
  }

  // Save and return
  const pdfBytes = await pdfDoc.save()
  return pdfBytes
}
