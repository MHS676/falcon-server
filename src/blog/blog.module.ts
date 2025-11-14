import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    MulterModule.register({
      dest: './uploads/blog',
    }),
  ],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
