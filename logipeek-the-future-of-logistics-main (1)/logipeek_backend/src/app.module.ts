import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ShipmentsModule } from './modules/shipments/shipments.module';
import { DriversModule } from './modules/drivers/drivers.module';
import { OrdersModule } from './modules/orders/orders.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AdminModule } from './modules/admin/admin.module';
import { SchedulerModule } from './modules/scheduler/scheduler.module';
import { UploadModule } from './modules/upload/upload.module';
import { EventsGateway } from './gateway/events.gateway';
import { User, UserSchema } from './schemas/user.schema';
import { DriverProfile, DriverProfileSchema } from './schemas/driver-profile.schema';
import { ShipperProfile, ShipperProfileSchema } from './schemas/shipper-profile.schema';
import { AdminAction, AdminActionSchema } from './schemas/admin-action.schema';
import { Shipment, ShipmentSchema } from './schemas/shipment.schema';
import { ShipmentStatusHistory, ShipmentStatusHistorySchema } from './schemas/shipment-status-history.schema';
import { Notification, NotificationSchema } from './schemas/notification.schema';
import { TestModule } from './modules/test/test.module';
import { mongodbConfig } from './config/mongodb.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI, mongodbConfig),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: DriverProfile.name, schema: DriverProfileSchema },
      { name: ShipperProfile.name, schema: ShipperProfileSchema },
      { name: AdminAction.name, schema: AdminActionSchema },
      { name: Shipment.name, schema: ShipmentSchema },
      { name: ShipmentStatusHistory.name, schema: ShipmentStatusHistorySchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    ShipmentsModule,
    DriversModule,
    OrdersModule,
    NotificationsModule,
    AdminModule,
    SchedulerModule,
    UploadModule,
    TestModule,
  ],
  providers: [
    EventsGateway,
  ],
})
export class AppModule {}
