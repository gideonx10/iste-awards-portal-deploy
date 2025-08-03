'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [membershipNumber, setMembershipNumber] = useState('')
  const [error, setError] = useState('')
  const [signedUp, setSignedUp] = useState(false)
  const [intervalId, setIntervalId] = useState(null)

  const router = useRouter()

  const handleSignup = async (e) => {
    e.preventDefault()

    // 1. Validate membership number
    const { data, error: checkError } = await supabase
      .from('membership_numbers')
      .select('*')
      .eq('membership_number', membershipNumber)

    if (checkError || data.length === 0) {
      setError('Invalid membership number.')
      return
    }

    // 2. Sign up user in Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (signUpError) {
      setError(signUpError.message)
    } else {
      setSignedUp(true)
      const id = setInterval(checkEmailVerification, 5000)
      setIntervalId(id)
    }
  }

  const checkEmailVerification = async () => {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
      console.log('Error fetching user:', error.message)
      return
    }

    if (user && user.email_confirmed_at) {
      clearInterval(intervalId)
      router.push('/login')
    }
  }

  return (
    <div>
      <h1>Sign Up</h1>
      {signedUp ? (
        <div>
          <p>A verification email has been sent to <strong>{email}</strong>.</p>
          <p>Please verify your email to continue...</p>
        </div>
      ) : (
        <form onSubmit={handleSignup}>
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
          <input type="text" placeholder="Membership Number" onChange={(e) => setMembershipNumber(e.target.value)} required />
          <button type="submit">Sign Up</button>
        </form>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}
