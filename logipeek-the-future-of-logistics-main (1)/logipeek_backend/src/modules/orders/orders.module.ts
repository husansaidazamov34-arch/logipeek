import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Shipment, ShipmentSchema } from '../../schemas/shipment.schema';
import { ShipmentStatusHistory, ShipmentStatusHistorySchema } from '../../schemas/shipment-status-history.schema';
import { DriverProfile, DriverProfileSchema } from '../../schemas/driver-profile.schema';
import { AuthModule } from '../auth/auth.module';
import { ShipmentsModule } from '../shipments/shipments.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Shipment.name, schema: ShipmentSchema },
      { name: ShipmentStatusHistory.name, schema: ShipmentStatusHistorySchema },
      { name: DriverProfile.name, schema: DriverProfileSchema },
    ]),
    AuthModule,
    ShipmentsModule,
    NotificationsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}