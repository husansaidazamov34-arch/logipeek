import { Controller, Get, Put, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Barcha bildirishnomalarni olish' })
  findAll(@Request() req) {
    return this.notificationsService.findAll(req.user.userId);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'O\'qilmagan bildirishnomalar sonini olish' })
  getUnreadCount(@Request() req) {
    return this.notificationsService.getUnreadCount(req.user.userId);
  }

  @Put(':id/read')
  @ApiOperation({ summary: 'Bildirishnomani o\'qilgan deb belgilash' })
  markAsRead(@Param('id') id: string, @Request() req) {
    return this.notificationsService.markAsRead(id, req.user.userId);
  }

  @Put('read-all')
  @ApiOperation({ summary: 'Barcha bildirishnomalarni o\'qilgan deb belgilash' })
  markAllAsRead(@Request() req) {
    return this.notificationsService.markAllAsRead(req.user.userId);
  }
}
