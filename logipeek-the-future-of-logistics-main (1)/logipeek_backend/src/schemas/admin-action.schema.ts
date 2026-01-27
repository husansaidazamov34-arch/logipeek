import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class AdminAction extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  adminId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  targetUserId: Types.ObjectId;

  @Prop({ required: true })
  action: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Object, default: null })
  metadata: any;

  @Prop({ default: null })
  ipAddress: string;

  @Prop({ default: null })
  userAgent: string;

  // Virtual fields for relations
  admin?: any;
  targetUser?: any;
}

export const AdminActionSchema = SchemaFactory.createForClass(AdminAction);

// Virtual relations
AdminActionSchema.virtual('admin', {
  ref: 'User',
  localField: 'adminId',
  foreignField: '_id',
  justOne: true,
});

AdminActionSchema.virtual('targetUser', {
  ref: 'User',
  localField: 'targetUserId',
  foreignField: '_id',
  justOne: true,
});

AdminActionSchema.set('toJSON', { virtuals: true });
AdminActionSchema.set('toObject', { virtuals: true });