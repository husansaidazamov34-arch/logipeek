import mongoose, { Schema, Document, Model } from 'mongoose'

export type OrderStatus =
  | 'pending'
  | 'available'
  | 'accepted'
  | 'in_transit'
  | 'delivered'
  | 'cancelled'

export type OrderPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId
  orderNumber: string
  shipperId: mongoose.Types.ObjectId
  assignedDriverId?: mongoose.Types.ObjectId
  // Addresses with coordinates
  pickupAddress: {
    street: string
    city: string
    region?: string
    lat: number
    lng: number
  }
  dropAddress: {
    street: string
    city: string
    region?: string
    lat: number
    lng: number
  }
  // Order details
  weight: number // in kg
  volume: number // in m³
  vehicleType?: string
  cargoType?: string
  description?: string
  // Pricing
  price: number
  currency: string
  // Status and priority
  status: OrderStatus
  priority: OrderPriority
  // Admin approval workflow
  requiresAdminApproval: boolean
  pendingChanges?: {
    field: string
    oldValue: any
    newValue: any
    requestedAt: Date
    requestedBy: mongoose.Types.ObjectId
  }[]
  // Dates
  pickupDate?: Date
  deliveryDate?: Date
  estimatedPickupTime?: Date
  estimatedDeliveryTime?: Date
  // Audit trail
  statusHistory: {
    status: OrderStatus
    changedAt: Date
    changedBy: mongoose.Types.ObjectId
    reason?: string
  }[]
  createdAt: Date
  updatedAt: Date
}

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    shipperId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedDriverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    pickupAddress: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      region: String,
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },
    dropAddress: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      region: String,
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },
    weight: {
      type: Number,
      required: true,
      min: 0,
    },
    volume: {
      type: Number,
      required: true,
      min: 0,
    },
    vehicleType: String,
    cargoType: String,
    description: String,
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'UZS',
    },
    status: {
      type: String,
      enum: ['pending', 'available', 'accepted', 'in_transit', 'delivered', 'cancelled'],
      default: 'pending',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    requiresAdminApproval: {
      type: Boolean,
      default: false,
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
        requestedBy: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
    pickupDate: Date,
    deliveryDate: Date,
    estimatedPickupTime: Date,
    estimatedDeliveryTime: Date,
    statusHistory: [
      {
        status: {
          type: String,
          enum: ['pending', 'available', 'accepted', 'in_transit', 'delivered', 'cancelled'],
        },
        changedAt: {
          type: Date,
          default: Date.now,
        },
        changedBy: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        reason: String,
      },
    ],
  },
  {
    timestamps: true,
  }
)

// Indexes
OrderSchema.index({ shipperId: 1 })
OrderSchema.index({ assignedDriverId: 1 })
OrderSchema.index({ status: 1 })
OrderSchema.index({ 'pickupAddress.city': 1 })
OrderSchema.index({ 'dropAddress.city': 1 })
OrderSchema.index({ createdAt: -1 })
OrderSchema.index({ 'pickupAddress.lat': 1, 'pickupAddress.lng': 1 }) // Geospatial index

// Generate order number before save
OrderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments()
    this.orderNumber = `ORD-${String(count + 1).padStart(6, '0')}`
  }
  next()
})

export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema)

