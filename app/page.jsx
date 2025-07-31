'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const [user, setUser] = useState(null)
  const [membership, setMembership] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session?.user) {
        router.push('/signin')
        return
      }

      setUser(session.user)

      const { data, error } = await supabase
        .from('membership_numbers')
        .select('membership_number')
        .eq('user_id', session.user.id)
        .single()

      if (data) {
        setMembership(data.membership_number)
      }
    }

    getUser()
  }, [])

  const handleSignout = async () => {
    await supabase.auth.signOut()
    router.push('/signin')
  }

  return (
    <div>
      <h1>Welcome!</h1>
      {user && (
        <>
          <p>Email: {user.email}</p>
          <p>Membership Number: {membership}</p>
          <button onClick={handleSignout}>Sign Out</button>
        </>
      )}
    </div>
  )
}
