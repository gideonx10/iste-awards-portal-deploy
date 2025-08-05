'use client'

import { useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import PDFUploadDirect from '@/components/PDFUploadDirect'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/unauthorized')
    }
  }, [status, router])

  if (status === 'loading') {
    return <p className="p-6">Loading...</p>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {session?.user && (
        <>
          <p className="mb-4">Welcome, {session.user.email}</p>

          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="mb-6 px-4 py-2 bg-red-500 text-white rounded"
          >
            Sign Out
          </button>

          <PDFUploadDirect />
        </>
      )}
    </div>
  )
}
