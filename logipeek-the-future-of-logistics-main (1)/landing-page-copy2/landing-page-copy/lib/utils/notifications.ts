import { Notification, NotificationType } from '@/lib/models/Notification'
import connectDB from '@/lib/db/mongodb'

export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  payload?: Record<string, any>
) {
  await connectDB()

  const notification = await Notification.create({
    userId,
    type,
    title,
    message,
    payload,
    read: false,
  })

  return notification
}

export async function createNotificationForUsers(
  userIds: string[],
  type: NotificationType,
  title: string,
  message: string,
  payload?: Record<string, any>
) {
  await connectDB()

  const notifications = userIds.map((userId) => ({
    userId,
    type,
    title,
    message,
    payload,
    read: false,
  }))

  await Notification.insertMany(notifications)
}

