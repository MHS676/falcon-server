import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSocialLinkDto } from './dto/create-social-link.dto';
import { UpdateSocialLinkDto } from './dto/update-social-link.dto';

@Injectable()
export class SocialService {
  constructor(private prisma: PrismaService) {}

  async create(createSocialLinkDto: CreateSocialLinkDto) {
    return this.prisma.socialLink.create({
      data: createSocialLinkDto,
    });
  }

  async findAll() {
    return this.prisma.socialLink.findMany({
      orderBy: {
        order: 'asc',
      },
    });
  }

  async findActive() {
    return this.prisma.socialLink.findMany({
      where: {
        active: true,
      },
      orderBy: {
        order: 'asc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.socialLink.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateSocialLinkDto: UpdateSocialLinkDto) {
    return this.prisma.socialLink.update({
      where: { id },
      data: updateSocialLinkDto,
    });
  }

  async remove(id: string) {
    return this.prisma.socialLink.delete({
      where: { id },
    });
  }
}
