import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';

@Injectable()
export class GalleryService {
  constructor(private prisma: PrismaService) {}

  async create(createGalleryDto: CreateGalleryDto & { image: string }) {
    return this.prisma.gallery.create({
      data: createGalleryDto,
    });
  }

  async findAll() {
    return this.prisma.gallery.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async findFeatured() {
    return this.prisma.gallery.findMany({
      where: { featured: true },
      orderBy: { order: 'asc' },
    });
  }

  async findByCategory(category: string) {
    return this.prisma.gallery.findMany({
      where: { category },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.gallery.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateGalleryDto: UpdateGalleryDto) {
    return this.prisma.gallery.update({
      where: { id },
      data: updateGalleryDto,
    });
  }

  async remove(id: string) {
    return this.prisma.gallery.delete({
      where: { id },
    });
  }
}