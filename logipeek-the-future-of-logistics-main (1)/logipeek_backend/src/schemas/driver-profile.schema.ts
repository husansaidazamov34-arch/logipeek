import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum DriverStatus {
  ONLINE = 'online',
  BUSY = 'busy',
  OFFLINE = 'offline',
}

@Schema({ timestamps: true })
export class DriverProfile extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  licensePlate: string;

  @Prop({ required: true })
  licenseNumber: string;

  @Prop({ default: null })
  licenseImageUrl: string;

  @Prop({ default: null })
  isLicenseApproved: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  licenseApprovedBy: Types.ObjectId;

  @Prop({ default: null })
  licenseApprovedAt: Date;

  @Prop({ default: 5.0, min: 0, max: 5 })
  rating: number;

  @Prop({ default: 0 })
  totalTrips: number;

  @Prop({ default: 0 })
  totalEarnings: number;

  @Prop({ enum: DriverStatus, default: DriverStatus.OFFLINE })
  status: DriverStatus;

  @Prop({ default: null })
  currentLatitude: number;

  @Prop({ default: null })
  currentLongitude: number;

  @Prop({ default: null })
  lastLocationUpdate: Date;

  // Virtual fields for relations
  user?: any;
  licenseApprovedByAdmin?: any;
}

export const DriverProfileSchema = SchemaFactory.createForClass(DriverProfile);

// Virtual relations
DriverProfileSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

DriverProfileSchema.virtual('licenseApprovedByAdmin', {
  ref: 'User',
  localField: 'licenseApprovedBy',
  foreignField: '_id',
  justOne: true,
});

DriverProfileSchema.set('toJSON', { virtuals: true });
DriverProfileSchema.set('toObject', { virtuals: true });