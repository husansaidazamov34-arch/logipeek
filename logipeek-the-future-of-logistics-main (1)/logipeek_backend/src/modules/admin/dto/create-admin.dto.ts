import { IsEmail, IsNotEmpty, IsString, MinLength, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminDto {
  @ApiProperty({ example: 'admin@logipeek.com' })
  @IsEmail({}, { message: 'Noto\'g\'ri email format' })
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6, { message: 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak' })
  password: string;

  @ApiProperty({ example: 'Admin Adminov' })
  @IsNotEmpty({ message: 'To\'liq ism kiritilishi shart' })
  @IsString()
  fullName: string;

  @ApiProperty({ example: '+998901234567' })
  @IsNotEmpty({ message: 'Telefon raqam kiritilishi shart' })
  @IsString()
  phone: string;
}