'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [adminEmail, setAdminEmail] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
        error: sessionError
      } = await supabase.auth.getSession()

      if (sessionError || !session) {
        router.push('/login')
        return
      }

      const userId = session.user.id

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role, email')
        .eq('id', userId)
        .single()

      if (userError || userData.role !== 'admin') {
        router.push('/unauthorized')
        return
      }

      setAdminEmail(userData.email)
      setLoading(false)
    }

    fetchUser()
  }, [router])

  if (loading) {
    return <div className="text-center mt-20">Loading dashboard...</div>
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Welcome, Admin</h1>
      <p className="text-gray-600">Logged in as: <span className="font-medium">{adminEmail}</span></p>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Dashboard Overview</h2>
        <p className="text-gray-700">This is the beginning of your admin panel. You’ll soon be able to manage users, submissions, awards, and more.</p>
      </div>
    </div>
  )
}
