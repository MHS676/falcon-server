import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GalleryService } from './gallery.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { UploadService } from '../upload/upload.service';

@Controller('gallery')
export class GalleryController {
  constructor(
    private readonly galleryService: GalleryService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createGalleryDto: CreateGalleryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let imageUrl = createGalleryDto.image;

    // If file is uploaded, use the upload service
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.mimetype)) {
        throw new BadRequestException('Only image files are allowed');
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        throw new BadRequestException('File size must be less than 5MB');
      }

      imageUrl = await this.uploadService.uploadImage(file, 'gallery');
    }

    // Ensure image is provided either via file upload or URL
    if (!imageUrl) {
      throw new BadRequestException('Image is required (either upload a file or provide image URL)');
    }

    return this.galleryService.create({
      ...createGalleryDto,
      image: imageUrl,
    });
  }

  @Get()
  findAll(@Query('category') category?: string) {
    if (category) {
      return this.galleryService.findByCategory(category);
    }
    return this.galleryService.findAll();
  }

  @Get('featured')
  findFeatured() {
    return this.galleryService.findFeatured();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.galleryService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() updateGalleryDto: UpdateGalleryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let updateData = { ...updateGalleryDto };

    // If file is uploaded, use the upload service
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.mimetype)) {
        throw new BadRequestException('Only image files are allowed');
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        throw new BadRequestException('File size must be less than 5MB');
      }

      const imageUrl = await this.uploadService.uploadImage(file, 'gallery');

      updateData.image = imageUrl;
    }

    return this.galleryService.update(id, updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.galleryService.remove(id);
  }
}