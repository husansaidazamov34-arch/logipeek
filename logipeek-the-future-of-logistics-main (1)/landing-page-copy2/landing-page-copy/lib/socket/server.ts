import { Server as HTTPServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { verifySocketToken } from '@/lib/auth/websocket-auth'
import { setupOrderHandlers } from './handlers/order-handler'
import { setupLocationHandlers } from './handlers/location-handler'

let io: SocketIOServer | null = null

export function initializeSocket(server: HTTPServer): SocketIOServer {
  if (io) {
    return io
  }

  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    path: '/api/socket',
  })

  // Authentication middleware
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return next(new Error('Authentication error'))
    }

    const user = await verifySocketToken(token)
    if (!user) {
      return next(new Error('Authentication error'))
    }

    ;(socket as any).user = user
    next()
  })

  // Setup handlers
  setupOrderHandlers(io)
  setupLocationHandlers(io)

  return io
}

export function getIO(): SocketIOServer | null {
  return io
}

