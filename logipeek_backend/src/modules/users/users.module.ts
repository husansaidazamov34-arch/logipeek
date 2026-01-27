import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from '../../schemas/user.schema';
import { DriverProfile, DriverProfileSchema } from '../../schemas/driver-profile.schema';
import { ShipperProfile, ShipperProfileSchema } from '../../schemas/shipper-profile.schema';
import { Shipment, ShipmentSchema } from '../../schemas/shipment.schema';
import { ShipmentStatusHistory, ShipmentStatusHistorySchema } from '../../schemas/shipment-status-history.schema';
import { Notification, NotificationSchema } from '../../schemas/notification.schema';
import { AdminAction, AdminActionSchema } from '../../schemas/admin-action.schema';
import { VerificationCode, VerificationCodeSchema } from '../../schemas/verification-code.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: DriverProfile.name, schema: DriverProfileSchema },
      { name: ShipperProfile.name, schema: ShipperProfileSchema },
      { name: Shipment.name, schema: ShipmentSchema },
      { name: ShipmentStatusHistory.name, schema: ShipmentStatusHistorySchema },
      { name: Notification.name, schema: NotificationSchema },
      { name: AdminAction.name, schema: AdminActionSchema },
      { name: VerificationCode.name, schema: VerificationCodeSchema },
    ]),
    AuthModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}