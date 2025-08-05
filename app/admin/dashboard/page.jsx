'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user.role !== 'admin') {
      router.push('/admin/login')
    }
  }, [session, status])

  if (status === 'loading') return <p>Loading...</p>

  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome Admin</h1>
      <p>Email: {session?.user.email}</p>
      <p>Membership No: {session?.user.membership_no}</p>
    </div>
  )
}
