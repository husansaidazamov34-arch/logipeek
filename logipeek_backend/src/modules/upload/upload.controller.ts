import { 
  Controller, 
  Post, 
  UseInterceptors, 
  UploadedFile, 
  BadRequestException,
  UseGuards 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('license-image')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Haydovchilik guvohnomasi rasmini yuklash (autentifikatsiya kerak)' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Rasm muvaffaqiyatli yuklandi' })
  @ApiResponse({ status: 400, description: 'Noto\'g\'ri fayl formati yoki hajmi' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadLicenseImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Fayl tanlanmadi');
    }

    const imageUrl = await this.uploadService.uploadLicenseImage(file);
    
    return {
      message: 'Rasm muvaffaqiyatli yuklandi',
      imageUrl,
    };
  }

  @Post('license-image-public')
  @ApiOperation({ summary: 'Haydovchilik guvohnomasi rasmini yuklash (ro\'yxatdan o\'tish uchun)' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Rasm muvaffaqiyatli yuklandi' })
  @ApiResponse({ status: 400, description: 'Noto\'g\'ri fayl formati yoki hajmi' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadLicenseImagePublic(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Fayl tanlanmadi');
    }

    const imageUrl = await this.uploadService.uploadLicenseImage(file);
    
    return {
      message: 'Rasm muvaffaqiyatli yuklandi',
      imageUrl,
    };
  }
}