'use client'

import { CldUploadWidget } from 'next-cloudinary'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import toast, { Toaster } from 'react-hot-toast'

export default function PDFUploadDirect() {
  const { data: session, status } = useSession()
  const [url, setUrl] = useState(null)
  const [userEmail, setUserEmail] = useState(null)

  useEffect(() => {
    if (status === 'authenticated') {
      setUserEmail(session.user.email)
    }
  }, [session, status])

  const getSafeFolderName = (email) => {
    if (!email) return 'ISTE-Awards-Portal/anonymous'
    return `ISTE-Awards-Portal/${email.replace(/[@.]/g, '_')}`
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#10B981',
            color: '#fff',
          },
        }}
      />

      <div className="p-4 border rounded-md">
        {status === 'loading' && <p className="text-gray-600">Loading user session...</p>}

        {status === 'authenticated' ? (
          <CldUploadWidget
            uploadPreset="pdf_uploads"
            options={{
              resourceType: 'raw',
              multiple: false,
              clientAllowedFormats: ['pdf'],
              folder: getSafeFolderName(userEmail),
            }}
            onUpload={(result) => {
              if (result?.info?.secure_url) {
                setUrl(result.info.secure_url)
                toast.success('PDF Uploaded Successfully!')
              }
            }}
            onSuccess={(result) => {
              if (result?.info?.secure_url) {
                setUrl(result.info.secure_url)
                toast.success('PDF Uploaded Successfully!')
              }
            }}
            onError={(error) => {
              console.error('Upload Error:', error)
              toast.error('Upload failed. Please try again.')
            }}
          >
            {({ open }) => (
              <button
                onClick={() => open()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Upload PDF
              </button>
            )}
          </CldUploadWidget>
        ) : (
          <p className="text-gray-600">Please log in to upload a PDF.</p>
        )}

        {url && (
          <div className="mt-4">
            <p>Uploaded PDF:</p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              {url}
            </a>
          </div>
        )}
      </div>
    </>
  )
}
