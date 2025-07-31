'use client'

import Link from 'next/link'

export default function Landing() {
  return (
    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
      <h1>This is the Landing Page</h1>
      <p>Welcome! Please sign in or sign up to continue.</p>
      <div style={{ marginTop: '2rem' }}>
        <Link href="/login"><button>Sign In</button></Link>
        <Link href="/signup"><button style={{ marginLeft: '1rem' }}>Sign Up</button></Link>
      </div>
    </div>
  )
}
