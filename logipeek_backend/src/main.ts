import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

// Fix for crypto global issue in NestJS scheduler
if (typeof global.crypto === 'undefined') {
  global.crypto = require('crypto');
}

async function bootstrap() {
  // Debug environment variables
  console.log('🔍 Environment Variables Debug:');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('PORT:', process.env.PORT);
  console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
  console.log('MONGODB_URI length:', process.env.MONGODB_URI?.length || 0);
  console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
  console.log('JWT_SECRET length:', process.env.JWT_SECRET?.length || 0);
  console.log('CORS_ORIGIN:', process.env.CORS_ORIGIN);
  
  // Set fallback MongoDB URI if missing
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI environment variable is missing!');
    process.env.MONGODB_URI = 'mongodb+srv://logipeek_db_user:admin123@cluster0.hzggjlp.mongodb.net/logipeek_db?retryWrites=true&w=majority&appName=Cluster0';
    console.log('🔧 Using fallback MongoDB URI');
  }
  if (!process.env.JWT_SECRET) {
    console.error('❌ JWT_SECRET environment variable is missing!');
  }
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve static files
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:8080',
      'http://localhost:5173',
      process.env.CORS_ORIGIN,
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false, // Vaqtincha false qilamiz
      disableErrorMessages: false, // Error messages ko'rsatish
    }),
  );

  // API prefix
  app.setGlobalPrefix('api/v1');

  // Health check endpoint for Railway (before API prefix)
  app.use('/health', (req, res) => {
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      message: 'LogiPeek Backend ishlamoqda',
      environment: process.env.NODE_ENV || 'development',
      port: process.env.PORT || 5000,
    });
  });

  // Additional health check after API prefix
  app.use('/api/v1/health', (req, res) => {
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      message: 'LogiPeek Backend API ishlamoqda',
    });
  });

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('LogiPeek API')
    .setDescription('Modern Logistics Platform API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management')
    .addTag('shipments', 'Shipment management')
    .addTag('drivers', 'Driver operations')
    .addTag('orders', 'Order management')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 5000;
  await app.listen(port, '0.0.0.0'); // 0.0.0.0'ga bind qilish

  console.log(`
╔═══════════════════════════════════════╗
║   🚀 LogiPeek Backend (NestJS)       ║
║   📡 Port: ${port}                      ║
║   🌍 Environment: ${process.env.NODE_ENV || 'development'}       ║
║   📚 Docs: http://localhost:${port}/api/docs ║
╚═══════════════════════════════════════╝
  `);
}

bootstrap();
