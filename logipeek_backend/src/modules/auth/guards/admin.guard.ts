import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserRole } from '../../../schemas/user.schema';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Foydalanuvchi topilmadi');
    }

    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Faqat adminlar uchun ruxsat berilgan');
    }

    return true;
  }
}