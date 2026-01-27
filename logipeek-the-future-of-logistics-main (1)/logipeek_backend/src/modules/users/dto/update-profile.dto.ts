import { IsString, IsEmail, IsOptional, MinLength, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Alisher Karimov' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ example: '+998901234567' })
  @IsOptional()
  @IsString()
  @Matches(/^\+998\d{9}$/, { message: 'Telefon raqam +998XXXXXXXXX formatida bo\'lishi kerak' })
  phone?: string;

  @ApiPropertyOptional({ example: 'alisher@example.com' })
  @IsOptional()
  @IsEmail({}, { message: 'Email noto\'g\'ri formatda' })
  email?: string;

  @ApiPropertyOptional({ example: 'NewPassword123!' })
  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak' })
  newPassword?: string;

  @ApiPropertyOptional({ example: 'OldPassword123!' })
  @IsOptional()
  @IsString()
  currentPassword?: string;

  @ApiPropertyOptional({ example: '/uploads/license_123.jpg' })
  @IsOptional()
  @IsString()
  licenseImageUrl?: string;
}
