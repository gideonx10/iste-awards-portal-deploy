'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()

    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (loginError) {
      setError('Invalid email or password')
      return
    }

    // Check role from users table
    const userId = data.user.id
    const { data: userData, error: roleError } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single()

    if (roleError || userData?.role !== 'admin') {
      setError('Access denied: Not an admin.')
      return
    }

    router.push('/admin/dashboard') // or wherever you route admins
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
      <form className="w-full max-w-sm space-y-4" onSubmit={handleLogin}>
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
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Log In
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  )
}
