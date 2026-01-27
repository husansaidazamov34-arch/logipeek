import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/db/mongodb'
import { User, IUser } from '@/lib/models/User'
import { mockAuthService, shouldUseMockAuth } from './mock-auth'

export const authOptions: any = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        phone: { label: 'Phone', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any) {
        if (!credentials?.phone || !credentials?.password) {
          return null
        }

        // Use mock auth if no database
        if (shouldUseMockAuth()) {
          console.log('[AUTH] Using mock authentication')
          const mockUser = mockAuthService.validateLogin(credentials.phone, credentials.password)
          if (!mockUser) {
            console.log('[AUTH] Mock login failed for:', credentials.phone)
            return null
          }
          console.log('[AUTH] Mock login success for:', mockUser.phone)
          return {
            id: mockUser.id,
            email: mockUser.email || `${mockUser.phone}@logipeek.uz`,
            phone: mockUser.phone,
            name: `${mockUser.firstName} ${mockUser.lastName}`,
            role: mockUser.role,
            avatar: '/avatars/default.jpg',
          }
        }

        // Real database auth
        try {
          await connectDB()

          const user = await User.findOne({ phone: credentials.phone, isActive: true, isVerified: true })

          if (!user) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user._id.toString(),
            email: user.email,
            phone: user.phone,
            name: `${user.firstName} ${user.lastName}`,
            role: user.role,
            avatar: user.avatar,
          }
        } catch (error) {
          console.error('[AUTH] Database error, falling back to mock:', error)
          // Fallback to mock auth on DB error
          const mockUser = mockAuthService.validateLogin(credentials.phone, credentials.password)
          if (!mockUser) return null
          return {
            id: mockUser.id,
            email: mockUser.email || `${mockUser.phone}@logipeek.uz`,
            phone: mockUser.phone,
            name: `${mockUser.firstName} ${mockUser.lastName}`,
            role: mockUser.role,
            avatar: '/avatars/default.jpg',
          }
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.phone = user.phone
      }
      return token
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.phone = token.phone
      }
      return session
    },
  },
  pages: {
    signIn: '/',
    error: '/403',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production',
}

export const { auth, handlers, signIn, signOut } = NextAuth(authOptions)

