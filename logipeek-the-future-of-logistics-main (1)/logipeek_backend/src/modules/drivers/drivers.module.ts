import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DriversController } from './drivers.controller';
import { DriversService } from './drivers.service';
import { DriverProfile, DriverProfileSchema } from '../../schemas/driver-profile.schema';
import { User, UserSchema } from '../../schemas/user.schema';
import { Shipment, ShipmentSchema } from '../../schemas/shipment.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DriverProfile.name, schema: DriverProfileSchema },
      { name: User.name, schema: UserSchema },
      { name: Shipment.name, schema: ShipmentSchema },
    ]),
    AuthModule,
  ],
  controllers: [DriversController],
  providers: [DriversService],
  exports: [DriversService],
})
export class DriversModule {}