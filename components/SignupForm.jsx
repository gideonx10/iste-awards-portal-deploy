'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

export default function SignupForm({ role }) {
  const [formData, setFormData] = useState({
    email: '',
    membership_no: '',
    password: '',
    confirmPassword: '',
  })

  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const sendOtp = async () => {
    const res = await fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.email,
        membership_no: formData.membership_no
      }),
    })

    const data = await res.json()
    if (data.success) {
      toast.success('OTP sent successfully!')
      setOtpSent(true)
    } else {
      toast.error(data.error || 'Failed to send OTP')
    }
  }

  const verifyOtp = async () => {
    const res = await fetch('/api/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: formData.email, otp }),
    })

    const data = await res.json()
    if (data.success) {
      toast.success('OTP verified!')
      setOtpVerified(true)
    } else {
      toast.error(data.error || 'OTP verification failed')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { email, membership_no, password, confirmPassword } = formData

    if (!email || !membership_no || !password || !confirmPassword)
      return toast.error('All fields required')

    if (password !== confirmPassword)
      return toast.error('Passwords do not match')

    if (!otpVerified)
      return toast.error('Verify your email with OTP first')

    const res = await fetch('/api/register-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, membership_no, password, role }),
    })

    const data = await res.json()
    if (data.success) {
      toast.success('Registration successful!')
      setFormData({ email: '', membership_no: '', password: '', confirmPassword: '' })
      setOtp('')
      setOtpSent(false)
      setOtpVerified(false)
    } else {
      toast.error(data.error || 'Registration failed.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="text"
        name="membership_no"
        value={formData.membership_no}
        onChange={handleChange}
        placeholder="Membership Number"
        className="w-full p-2 border rounded"
        required
      />

      <div className="flex gap-2">
        <button
          type="button"
          onClick={sendOtp}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send OTP
        </button>

        {otpSent && !otpVerified && (
          <>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="p-2 border rounded"
            />
            <button
              type="button"
              onClick={verifyOtp}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Verify OTP
            </button>
          </>
        )}
      </div>

      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="Confirm Password"
        className="w-full p-2 border rounded"
        required
      />

      <button
        type="submit"
        className="w-full bg-purple-600 text-white py-2 rounded"
      >
        Register
      </button>
    </form>
  )
}
