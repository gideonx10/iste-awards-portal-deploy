// /app/api/auth/[...nextauth]/route.js

import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { supabase } from '@/lib/supabaseClient'

const handler = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = credentials

        // Check user in Supabase
        const { data: user, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single()

        if (error || !user) throw new Error('User not found.')

        // Match password (no hashing for now)
        if (user.password !== password) throw new Error('Invalid password.')

        // return user object
        return {
          id: user.uuid,
          email: user.email,
          role: user.role,
          membership_no: user.membership_no,
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.membership_no = user.membership_no
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id
      session.user.role = token.role
      session.user.membership_no = token.membership_no
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
