'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { generatePDFBuffer } from '@/lib/generatePDFBestChapter'
import UploadPDFSection from '@/components/UploadPDFSection'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function BestChapterForm() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [formData, setFormData] = useState({
    institute_name: '',
    address: '',
    pin: '',
    phone: '',
    email: '',
    website: '',
    chapter_page_link: '',
    im_number: '',
    im_year: '',
    faculty_chapter_number: '',
    faculty_chapter_year: '',
    num_lm: '',
    student_chapter_number: '',
    student_chapter_year: '',
    num_student_members: '',
    head_name: '',
    head_designation: '',
    head_phone: '',
    head_mobile: '',
    head_email: '',
    chairman_name: '',
    chairman_designation: '',
    chairman_phone: '',
    chairman_mobile: '',
    chairman_email: '',
    secretary_name: '',
    secretary_designation: '',
    secretary_phone: '',
    secretary_mobile: '',
    secretary_email: '',
    new_lm: '',
    events_international: '',
    events_national: '',
    events_local: '',
    days_international: '',
    days_national: '',
    days_local: '',
    summary: '',
  })

  const [pdfUrl, setPdfUrl] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [existingSlipUrl, setExistingSlipUrl] = useState('')

  useEffect(() => {
    if (status === 'authenticated') {
      const email = session?.user?.email
      setUserEmail(email)
      checkIfAlreadySubmitted(email)
    } else if (status === 'unauthenticated') {
      router.push('/unauthorized') // redirect if not logged in
    }
  }, [status])

  const checkIfAlreadySubmitted = async (email) => {
    const res = await fetch(`/api/check-submission?email=${email}`)
    const data = await res.json()

    if (data.exists) {
      setHasSubmitted(true)
      setExistingSlipUrl(data.registration_slip_url)
    }
  }

  const getSafeFolderName = (email) => {
    return `ISTE-Awards-Portal/${email.replace(/[@.]/g, '_')}`
  }

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    if (!pdfUrl) return toast.error('Please upload the nomination PDF first.')

    setSubmitting(true)

    try {
      const pdfBuffer = await generatePDFBuffer(formData, userEmail)
      const blob = new Blob([pdfBuffer], { type: 'application/pdf' })

      const file = new File(
        [blob],
        `registration-slip-${userEmail.replace(/[@.]/g, '_')}.pdf`,
        { type: 'application/pdf' }
      )

      const formDataCloudinary = new FormData()
      formDataCloudinary.append('file', file)
      formDataCloudinary.append('upload_preset', 'pdf_uploads')
      formDataCloudinary.append('folder', getSafeFolderName(userEmail))
      formDataCloudinary.append(
        'public_id',
        `${getSafeFolderName(userEmail)}/registration-slip-${userEmail.replace(/[@.]/g, '_')}`
      )
      formDataCloudinary.append('resource_type', 'raw')

      const cloudRes = await fetch('https://api.cloudinary.com/v1_1/dz45ms5dt/raw/upload', {
        method: 'POST',
        body: formDataCloudinary,
      })

      const cloudData = await cloudRes.json()
      if (!cloudData.secure_url) throw new Error('Cloudinary upload failed.')

      const registrationSlipUrl = cloudData.secure_url

      // Store in DB
      const insertRes = await fetch('/api/submit-best-chapter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          user_email: userEmail,
          nomination_pdf_url: pdfUrl,
          registration_slip_url: registrationSlipUrl,
        }),
      })

      const insertData = await insertRes.json()
      if (!insertData.success) throw new Error(insertData.error)

      // Send email confirmation
      await fetch('/api/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toEmail: userEmail,
          pdfUrl: registrationSlipUrl,
          institute_name: formData.institute_name,
        }),
      })

      toast.success('Nomination submitted successfully!')
      setHasSubmitted(true)
      setExistingSlipUrl(registrationSlipUrl)
      setFormData({})
      setPdfUrl('')
    } catch (err) {
      console.error(err)
      toast.error('Error submitting form.')
    } finally {
      setSubmitting(false)
    }
  }

  if (status === 'loading') {
    return <p className="text-center mt-10">Loading session...</p>
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">ISTE Best Chapter Nomination Form</h1>

      {hasSubmitted ? (
        <div className="p-4 border border-green-400 rounded bg-green-50 text-green-700">
          <p className="font-semibold mb-2">
            ✅ You have successfully nominated for this award.
          </p>
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
