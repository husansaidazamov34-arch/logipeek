import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class ShipperProfile extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ default: null })
  companyName: string;

  @Prop({ default: null })
  companyAddress: string;

  @Prop({ default: 0 })
  totalShipments: number;

  @Prop({ default: 0 })
  totalSpent: number;

  // Virtual fields for relations
  user?: any;
}

export const ShipperProfileSchema = SchemaFactory.createForClass(ShipperProfile);

// Virtual relations
ShipperProfileSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

ShipperProfileSchema.set('toJSON', { virtuals: true });
ShipperProfileSchema.set('toObject', { virtuals: true });