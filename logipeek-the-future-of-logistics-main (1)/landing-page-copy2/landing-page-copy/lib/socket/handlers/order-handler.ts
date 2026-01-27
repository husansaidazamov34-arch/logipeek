import { Server as SocketIOServer } from 'socket.io'
import { getOrderRoom, getRegionRoom, getDriverRoom } from '../rooms'
import { Order } from '@/lib/models/Order'
import { User } from '@/lib/models/User'
import { createNotification } from '@/lib/utils/notifications'
import connectDB from '@/lib/db/mongodb'

export function setupOrderHandlers(io: SocketIOServer) {
  io.on('connection', (socket) => {
    const userId = (socket as any).user?.id
    const userRole = (socket as any).user?.role

    // Join driver room if driver
    if (userRole === 'driver') {
      socket.join(getDriverRoom())
    }

    // Handle order creation
    socket.on('order:subscribe', async (data: { orderId: string }) => {
      await connectDB()
      const order = await Order.findById(data.orderId)
      if (order) {
        socket.join(getOrderRoom(data.orderId))
        // Also join region room for drivers
        if (userRole === 'driver') {
          socket.join(getRegionRoom(order.pickupAddress.city))
        }
      }
    })

    // Handle order acceptance
    socket.on('order:accept', async (data: { orderId: string }) => {
      if (userRole !== 'driver') {
        socket.emit('error', { message: 'Only drivers can accept orders' })
        return
      }

      await connectDB()
      const order = await Order.findById(data.orderId).populate('shipperId')
      const driver = await User.findById(userId)

      if (!order || !driver) {
        socket.emit('error', { message: 'Order or driver not found' })
        return
      }

      if (order.status !== 'available') {
        socket.emit('error', { message: 'Order is not available' })
        return
      }

      order.assignedDriverId = driver._id
      order.status = 'accepted'
      order.statusHistory.push({
        status: 'accepted',
        changedAt: new Date(),
        changedBy: driver._id,
      })
      await order.save()

      // Broadcast to order room
      const populatedOrder = await Order.findById(order._id)
        .populate('shipperId', 'firstName lastName phone')
        .populate('assignedDriverId', 'firstName lastName phone')

      io.to(getOrderRoom(data.orderId)).emit('order:accepted', {
        order: populatedOrder,
      })

      // Notify shipper
      await createNotification(
        (order.shipperId as any)._id.toString(),
        'order_accepted',
        'Buyurtma qabul qilindi',
        `Haydovchi ${driver.firstName} ${driver.lastName} buyurtmangizni qabul qildi`,
        {
          orderId: order._id.toString(),
          driverId: driver._id.toString(),
          driverPhone: driver.phone,
        }
      )

      // Remove from available orders for other drivers
      io.to(getDriverRoom()).emit('order:removed', { orderId: data.orderId })
    })

    // Handle order status updates
    socket.on('order:status_update', async (data: { orderId: string; status: string }) => {
      await connectDB()
      const order = await Order.findById(data.orderId)
      if (!order) {
        socket.emit('error', { message: 'Order not found' })
        return
      }

      // Permission check
      if (userRole === 'driver' && order.assignedDriverId?.toString() !== userId) {
        socket.emit('error', { message: 'Forbidden' })
        return
      }
      if (userRole === 'shipper' && order.shipperId.toString() !== userId) {
        socket.emit('error', { message: 'Forbidden' })
        return
      }

      const oldStatus = order.status
      order.status = data.status as any
      order.statusHistory.push({
        status: data.status as any,
        changedAt: new Date(),
        changedBy: userId as any,
      })
      await order.save()

      // Broadcast to order room
      const populatedOrder = await Order.findById(order._id)
        .populate('shipperId', 'firstName lastName phone')
        .populate('assignedDriverId', 'firstName lastName phone')

      io.to(getOrderRoom(data.orderId)).emit('order:status_changed', {
        order: populatedOrder,
        oldStatus,
        newStatus: data.status,
      })
    })
  })
}

