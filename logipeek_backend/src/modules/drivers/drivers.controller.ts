import { Controller, Get, Put, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DriversService } from './drivers.service';
import { UpdateLocationDto } from './dto/update-location.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DriverStatus } from '../../schemas/driver-profile.schema';

@ApiTags('drivers')
@Controller('drivers')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Get('stats/me')
  @ApiOperation({ summary: 'Haydovchi statistikasini olish' })
  getStats(@Request() req) {
    return this.driversService.getStats(req.user.userId);
  }

  @Get('online/all')
  @ApiOperation({ summary: 'Barcha onlayn haydovchilarni olish' })
  findAllOnline() {
    return this.driversService.findAllOnline();
  }

  @Get()
  @ApiOperation({ summary: 'Barcha haydovchilarni olish' })
  findAll() {
    return this.driversService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Haydovchi ma\'lumotlarini olish' })
  findOne(@Param('id') id: string) {
    return this.driversService.findOne(id);
  }

  @Put('location')
  @ApiOperation({ summary: 'Haydovchi lokatsiyasini yangilash' })
  updateLocation(@Body() updateLocationDto: UpdateLocationDto, @Request() req) {
    return this.driversService.updateLocation(req.user.userId, updateLocationDto);
  }

  @Put('status')
  @ApiOperation({ summary: 'Haydovchi statusini yangilash' })
  updateStatus(@Body('status') status: DriverStatus, @Request() req) {
    return this.driversService.updateStatus(req.user.userId, status);
  }
}
