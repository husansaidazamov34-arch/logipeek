import { Controller, Get } from '@nestjs/common';
import { TestService } from './test.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('test')
@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Get('mongodb')
  @ApiOperation({ summary: 'MongoDB ulanishini tekshirish' })
  @ApiResponse({ status: 200, description: 'MongoDB holati' })
  async testMongoDB() {
    return this.testService.testMongoDB();
  }

  @Get('health')
  @ApiOperation({ summary: 'Server holatini tekshirish' })
  @ApiResponse({ status: 200, description: 'Server holati' })
  async healthCheck() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      message: 'LogiPeek Backend ishlamoqda',
    };
  }
}