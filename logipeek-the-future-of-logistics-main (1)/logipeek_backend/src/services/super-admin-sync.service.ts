import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserRole } from '../schemas/user.schema';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SuperAdminSyncService {
  private readonly logger = new Logger(SuperAdminSyncService.name);

  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  // Run on startup and every hour
  @Cron(CronExpression.EVERY_HOUR)
  async syncSuperAdmin() {
    try {
      const superAdminEmail = process.env.SUPER_ADMIN;
      
      if (!superAdminEmail) {
        this.logger.warn('SUPER_ADMIN environment variable not set');
        return;
      }

      this.logger.log(`Syncing super admin: ${superAdminEmail}`);

      // First, remove super admin privileges from all users
      await this.userModel.updateMany(
        { isSuperAdmin: true },
        { isSuperAdmin: false }
      );

      // Then, set the specified email as super admin
      const result = await this.userModel.updateOne(
        { 
          email: superAdminEmail,
          role: UserRole.ADMIN,
          isActive: true 
        },
        { isSuperAdmin: true }
      );

      if (result.matchedCount === 0) {
        this.logger.warn(`Super admin user not found: ${superAdminEmail}. User must be an active admin.`);
      } else {
        this.logger.log(`Super admin privileges granted to: ${superAdminEmail}`);
      }

    } catch (error) {
      this.logger.error('Error syncing super admin:', error);
    }
  }

  // Manual sync method
  async syncSuperAdminManual() {
    await this.syncSuperAdmin();
  }
}