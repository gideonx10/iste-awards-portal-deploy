// lib/pdfGenerators/bestStudentChapter.js

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

export async function generateBestStudentChapterPDF(formData, userEmail) {
  const pdfDoc = await PDFDocument.create()
  let page = pdfDoc.addPage([595, 842]) // A4
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const fontSize = 12
  const lineHeight = 18
  let y = 800

  // Title
  page.drawText('ISTE Best Student Chapter Registration Slip', {
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

  // Loop through form data
  for (const key in formData) {
    const label = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    const value = formData[key] || ''

    // If space runs out, add a new page
    if (y < 50) {
      page = pdfDoc.addPage([595, 842])
      y = 800
    }

    page.drawText(`${label}:`, {
      x: 50,
      y,
      size: fontSize,
      font: boldFont,
    })

    page.drawText(String(value), {
      x: 200,
      y,
      size: fontSize,
      font,
    })

    y -= lineHeight
  }

  const pdfBytes = await pdfDoc.save()
  return pdfBytes
}
