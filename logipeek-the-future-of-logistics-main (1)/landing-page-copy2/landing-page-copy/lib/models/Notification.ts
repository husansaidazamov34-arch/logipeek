import mongoose, { Schema, Document, Model } from 'mongoose'

export type NotificationType =
  | 'order_created'
  | 'order_accepted'
  | 'order_status_changed'
  | 'order_cancelled'
  | 'driver_assigned'
  | 'driver_en_route'
  | 'order_delivered'
  | 'payment_received'
  | 'payment_failed'
  | 'admin_message'
  | 'profile_approved'
  | 'profile_rejected'
  | 'document_verified'
  | 'system'

export interface INotification extends Document {
  _id: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  type: NotificationType
  title: string
  message: string
  payload?: {
    orderId?: string
    driverId?: string
    amount?: number
    [key: string]: any
  }
  read: boolean
  readAt?: Date
  createdAt: Date
  updatedAt: Date
}

const NotificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        'order_created',
        'order_accepted',
        'order_status_changed',
        'order_cancelled',
        'driver_assigned',
        'driver_en_route',
        'order_delivered',
        'payment_received',
        'payment_failed',
        'admin_message',
        'profile_approved',
        'profile_rejected',
        'document_verified',
        'system',
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    payload: {
      type: Schema.Types.Mixed,
    },
    read: {
      type: Boolean,
      default: false,
    },
    readAt: Date,
  },
  {
    timestamps: true,
  }
)

// Indexes
NotificationSchema.index({ userId: 1, read: 1 })
NotificationSchema.index({ userId: 1, createdAt: -1 })
NotificationSchema.index({ type: 1 })

export const Notification: Model<INotification> =
  mongoose.models.Notification ||
  mongoose.model<INotification>('Notification', NotificationSchema)

