import { Injectable, UnauthorizedException, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../../schemas/user.schema';
import { DriverProfile } from '../../schemas/driver-profile.schema';
import { ShipperProfile } from '../../schemas/shipper-profile.schema';
import { VerificationCode } from '../../schemas/verification-code.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SendVerificationCodeDto, VerifyEmailDto } from './dto/verify-email.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/reset-password.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(DriverProfile.name)
    private driverProfileModel: Model<DriverProfile>,
    @InjectModel(ShipperProfile.name)
    private shipperProfileModel: Model<ShipperProfile>,
    @InjectModel(VerificationCode.name)
    private verificationCodeModel: Model<VerificationCode>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, fullName, phone, role, ...profileData } = registerDto;

    // Email va telefon raqamni tekshirish
    const existingUser = await this.userModel.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new ConflictException('Bu email allaqachon ro\'yxatdan o\'tgan');
      }
      if (existingUser.phone === phone) {
        throw new ConflictException('Bu telefon raqam allaqachon ro\'yxatdan o\'tgan');
      }
    }

    // Davlat raqamini tekshirish (haydovchilar uchun)
    if (role === UserRole.DRIVER && profileData.licensePlate) {
      const existingDriver = await this.driverProfileModel.findOne({
        licensePlate: profileData.licensePlate,
      });

      if (existingDriver) {
        throw new ConflictException('Bu davlat raqami allaqachon ro\'yxatdan o\'tgan');
      }
    }

    // Parolni hash qilish
    const passwordHash = await bcrypt.hash(password, 10);

    // Foydalanuvchi yaratish
    const user = new this.userModel({
      email,
      passwordHash,
      fullName,
      phone,
      role,
      isActive: true, // Darhol faollashtirish
      emailVerified: true, // Email tasdiqlangan deb belgilash
    });

    const savedUser = await user.save();

    // Rol asosida profil yaratish
    if (role === UserRole.DRIVER) {
      const driverProfile = new this.driverProfileModel({
        userId: savedUser._id,
        licensePlate: profileData.licensePlate,
        licenseNumber: profileData.licenseNumber,
      });
      await driverProfile.save();
    } else if (role === UserRole.SHIPPER) {
      const shipperProfile = new this.shipperProfileModel({
        userId: savedUser._id,
        companyName: profileData.companyName,
        companyAddress: profileData.companyAddress,
      });
      await shipperProfile.save();
    }

    // Token yaratish
    const token = this.generateToken(savedUser);

    return {
      message: 'Ro\'yxatdan o\'tish muvaffaqiyatli yakunlandi',
      user: this.sanitizeUser(savedUser),
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email })
      .populate('driverProfile')
      .populate('shipperProfile');

    if (!user) {
      throw new UnauthorizedException('Email yoki parol noto\'g\'ri');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email yoki parol noto\'g\'ri');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Akkaunt faol emas');
    }

    const token = this.generateToken(user);

    return {
      user: this.sanitizeUser(user),
      token,
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email });

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      return this.sanitizeUser(user);
    }

    return null;
  }

  async getUserById(id: string) {
    const user = await this.userModel.findById(id)
      .populate('driverProfile')
      .populate('shipperProfile');

    if (!user) {
      throw new UnauthorizedException('Foydalanuvchi topilmadi');
    }

    return this.sanitizeUser(user);
  }

  private generateToken(user: User): string {
    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }

  private sanitizeUser(user: User) {
    const { passwordHash, ...result } = user.toObject();
    
    // Filter out sensitive driver information (license number) for security
    if (result.driverProfile) {
      const { licenseNumber, ...driverProfileWithoutLicense } = result.driverProfile;
      result.driverProfile = driverProfileWithoutLicense;
    }
    
    return result;
  }

  // Generate 6-digit verification code
  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Send verification code to email
  async sendVerificationCode(dto: SendVerificationCodeDto, forUpdate: boolean = false) {
    const { email } = dto;

    // Check if email already exists (only for registration, not for profile update)
    if (!forUpdate) {
      const existingUser = await this.userModel.findOne({ email });
      if (existingUser) {
        throw new ConflictException('Bu email allaqachon ro\'yxatdan o\'tgan');
      }
    }

    // Delete old unused codes for this email
    await this.verificationCodeModel.deleteMany({
      email,
      isUsed: false,
    });

    // Generate new code
    const code = this.generateVerificationCode();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5); // 5 minutes expiry

    // Save code to database
    const verificationCode = new this.verificationCodeModel({
      email,
      code,
      expiresAt,
    });
    await verificationCode.save();

    // Send email
    await this.emailService.sendVerificationCode(email, code);

    return {
      message: 'Tasdiqlash kodi emailga yuborildi',
      expiresIn: 300, // seconds (5 minutes)
    };
  }

  // Verify email code
  async verifyEmail(dto: VerifyEmailDto) {
    const { email, code } = dto;

    // Find verification code
    const verificationCode = await this.verificationCodeModel.findOne({
      email,
      code,
      isUsed: false,
    });

    if (!verificationCode) {
      // Check if code exists but is used
      const usedCode = await this.verificationCodeModel.findOne({
        email,
        code,
      });
      
      if (usedCode) {
        throw new BadRequestException('Bu tasdiqlash kodi allaqachon ishlatilgan');
      }
      
      throw new BadRequestException('Noto\'g\'ri yoki yaroqsiz tasdiqlash kodi');
    }

    // Check if code is expired
    if (new Date() > verificationCode.expiresAt) {
      throw new BadRequestException('Tasdiqlash kodi muddati tugagan. Yangi kod so\'rang');
    }

    // Mark code as used
    verificationCode.isUsed = true;
    await verificationCode.save();

    return {
      message: 'Email muvaffaqiyatli tasdiqlandi',
      verified: true,
    };
  }

  // Clean up expired codes (can be called periodically)
  async cleanupExpiredCodes() {
    await this.verificationCodeModel.deleteMany({
      expiresAt: { $lt: new Date() },
    });
  }

  // Forgot password - send reset code
  async forgotPassword(dto: ForgotPasswordDto) {
    const { email } = dto;

    // Check if user exists
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('Bu email bilan foydalanuvchi topilmadi');
    }

    // Delete old unused codes for this email
    await this.verificationCodeModel.deleteMany({
      email,
      isUsed: false,
    });

    // Generate new code
    const code = this.generateVerificationCode();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5); // 5 minutes expiry

    // Save code to database
    const verificationCode = new this.verificationCodeModel({
      email,
      code,
      expiresAt,
    });
    await verificationCode.save();

    // Send email
    await this.emailService.sendPasswordResetCode(email, code, user.fullName);

    return {
      message: 'Parolni tiklash kodi emailga yuborildi',
      expiresIn: 300, // seconds
    };
  }

  // Reset password with code
  async resetPassword(dto: ResetPasswordDto) {
    const { email, code, newPassword } = dto;

    // Find verification code
    const verificationCode = await this.verificationCodeModel.findOne({
      email,
      code,
      isUsed: false,
    });

    if (!verificationCode) {
      throw new BadRequestException('Noto\'g\'ri yoki yaroqsiz tasdiqlash kodi');
    }

    // Check if code is expired
    if (new Date() > verificationCode.expiresAt) {
      throw new BadRequestException('Tasdiqlash kodi muddati tugagan. Yangi kod so\'rang');
    }

    // Find user
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    // Update password
    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = passwordHash;
    await user.save();

    // Mark code as used
    verificationCode.isUsed = true;
    await verificationCode.save();

    return {
      message: 'Parol muvaffaqiyatli yangilandi',
    };
  }
}