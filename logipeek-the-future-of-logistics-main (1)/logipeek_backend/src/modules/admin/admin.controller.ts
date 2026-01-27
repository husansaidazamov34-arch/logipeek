import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query, 
  UseGuards, 
  Request,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { ApproveLicenseDto } from './dto/approve-license.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { SuperAdminGuard } from './guards/super-admin.guard';
import { UserRole } from '../../schemas/user.schema';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard/stats')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Dashboard statistikalari' })
  @ApiResponse({ status: 200, description: 'Statistikalar muvaffaqiyatli olindi' })
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  // Admin management
  @Get('admins')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Barcha adminlarni ko\'rish' })
  @ApiResponse({ status: 200, description: 'Adminlar ro\'yxati' })
  async getAllAdmins(@Request() req) {
    return this.adminService.getAllAdmins();
  }

  @Post('admins')
  @UseGuards(SuperAdminGuard)
  @ApiOperation({ summary: 'Yangi admin yaratish (faqat super admin)' })
  @ApiResponse({ status: 201, description: 'Admin muvaffaqiyatli yaratildi' })
  @ApiResponse({ status: 403, description: 'Faqat super admin bu amalni bajara oladi' })
  async createAdmin(@Body() createAdminDto: CreateAdminDto, @Request() req) {
    return this.adminService.createAdmin(createAdminDto, req.user.userId);
  }

  @Delete('admins/:id')
  @UseGuards(SuperAdminGuard)
  @ApiOperation({ summary: 'Adminni o\'chirish (faqat super admin)' })
  @ApiResponse({ status: 200, description: 'Admin muvaffaqiyatli o\'chirildi' })
  @ApiResponse({ status: 403, description: 'Faqat super admin bu amalni bajara oladi' })
  async deleteAdmin(@Param('id') adminId: string, @Request() req) {
    return this.adminService.deleteAdmin(adminId, req.user.userId);
  }

  // User management
  @Get('users/:id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Foydalanuvchi tafsilotlari' })
  @ApiResponse({ status: 200, description: 'Foydalanuvchi ma\'lumotlari' })
  async getUserDetails(@Param('id') userId: string, @Request() req) {
    return this.adminService.getUserDetails(userId);
  }

  @Get('users')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Barcha foydalanuvchilarni ko\'rish' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'role', required: false, enum: UserRole })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Foydalanuvchilar ro\'yxati' })
  async getAllUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('role') role?: UserRole,
    @Query('search') search?: string,
  ) {
    return this.adminService.getAllUsers(page, limit, role);
  }

  @Put('users/:id/status')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Foydalanuvchi holatini o\'zgartirish' })
  @ApiResponse({ status: 200, description: 'Foydalanuvchi holati yangilandi' })
  async updateUserStatus(
    @Param('id') userId: string,
    @Body() updateStatusDto: UpdateUserStatusDto,
    @Request() req,
  ) {
    return this.adminService.updateUserStatus(userId, updateStatusDto, req.user.userId);
  }

  @Delete('users/:id')
  @UseGuards(SuperAdminGuard)
  @ApiOperation({ summary: 'Foydalanuvchini o\'chirish (faqat super admin)' })
  @ApiResponse({ status: 200, description: 'Foydalanuvchi muvaffaqiyatli o\'chirildi' })
  @ApiResponse({ status: 403, description: 'Faqat super admin bu amalni bajara oladi' })
  async deleteUser(@Param('id') userId: string, @Request() req) {
    return this.adminService.deleteUser(userId, req.user.userId);
  }

  // License approval management
  @Get('licenses/pending')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Tasdiqlanmagan haydovchilik guvohnomalari' })
  @ApiResponse({ status: 200, description: 'Kutilayotgan guvohnomaların ro\'yxati' })
  async getPendingLicenseApprovals(@Request() req) {
    return this.adminService.getPendingLicenseApprovals();
  }

  @Get('licenses/approved')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Tasdiqlangan haydovchilik guvohnomalari' })
  @ApiResponse({ status: 200, description: 'Tasdiqlangan guvohnomaların ro\'yxati' })
  async getApprovedLicenses(@Request() req) {
    return this.adminService.getApprovedLicenses();
  }

  @Get('licenses/rejected')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Rad etilgan haydovchilik guvohnomalari' })
  @ApiResponse({ status: 200, description: 'Rad etilgan guvohnomaların ro\'yxati' })
  async getRejectedLicenses(@Request() req) {
    return this.adminService.getRejectedLicenses();
  }

  @Post('licenses/approve')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Haydovchilik guvohnomasini tasdiqlash yoki rad etish' })
  @ApiResponse({ status: 200, description: 'Guvohnoma holati yangilandi' })
  async approveLicense(@Body() approveLicenseDto: ApproveLicenseDto, @Request() req) {
    return this.adminService.approveLicense(
      approveLicenseDto.driverId, 
      approveLicenseDto, 
      req.user.userId
    );
  }

  // Admin action logs
  @Get('logs')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Admin amallar tarixi' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'adminId', required: false, type: String })
  @ApiQuery({ name: 'action', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Admin amallar tarixi' })
  async getAdminActionLogs(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Query('adminId') adminId?: string,
    @Query('action') action?: string,
  ) {
    return this.adminService.getAdminActions(page, limit);
  }
}