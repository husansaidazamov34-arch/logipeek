import { MongooseModuleOptions } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

export const mongodbConfig: MongooseModuleOptions = {
  retryWrites: true,
  w: 'majority',
};