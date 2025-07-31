'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/navigation'

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
    <div>
      <h1>Dashboard</h1>
      {user && (
        <>
          <p>Welcome, {user.email}</p>
          <button onClick={handleSignout}>Sign Out</button>
        </>
      )}
    </div>
  )
}
