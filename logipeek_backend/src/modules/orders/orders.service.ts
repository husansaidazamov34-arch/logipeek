import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shipment, ShipmentStatus } from '../../schemas/shipment.schema';
import { DriverProfile, DriverStatus } from '../../schemas/driver-profile.schema';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Shipment.name)
    private shipmentModel: Model<Shipment>,
    @InjectModel(DriverProfile.name)
    private driverProfileModel: Model<DriverProfile>,
    private notificationsService: NotificationsService,
  ) {}

  async getAvailableOrders() {
    return this.shipmentModel.find({ status: ShipmentStatus.PENDING })
      .populate({
        path: 'shipper',
        select: 'fullName email phone',
        populate: {
          path: 'shipperProfile',
          select: 'companyName companyAddress'
        }
      })
      .sort({ createdAt: -1 });
  }

  async getActiveOrders(driverId: string) {
    return this.shipmentModel.find({
      driverId,
      status: ShipmentStatus.TRANSIT,
    })
    .populate({
      path: 'shipper',
      select: 'fullName email phone',
      populate: {
        path: 'shipperProfile',
        select: 'companyName companyAddress'
      }
    });
  }

  async getOrderHistory(driverId: string) {
    return this.shipmentModel.find({
      driverId,
      status: ShipmentStatus.COMPLETED,
    })
    .populate('shipper', 'fullName email phone')
    .sort({ completedAt: -1 })
    .limit(50);
  }

  async acceptOrder(orderId: string, driverId: string) {
    // Check driver profile and license image
    const driverProfile = await this.driverProfileModel.findOne({ userId: driverId });

    if (!driverProfile) {
      throw new Error('Haydovchi profili topilmadi');
    }

    if (!driverProfile.licenseImageUrl) {
      throw new Error('Haydovchilik guvohnomasi rasmi yuklanmagan');
    }

    if (driverProfile.isLicenseApproved === false) {
      throw new Error('Haydovchilik guvohnomasi tasdiqlanmagan');
    }

    if (driverProfile.isLicenseApproved === null) {
      throw new Error('Haydovchilik guvohnomasi hali ko\'rib chiqilmagan');
    }

    // Check if order is still available
    const order = await this.shipmentModel.findById(orderId);
    
    if (!order) {
      throw new Error('Buyurtma topilmadi');
    }

    if (order.status !== ShipmentStatus.PENDING) {
      throw new Error('Bu buyurtma allaqachon qabul qilingan');
    }

    // Accept the order
    order.driverId = driverId as any;
    order.status = ShipmentStatus.ACCEPTED;
    order.acceptedAt = new Date();

    await order.save();

    // Update driver status to busy
    driverProfile.status = DriverStatus.BUSY;
    await driverProfile.save();

    // Create notifications
    await this.notificationsService.create(
      order.shipperId.toString(),
      'Buyurtma qabul qilindi',
      `Buyurtma ${order.orderNumber} haydovchi tomonidan qabul qilindi.`,
      'order_accepted',
      orderId
    );

    await this.notificationsService.create(
      driverId,
      'Buyurtmani qabul qildingiz',
      `Buyurtma ${order.orderNumber}ni muvaffaqiyatli qabul qildingiz.`,
      'order_accepted',
      orderId
    );

    return order;
  }

  async markAsDelivered(orderId: string, driverId: string) {
    const order = await this.shipmentModel.findById(orderId);
    
    if (!order) {
      throw new Error('Buyurtma topilmadi');
    }

    if (order.driverId?.toString() !== driverId) {
      throw new Error('Bu buyurtmani faqat mas\'ul haydovchi yakunlay oladi');
    }

    if (order.status !== ShipmentStatus.TRANSIT) {
      throw new Error('Buyurtma transit holatida emas');
    }

    // Update order status
    order.status = ShipmentStatus.DELIVERED;
    order.deliveredAt = new Date();
    await order.save();

    // Create notification
    await this.notificationsService.create(
      order.shipperId.toString(),
      'Yuk yetkazildi',
      `Buyurtma ${order.orderNumber} yetkazildi. Iltimos, qabul qilganingizni tasdiqlang.`,
      'order_delivered',
      orderId
    );

    return order;
  }

  async confirmDelivery(orderId: string, shipperId: string, rating?: number) {
    const order = await this.shipmentModel.findById(orderId);
    
    if (!order) {
      throw new Error('Buyurtma topilmadi');
    }

    if (order.shipperId?.toString() !== shipperId) {
      throw new Error('Bu buyurtmani faqat buyurtmachi tasdiqlashi mumkin');
    }

    if (order.status !== ShipmentStatus.DELIVERED) {
      throw new Error('Buyurtma hali yetkazilmagan');
    }

    // Update order status
    order.status = ShipmentStatus.COMPLETED;
    order.completedAt = new Date();
    
    if (rating) {
      order.rating = rating;
    }

    await order.save();

    // Update driver status to online
    const driverProfile = await this.driverProfileModel.findOne({ userId: order.driverId });
    if (driverProfile) {
      driverProfile.status = DriverStatus.ONLINE;
      driverProfile.totalTrips += 1;
      driverProfile.totalEarnings += order.finalPrice || order.estimatedPrice;
      
      // Update rating
      if (rating) {
        const currentRating = driverProfile.rating || 5.0;
        const totalTrips = driverProfile.totalTrips;
        driverProfile.rating = ((currentRating * (totalTrips - 1)) + rating) / totalTrips;
      }
      
      await driverProfile.save();
    }

    // Create notifications
    await this.notificationsService.create(
      order.driverId.toString(),
      'Buyurtma yakunlandi',
      `Buyurtma ${order.orderNumber} muvaffaqiyatli yakunlandi.${rating ? ` Baho: ${rating}/5` : ''}`,
      'order_completed',
      orderId
    );

    return order;
  }

  async simulateDelivered(orderId: string, driverId: string) {
    // This is for testing purposes only
    if (process.env.NODE_ENV !== 'development') {
      throw new Error('Bu funksiya faqat development muhitida ishlaydi');
    }

    return this.markAsDelivered(orderId, driverId);
  }
}