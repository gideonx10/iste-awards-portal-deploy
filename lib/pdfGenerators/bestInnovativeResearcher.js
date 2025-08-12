// pdfGenerators/bestInnovativeResearcher.js
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

export async function generateBestInnovativeResearcherPDF(formData, userEmail) {
  const pdfDoc = await PDFDocument.create()
  let page = pdfDoc.addPage([595, 842]) // A4
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontSize = 12
  const lineHeight = 18
  let y = 800

  // Title
  page.drawText('ISTE Best Innovative Researcher Registration Slip', {
    x: 50,
    y,
    size: 18,
    font,
    color: rgb(0, 0.53, 0.71),
  })

  y -= 30
  page.drawText(`Submitted by: ${userEmail}`, { x: 50, y, size: 12, font })
  y -= 20

  // Loop through form data
  for (const key in formData) {
    const label = key.replace(/_/g, ' ').toUpperCase()
    const value = formData[key] || ''

    // If space is running out → add a new page
    if (y < 40) {
      page = pdfDoc.addPage([595, 842])
      y = 800
      page.drawText('(continued...)', { x: 50, y, size: 10, font, color: rgb(0.5, 0.5, 0.5) })
      y -= 20
    }

    page.drawText(`${label}: ${value}`, {
      x: 50,
      y,
      size: fontSize,
      font,
    })

    y -= lineHeight
  }

  return await pdfDoc.save()
}
