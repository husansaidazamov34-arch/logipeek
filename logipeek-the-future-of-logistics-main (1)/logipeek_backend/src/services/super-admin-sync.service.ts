import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../schemas/user.schema';

@Injectable()
export class SuperAdminSyncService implements OnModuleInit {
  private readonly logger = new Logger(SuperAdminSyncService.name);

  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async onModuleInit() {
    await this.syncSuperAdmin();
  }

  private async syncSuperAdmin() {
    const superAdminEmail = process.env.SUPER_ADMIN;
    const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;
    const superAdminName = process.env.SUPER_ADMIN_NAME || 'Super Admin';

    if (!superAdminEmail || !superAdminPassword) {
      this.logger.warn('Super admin email yoki parol .env faylida belgilanmagan');
      return;
    }

    try {
      // Super admin mavjudligini tekshirish
      let superAdmin = await this.userModel.findOne({ 
        email: superAdminEmail 
      });

      if (superAdmin) {
        // Mavjud super admin'ni yangilash
        if (superAdmin.role !== UserRole.ADMIN || !superAdmin.isSuperAdmin) {
          superAdmin.role = UserRole.ADMIN;
          superAdmin.isSuperAdmin = true;
          superAdmin.isActive = true;
          await superAdmin.save();
          this.logger.log(`Super admin yangilandi: ${superAdminEmail}`);
        } else {
          this.logger.log(`Super admin allaqachon mavjud: ${superAdminEmail}`);
        }
      } else {
        // Yangi super admin yaratish
        const passwordHash = await bcrypt.hash(superAdminPassword, 10);
        
        superAdmin = new this.userModel({
          email: superAdminEmail,
          passwordHash,
          fullName: superAdminName,
          phone: '+998000000000', // Default telefon raqam
          role: UserRole.ADMIN,
          isSuperAdmin: true,
          isActive: true,
          emailVerified: true,
        });

        await superAdmin.save();
        this.logger.log(`Yangi super admin yaratildi: ${superAdminEmail}`);
      }
    } catch (error) {
      this.logger.error(`Super admin yaratishda xatolik: ${error.message}`);
    }
  }
}