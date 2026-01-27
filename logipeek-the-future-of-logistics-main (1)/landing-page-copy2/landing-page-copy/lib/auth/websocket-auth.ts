import jwt from 'jsonwebtoken'
import { User } from '@/lib/models/User'
import connectDB from '@/lib/db/mongodb'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production'

export interface SocketUser {
  id: string
  role: string
  email: string
  phone: string
}

export async function verifySocketToken(token: string): Promise<SocketUser | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any

    await connectDB()

    const user = await User.findById(decoded.id).select('_id email phone role isActive')

    if (!user || !user.isActive) {
      return null
    }

    return {
      id: user._id.toString(),
      role: user.role,
      email: user.email,
      phone: user.phone,
    }
  } catch (error) {
    return null
  }
}

export function generateSocketToken(userId: string): string {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' })
}

