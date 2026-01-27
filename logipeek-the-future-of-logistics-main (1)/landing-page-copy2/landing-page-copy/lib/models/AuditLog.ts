import mongoose, { Schema, Document, Model } from 'mongoose'

export type AuditAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'approve'
  | 'reject'
  | 'status_change'
  | 'assign'
  | 'accept'
  | 'cancel'

export type AuditEntity = 'order' | 'user' | 'document' | 'payment' | 'notification'

export interface IAuditLog extends Document {
  _id: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId // Who performed the action
  entityType: AuditEntity
  entityId: mongoose.Types.ObjectId
  action: AuditAction
  changes?: {
    field: string
    oldValue: any
    newValue: any
  }[]
  metadata?: {
    ipAddress?: string
    userAgent?: string
    reason?: string
    [key: string]: any
  }
  createdAt: Date
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    entityType: {
      type: String,
      enum: ['order', 'user', 'document', 'payment', 'notification'],
      required: true,
      index: true,
    },
    entityId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    action: {
      type: String,
      enum: [
        'create',
        'update',
        'delete',
        'approve',
        'reject',
        'status_change',
        'assign',
        'accept',
        'cancel',
      ],
      required: true,
    },
    changes: [
      {
        field: String,
        oldValue: Schema.Types.Mixed,
        newValue: Schema.Types.Mixed,
      },
    ],
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
)

// Indexes
AuditLogSchema.index({ userId: 1, createdAt: -1 })
AuditLogSchema.index({ entityType: 1, entityId: 1 })
AuditLogSchema.index({ entityType: 1, action: 1, createdAt: -1 })
AuditLogSchema.index({ createdAt: -1 })

export const AuditLog: Model<IAuditLog> =
  mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema)

