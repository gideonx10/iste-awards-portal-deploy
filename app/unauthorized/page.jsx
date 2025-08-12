'use client'

import { useRouter } from 'next/navigation'

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <div className="max-w-xl mx-auto mt-20 text-center px-4">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
      <p className="text-gray-700 text-lg mb-6">
        You do not have permission to access this page. Please ensure you are logged in with the correct account.
      </p>
      <div className="flex gap-45">
        <button
          onClick={() => router.push('/')}
          className="bg-blue-600 text-white px-6 py-4 rounded hover:bg-blue-700"
        >
          Go to Homepage
        </button>

        <button
          onClick={() => router.push('/login')}
          className="bg-green-600 text-white px-6 py-4 rounded hover:bg-green-700"
        >
          Go to Login Page
        </button>
      </div>

    </div>
  )
}
