import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SchedulerService } from './scheduler.service';
import { SchedulerController } from './scheduler.controller';
import { Shipment, ShipmentSchema } from '../../schemas/shipment.schema';
import { ShipmentStatusHistory, ShipmentStatusHistorySchema } from '../../schemas/shipment-status-history.schema';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Shipment.name, schema: ShipmentSchema },
      { name: ShipmentStatusHistory.name, schema: ShipmentStatusHistorySchema },
    ]),
    NotificationsModule,
  ],
  controllers: [SchedulerController],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}