'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function AdminSignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [membershipNumber, setMembershipNumber] = useState('')
  const [error, setError] = useState('')

  const router = useRouter()

  const handleSignup = async (e) => {
    e.preventDefault()

    // 1. Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    // 2. Validate membership number from pre-approved table
    const { data, error: checkError } = await supabase
      .from('membership_numbers')
      .select('*')
      .eq('membership_number', membershipNumber)

    if (checkError || data.length === 0) {
      setError('Invalid membership number.')
      return
    }

    // 3. Sign up in Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    // 4. Insert into 'users' table with role 'admin'
    const userId = signUpData.user?.id
    if (userId) {
      const { error: insertError } = await supabase
        .from('users')
        .insert([
          {
            id: userId,
            email,
            role: 'admin',
            membership_number: membershipNumber,
          },
        ])

      if (insertError) {
        console.error('Error inserting admin:', insertError)
        setError('Could not save admin details.')
      } else {
        router.push('/admin/login')
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold mb-4">Admin Sign Up</h1>
      <form className="w-full max-w-sm space-y-4" onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Admin Email"
          className="w-full p-2 border border-gray-300 rounded"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border border-gray-300 rounded"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full p-2 border border-gray-300 rounded"
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Membership Number"
          className="w-full p-2 border border-gray-300 rounded"
          onChange={(e) => setMembershipNumber(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Sign Up
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </div>
  )
}
