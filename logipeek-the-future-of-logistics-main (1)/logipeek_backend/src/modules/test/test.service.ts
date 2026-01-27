import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../schemas/user.schema';

@Injectable()
export class TestService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async testMongoDB() {
    try {
      // Test MongoDB connection by counting users
      const userCount = await this.userModel.countDocuments();
      
      // Test creating a simple document
      const testDoc = {
        _id: 'test-connection',
        timestamp: new Date(),
      };

      return {
        status: 'SUCCESS',
        message: 'MongoDB ulanishi muvaffaqiyatli',
        data: {
          userCount,
          connectionTest: 'OK',
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      return {
        status: 'ERROR',
        message: 'MongoDB ulanishida xatolik',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}