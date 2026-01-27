import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IPaymentSummary extends Document {
  _id: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  period: {
    start: Date
    end: Date
    month: number
    year: number
  }
  ordersCount: number
  totalAmount: number
  platformFee: number // 80,000 so'm
  paidAmount: number
  pendingAmount: number
  currency: string
  status: 'pending' | 'paid' | 'overdue'
  paidAt?: Date
  createdAt: Date
  updatedAt: Date
}

const PaymentSummarySchema = new Schema<IPaymentSummary>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    period: {
      start: {
        type: Date,
        required: true,
      },
      end: {
        type: Date,
        required: true,
      },
      month: {
        type: Number,
        required: true,
        min: 1,
        max: 12,
      },
      year: {
        type: Number,
        required: true,
      },
    },
    ordersCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    platformFee: {
      type: Number,
      default: 80000, // 80,000 so'm
      min: 0,
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    pendingAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    currency: {
      type: String,
      default: 'UZS',
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'overdue'],
      default: 'pending',
    },
    paidAt: Date,
  },
  {
    timestamps: true,
  }
)

// Indexes
PaymentSummarySchema.index({ userId: 1, 'period.year': 1, 'period.month': 1 })
PaymentSummarySchema.index({ userId: 1, status: 1 })
PaymentSummarySchema.index({ status: 1 })

export const PaymentSummary: Model<IPaymentSummary> =
  mongoose.models.PaymentSummary ||
  mongoose.model<IPaymentSummary>('PaymentSummary', PaymentSummarySchema)

