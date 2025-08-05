'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'

export default function SignupPage() {
  const pathname = usePathname()
  const isAdmin = pathname.includes('/admin')
  const role = isAdmin ? 'admin' : 'user'

  const [formData, setFormData] = useState({
    email: '',
    membership_no: '',
    password: '',
    confirmPassword: '',
  })

  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpVerified, setOtpVerified] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const sendOtp = async () => {
    const { email, membership_no } = formData
    if (!email || !membership_no) return toast.error('Email and Membership No required!')

    setLoading(true)

    const res = await fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, membership_no }),
    })

    const data = await res.json()
    setLoading(false)

    if (data.success) {
      toast.success('OTP sent successfully!')
      setOtpSent(true)
    } else {
      toast.error(data.error || 'Failed to send OTP.')
    }
  }

  const verifyOtp = async () => {
    if (!otp) return toast.error('Enter OTP first.')

    setLoading(true)
    const res = await fetch('/api/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: formData.email, otp }),
    })

    const data = await res.json()
    setLoading(false)

    if (data.success) {
      toast.success('OTP verified!')
      setOtpVerified(true)
    } else {
      toast.error(data.error || 'OTP verification failed.')
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()

    const { email, membership_no, password, confirmPassword } = formData

    if (!otpVerified) return toast.error('Verify your email with OTP first!')
    if (!email || !membership_no || !password || !confirmPassword)
      return toast.error('All fields are required.')
    if (password !== confirmPassword) return toast.error('Passwords do not match.')

    setLoading(true)

    const res = await fetch('/api/register-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, membership_no, password, role }),
    })

    const data = await res.json()
    setLoading(false)

    if (data.success) {
      toast.success('Registered successfully!')
      setFormData({ email: '', membership_no: '', password: '', confirmPassword: '' })
      setOtp('')
      setOtpSent(false)
      setOtpVerified(false)
    } else {
      toast.error(data.error || 'Registration failed.')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 px-4 py-6 border rounded-md shadow">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">
        {isAdmin ? 'Admin' : 'User'} Signup
      </h1>

      <form onSubmit={handleSignup} className="space-y-4">
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
        <div className="flex gap-2">
          <button
            type="button"
            onClick={sendOtp}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>

          {otpSent && !otpVerified && (
            <>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="p-2 border rounded w-full"
              />
              <button
                type="button"
                onClick={verifyOtp}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Verify OTP
              </button>
            </>
          )}
        </div>

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

        <button
          type="submit"
          className={`w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  )
}
