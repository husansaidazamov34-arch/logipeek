import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShipmentsController } from './shipments.controller';
import { ShipmentsService } from './shipments.service';
import { Shipment, ShipmentSchema } from '../../schemas/shipment.schema';
import { ShipmentStatusHistory, ShipmentStatusHistorySchema } from '../../schemas/shipment-status-history.schema';
import { User, UserSchema } from '../../schemas/user.schema';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Shipment.name, schema: ShipmentSchema },
      { name: ShipmentStatusHistory.name, schema: ShipmentStatusHistorySchema },
      { name: User.name, schema: UserSchema },
    ]),
    AuthModule,
    NotificationsModule,
  ],
  controllers: [ShipmentsController],
  providers: [ShipmentsService],
  exports: [ShipmentsService],
})
export class ShipmentsModule {}