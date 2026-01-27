import { IsUUID, IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApproveLicenseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  driverId: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  approved: boolean;

  @ApiPropertyOptional({ example: 'Guvohnoma aniq va to\'g\'ri' })
  @IsOptional()
  @IsString()
  reason?: string;
}