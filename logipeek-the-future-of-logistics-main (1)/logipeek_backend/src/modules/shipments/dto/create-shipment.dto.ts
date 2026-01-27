import { IsString, IsNumber, IsOptional, Min, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateShipmentDto {
  @ApiProperty({ example: 'Tashkent, Mirabad tumani' })
  @IsString()
  pickupAddress: string;

  @ApiProperty({ example: 41.2995 })
  @IsNumber()
  pickupLatitude: number;

  @ApiProperty({ example: 69.2401 })
  @IsNumber()
  pickupLongitude: number;

  @ApiPropertyOptional({ example: 'Alisher' })
  @IsOptional()
  @IsString()
  pickupContactName?: string;

  @ApiPropertyOptional({ example: '+998901234567' })
  @IsOptional()
  @IsString()
  pickupContactPhone?: string;

  @ApiProperty({ example: 'Samarkand, Registon maydoni' })
  @IsString()
  dropoffAddress: string;

  @ApiProperty({ example: 39.6542 })
  @IsNumber()
  dropoffLatitude: number;

  @ApiProperty({ example: 66.9597 })
  @IsNumber()
  dropoffLongitude: number;

  @ApiPropertyOptional({ example: 'Nodira' })
  @IsOptional()
  @IsString()
  dropoffContactName?: string;

  @ApiPropertyOptional({ example: '+998909876543' })
  @IsOptional()
  @IsString()
  dropoffContactPhone?: string;

  @ApiProperty({ example: 750 })
  @IsNumber()
  @Min(1)
  weight: number;

  @ApiProperty({ example: 'truck' })
  @IsString()
  vehicleTypeRequired: string;

  @ApiPropertyOptional({ example: 'Mo\'rt yuk, ehtiyot bo\'ling' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Tez yetkazish kerak' })
  @IsOptional()
  @IsString()
  specialInstructions?: string;

  @ApiProperty({ example: 580000 })
  @IsNumber()
  @Min(0)
  estimatedPrice: number;

  @ApiPropertyOptional({ example: 'payme' })
  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @ApiPropertyOptional({ example: 298 })
  @IsOptional()
  @IsNumber()
  distanceKm?: number;

  @ApiPropertyOptional({ example: '2024-01-20T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  deliveryDateFrom?: string;

  @ApiPropertyOptional({ example: '2024-01-25T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  deliveryDateTo?: string;
}
