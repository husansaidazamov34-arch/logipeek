import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { SchedulerService } from './scheduler.service';

@ApiTags('Scheduler')
@Controller('scheduler')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}

  @Post('trigger-expired-check')
  @ApiOperation({ 
    summary: 'Muddati o\'tgan buyurtmalarni tekshirish (Test uchun)',
    description: 'Faqat development muhitida ishlaydi. 2 soatdan ortiq vaqt o\'tgan buyurtmalarni tekshiradi va avtomatik bekor qiladi.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Tekshirish muvaffaqiyatli bajarildi' 
  })
  async triggerExpiredCheck() {
    await this.schedulerService.triggerExpiredPickupsCheck();
    return { 
      message: 'Muddati o\'tgan buyurtmalarni tekshirish bajarildi',
      timestamp: new Date().toISOString()
    };
  }
}