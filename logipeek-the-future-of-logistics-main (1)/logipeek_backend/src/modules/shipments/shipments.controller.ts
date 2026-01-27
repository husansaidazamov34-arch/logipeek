import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ShipmentsService } from './shipments.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentStatusDto } from './dto/update-shipment-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('shipments')
@Controller('shipments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ShipmentsController {
  constructor(private readonly shipmentsService: ShipmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Yangi jo\'natma yaratish' })
  @ApiResponse({ status: 201, description: 'Jo\'natma yaratildi' })
  create(@Body() createShipmentDto: CreateShipmentDto, @Request() req) {
    return this.shipmentsService.create(createShipmentDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha jo\'natmalarni olish' })
  @ApiResponse({ status: 200, description: 'Jo\'natmalar ro\'yxati' })
  findAll(@Request() req) {
    return this.shipmentsService.findAll(req.user.userId, req.user.role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Jo\'natma ma\'lumotlarini olish' })
  @ApiResponse({ status: 200, description: 'Jo\'natma ma\'lumotlari' })
  @ApiResponse({ status: 404, description: 'Jo\'natma topilmadi' })
  findOne(@Param('id') id: string) {
    return this.shipmentsService.findOne(id);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Jo\'natma statusini yangilash' })
  @ApiResponse({ status: 200, description: 'Status yangilandi' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateShipmentStatusDto,
    @Request() req,
  ) {
    return this.shipmentsService.updateStatus(id, updateStatusDto, req.user.userId);
  }
}
