import { Injectable, BadRequestException } from '@nestjs/common';
import { extname } from 'path';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class UploadService {
  private readonly uploadPath = path.join(process.cwd(), 'uploads');

  constructor() {
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  private generateUniqueId(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  async uploadLicenseImage(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException('Fayl yuklanmadi');
    }

    // Validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Faqat JPEG, PNG va WebP formatdagi rasmlar qabul qilinadi');
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('Fayl hajmi 5MB dan oshmasligi kerak');
    }

    // Generate unique filename
    const fileExtension = extname(file.originalname);
    const fileName = `license_${this.generateUniqueId()}${fileExtension}`;
    const filePath = path.join(this.uploadPath, fileName);

    try {
      // Save file to disk
      fs.writeFileSync(filePath, file.buffer);
      
      // Return relative URL
      return `/uploads/${fileName}`;
    } catch (error) {
      throw new BadRequestException('Faylni saqlashda xatolik yuz berdi');
    }
  }

  async deleteLicenseImage(imageUrl: string): Promise<void> {
    if (!imageUrl || !imageUrl.startsWith('/uploads/')) {
      return;
    }

    const fileName = path.basename(imageUrl);
    const filePath = path.join(this.uploadPath, fileName);

    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      // Don't throw error, just log it
    }
  }
}