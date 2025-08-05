'use client'

import { useParams } from 'next/navigation'
import BestChapterForm from '@/components/forms/BestChapterForm'
// import other forms below when ready
// import BestFacultyForm from '@/components/forms/BestFacultyForm'
// import OutstandingContributionForm from '@/components/forms/OutstandingContributionForm'

export default function RegisterPage() {
  const { id } = useParams()

  const renderForm = () => {
    switch (id) {
      case '0':
        return <BestChapterForm />
      // case '1':
      //   return <BestFacultyForm />
      // case '2':
      //   return <OutstandingContributionForm />
      default:
        return (
          <div className="p-8 text-center text-red-500">
            Invalid form index: {id}
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Nomination Form</h1>
      {renderForm()}
    </div>
  )
}
