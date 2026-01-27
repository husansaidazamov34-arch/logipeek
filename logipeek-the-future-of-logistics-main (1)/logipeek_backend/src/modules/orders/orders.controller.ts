import { Controller, Get, Post, Param, UseGuards, Request, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('available')
  @ApiOperation({ summary: 'Mavjud buyurtmalarni olish' })
  getAvailableOrders() {
    return this.ordersService.getAvailableOrders();
  }

  @Get('active')
  @ApiOperation({ summary: 'Faol buyurtmalarni olish' })
  getActiveOrders(@Request() req) {
    return this.ordersService.getActiveOrders(req.user.userId);
  }

  @Get('history')
  @ApiOperation({ summary: 'Buyurtmalar tarixini olish' })
  getOrderHistory(@Request() req) {
    return this.ordersService.getOrderHistory(req.user.userId);
  }

  @Post(':id/accept')
  @ApiOperation({ summary: 'Buyurtmani qabul qilish' })
  acceptOrder(@Param('id') id: string, @Request() req) {
    return this.ordersService.acceptOrder(id, req.user.userId);
  }

  @Post(':id/delivered')
  @ApiOperation({ summary: 'Buyurtma yetkazildi deb belgilash' })
  markAsDelivered(@Param('id') id: string, @Request() req) {
    return this.ordersService.markAsDelivered(id, req.user.userId);
  }

  @Post(':id/confirm')
  @ApiOperation({ summary: 'Yetkazilishni tasdiqlash va baholash' })
  confirmDelivery(
    @Param('id') id: string,
    @Request() req,
    @Body() body: { rating: number }
  ) {
    return this.ordersService.confirmDelivery(id, req.user.userId, body.rating);
  }

  @Post(':id/simulate-delivered')
  @ApiOperation({ summary: 'Test: Haydovchi yetkazdi deb simulatsiya qilish' })
  simulateDelivered(@Param('id') id: string, @Request() req) {
    return this.ordersService.simulateDelivered(id, req.user.userId);
  }
}
