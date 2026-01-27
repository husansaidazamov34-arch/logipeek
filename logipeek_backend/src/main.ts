import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
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
  await app.listen(port);

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
