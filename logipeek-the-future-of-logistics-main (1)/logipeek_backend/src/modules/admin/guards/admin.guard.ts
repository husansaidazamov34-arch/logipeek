import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserRole } from '../../../schemas/user.schema';

@Injectable()
export class AdminGuard implements CanActivate {
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
      isActive: true,
    });

    if (!user) {
      throw new ForbiddenException('Foydalanuvchi topilmadi');
    }

    // Allow both admins and super admins
    if (user.role !== UserRole.ADMIN && !user.isSuperAdmin) {
      throw new ForbiddenException('Sizda admin huquqlari yo\'q');
    }

    return true;
  }
}