'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'
// import PDFUpload from '@/components/PDFUpload'
import PDFUploadDirect from '@/components/PDFUploadDirect'

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        router.push('/')
      } else {
        setUser(session.user)
      }
    }

    checkAuth()
  }, [])

  const handleSignout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {user && (
        <>
          <p className="mb-4">Welcome, {user.email}</p>
          <button onClick={handleSignout} className="mb-6 px-4 py-2 bg-red-500 text-white rounded">
            Sign Out
          </button>
          {/* <PDFUpload /> */}
          <PDFUploadDirect />
        </>
      )}
    </div>
  )
}
