import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
  Delete,
  Param,
  Get,
  Query,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Only image files are allowed');
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('File size must be less than 5MB');
    }

    const imageUrl = await this.uploadService.uploadImage(
      file,
      folder || 'portfolio',
    );

    return {
      success: true,
      url: imageUrl,
      message: 'Image uploaded successfully',
    };
  }

  @Post('images')
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadMultipleImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('folder') folder?: string,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    // Validate each file
    for (const file of files) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.mimetype)) {
        throw new BadRequestException(`Invalid file type: ${file.originalname}`);
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new BadRequestException(`File too large: ${file.originalname}`);
      }
    }

    const uploadPromises = files.map((file) =>
      this.uploadService.uploadImage(
        file,
        folder || 'portfolio',
      ),
    );

    const imageUrls = await Promise.all(uploadPromises);

    return {
      success: true,
      urls: imageUrls,
      message: `${imageUrls.length} images uploaded successfully`,
    };
  }

  @Post('document')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file type for documents (PDF, DOC, DOCX)
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Only PDF and Word documents are allowed');
    }

    // Validate file size (10MB max for documents)
    if (file.size > 10 * 1024 * 1024) {
      throw new BadRequestException('File size must be less than 10MB');
    }

    const documentUrl = await this.uploadService.uploadImage(
      file,
      folder || 'documents',
    );

    return {
      success: true,
      url: documentUrl,
      message: 'Document uploaded successfully',
    };
  }

  @Delete(':publicId')
  async deleteFile(@Param('publicId') publicId: string) {
    const success = await this.uploadService.deleteImage(publicId);
    
    return {
      success,
      message: success ? 'File deleted successfully' : 'Failed to delete file',
    };
  }

  @Get('optimize')
  getOptimizedUrl(
    @Query('publicId') publicId: string,
    @Query('width') width?: string,
    @Query('height') height?: string,
    @Query('quality') quality?: string,
    @Query('format') format?: string,
  ) {
    if (!publicId) {
      throw new BadRequestException('Public ID is required');
    }

    const optimizedUrl = this.uploadService.getOptimizedUrl(publicId);

    return {
      success: true,
      url: optimizedUrl,
    };
  }
}