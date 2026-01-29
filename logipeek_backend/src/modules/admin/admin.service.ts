import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserRole } from '../../schemas/user.schema';
import { AdminAction } from '../../schemas/admin-action.schema';
import { Shipment, ShipmentStatus } from '../../schemas/shipment.schema';
import { ShipmentStatusHistory } from '../../schemas/shipment-status-history.schema';
import { DriverProfile, DriverStatus } from '../../schemas/driver-profile.schema';
import { ShipperProfile } from '../../schemas/shipper-profile.schema';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { ApproveLicenseDto } from './dto/approve-license.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(AdminAction.name)
    private adminActionModel: Model<AdminAction>,
    @InjectModel(Shipment.name)
    private shipmentModel: Model<Shipment>,
    @InjectModel(DriverProfile.name)
    private driverProfileModel: Model<DriverProfile>,
    @InjectModel(ShipperProfile.name)
    private shipperProfileModel: Model<ShipperProfile>,
    @InjectModel(ShipmentStatusHistory.name)
    private statusHistoryModel: Model<ShipmentStatusHistory>,
  ) {}

  // Dashboard statistics
  async getDashboardStats() {
    const [
      totalUsers,
      totalDrivers,
      totalShippers,
      totalAdmins,
      totalShipments,
      activeShipments,
      completedShipments,
      onlineDrivers,
    ] = await Promise.all([
      this.userModel.countDocuments({ isActive: true }),
      this.userModel.countDocuments({ role: UserRole.DRIVER, isActive: true }),
      this.userModel.countDocuments({ role: UserRole.SHIPPER, isActive: true }),
      this.userModel.countDocuments({ role: UserRole.ADMIN, isActive: true }),
      this.shipmentModel.countDocuments(),
      this.shipmentModel.countDocuments({ 
        status: { $in: [ShipmentStatus.ACCEPTED, ShipmentStatus.PICKUP, ShipmentStatus.TRANSIT] }
      }),
      this.shipmentModel.countDocuments({ status: ShipmentStatus.COMPLETED }),
      this.driverProfileModel.countDocuments({ status: DriverStatus.ONLINE }),
    ]);

    return {
      totalUsers,
      totalDrivers,
      totalShippers,
      totalAdmins,
      totalShipments,
      activeShipments,
      completedShipments,
      onlineDrivers,
    };
  }

  // Get all users with pagination
  async getAllUsers(page: number = 1, limit: number = 10, role?: UserRole) {
    const skip = (page - 1) * limit;
    const filter: any = {};
    
    if (role) {
      filter.role = role;
    }

    const [users, total] = await Promise.all([
      this.userModel.find(filter)
        .populate('driverProfile', 'licensePlate rating totalTrips status isLicenseApproved')
        .populate('shipperProfile', 'companyName totalShipments')
        .select('-passwordHash')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      this.userModel.countDocuments(filter),
    ]);

    return {
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Get all admins
  async getAllAdmins() {
    return this.userModel.find({ 
      role: UserRole.ADMIN,
      isActive: true 
    })
    .select('-passwordHash')
    .sort({ createdAt: -1 });
  }

  // Get pending license approvals
  async getPendingLicenseApprovals() {
    return this.driverProfileModel.find({ 
      isLicenseApproved: null,
      licenseImageUrl: { $ne: null }
    })
    .populate('user', 'fullName email phone')
    .sort({ createdAt: -1 });
  }

  // Approve or reject license
  async approveLicense(driverProfileId: string, approveDto: ApproveLicenseDto, adminId: string) {
    const driverProfile = await this.driverProfileModel.findById(driverProfileId)
      .populate('user', 'fullName email');

    if (!driverProfile) {
      throw new NotFoundException('Haydovchi profili topilmadi');
    }

    driverProfile.isLicenseApproved = approveDto.approved;
    driverProfile.licenseApprovedBy = adminId as any;
    driverProfile.licenseApprovedAt = new Date();

    await driverProfile.save();

    // Log admin action
    await this.logAdminAction(
      adminId,
      driverProfile.userId.toString(),
      approveDto.approved ? 'license_approved' : 'license_rejected',
      `Haydovchilik guvohnomasi ${approveDto.approved ? 'tasdiqlandi' : 'rad etildi'}`,
      { reason: approveDto.reason }
    );

    return driverProfile;
  }

  // Create admin user
  async createAdmin(createAdminDto: CreateAdminDto, createdByAdminId: string) {
    // Check if email already exists
    const existingUser = await this.userModel.findOne({ email: createAdminDto.email });
    if (existingUser) {
      throw new ConflictException('Bu email allaqachon ishlatilmoqda');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);

    // Create admin user
    const adminUser = new this.userModel({
      fullName: createAdminDto.fullName,
      email: createAdminDto.email,
      phone: createAdminDto.phone,
      passwordHash: hashedPassword,
      role: UserRole.ADMIN,
      isActive: true,
    });

    await adminUser.save();

    // Log admin action
    await this.logAdminAction(
      createdByAdminId,
      adminUser._id.toString(),
      'admin_created',
      `Yangi admin yaratildi: ${adminUser.fullName}`,
    );

    return this.sanitizeUser(adminUser);
  }

  // Create super admin (public method for initial setup)
  async createSuperAdmin() {
    const superAdminEmail = process.env.SUPER_ADMIN || 'pes159541@gmail.com';
    
    // Check if super admin already exists
    const existingUser = await this.userModel.findOne({ email: superAdminEmail });
    
    if (existingUser) {
      // Update existing user to be super admin
      existingUser.role = UserRole.ADMIN;
      existingUser.isActive = true;
      existingUser.isSuperAdmin = true;
      await existingUser.save();
      
      return {
        message: 'Mavjud foydalanuvchi super admin qilindi',
        email: superAdminEmail,
        user: this.sanitizeUser(existingUser)
      };
    } else {
      // Create new super admin
      const hashedPassword = await bcrypt.hash('SuperAdmin123!', 10);
      
      const superAdmin = new this.userModel({
        fullName: 'Super Administrator',
        email: superAdminEmail,
        phone: '+998901234567',
        passwordHash: hashedPassword,
        role: UserRole.ADMIN,
        isActive: true,
        isSuperAdmin: true,
      });

      await superAdmin.save();

      return {
        message: 'Yangi super admin yaratildi',
        email: superAdminEmail,
        password: 'SuperAdmin123!',
        user: this.sanitizeUser(superAdmin),
        warning: 'Parolni o\'zgartirishni unutmang!'
      };
    }
  }

  private sanitizeUser(user: User) {
    const { passwordHash, ...result } = user.toObject();
    return result;
  }

    // Hash password
    const passwordHash = await bcrypt.hash(createAdminDto.password, 10);

    const admin = new this.userModel({
      email: createAdminDto.email,
      passwordHash,
      fullName: createAdminDto.fullName,
      phone: createAdminDto.phone,
      role: UserRole.ADMIN,
      createdByAdminId,
    });

    const savedAdmin = await admin.save();

    // Log admin action
    await this.logAdminAction(
      createdByAdminId,
      savedAdmin._id.toString(),
      'admin_created',
      'Yangi admin yaratildi',
      { adminEmail: createAdminDto.email }
    );

    const { passwordHash: _, ...result } = savedAdmin.toObject();
    return result;
  }

  // Delete admin
  async deleteAdmin(adminId: string, requestingAdminId: string) {
    const admin = await this.userModel.findById(adminId);
    
    if (!admin) {
      throw new NotFoundException('Admin topilmadi');
    }

    if (admin.isSuperAdmin) {
      throw new ForbiddenException('Super adminni o\'chirib bo\'lmaydi');
    }

    admin.isActive = false;
    await admin.save();

    // Log admin action
    await this.logAdminAction(
      requestingAdminId,
      adminId,
      'admin_deleted',
      'Admin o\'chirildi',
      { adminEmail: admin.email }
    );

    return { message: 'Admin muvaffaqiyatli o\'chirildi' };
  }

  // Get user details
  async getUserDetails(userId: string) {
    const user = await this.userModel.findById(userId)
      .populate('driverProfile')
      .populate('shipperProfile')
      .select('-passwordHash');

    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    return user;
  }

  // Update user status
  async updateUserStatus(userId: string, updateStatusDto: UpdateUserStatusDto, adminId: string) {
    const user = await this.userModel.findById(userId);
    
    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    user.isActive = updateStatusDto.isActive;
    await user.save();

    // Log admin action
    await this.logAdminAction(
      adminId,
      userId,
      updateStatusDto.isActive ? 'user_activated' : 'user_deactivated',
      `Foydalanuvchi ${updateStatusDto.isActive ? 'faollashtirildi' : 'o\'chirildi'}`,
      { reason: updateStatusDto.reason }
    );

    return user;
  }

  // Delete user
  async deleteUser(userId: string, adminId: string) {
    const user = await this.userModel.findById(userId);
    
    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    if (user.role === UserRole.ADMIN) {
      throw new ForbiddenException('Adminni oddiy admin o\'chira olmaydi');
    }

    user.isActive = false;
    await user.save();

    // Log admin action
    await this.logAdminAction(
      adminId,
      userId,
      'user_deleted',
      'Foydalanuvchi o\'chirildi',
      { userEmail: user.email }
    );

    return { message: 'Foydalanuvchi muvaffaqiyatli o\'chirildi' };
  }

  // Get approved licenses
  async getApprovedLicenses() {
    return this.driverProfileModel.find({ 
      isLicenseApproved: true,
      licenseImageUrl: { $ne: null }
    })
    .populate('user', 'fullName email phone')
    .populate('licenseApprovedByAdmin', 'fullName email')
    .sort({ licenseApprovedAt: -1 });
  }

  // Get rejected licenses
  async getRejectedLicenses() {
    return this.driverProfileModel.find({ 
      isLicenseApproved: false,
      licenseImageUrl: { $ne: null }
    })
    .populate('user', 'fullName email phone')
    .populate('licenseApprovedByAdmin', 'fullName email')
    .sort({ licenseApprovedAt: -1 });
  }

  // Get admin actions log
  async getAdminActions(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [actions, total] = await Promise.all([
      this.adminActionModel.find()
        .populate('admin', 'fullName email')
        .populate('targetUser', 'fullName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      this.adminActionModel.countDocuments(),
    ]);

    return {
      actions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Private method to log admin actions
  private async logAdminAction(
    adminId: string,
    targetUserId: string | null,
    action: string,
    description: string,
    metadata?: any
  ) {
    const adminAction = new this.adminActionModel({
      adminId,
      targetUserId,
      action,
      description,
      metadata,
    });

    await adminAction.save();
  }
}