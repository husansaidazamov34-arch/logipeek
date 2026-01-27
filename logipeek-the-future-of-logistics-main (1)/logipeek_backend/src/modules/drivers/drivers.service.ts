import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DriverProfile, DriverStatus } from '../../schemas/driver-profile.schema';
import { Shipment, ShipmentStatus } from '../../schemas/shipment.schema';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class DriversService {
  constructor(
    @InjectModel(DriverProfile.name)
    private driverProfileModel: Model<DriverProfile>,
    @InjectModel(Shipment.name)
    private shipmentModel: Model<Shipment>,
  ) {}

  async findAll() {
    return this.driverProfileModel.find({
      status: DriverStatus.ONLINE,
    })
    .populate('user', 'fullName email phone')
    .select('userId licensePlate rating totalTrips totalEarnings status currentLatitude currentLongitude lastLocationUpdate createdAt updatedAt');
  }

  async findAllOnline() {
    // Get all online and busy drivers with their locations
    return this.driverProfileModel.find({
      status: { $in: [DriverStatus.ONLINE, DriverStatus.BUSY] },
    })
    .populate('user', 'fullName')
    .select('userId licensePlate status currentLatitude currentLongitude lastLocationUpdate');
  }

  async findOne(userId: string) {
    const profile = await this.driverProfileModel.findOne({ userId })
      .populate('user', 'fullName email phone')
      .select('userId licensePlate rating totalTrips totalEarnings status currentLatitude currentLongitude lastLocationUpdate createdAt updatedAt');

    if (!profile) {
      throw new NotFoundException('Haydovchi topilmadi');
    }

    return profile;
  }

  async updateLocation(userId: string, updateLocationDto: UpdateLocationDto) {
    const profile = await this.driverProfileModel.findOne({ userId });

    if (!profile) {
      throw new NotFoundException('Haydovchi topilmadi');
    }

    profile.currentLatitude = updateLocationDto.latitude;
    profile.currentLongitude = updateLocationDto.longitude;
    profile.lastLocationUpdate = new Date();

    await profile.save();

    return this.findOne(userId);
  }

  async updateStatus(userId: string, status: DriverStatus) {
    const profile = await this.driverProfileModel.findOne({ userId });
    
    if (!profile) {
      throw new NotFoundException('Haydovchi topilmadi');
    }

    profile.status = status;
    await profile.save();
    
    return this.findOne(userId);
  }

  async getStats(userId: string) {
    const profile = await this.findOne(userId);

    const completedTrips = await this.shipmentModel.countDocuments({
      driverId: userId,
      status: ShipmentStatus.COMPLETED,
    });

    const activeTrips = await this.shipmentModel.countDocuments({
      driverId: userId,
      status: ShipmentStatus.TRANSIT,
    });

    return {
      ...profile.toObject(),
      completedTrips,
      activeTrips,
    };
  }
}