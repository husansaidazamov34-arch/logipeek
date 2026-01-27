import { IsEnum, IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ShipmentStatus } from '../../../schemas/shipment.schema';

export class UpdateShipmentStatusDto {
  @ApiProperty({ enum: ShipmentStatus, example: ShipmentStatus.TRANSIT })
  @IsEnum(ShipmentStatus)
  status: ShipmentStatus;

  @ApiPropertyOptional({ example: 'Yukni oldim, yo\'lga chiqdim' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: 41.2995 })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ example: 69.2401 })
  @IsOptional()
  @IsNumber()
  longitude?: number;
}
