import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'Email noto\'g\'ri formatda' })
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  password: string;
}
