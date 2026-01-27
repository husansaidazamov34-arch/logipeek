import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shipment, ShipmentStatus } from '../../schemas/shipment.schema';
import { ShipmentStatusHistory } from '../../schemas/shipment-status-history.schema';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentStatusDto } from './dto/update-shipment-status.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ShipmentsService {
  constructor(
    @InjectModel(Shipment.name)
    private shipmentModel: Model<Shipment>,
    @InjectModel(ShipmentStatusHistory.name)
    private statusHistoryModel: Model<ShipmentStatusHistory>,
    private notificationsService: NotificationsService,
  ) {}

  async create(createShipmentDto: CreateShipmentDto, shipperId: string) {
    // Generate order number
    const orderNumber = await this.generateOrderNumber();

    const shipment = new this.shipmentModel({
      ...createShipmentDto,
      orderNumber,
      shipperId,
      status: ShipmentStatus.PENDING,
      deliveryDateFrom: createShipmentDto.deliveryDateFrom ? new Date(createShipmentDto.deliveryDateFrom) : null,
      deliveryDateTo: createShipmentDto.deliveryDateTo ? new Date(createShipmentDto.deliveryDateTo) : null,
    });

    const savedShipment = await shipment.save();

    // Create status history
    await this.createStatusHistory(savedShipment._id.toString(), ShipmentStatus.PENDING);

    // Create notification for new shipment
    await this.notificationsService.create(
      shipperId,
      'Yangi buyurtma yaratildi',
      `Buyurtma raqami: ${orderNumber}. Haydovchi topilishini kuting.`,
      'shipment_created',
      savedShipment._id.toString()
    );

    return this.findOne(savedShipment._id.toString());
  }

  async findAll(userId: string, role: string) {
    const filter = role === 'shipper' ? { shipperId: userId } : { driverId: userId };

    const shipments = await this.shipmentModel.find(filter)
      .populate('shipper', 'fullName email phone')
      .populate({
        path: 'driver',
        select: 'fullName email phone',
        populate: {
          path: 'driverProfile',
          select: 'licensePlate rating totalTrips status' // Exclude licenseNumber for security
        }
      })
      .sort({ createdAt: -1 });

    return shipments;
  }

  async findOne(id: string) {
    const shipment = await this.shipmentModel.findById(id)
      .populate('shipper', 'fullName email phone')
      .populate({
        path: 'driver',
        select: 'fullName email phone',
        populate: {
          path: 'driverProfile',
          select: 'licensePlate rating totalTrips status' // Exclude licenseNumber for security
        }
      });

    if (!shipment) {
      throw new NotFoundException('Jo\'natma topilmadi');
    }

    // Get status history
    const statusHistory = await this.statusHistoryModel.find({ shipmentId: id })
      .sort({ createdAt: -1 });

    const result = shipment.toObject();
    result.statusHistory = statusHistory;

    return result;
  }

  async updateStatus(id: string, updateStatusDto: UpdateShipmentStatusDto, userId: string) {
    const shipment = await this.findOne(id);

    // Check permissions
    if (shipment.driverId?.toString() !== userId && shipment.shipperId?.toString() !== userId) {
      throw new ForbiddenException('Sizda bu jo\'natmani o\'zgartirish huquqi yo\'q');
    }

    const updateData: any = { status: updateStatusDto.status };

    // Update timestamps based on status
    const now = new Date();
    switch (updateStatusDto.status) {
      case ShipmentStatus.ACCEPTED:
        updateData.acceptedAt = now;
        break;
      case ShipmentStatus.PICKUP:
        updateData.pickupAt = now;
        break;
      case ShipmentStatus.TRANSIT:
        updateData.transitAt = now;
        break;
      case ShipmentStatus.COMPLETED:
        updateData.completedAt = now;
        updateData.finalPrice = shipment.estimatedPrice;
        break;
      case ShipmentStatus.CANCELLED:
        updateData.cancelledAt = now;
        break;
    }

    await this.shipmentModel.updateOne({ _id: id }, updateData);

    // Create status history
    await this.createStatusHistory(
      id,
      updateStatusDto.status,
      updateStatusDto.notes,
      updateStatusDto.latitude,
      updateStatusDto.longitude,
    );

    // Create notifications based on status change
    const updatedShipment = await this.shipmentModel.findById(id);
    await this.createStatusNotifications(updatedShipment, updateStatusDto.status);

    return this.findOne(id);
  }

  async getAvailableOrders() {
    return this.shipmentModel.find({ status: ShipmentStatus.PENDING })
      .populate('shipper', 'fullName email phone')
      .sort({ createdAt: -1 });
  }

  async acceptOrder(id: string, driverId: string) {
    const shipment = await this.shipmentModel.findById(id);

    if (!shipment) {
      throw new NotFoundException('Jo\'natma topilmadi');
    }

    if (shipment.status !== ShipmentStatus.PENDING) {
      throw new ForbiddenException('Bu buyurtma allaqachon qabul qilingan');
    }

    shipment.driverId = driverId as any;
    shipment.status = ShipmentStatus.ACCEPTED;
    shipment.acceptedAt = new Date();

    await shipment.save();
    await this.createStatusHistory(id, ShipmentStatus.ACCEPTED);

    // Create notifications for both shipper and driver
    await this.notificationsService.create(
      shipment.shipperId.toString(),
      'Buyurtma qabul qilindi',
      `Buyurtma ${shipment.orderNumber} haydovchi tomonidan qabul qilindi.`,
      'order_accepted',
      id
    );

    await this.notificationsService.create(
      driverId,
      'Buyurtmani qabul qildingiz',
      `Buyurtma ${shipment.orderNumber}ni muvaffaqiyatli qabul qildingiz.`,
      'order_accepted',
      id
    );

    return this.findOne(id);
  }

  private async generateOrderNumber(): Promise<string> {
    const year = new Date().getFullYear();
    
    // Find the highest order number for the current year
    const lastShipment = await this.shipmentModel
      .findOne({ orderNumber: new RegExp(`^SHP-${year}-`) })
      .sort({ createdAt: -1 });

    let nextNumber = 1;
    if (lastShipment) {
      // Extract the number from the order number (e.g., "SHP-2026-0005" -> 5)
      const match = lastShipment.orderNumber.match(/SHP-\d{4}-(\d+)/);
      if (match) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }

    return `SHP-${year}-${String(nextNumber).padStart(4, '0')}`;
  }

  private async createStatusHistory(
    shipmentId: string,
    status: ShipmentStatus,
    notes?: string,
    latitude?: number,
    longitude?: number,
  ) {
    const history = new this.statusHistoryModel({
      shipmentId,
      status,
      notes,
      latitude,
      longitude,
    });

    await history.save();
  }

  private async createStatusNotifications(shipment: any, status: ShipmentStatus) {
    const statusMessages = {
      [ShipmentStatus.ACCEPTED]: {
        shipperTitle: 'Buyurtma qabul qilindi',
        shipperMessage: `Buyurtma ${shipment.orderNumber} haydovchi tomonidan qabul qilindi.`,
        driverTitle: 'Buyurtmani qabul qildingiz',
        driverMessage: `Buyurtma ${shipment.orderNumber}ni muvaffaqiyatli qabul qildingiz.`,
      },
      [ShipmentStatus.PICKUP]: {
        shipperTitle: 'Yuk olinmoqda',
        shipperMessage: `Haydovchi ${shipment.orderNumber} buyurtmasi uchun yukni olish joyiga yetib keldi.`,
        driverTitle: 'Yuk olish boshlandi',
        driverMessage: `${shipment.orderNumber} buyurtmasi uchun yuk olish boshlandi.`,
      },
      [ShipmentStatus.TRANSIT]: {
        shipperTitle: 'Yuk yo\'lda',
        shipperMessage: `${shipment.orderNumber} buyurtmasi yo\'lda. Haydovchi yuk bilan yo\'lga chiqdi.`,
        driverTitle: 'Yuk bilan yo\'lga chiqdingiz',
        driverMessage: `${shipment.orderNumber} buyurtmasi bilan yo\'lga chiqdingiz.`,
      },
      [ShipmentStatus.COMPLETED]: {
        shipperTitle: 'Yuk yetkazildi',
        shipperMessage: `${shipment.orderNumber} buyurtmasi muvaffaqiyatli yetkazildi.`,
        driverTitle: 'Buyurtma yakunlandi',
        driverMessage: `${shipment.orderNumber} buyurtmasini muvaffaqiyatli yakunladingiz.`,
      },
      [ShipmentStatus.CANCELLED]: {
        shipperTitle: 'Buyurtma bekor qilindi',
        shipperMessage: `${shipment.orderNumber} buyurtmasi bekor qilindi.`,
        driverTitle: 'Buyurtma bekor qilindi',
        driverMessage: `${shipment.orderNumber} buyurtmasi bekor qilindi.`,
      },
    };

    const messages = statusMessages[status];
    if (!messages) return;

    // Create notification for shipper
    await this.notificationsService.create(
      shipment.shipperId.toString(),
      messages.shipperTitle,
      messages.shipperMessage,
      'status_update',
      shipment._id.toString()
    );

    // Create notification for driver if assigned
    if (shipment.driverId) {
      await this.notificationsService.create(
        shipment.driverId.toString(),
        messages.driverTitle,
        messages.driverMessage,
        'status_update',
        shipment._id.toString()
      );
    }
  }
}