import { Controller, Post, Body, Get, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SendVerificationCodeDto, VerifyEmailDto } from './dto/verify-email.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-verification-code')
  @ApiOperation({ summary: 'Email tasdiqlash kodini yuborish' })
  @ApiQuery({ name: 'forUpdate', required: false, type: Boolean, description: 'Profil tahrirlash uchun' })
  @ApiResponse({ status: 200, description: 'Kod muvaffaqiyatli yuborildi' })
  @ApiResponse({ status: 409, description: 'Email allaqachon ro\'yxatdan o\'tgan' })
  async sendVerificationCode(
    @Body() dto: SendVerificationCodeDto,
    @Query('forUpdate') forUpdate?: string,
  ) {
    const isForUpdate = forUpdate === 'true';
    return this.authService.sendVerificationCode(dto, isForUpdate);
  }

  @Post('verify-email')
  @ApiOperation({ summary: 'Email tasdiqlash kodini tekshirish' })
  @ApiResponse({ status: 200, description: 'Email tasdiqlandi' })
  @ApiResponse({ status: 400, description: 'Noto\'g\'ri yoki yaroqsiz kod' })
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Ro\'yxatdan o\'tish' })
  @ApiResponse({ status: 201, description: 'Foydalanuvchi muvaffaqiyatli ro\'yxatdan o\'tdi' })
  @ApiResponse({ status: 409, description: 'Email yoki telefon allaqachon mavjud' })
  async register(@Body() registerDto: RegisterDto) {
    console.log('📝 Register request received:', JSON.stringify(registerDto, null, 2));
    try {
      const result = await this.authService.register(registerDto);
      console.log('✅ Register successful for:', registerDto.email);
      return result;
    } catch (error) {
      console.error('❌ Register error:', error.message);
      throw error;
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'Tizimga kirish' })
  @ApiResponse({ status: 200, description: 'Muvaffaqiyatli kirish' })
  @ApiResponse({ status: 401, description: 'Noto\'g\'ri email yoki parol' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Parolni unutdim - tiklash kodini yuborish' })
  @ApiResponse({ status: 200, description: 'Tiklash kodi yuborildi' })
  @ApiResponse({ status: 404, description: 'Foydalanuvchi topilmadi' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Parolni tiklash' })
  @ApiResponse({ status: 200, description: 'Parol yangilandi' })
  @ApiResponse({ status: 400, description: 'Noto\'g\'ri yoki yaroqsiz kod' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Joriy foydalanuvchi ma\'lumotlari' })
  @ApiResponse({ status: 200, description: 'Foydalanuvchi ma\'lumotlari' })
  @ApiResponse({ status: 401, description: 'Autentifikatsiya talab qilinadi' })
  async getProfile(@Request() req) {
    return this.authService.getUserById(req.user.userId);
  }
}
