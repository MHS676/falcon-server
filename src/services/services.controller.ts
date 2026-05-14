import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { UploadService } from '../upload/upload.service';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

@Controller('service')
export class ServicesController {
  constructor(
    private readonly servicesService: ServicesService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createServiceDto: CreateServiceDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let imageUrl = createServiceDto.image;
    if (file) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) throw new BadRequestException('Only image files are allowed');
      if (file.size > MAX_FILE_SIZE) throw new BadRequestException('File size must be less than 5MB');
      imageUrl = await this.uploadService.uploadImage(file, 'services');
    }
    const parseBool = (v: any) => v === true || v === 'true' || v === '1';
    const body = createServiceDto as any;
    return this.servicesService.create({
      ...createServiceDto,
      image: imageUrl,
      active: body.active !== undefined ? parseBool(body.active) : (body.isActive !== undefined ? parseBool(body.isActive) : true),
      featured: body.featured !== undefined ? parseBool(body.featured) : (body.isFeatured !== undefined ? parseBool(body.isFeatured) : false),
    });
  }

  @Get()
  findAll() {
    return this.servicesService.findAll();
  }

  @Get('active')
  findActive() {
    return this.servicesService.findActive();
  }

  @Get('featured')
  findFeatured() {
    return this.servicesService.findFeatured();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let imageUrl = updateServiceDto.image;
    if (file) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) throw new BadRequestException('Only image files are allowed');
      if (file.size > MAX_FILE_SIZE) throw new BadRequestException('File size must be less than 5MB');
      imageUrl = await this.uploadService.uploadImage(file, 'services');
    }
    const parseBool = (v: any) => v === true || v === 'true' || v === '1';
    const body = updateServiceDto as any;
    const update: any = { ...updateServiceDto, image: imageUrl };
    if (body.isActive !== undefined) update.active = parseBool(body.isActive);
    if (body.isFeatured !== undefined) update.featured = parseBool(body.isFeatured);
    if (body.active !== undefined) update.active = parseBool(body.active);
    if (body.featured !== undefined) update.featured = parseBool(body.featured);
    return this.servicesService.update(id, update);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }
}