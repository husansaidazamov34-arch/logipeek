import { Injectable, NotFoundException, BadRequestException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../schemas/user.schema';
import { DriverProfile } from '../../schemas/driver-profile.schema';
import { ShipperProfile } from '../../schemas/shipper-profile.schema';
import { Shipment } from '../../schemas/shipment.schema';
import { ShipmentStatusHistory } from '../../schemas/shipment-status-history.schema';
import { Notification } from '../../schemas/notification.schema';
import { AdminAction } from '../../schemas/admin-action.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(DriverProfile.name)
    private driverProfileModel: Model<DriverProfile>,
    @InjectModel(ShipperProfile.name)
    private shipperProfileModel: Model<ShipperProfile>,
    @InjectModel(Shipment.name)
    private shipmentModel: Model<Shipment>,
    @InjectModel(ShipmentStatusHistory.name)
    private shipmentStatusHistoryModel: Model<ShipmentStatusHistory>,
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
    @InjectModel(AdminAction.name)
    private adminActionModel: Model<AdminAction>,
  ) {}

  async findOne(id: string) {
    const user = await this.userModel.findById(id)
      .populate('driverProfile')
      .populate('shipperProfile');

    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    const result = user.toObject();
    delete result.passwordHash;
    
    // Remove license number from driver profile for security
    if (result.driverProfile) {
      const { licenseNumber, ...driverProfileWithoutLicense } = result.driverProfile;
      result.driverProfile = driverProfileWithoutLicense;
    }
    
    return result;
  }

  async update(id: string, updateData: Partial<User>) {
    await this.userModel.updateOne({ _id: id }, updateData);
    return this.findOne(id);
  }

  async updateProfile(id: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    // Check if email is being changed and if it's already taken
    if (updateProfileDto.email && updateProfileDto.email !== user.email) {
      const existingUser = await this.userModel.findOne({
        email: updateProfileDto.email,
      });
      if (existingUser) {
        throw new ConflictException('Bu email allaqachon ishlatilmoqda');
      }
      user.email = updateProfileDto.email;
    }

    // Check if phone is being changed and if it's already taken
    if (updateProfileDto.phone && updateProfileDto.phone !== user.phone) {
      const existingUser = await this.userModel.findOne({
        phone: updateProfileDto.phone,
      });
      if (existingUser) {
        throw new ConflictException('Bu telefon raqam allaqachon ishlatilmoqda');
      }
      user.phone = updateProfileDto.phone;
    }

    // Update full name if provided
    if (updateProfileDto.fullName) {
      user.fullName = updateProfileDto.fullName;
    }

    // Update password if provided
    if (updateProfileDto.newPassword) {
      // Verify current password
      if (!updateProfileDto.currentPassword) {
        throw new BadRequestException('Parolni o\'zgartirish uchun joriy parolni kiriting');
      }

      const isPasswordValid = await bcrypt.compare(
        updateProfileDto.currentPassword,
        user.passwordHash,
      );

      if (!isPasswordValid) {
        throw new BadRequestException('Joriy parol noto\'g\'ri');
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(updateProfileDto.newPassword, salt);
    }

    // Update driver profile license image if provided
    if (updateProfileDto.licenseImageUrl !== undefined && user.role === 'driver') {
      const driverProfile = await this.driverProfileModel.findOne({
        userId: user._id,
      });
      
      if (driverProfile) {
        driverProfile.licenseImageUrl = updateProfileDto.licenseImageUrl;
        
        // Reset approval status when new image is uploaded
        // This allows admin to review the new image
        if (updateProfileDto.licenseImageUrl) {
          driverProfile.isLicenseApproved = null; // Reset to pending
          driverProfile.licenseApprovedBy = null;
          driverProfile.licenseApprovedAt = null;
        }
        
        await driverProfile.save();
      }
    }

    await user.save();

    return this.findOne(id);
  }

  async deleteAccount(userId: string) {
    const user = await this.userModel.findById(userId)
      .populate('driverProfile')
      .populate('shipperProfile');

    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    // Cannot delete super admin account
    if (user.isSuperAdmin) {
      throw new ForbiddenException('Super admin akkauntini o\'chirib bo\'lmaydi');
    }

    // Delete related data
    // Delete related profiles first
    if (user.driverProfile) {
      await this.driverProfileModel.deleteOne({ userId });
    }
    if (user.shipperProfile) {
      await this.shipperProfileModel.deleteOne({ userId });
    }

    // Get user shipments to delete related status history
    const userShipments = await this.shipmentModel.find({
      $or: [{ shipperId: userId }, { driverId: userId }]
    });
    
    for (const shipment of userShipments) {
      await this.shipmentStatusHistoryModel.deleteMany({ shipmentId: shipment._id });
    }

    // Delete related shipments
    await this.shipmentModel.deleteMany({
      $or: [{ shipperId: userId }, { driverId: userId }]
    });

    // Delete related notifications
    await this.notificationModel.deleteMany({ userId });

    // Delete related admin actions (if user is admin)
    await this.adminActionModel.deleteMany({
      $or: [{ adminId: userId }, { targetUserId: userId }]
    });

    // Finally delete the user
    await this.userModel.deleteOne({ _id: userId });

    return { message: 'Akkaunt muvaffaqiyatli o\'chirildi' };
  }
}