'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Landing from '../components/Landing'

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [session, setSession] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        router.push('/dashboard')
      } else {
        setSession(null)
        setIsLoading(false)
      }
    }

    checkSession()
  }, [])

  if (isLoading) return <p>Loading...</p>

  return <Landing />
}
