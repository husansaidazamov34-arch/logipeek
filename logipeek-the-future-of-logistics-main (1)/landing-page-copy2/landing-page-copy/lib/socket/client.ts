import { io, Socket } from 'socket.io-client'
import { getSession } from 'next-auth/react'

let socket: Socket | null = null

export async function getSocket(): Promise<Socket | null> {
  if (socket?.connected) {
    return socket
  }

  const session = await getSession()
  if (!session?.user) {
    return null
  }

  // Get token from session (we'll need to store it)
  const token = (session as any).token || ''

  socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000', {
    path: '/api/socket',
    auth: {
      token,
    },
    transports: ['websocket', 'polling'],
  })

  socket.on('connect', () => {
    // Socket connected
  })

  socket.on('disconnect', () => {
    // Socket disconnected
  })

  socket.on('error', (error) => {
    console.error('Socket error:', error)
  })

  return socket
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

