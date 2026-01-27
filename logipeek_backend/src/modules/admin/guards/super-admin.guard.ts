import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserRole } from '../../../schemas/user.schema';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.userId;

    if (!userId) {
      throw new ForbiddenException('Autentifikatsiya talab qilinadi');
    }

    const user = await this.userModel.findOne({
      _id: userId,
      role: UserRole.ADMIN,
      isActive: true,
    });

    if (!user || !user.isSuperAdmin) {
      throw new ForbiddenException('Faqat super admin bu amalni bajara oladi');
    }

    return true;
  }
}