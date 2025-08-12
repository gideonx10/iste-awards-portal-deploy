// lib/formConfig.js

import { generateBestChapterAwardPDF } from '@/lib/pdfGenerators/bestChapterAward'
import { generateBestInnovativeResearcherPDF } from '@/lib/pdfGenerators/bestInnovativeResearcher'
import { generateBestStudentChapterPDF } from '@/lib/pdfGenerators/bestStudentChapter'
// ✅ Import additional PDF generators here

export const formConfig = {
  best_chapter_award: {
    table: 'best_chapter_award',
    emailSubject: 'ISTE Best Chapter Award Submission Confirmation',
    emailIntro: 'Thank you for submitting your nomination for the ISTE Best Chapter Award.',
    generatePDF: generateBestChapterAwardPDF
  },
  best_innovative_researcher_award: {
    table: 'best_innovative_researcher_award',
    emailSubject: 'ISTE Best Innovative Researcher Submission Confirmation',
    emailIntro: 'Thank you for submitting your nomination for the ISTE Best Innovative Researcher Award.',
    generatePDF: generateBestInnovativeResearcherPDF
  },
  best_student_chapter_award: {
    table: 'best_student_chapter_award',
    emailSubject: 'ISTE Best Student Chapter Submission Confirmation',
    emailIntro: 'Thank you for submitting your nomination for the ISTE Best Student Chapter Award.',
    generatePDF: generateBestStudentChapterPDF
  },

  // 🔹 Add new awards below
  // example_award: {
  //   table: 'example_award',
  //   emailSubject: 'ISTE Example Award Submission Confirmation',
  //   emailIntro: 'Thank you for submitting your nomination for the ISTE Example Award.',
  //   generatePDF: generateExampleAwardPDF
  // }
}
