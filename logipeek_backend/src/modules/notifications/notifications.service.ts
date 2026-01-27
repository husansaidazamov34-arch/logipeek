import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from '../../schemas/notification.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
  ) {}

  async create(userId: string, title: string, message: string, type: string, shipmentId?: string) {
    const notification = new this.notificationModel({
      userId,
      title,
      message,
      type,
      relatedShipmentId: shipmentId || null,
    });

    return notification.save();
  }

  async findAll(userId: string) {
    return this.notificationModel.find({
      userId,
    }).sort({ createdAt: -1 }).limit(50);
  }

  async markAsRead(id: string, userId: string) {
    await this.notificationModel.updateOne(
      { _id: id, userId },
      { isRead: true },
    );

    return this.notificationModel.findById(id);
  }

  async markAllAsRead(userId: string) {
    await this.notificationModel.updateMany(
      { userId, isRead: false },
      { isRead: true },
    );

    return { message: 'Barcha bildirishnomalar o\'qilgan deb belgilandi' };
  }

  async getUnreadCount(userId: string) {
    const count = await this.notificationModel.countDocuments({
      userId, 
      isRead: false,
    });

    return { count };
  }
}