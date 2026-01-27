import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User, UserSchema } from '../../schemas/user.schema';
import { AdminAction, AdminActionSchema } from '../../schemas/admin-action.schema';
import { Shipment, ShipmentSchema } from '../../schemas/shipment.schema';
import { ShipmentStatusHistory, ShipmentStatusHistorySchema } from '../../schemas/shipment-status-history.schema';
import { DriverProfile, DriverProfileSchema } from '../../schemas/driver-profile.schema';
import { ShipperProfile, ShipperProfileSchema } from '../../schemas/shipper-profile.schema';
import { AuthModule } from '../auth/auth.module';
import { AdminGuard } from './guards/admin.guard';
import { SuperAdminGuard } from './guards/super-admin.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: AdminAction.name, schema: AdminActionSchema },
      { name: Shipment.name, schema: ShipmentSchema },
      { name: ShipmentStatusHistory.name, schema: ShipmentStatusHistorySchema },
      { name: DriverProfile.name, schema: DriverProfileSchema },
      { name: ShipperProfile.name, schema: ShipperProfileSchema },
    ]),
    AuthModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, AdminGuard, SuperAdminGuard],
  exports: [AdminService, AdminGuard, SuperAdminGuard],
})
export class AdminModule {}