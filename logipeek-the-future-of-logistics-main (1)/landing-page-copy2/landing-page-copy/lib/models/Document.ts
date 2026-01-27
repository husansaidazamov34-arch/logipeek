import mongoose, { Schema, Document, Model } from 'mongoose'

export type DocumentStatus = 'verified' | 'pending' | 'expired' | 'rejected'

export interface IDocument extends Document {
  _id: mongoose.Types.ObjectId
  ownerId: mongoose.Types.ObjectId
  name: string
  type: string // 'license', 'passport', 'insurance', 'vehicle_registration', etc.
  filePath: string
  fileSize: number
  mimeType: string
  status: DocumentStatus
  verified: boolean
  verifiedBy?: mongoose.Types.ObjectId
  verifiedAt?: Date
  // Approval workflow for edits
  pendingChanges?: {
    field: string
    oldValue: any
    newValue: any
    requestedAt: Date
  }[]
  // Metadata
  tags: string[]
  description?: string
  expiresAt?: Date
  createdAt: Date
  updatedAt: Date
}

const DocumentSchema = new Schema<IDocument>(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['verified', 'pending', 'expired', 'rejected'],
      default: 'pending',
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    verifiedAt: Date,
    pendingChanges: [
      {
        field: String,
        oldValue: Schema.Types.Mixed,
        newValue: Schema.Types.Mixed,
        requestedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    tags: [
      {
        type: String,
      },
    ],
    description: String,
    expiresAt: Date,
  },
  {
    timestamps: true,
  }
)

// Indexes
DocumentSchema.index({ ownerId: 1, status: 1 })
DocumentSchema.index({ ownerId: 1, type: 1 })
DocumentSchema.index({ verified: 1 })
DocumentSchema.index({ expiresAt: 1 })

export const AppDocument: Model<IDocument> =
  mongoose.models.Document || mongoose.model<IDocument>('Document', DocumentSchema)

