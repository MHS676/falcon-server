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
import { BannerService } from './banner.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { UploadService } from '../upload/upload.service';

@Controller('banner')
export class BannerController {
  constructor(
    private readonly bannerService: BannerService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createBannerDto: CreateBannerDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let imageUrl = createBannerDto.image;

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
      
      // Upload (will try external first, fallback to local)
      imageUrl = await this.uploadService.uploadImage(file, 'banner');
    }

    // Normalize types defensively (covers production deploys without implicit conversion)
    const normalized = {
      title: createBannerDto.title,
      subtitle: createBannerDto.subtitle || undefined,
      image: imageUrl || undefined,
      buttonText: createBannerDto.buttonText || undefined,
      buttonUrl: createBannerDto.buttonUrl || undefined,
      order: typeof createBannerDto.order === 'number'
        ? createBannerDto.order
        : Number(createBannerDto.order) || 0,
      active: typeof createBannerDto.active === 'boolean'
        ? createBannerDto.active
        : ((typeof (createBannerDto.active as any) === 'string')
            ? ['true', '1', 'yes', 'on'].includes((createBannerDto.active as any).toLowerCase())
            : (createBannerDto.active as any) === 1),
    };

    return this.bannerService.create(normalized as any);
  }

  @Get()
  findAll() {
    return this.bannerService.findAll();
  }

  @Get('active')
  findActive() {
    return this.bannerService.findActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bannerService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() updateBannerDto: UpdateBannerDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let imageUrl = updateBannerDto.image;

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

      // Upload (will try external first, fallback to local)
      imageUrl = await this.uploadService.uploadImage(file, 'banner');
    }

    const normalized = {
      title: updateBannerDto.title || undefined,
      subtitle: updateBannerDto.subtitle || undefined,
      image: imageUrl || undefined,
      buttonText: updateBannerDto.buttonText || undefined,
      buttonUrl: updateBannerDto.buttonUrl || undefined,
      order: updateBannerDto.order !== undefined
        ? (typeof updateBannerDto.order === 'number'
            ? updateBannerDto.order
            : Number(updateBannerDto.order) || 0)
        : undefined,
      active: updateBannerDto.active !== undefined
        ? (typeof updateBannerDto.active === 'boolean'
            ? updateBannerDto.active
            : ((typeof (updateBannerDto.active as any) === 'string'
                ? ['true', '1', 'yes', 'on'].includes((updateBannerDto.active as any).toLowerCase())
                : (updateBannerDto.active as any) === 1)))
        : undefined,
    };

    return this.bannerService.update(id, normalized as any);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bannerService.remove(id);
  }
}
