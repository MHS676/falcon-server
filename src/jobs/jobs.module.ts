import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [
    PrismaModule,
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          const isResume = file.fieldname === 'resume';
          const dest = isResume ? './uploads/resumes' : './uploads/portfolios';
          cb(null, dest);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const isResume = file.fieldname === 'resume';
          const prefix = isResume ? 'resume' : 'portfolio';
          cb(null, `${prefix}-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  ],
  controllers: [JobsController],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}