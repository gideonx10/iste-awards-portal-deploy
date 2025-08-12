// lib/pdfGenerators/bestInnovativeResearcher.js
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

export async function generateBestInnovativeResearcherPDF(formData, userEmail) {
  const pdfDoc = await PDFDocument.create()
  let page = pdfDoc.addPage([595, 842]) // A4 size

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const fontSize = 12
  const lineHeight = 18
  let y = 800

  // Title
  page.drawText('ISTE Best Innovative Researcher - Registration Slip', {
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

  // Loop through formData
  for (const key in formData) {
    const label = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    const value = formData[key] || ''

    // If page overflows, add new page
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

  return await pdfDoc.save()
}
