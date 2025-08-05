'use client'

import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function AddUserPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [formData, setFormData] = useState({
    email: '',
    membership_no: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddUser = async (e) => {
    e.preventDefault()
    const { email, membership_no, password, confirmPassword, role } = formData

    if (!email || !membership_no || !password || !confirmPassword || !role)
      return toast.error('All fields are required.')

    if (password !== confirmPassword)
      return toast.error('Passwords do not match.')

    setLoading(true)

    const res = await fetch('/api/register-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, membership_no, password, role }),
    })

    const data = await res.json()
    setLoading(false)

    if (data.success) {
      toast.success('User added successfully!')
      setFormData({ email: '', membership_no: '', password: '', confirmPassword: '', role: 'user' })
    } else {
      toast.error(data.error || 'Failed to add user.')
    }
  }

  if (status === 'loading') return <p>Loading...</p>
  if (session?.user?.role !== 'admin') {
    router.push('/unauthorized')
    return null
  }

  return (
    <div className="max-w-md mx-auto mt-10 px-4 py-6 border rounded-md shadow">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">Add New User</h1>

      <form onSubmit={handleAddUser} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="membership_no"
          placeholder="Membership Number"
          value={formData.membership_no}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 ${loading ? 'opacity-50' : ''}`}
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add User'}
        </button>
      </form>
    </div>
  )
}
