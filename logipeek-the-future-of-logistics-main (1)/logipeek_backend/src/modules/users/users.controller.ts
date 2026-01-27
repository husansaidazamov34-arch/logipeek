import { Controller, Get, Put, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Foydalanuvchi ma\'lumotlarini olish' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Foydalanuvchi ma\'lumotlarini yangilash' })
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.usersService.update(id, updateData);
  }

  @Put(':id/profile')
  @ApiOperation({ summary: 'Profil ma\'lumotlarini yangilash (email, telefon, parol)' })
  @ApiResponse({ status: 200, description: 'Profil yangilandi' })
  @ApiResponse({ status: 400, description: 'Noto\'g\'ri ma\'lumot' })
  @ApiResponse({ status: 409, description: 'Email yoki telefon allaqachon ishlatilmoqda' })
  updateProfile(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
    @Request() req,
  ) {
    // Only allow users to update their own profile or admins to update any profile
    if (req.user.userId !== id && req.user.role !== 'admin') {
      throw new Error('Sizda bu profilni o\'zgartirish huquqi yo\'q');
    }
    return this.usersService.updateProfile(id, updateProfileDto);
  }

  @Delete('me')
  @ApiOperation({ summary: 'O\'z akkauntini o\'chirish' })
  @ApiResponse({ status: 200, description: 'Akkaunt o\'chirildi' })
  @ApiResponse({ status: 400, description: 'Xatolik yuz berdi' })
  deleteMyAccount(@Request() req) {
    return this.usersService.deleteAccount(req.user.userId);
  }
}
