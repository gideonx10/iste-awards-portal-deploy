'use client'

import { useRouter } from 'next/navigation'

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <div className="max-w-xl mx-auto mt-20 text-center px-4">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
      <p className="text-gray-700 text-lg mb-6">
        You do not have permission to access this page.
      </p>

      <button
        onClick={() => router.push('/')}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Go to Homepage
      </button>
    </div>
  )
}
