import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class ShipmentStatusHistory extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Shipment', required: true })
  shipmentId: Types.ObjectId;

  @Prop({ required: true })
  status: string;

  @Prop({ default: null })
  notes: string;

  @Prop({ default: null })
  latitude: number;

  @Prop({ default: null })
  longitude: number;

  // Virtual fields for relations
  shipment?: any;
}

export const ShipmentStatusHistorySchema = SchemaFactory.createForClass(ShipmentStatusHistory);

// Virtual relations
ShipmentStatusHistorySchema.virtual('shipment', {
  ref: 'Shipment',
  localField: 'shipmentId',
  foreignField: '_id',
  justOne: true,
});

ShipmentStatusHistorySchema.set('toJSON', { virtuals: true });
ShipmentStatusHistorySchema.set('toObject', { virtuals: true });