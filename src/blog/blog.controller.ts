import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  UseInterceptors,
  UploadedFile,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UploadService } from '../upload/upload.service';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

@Controller('blog')
export class BlogController {
  constructor(
    private readonly blogService: BlogService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('coverImage'))
  async create(
    @Body() createBlogDto: CreateBlogDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) throw new BadRequestException('Only image files are allowed');
      if (file.size > 5 * 1024 * 1024) throw new BadRequestException('File size must be less than 5MB');
      createBlogDto.coverImage = await this.uploadService.uploadImage(file, 'blog');
    }
    return this.blogService.create(createBlogDto);
  }

  @Get()
  findAll() {
    return this.blogService.findAll();
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.blogService.findBySlug(slug);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('coverImage'))
  async update(
    @Param('id') id: string,
    @Body() updateBlogDto: CreateBlogDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) throw new BadRequestException('Only image files are allowed');
      if (file.size > 5 * 1024 * 1024) throw new BadRequestException('File size must be less than 5MB');
      updateBlogDto.coverImage = await this.uploadService.uploadImage(file, 'blog');
    }
    return this.blogService.update(id, updateBlogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }
}
