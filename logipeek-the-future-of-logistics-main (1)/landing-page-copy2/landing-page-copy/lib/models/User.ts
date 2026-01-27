import mongoose, { Schema, Document, Model } from 'mongoose'

export type UserRole = 'admin' | 'shipper' | 'driver'

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId
  email: string
  phone: string
  password: string
  firstName: string
  lastName: string
  role: UserRole
  avatar?: string
  // Verification
  verificationCode?: string
  verificationCodeExpires?: Date
  // Profile fields that require approval
  company?: string
  address?: string
  city?: string
  region?: string
  // Driver-specific fields
  licenseNumber?: string
  vehicleType?: string
  vehicleModel?: string
  vehiclePlateNumber?: string
  vehicleCapacity?: number
  rating?: number
  totalTrips?: number
  totalRevenue?: number
  // Approval workflow
  pendingChanges?: {
    field: string
    oldValue: any
    newValue: any
    requestedAt: Date
  }[]
  // Status
  isActive: boolean
  isVerified: boolean
  lastActive?: Date
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['admin', 'shipper', 'driver'],
      required: true,
    },
    avatar: {
      type: String,
    },
    verificationCode: {
      type: String,
      select: false, // Don't return by default
    },
    verificationCodeExpires: {
      type: Date,
    },

    company: String,
    address: String,
    city: String,
    region: String,
    // Driver-specific
    licenseNumber: String,
    vehicleType: String,
    vehicleModel: String,
    vehiclePlateNumber: String,
    vehicleCapacity: Number,
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalTrips: {
      type: Number,
      default: 0,
    },
    totalRevenue: {
      type: Number,
      default: 0,
    },
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
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    lastActive: Date,
  },
  {
    timestamps: true,
  }
)

// Indexes
UserSchema.index({ role: 1 })
UserSchema.index({ isActive: 1 })

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema)

