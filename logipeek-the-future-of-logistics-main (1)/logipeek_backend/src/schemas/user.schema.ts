import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum UserRole {
  DRIVER = 'driver',
  SHIPPER = 'shipper',
  ADMIN = 'admin',
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ required: true, enum: UserRole })
  role: UserRole;

  @Prop({ default: null })
  avatarUrl: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: false })
  isSuperAdmin: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  createdByAdminId: Types.ObjectId;

  // Virtual fields for relations
  driverProfile?: any;
  shipperProfile?: any;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Virtual relations
UserSchema.virtual('driverProfile', {
  ref: 'DriverProfile',
  localField: '_id',
  foreignField: 'userId',
  justOne: true,
});

UserSchema.virtual('shipperProfile', {
  ref: 'ShipperProfile',
  localField: '_id',
  foreignField: 'userId',
  justOne: true,
});

UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });