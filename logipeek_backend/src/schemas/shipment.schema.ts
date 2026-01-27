import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum ShipmentStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  PICKUP = 'pickup',
  TRANSIT = 'transit',
  ARRIVED = 'arrived',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Schema({ timestamps: true })
export class Shipment extends Document {
  @Prop({ required: true, unique: true })
  orderNumber: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  shipperId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  driverId: Types.ObjectId;

  // Pickup details
  @Prop({ required: true })
  pickupAddress: string;

  @Prop({ required: true })
  pickupLatitude: number;

  @Prop({ required: true })
  pickupLongitude: number;

  @Prop({ default: null })
  pickupContactName: string;

  @Prop({ default: null })
  pickupContactPhone: string;

  // Dropoff details
  @Prop({ required: true })
  dropoffAddress: string;

  @Prop({ required: true })
  dropoffLatitude: number;

  @Prop({ required: true })
  dropoffLongitude: number;

  @Prop({ default: null })
  dropoffContactName: string;

  @Prop({ default: null })
  dropoffContactPhone: string;

  // Shipment details
  @Prop({ required: true })
  weight: number;

  @Prop({ required: true })
  vehicleTypeRequired: string;

  @Prop({ default: null })
  description: string;

  @Prop({ default: null })
  specialInstructions: string;

  // Pricing
  @Prop({ required: true })
  estimatedPrice: number;

  @Prop({ default: null })
  finalPrice: number;

  @Prop({ default: null })
  paymentMethod: string;

  @Prop({ default: null })
  distanceKm: number;

  // Status
  @Prop({ enum: ShipmentStatus, default: ShipmentStatus.PENDING })
  status: ShipmentStatus;

  // Timestamps
  @Prop({ default: null })
  acceptedAt: Date;

  @Prop({ default: null })
  pickupAt: Date;

  @Prop({ default: null })
  transitAt: Date;

  @Prop({ default: null })
  completedAt: Date;

  @Prop({ default: null })
  deliveredAt: Date;

  @Prop({ default: null })
  cancelledAt: Date;

  @Prop({ default: null, min: 0, max: 5 })
  rating: number;

  @Prop({ default: null })
  estimatedDeliveryTime: Date;

  @Prop({ default: null })
  deliveryDateFrom: Date;

  @Prop({ default: null })
  deliveryDateTo: Date;

  // Virtual fields for relations
  shipper?: any;
  driver?: any;
  statusHistory?: any[];
}

export const ShipmentSchema = SchemaFactory.createForClass(Shipment);

// Virtual relations
ShipmentSchema.virtual('shipper', {
  ref: 'User',
  localField: 'shipperId',
  foreignField: '_id',
  justOne: true,
});

ShipmentSchema.virtual('driver', {
  ref: 'User',
  localField: 'driverId',
  foreignField: '_id',
  justOne: true,
});

ShipmentSchema.virtual('statusHistory', {
  ref: 'ShipmentStatusHistory',
  localField: '_id',
  foreignField: 'shipmentId',
});

ShipmentSchema.set('toJSON', { virtuals: true });
ShipmentSchema.set('toObject', { virtuals: true });