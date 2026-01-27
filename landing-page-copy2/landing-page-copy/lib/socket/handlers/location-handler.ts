import { Server as SocketIOServer } from 'socket.io'
import { getOrderRoom } from '../rooms'
import { Order } from '@/lib/models/Order'
import connectDB from '@/lib/db/mongodb'

export function setupLocationHandlers(io: SocketIOServer) {
  io.on('connection', (socket) => {
    const userId = (socket as any).user?.id
    const userRole = (socket as any).user?.role

    // Handle driver location updates
    socket.on('location:update', async (data: { lat: number; lng: number; orderId?: string }) => {
      if (userRole !== 'driver') {
        return
      }

      // Broadcast to order room if orderId provided
      if (data.orderId) {
        await connectDB()
        const order = await Order.findById(data.orderId)
        if (order && order.assignedDriverId?.toString() === userId) {
          io.to(getOrderRoom(data.orderId)).emit('location:driver_update', {
            driverId: userId,
            location: { lat: data.lat, lng: data.lng },
            orderId: data.orderId,
          })
        }
      }
    })
  })
}

