/** @format */

import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { CareerService } from "./career.service";
import { CareerController } from "./career.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { UploadModule } from "../upload/upload.module";
import * as multer from "multer";

@Module({
  imports: [
    PrismaModule,
    UploadModule,
    MulterModule.register({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max file size
      },
    }),
  ],
  controllers: [CareerController],
  providers: [CareerService],
  exports: [CareerService],
})
export class CareerModule {}
