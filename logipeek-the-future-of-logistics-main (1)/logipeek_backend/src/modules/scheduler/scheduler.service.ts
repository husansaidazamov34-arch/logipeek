import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shipment, ShipmentStatus } from '../../schemas/shipment.schema';
import { ShipmentStatusHistory } from '../../schemas/shipment-status-history.schema';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class SchedulerService {
  constructor(
    @InjectModel(Shipment.name)
    private shipmentModel: Model<Shipment>,
    @InjectModel(ShipmentStatusHistory.name)
    private statusHistoryModel: Model<ShipmentStatusHistory>,
    private notificationsService: NotificationsService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async checkExpiredShipments() {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Find shipments that are pending for more than 24 hours
    const expiredShipments = await this.shipmentModel.find({
      status: ShipmentStatus.PENDING,
      createdAt: { $lt: oneDayAgo },
    });

    for (const shipment of expiredShipments) {
      // Update status to cancelled
      shipment.status = ShipmentStatus.CANCELLED;
      shipment.cancelledAt = new Date();
      await shipment.save();

      // Create status history
      const history = new this.statusHistoryModel({
        shipmentId: shipment._id,
        status: ShipmentStatus.CANCELLED,
        notes: 'Avtomatik bekor qilindi - 24 soat ichida haydovchi topilmadi',
      });
      await history.save();

      // Create notification for shipper
      await this.notificationsService.create(
        shipment.shipperId.toString(),
        'Buyurtma bekor qilindi',
        `Buyurtma ${shipment.orderNumber} 24 soat ichida haydovchi topilmagani sababli avtomatik bekor qilindi.`,
        'shipment_expired',
        shipment._id.toString()
      );
    }

    if (expiredShipments.length > 0) {
      console.log(`${expiredShipments.length} ta muddati o'tgan buyurtma bekor qilindi`);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupOldNotifications() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // This would need to be implemented in NotificationsService
    // For now, we'll skip this cleanup
    console.log('Eski bildirishnomalarni tozalash...');
  }

  async triggerExpiredPickupsCheck() {
    // Manual trigger for expired pickups check
    const now = new Date();
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

    // Find shipments that are accepted but not picked up for more than 2 hours
    const expiredPickups = await this.shipmentModel.find({
      status: ShipmentStatus.ACCEPTED,
      acceptedAt: { $lt: twoHoursAgo },
    });

    for (const shipment of expiredPickups) {
      // Reset to pending status
      shipment.status = ShipmentStatus.PENDING;
      shipment.driverId = null;
      shipment.acceptedAt = null;
      await shipment.save();

      // Create status history
      const history = new this.statusHistoryModel({
        shipmentId: shipment._id,
        status: ShipmentStatus.PENDING,
        notes: 'Haydovchi 2 soat ichida yukni olmadi - buyurtma qayta ochildi',
      });
      await history.save();

      // Create notifications
      await this.notificationsService.create(
        shipment.shipperId.toString(),
        'Buyurtma qayta ochildi',
        `Buyurtma ${shipment.orderNumber} haydovchi tomonidan vaqtida olinmagani sababli qayta ochildi.`,
        'shipment_reopened',
        shipment._id.toString()
      );

      if (shipment.driverId) {
        await this.notificationsService.create(
          shipment.driverId.toString(),
          'Buyurtma bekor qilindi',
          `Buyurtma ${shipment.orderNumber} vaqtida olinmagani sababli bekor qilindi.`,
          'order_cancelled',
          shipment._id.toString()
        );
      }
    }

    return {
      message: `${expiredPickups.length} ta muddati o'tgan pickup qayta ochildi`,
      count: expiredPickups.length
    };
  }
}