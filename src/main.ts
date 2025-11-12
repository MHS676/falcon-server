import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Serve static files from uploads directory
  // In production (Railway), use /data/uploads. In development, use local uploads
  const isProd = process.env.NODE_ENV === 'production';
  const uploadsPath = isProd ? '/data/uploads' : join(process.cwd(), 'uploads');
  
  // Ensure directory exists
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
  }
  
  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads/',
  });
  
  // Enable CORS for frontend
  app.enableCors({
    origin: [
      'http://localhost:5173', // Local development
      'https://falcon-frontend-six.vercel.app', // Production
      'https://falcon-frontend-88b8yuylc-hasan-talukders-projects.vercel.app', // Vercel deployment
      /^https:\/\/falcon-frontend.*\.vercel\.app$/ // All Vercel deployment URLs
    ],
    credentials: true,
  });

  // Enable validation globally
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: false,
    // Important for multipart/form-data: converts '"1"' -> 1, '"true"' -> true based on DTO types
    transformOptions: { 
      enableImplicitConversion: true,
      exposeDefaultValues: true,
    },
  }));

  // API prefix
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Backend server is running on: http://localhost:${port}`);
}
bootstrap();
