import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateLocationDto {
  @ApiProperty({ example: 41.2995 })
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: 69.2401 })
  @IsNumber()
  longitude: number;
}
