import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExperienceDto } from './dto/create-experience.dto';

@Injectable()
export class ExperienceService {
  constructor(private prisma: PrismaService) {}

  async create(createExperienceDto: CreateExperienceDto) {
    return this.prisma.experience.create({
      data: {
        ...createExperienceDto,
        startDate: new Date(createExperienceDto.startDate),
        endDate: createExperienceDto.endDate ? new Date(createExperienceDto.endDate) : null,
      },
    });
  }

  async findAll() {
    return this.prisma.experience.findMany({
      orderBy: {
        startDate: 'desc',
      },
    });
  }

  async remove(id: string) {
    return this.prisma.experience.delete({
      where: { id },
    });
  }
}
