'use client'

import { CldUploadWidget } from 'next-cloudinary'
import toast from 'react-hot-toast'

const getSafeFolderName = (email) => {
  if (!email) return 'ISTE-Awards-Portal/anonymous'
  return `ISTE-Awards-Portal/${email.replace(/[@.]/g, '_')}`
}

export default function UploadPDFSection({ userEmail, setPdfUrl }) {
  return (
    <div className="my-4">
      <p className="font-semibold mb-2">Upload Nomination PDF</p>

      {userEmail ? (
        <CldUploadWidget
          uploadPreset="pdf_uploads"
          options={{
            resourceType: 'raw',
            folder: getSafeFolderName(userEmail),
            multiple: false,
            clientAllowedFormats: ['pdf'],
          }}
          onSuccess={(result) => {
            if (result?.info?.secure_url) {
              setPdfUrl(result.info.secure_url)
              toast.success('PDF Uploaded Successfully!')
            }
          }}
          onError={(error) => {
            console.error('Upload failed:', error)
            toast.error('Upload failed. Try again.')
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Upload PDF
            </button>
          )}
        </CldUploadWidget>
      ) : (
        <p className="text-gray-600">Loading user session...</p>
      )}
    </div>
  )
}
