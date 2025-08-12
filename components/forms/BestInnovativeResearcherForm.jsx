'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import UploadPDFSection from '@/components/UploadPDFSection'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { formConfig } from '@/lib/formConfig'

export default function BestInnovativeResearcherForm() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [formData, setFormData] = useState({
  faculty_name: '',
  faculty_address: '',
  faculty_mobile: '',
  faculty_email: '',
  institute_name: '',
  institute_address: '',
  institute_phone: '',
  institute_email: '',
  institute_pin: '',
  im_number: '',
  im_year: '',
  research_innovation: '',
  sustainability_impact: '',
  other_activities: '',
  })

  const [pdfUrl, setPdfUrl] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [existingSlipUrl, setExistingSlipUrl] = useState('')

  const formKey = 'best_innovative_researcher_award'
  const { emailSubject, emailIntro, table } = formConfig[formKey]

  useEffect(() => {
    if (status === 'authenticated') {
      const email = session?.user?.email
      setUserEmail(email)
      checkIfAlreadySubmitted(email)
    } else if (status === 'unauthenticated') {
      router.push('/unauthorized')
    }
  }, [status])

  const checkIfAlreadySubmitted = async (email) => {
    try {
      const res = await fetch(
        `/api/check-submission?email=${encodeURIComponent(email)}&form=${formKey}`
      )
      const data = await res.json()

      if (data.exists) {
        setHasSubmitted(true)
        setExistingSlipUrl(data.registration_slip_url)
      }
    } catch (err) {
      console.error('Error checking submission:', err)
      toast.error('Unable to check submission status.')
    }
  }

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    if (!pdfUrl) return toast.error('Please upload the nomination PDF first.')

    setSubmitting(true)

    try {
      const res = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formKey,
          formData: { ...formData, nomination_pdf_url: pdfUrl },
          userEmail,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Submission failed.')
      }

      toast.success('Nomination submitted successfully!')
      setHasSubmitted(true)
      setExistingSlipUrl(data.registrationSlipUrl || data.registration_slip_url)
      setFormData({
        faculty_name: '',
        faculty_address: '',
        faculty_mobile: '',
        faculty_email: '',
        institute_name: '',
        institute_address: '',
        institute_phone: '',
        institute_email: '',
        institute_pin: '',
        im_number: '',
        im_year: '',
        research_innovation: '',
        sustainability_impact: '',
        other_activities: '',
      })
      setPdfUrl('')
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Error submitting form.')
    } finally {
      setSubmitting(false)
    }
  }

  if (status === 'loading') {
    return <p className="text-center mt-10">Loading session...</p>
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">ISTE Best Innovative Researcher Nomination Form</h1>

      {hasSubmitted ? (
        <div className="p-4 border border-green-400 rounded bg-green-50 text-green-700">
          <p className="font-semibold mb-2">✅ You have successfully nominated for this award.</p>
          <p>
            Your registration slip:{' '}
            <a
              href={existingSlipUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
              download
            >
              Download Slip
            </a>
          </p>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleFormSubmit}>
          {Object.keys(formData).map((key) => (
            <input
              key={key}
              name={key}
              placeholder={key.replace(/_/g, ' ').toUpperCase()}
              value={formData[key]}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          ))}

          <UploadPDFSection userEmail={userEmail} setPdfUrl={setPdfUrl} />

          {pdfUrl && <p className="text-green-600">PDF uploaded successfully!</p>}

          <button
            type="submit"
            className={`w-full bg-green-600 text-white py-2 rounded ${
              submitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Nomination'}
          </button>
        </form>
      )}
    </div>
  )
}
